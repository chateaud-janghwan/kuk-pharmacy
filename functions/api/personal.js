// 개인 탭 바로가기 저장소 — Cloudflare KV(PERSONAL)에 목록 하나를 보관한다.
// GET  /api/personal : 바로가기 목록 반환
// PUT  /api/personal : 바로가기 목록 전체를 교체 (본문: {links:[{label,href}]})
// 두 요청 모두 X-Pin 헤더의 비밀번호가 맞아야 하며, 틀린 시도가 많으면 잠시 막는다.
const PIN_SALT = "c29906f6c335e0e50ffce7d0acf63970";
const PIN_HASH = "541f71e035b4d77d087cc7afba1ae29e7b5982e24f26f29ea82a8c8c2f9e8bb7";
const KEY_LINKS = "links";
const MAX_FAILS = 20; // 1시간에 틀린 시도가 이만큼 쌓이면 잠금
const MAX_LINKS = 60;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

function hexToBytes(hex) {
  return Uint8Array.from(hex.match(/../g).map((b) => parseInt(b, 16)));
}

async function pinMatches(pin) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: hexToBytes(PIN_SALT), iterations: 100000 },
    key,
    256
  );
  const got = Array.from(new Uint8Array(bits), (b) => b.toString(16).padStart(2, "0")).join("");
  return got === PIN_HASH;
}

function cleanLinks(list) {
  if (!Array.isArray(list)) return null;
  const out = [];
  for (const item of list.slice(0, MAX_LINKS)) {
    const label = String((item && item.label) || "").trim().slice(0, 20);
    let href = String((item && item.href) || "").trim();
    if (!label || !href) continue;
    try {
      const url = new URL(href);
      if (!/^https?:$/.test(url.protocol)) continue;
      href = url.href;
    } catch (e) {
      continue;
    }
    out.push({ label, href });
  }
  return out;
}

export async function onRequest({ request, env }) {
  const kv = env.PERSONAL;
  if (!kv) return json({ error: "저장소가 연결되지 않았습니다." }, 503);
  if (request.method !== "GET" && request.method !== "PUT") return json({ error: "허용되지 않는 요청입니다." }, 405);

  const hourKey = "fails:" + new Date().toISOString().slice(0, 13);
  const fails = parseInt((await kv.get(hourKey)) || "0", 10) || 0;
  if (fails >= MAX_FAILS) return json({ error: "시도가 너무 많습니다. 잠시 후 다시 해 주세요." }, 429);

  const pin = request.headers.get("X-Pin") || "";
  if (!pin || pin.length > 64 || !(await pinMatches(pin))) {
    await kv.put(hourKey, String(fails + 1), { expirationTtl: 7200 });
    return json({ error: "비밀번호가 맞지 않습니다." }, 401);
  }

  if (request.method === "PUT") {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return json({ error: "형식이 올바르지 않습니다." }, 400);
    }
    const links = cleanLinks(body && body.links);
    if (!links) return json({ error: "형식이 올바르지 않습니다." }, 400);
    await kv.put(KEY_LINKS, JSON.stringify(links));
    return json({ links });
  }

  let links = [];
  try {
    links = JSON.parse((await kv.get(KEY_LINKS)) || "[]");
  } catch (e) {}
  return json({ links: Array.isArray(links) ? links : [] });
}
