// GET /api/updates — 각 연동 GitHub 저장소의 최근 푸시 시각(pushed_at)을 반환한다.
// Cloudflare Pages 환경변수에 GITHUB_TOKEN(읽기 전용 PAT)이 설정되어 있으면 Private 저장소까지 모두 조회하고,
// 없으면 Public 저장소만 조회한다. 결과는 KV(HITS)에 10분간 캐시한다.

const OWNER = "chateaud-janghwan";
const CACHE_KEY = "gh_updates_v1";
const CACHE_TTL = 600; // 10분

function json(body, maxAge = 300) {
  return new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": `public, max-age=${maxAge}`,
    },
  });
}

export async function onRequestGet({ env }) {
  const kv = env.HITS;
  if (kv) {
    try {
      const cached = await kv.get(CACHE_KEY);
      if (cached) return json(JSON.parse(cached));
    } catch (e) {}
  }

  const token = (env.GITHUB_TOKEN || "").trim();
  const url = token
    ? "https://api.github.com/user/repos?per_page=100&affiliation=owner&sort=pushed"
    : `https://api.github.com/users/${OWNER}/repos?per_page=100&sort=pushed`;

  const headers = {
    "User-Agent": "kuk-pharmacy-portal",
    Accept: "application/vnd.github+json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) return json({ repos: {}, error: res.status }, 60);
    const list = await res.json();
    const repos = {};
    if (Array.isArray(list)) {
      for (const r of list) {
        if (r && r.name && r.pushed_at) repos[r.name] = r.pushed_at;
      }
    }
    const payload = { repos, mode: token ? "all" : "public", fetchedAt: new Date().toISOString() };
    if (kv) {
      try {
        await kv.put(CACHE_KEY, JSON.stringify(payload), { expirationTtl: CACHE_TTL });
      } catch (e) {}
    }
    return json(payload);
  } catch (e) {
    return json({ repos: {}, error: "fetch_failed" }, 60);
  }
}
