// 건국대학교병원 약제부 업무 포털 — 에디토리얼 미니멀 (원스크린 + 자동 반응형 + 48시간 업데이트 표시)
const RECENT_WINDOW_MS = 48 * 60 * 60 * 1000;

const departments = [
  {
    title: "병동약국",
    kicker: "Inpatient Pharmacy",
    cols: 2,
    links: [
      { label: "향정계산기", href: "https://hyangjeong-counter.pages.dev/", repo: "hyangjeong-counter", updatedAt: "2026-09-24T16:16:30+09:00" },
      { label: "마약향정폐기량", href: "https://drug-disposal-calculator.hidoi.workers.dev/", repo: "drug-disposal-calculator", updatedAt: "2026-09-24T16:16:48+09:00" },
      { label: "산제리스트", href: "https://powderlist.pages.dev", repo: "powderlist", updatedAt: "2026-11-10T19:04:11+09:00" },
      { label: "병동월통계", href: "https://reportinp.hidoi.workers.dev/", repo: "report_inp", updatedAt: "2026-09-21T11:44:00+09:00" },
      { label: "재고분석", href: "https://drug-stock-analyzer.pages.dev", repo: "drug-stock-analyzer", updatedAt: "2026-11-28T12:19:06+09:00" },
      { label: "코드날짜계산기", href: "https://pharm-date-calculator.pages.dev", repo: "pharm-date-calculator", updatedAt: "2026-11-28T12:14:52+09:00" },
      { label: "약품리스트편집기", href: "https://drugmap-editor.pages.dev/", repo: "drugmap-editor", updatedAt: "2026-11-28T12:15:07+09:00" },
      { label: "ATC 퀴즈", href: "https://drugmap-editor.pages.dev/quiz", repo: "drugmap-editor", updatedAt: "2026-11-28T12:38:00+09:00" },
      { label: "복약지도문제작", href: "https://chemo-guide.pages.dev/", repo: "chemo-guide", updatedAt: "2026-11-26T19:15:49+09:00" },
      { label: "상비품체커", href: "https://sangbipum-checklist.pages.dev" },
      { label: "재고2관리", href: "https://surplus-drugs.pages.dev", repo: "surplus-drugs", updatedAt: "2026-11-26T13:26:06+09:00" },
    ],
  },
];

const infoDepartment = {
  title: "약무정보실",
  kicker: "Drug Information",
  links: [
    { label: "신약변경알림", href: "https://pharmacy-notification.pages.dev/", repo: "pharmacy_notification", updatedAt: "2026-11-26T13:34:55+09:00" },
    { label: "코드유효성확인", href: "https://drug-code-validator.pages.dev", repo: "drug-code-validator", updatedAt: "2026-10-03T13:46:42+09:00" },
    { label: "약품코드통계", href: "https://drugcode-stats.pages.dev/", repo: "drugcode-stats", updatedAt: "2026-09-24T16:18:23+09:00" },
  ],
};

const commonDepartment = {
  title: "공통",
  kicker: "Common",
  links: [
    { label: "통합매뉴얼", href: "https://pharm-hub-75r.pages.dev/", repo: "pharm-hub", updatedAt: "2026-11-28T12:19:23+09:00" },
    { label: "점심메뉴", href: "https://lunch-menu-5ok.pages.dev/", repo: "lunch-menu", updatedAt: "2026-11-21T11:47:41+09:00" },
  ],
};

const outpatientDepartment = {
  title: "외래약국",
  kicker: "Outpatient Pharmacy",
  links: [{ label: "대기시간통계", href: "https://outpatient-wait-stats.pages.dev/", repo: "outpatient-wait-time-stats", updatedAt: "2026-09-24T16:18:34+09:00" }],
};

const allDepartments = [...departments, infoDepartment, commonDepartment, outpatientDepartment];

// ===== 다크/라이트 2-state 토글 =====
function getSystemScheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function applyScheme(stored) {
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (stored === "light" || stored === "dark") {
    meta.content = stored;
    document.documentElement.dataset.theme = stored;
  } else {
    meta.content = "light dark";
    delete document.documentElement.dataset.theme;
  }
}
document.querySelector("#themeBtn").addEventListener("click", () => {
  let stored = null;
  try { stored = localStorage.getItem("color-scheme"); } catch (e) {}
  const sys = getSystemScheme();
  const target = (stored || sys) === "dark" ? "light" : "dark";
  try {
    if (target === sys) localStorage.removeItem("color-scheme");
    else localStorage.setItem("color-scheme", target);
  } catch (e) {}
  applyScheme(target === sys ? null : target);
});
window.addEventListener("storage", (e) => {
  if (e.key === "color-scheme") applyScheme(e.newValue);
});

// ===== 디렉토리 렌더 =====
function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function isRecentUpdate(iso) {
  if (!iso) return false;
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return false;
  const age = Date.now() - t;
  return age >= 0 && age <= RECENT_WINDOW_MS;
}

function linksMarkup(links) {
  return links
    .map((link) => {
      const recent = isRecentUpdate(link.updatedAt);
      const dot = recent
        ? '<span class="portal-link-dot" title="최근 48시간 내 업데이트" aria-label="최근 업데이트"></span>'
        : "";
      const attrs = [
        link.repo ? `data-repo="${escapeHtml(link.repo)}"` : "",
        link.updatedAt ? `data-updated="${escapeHtml(link.updatedAt)}"` : "",
      ].filter(Boolean).join(" ");
      if (link.disabled) {
        return `<span class="portal-link is-disabled" aria-disabled="true" title="${escapeHtml(link.label)} (현재 사용 중지)"><span class="portal-link-name">${escapeHtml(link.label)}</span></span>`;
      }
      return `<a class="portal-link" href="${escapeHtml(link.href)}" target="_blank" rel="noopener" title="${escapeHtml(link.label)}" ${attrs}><span class="portal-link-name">${dot}${escapeHtml(link.label)}</span><span class="portal-link-arrow" aria-hidden="true">↗</span></a>`;
    })
    .join("");
}

// 서버(/api/updates)에서 최신 GitHub 푸시 시각을 받아 48시간 이내 업데이트 파랑점을 실시간 갱신한다.
(function refreshRecentDots() {
  fetch("/api/updates")
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      const repos = data && data.repos;
      if (!repos || typeof repos !== "object") return;
      document.querySelectorAll("a.portal-link[data-repo]").forEach((el) => {
        const liveIso = repos[el.dataset.repo];
        const baseIso = el.dataset.updated || "";
        const bestTs = Math.max(Date.parse(liveIso) || 0, Date.parse(baseIso) || 0);
        const recent = bestTs > 0 && Date.now() - bestTs <= RECENT_WINDOW_MS;
        const nameEl = el.querySelector(".portal-link-name");
        if (!nameEl) return;
        let dot = nameEl.querySelector(".portal-link-dot");
        if (recent && !dot) {
          dot = document.createElement("span");
          dot.className = "portal-link-dot";
          dot.title = "최근 48시간 내 업데이트";
          dot.setAttribute("aria-label", "최근 업데이트");
          nameEl.prepend(dot);
        } else if (!recent && dot) {
          dot.remove();
        }
      });
    })
    .catch(() => {});
})();

function groupMarkup(dept) {
  return `
    <section class="dir-group" data-department="${escapeHtml(dept.title)}">
      <div class="group-head">
        <h2>${escapeHtml(dept.title)}</h2>
        <span class="num">${dept.links.length}</span>
      </div>
      <div class="link-list ${dept.cols === 2 ? "link-list--2col" : ""}">
        ${linksMarkup(dept.links)}
      </div>
    </section>
  `;
}

const grid = document.querySelector("#departmentGrid");
grid.innerHTML = `
  ${groupMarkup(departments[0])}
  ${groupMarkup(infoDepartment)}
  <div class="dir-stack">
    ${groupMarkup(commonDepartment)}
    ${groupMarkup(outpatientDepartment)}
  </div>
`;

// ===== 검색 =====
const portalSearch = document.querySelector("#portalSearch");
const searchWrap = document.querySelector("#searchWrap");
const emptyState = document.querySelector("#emptyState");
const panelPortal = document.querySelector("#panelPortal");
const panelPersonal = document.querySelector("#panelPersonal");

portalSearch.addEventListener("input", (event) => {
  filterDepartments(event.target.value);
});

document.addEventListener("keydown", (event) => {
  const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName || "");
  if (event.key === "/" && !typing && !panelPortal.hidden) {
    event.preventDefault();
    portalSearch.focus();
  } else if (event.key === "Escape" && document.activeElement === portalSearch) {
    portalSearch.value = "";
    filterDepartments("");
    portalSearch.blur();
  }
});

function filterDepartments(query) {
  const q = query.trim().toLocaleLowerCase("ko-KR");
  let visibleCount = 0;

  document.querySelectorAll(".dir-group").forEach((group) => {
    const dept = allDepartments.find((d) => d.title === group.dataset.department);
    if (!dept) return;
    const text = [dept.title, dept.kicker, ...dept.links.map((l) => l.label)].join(" ").toLocaleLowerCase("ko-KR");
    const matched = q === "" || text.includes(q);
    group.hidden = !matched;
    if (matched) visibleCount += 1;

    group.querySelectorAll("a.portal-link").forEach((link) => {
      const label = link.textContent.trim().toLocaleLowerCase("ko-KR");
      link.classList.toggle("is-hit", q !== "" && label.includes(q));
    });
  });

  emptyState.hidden = visibleCount > 0;
}

// ===== 시계 · 날짜 =====
const clock = document.querySelector("#clock");
const heroDate = document.querySelector("#heroDate");
const timeFormat = new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
const dateFormat = new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" });

function updateClock() {
  const now = new Date();
  clock.textContent = timeFormat.format(now);
  heroDate.textContent = dateFormat.format(now);
}
updateClock();
setInterval(updateClock, 15000);

// ===== 푸터 통계 (부서 수 · 바로가기 수 · 방문자 수) =====
(function renderHeroStats() {
  const box = document.querySelector("#heroStats");
  if (!box) return;

  const departmentCount = 3; // 병동약국 · 약무정보실 · 외래약국
  const linkCount = allDepartments.reduce((sum, d) => sum + d.links.length, 0);

  box.innerHTML = `
    <span><b>${departmentCount}</b>개 부서</span>
    <span class="foot-dot" aria-hidden="true"></span>
    <span><b>${linkCount}</b>개 바로가기</span>
  `;

  const counted = sessionStorage.getItem("kp_visit_counted");
  const method = counted ? "GET" : "POST";

  fetch("/api/hits", { method })
    .then((res) => res.json())
    .then((data) => {
      if (!data || typeof data.count !== "number") return;
      const dot = document.createElement("span");
      dot.className = "foot-dot";
      dot.setAttribute("aria-hidden", "true");
      const stat = document.createElement("span");
      stat.innerHTML = `<b>${data.count.toLocaleString("ko-KR")}</b>번째 방문`;
      box.append(dot, stat);
      sessionStorage.setItem("kp_visit_counted", "1");
    })
    .catch(() => {});
})();

// ===== 탭 · 개인 공간 (Cloudflare KV) =====
const LEGACY_KEY = "kp_personal_links";
let personalPin = "";
let personalList = [];

const tabPortal = document.querySelector("#tabPortal");
const tabPersonal = document.querySelector("#tabPersonal");
const lockForm = document.querySelector("#lockForm");
const lockMsg = document.querySelector("#lockMsg");
const pinInput = document.querySelector("#pinInput");
const personalBody = document.querySelector("#personalBody");
const personalLinks = document.querySelector("#personalLinks");
const personalEmpty = document.querySelector("#personalEmpty");
const personalNote = document.querySelector("#personalNote");
const addForm = document.querySelector("#addForm");

async function personalApi(method, links) {
  const res = await fetch("/api/personal", {
    method,
    headers: { "X-Pin": personalPin, ...(links ? { "Content-Type": "application/json" } : {}) },
    body: links ? JSON.stringify({ links }) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || "서버에 연결할 수 없습니다.");
    error.status = res.status;
    throw error;
  }
  return Array.isArray(data.links) ? data.links : [];
}

function renderPersonal() {
  personalLinks.innerHTML = personalList
    .map(
      (link, index) => `
        <span class="chip-wrap">
          <a class="portal-link" href="${escapeHtml(link.href)}" target="_blank" rel="noopener" title="${escapeHtml(link.label)}">
            <span class="portal-link-name">${escapeHtml(link.label)}</span>
            <span class="portal-link-arrow" aria-hidden="true">↗</span>
          </a>
          <button class="chip-del" type="button" data-index="${index}" aria-label="${escapeHtml(link.label)} 삭제">×</button>
        </span>
      `
    )
    .join("");
  personalEmpty.hidden = personalList.length > 0;
}

function setNote(text, isError) {
  personalNote.textContent = text;
  personalNote.classList.toggle("is-error", Boolean(isError));
}

function showPersonalBody(open) {
  lockForm.hidden = open;
  personalBody.hidden = !open;
  if (open) {
    setNote("어느 기기에서 열어도 같은 목록이 보입니다.");
    renderPersonal();
  } else {
    personalBody.classList.remove("is-editing");
    document.querySelector("#editBtn").textContent = "편집";
    addForm.hidden = true;
    pinInput.value = "";
    lockMsg.textContent = "";
  }
}

function lockPersonal() {
  personalPin = "";
  personalList = [];
  showPersonalBody(false);
}

function showTab(name) {
  const personal = name === "personal";
  tabPortal.classList.toggle("is-active", !personal);
  tabPersonal.classList.toggle("is-active", personal);
  tabPortal.setAttribute("aria-selected", String(!personal));
  tabPersonal.setAttribute("aria-selected", String(personal));
  panelPortal.hidden = personal;
  panelPersonal.hidden = !personal;
  searchWrap.style.visibility = personal ? "hidden" : "visible";
  if (personal) {
    showPersonalBody(Boolean(personalPin));
    if (!personalPin) pinInput.focus();
  }
}

async function savePersonal(next) {
  const before = personalList;
  personalList = next;
  renderPersonal();
  try {
    personalList = await personalApi("PUT", next);
    renderPersonal();
    setNote("저장했습니다. 어느 기기에서 열어도 같은 목록이 보입니다.");
  } catch (e) {
    personalList = before;
    renderPersonal();
    if (e.status === 401) lockPersonal();
    else setNote(e.message, true);
    return false;
  }
  return true;
}

tabPortal.addEventListener("click", () => showTab("portal"));
tabPersonal.addEventListener("click", () => showTab("personal"));

lockForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  lockMsg.textContent = "";
  const submit = lockForm.querySelector("button");
  submit.disabled = true;
  personalPin = pinInput.value;
  try {
    personalList = await personalApi("GET");
    try {
      const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) || "[]");
      if (Array.isArray(legacy) && legacy.length) {
        const known = new Set(personalList.map((l) => l.href));
        const merged = [...personalList, ...legacy.filter((l) => l && l.label && l.href && !known.has(l.href))];
        personalList = await personalApi("PUT", merged);
        localStorage.removeItem(LEGACY_KEY);
      }
    } catch (e) {}
    pinInput.value = "";
    showPersonalBody(true);
  } catch (e) {
    personalPin = "";
    lockMsg.textContent = e.message;
    pinInput.select();
  } finally {
    submit.disabled = false;
  }
});

document.querySelector("#lockBtn").addEventListener("click", () => {
  lockPersonal();
  pinInput.focus();
});

document.querySelector("#editBtn").addEventListener("click", () => {
  const editing = personalBody.classList.toggle("is-editing");
  addForm.hidden = !editing;
  document.querySelector("#editBtn").textContent = editing ? "완료" : "편집";
  if (editing) document.querySelector("#addLabel").focus();
});

addForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const labelInput = document.querySelector("#addLabel");
  const hrefInput = document.querySelector("#addHref");
  const label = labelInput.value.trim();
  let href = hrefInput.value.trim();
  if (!label || !href) return;
  if (!/^https?:\/\//i.test(href)) href = "https://" + href;
  try {
    const url = new URL(href);
    if (!/^https?:$/.test(url.protocol)) throw new Error("protocol");
    href = url.href;
  } catch (e) {
    hrefInput.setCustomValidity("주소 형식이 올바르지 않습니다.");
    hrefInput.reportValidity();
    hrefInput.setCustomValidity("");
    return;
  }
  if (await savePersonal([...personalList, { label, href }])) {
    addForm.reset();
    labelInput.focus();
  }
});

personalLinks.addEventListener("click", (event) => {
  const btn = event.target.closest(".chip-del");
  if (!btn) return;
  const next = personalList.slice();
  next.splice(Number(btn.dataset.index), 1);
  savePersonal(next);
});
