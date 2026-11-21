// 병동약국은 단독 카드(왼쪽 절반), 나머지 부서와 공통은 한 카드(오른쪽 절반)에 나눠 담는다
// (위: 약무정보실 / 아래: 외래약국·공통).
const departments = [
  {
    title: "병동약국",
    kicker: "Inpatient Pharmacy",
    accent: "#3b82f6",
    icon: "ward",
    links: [
      { label: "향정계산기", href: "https://hyangjeong-counter.pages.dev/" },
      {
        label: "마약향정폐기량",
        href: "https://drug-disposal-calculator.hidoi.workers.dev/",
      },
      { label: "산제리스트", href: "https://powderlist.pages.dev" },
      { label: "병동월통계", href: "https://reportinp.hidoi.workers.dev/" },
      { label: "재고분석", href: "https://drug-stock-analyzer.pages.dev" },
      { label: "코드날짜계산기", href: "https://pharm-date-calculator.pages.dev" },
      { label: "약품리스트편집기", href: "https://drugmap-editor.pages.dev/" },
      { label: "복약지도문제작", href: "https://chemo-guide.pages.dev/" },
      { label: "상비품체커", href: "https://sangbipum-checklist.pages.dev" },
      { label: "재고2관리", href: "https://surplus-drugs.pages.dev" },
      { label: "영상기법", href: "https://video-technique-dictionary.pages.dev/" },
    ],
  },
];

const commonDepartment = {
  title: "공통",
  kicker: "Common",
  accent: "#64748b",
  icon: "common",
  links: [
    { label: "통합매뉴얼", href: "https://pharm-hub-75r.pages.dev/" },
    { label: "점심메뉴", href: "https://lunch-menu-5ok.pages.dev/" },
  ],
};

const mergedDepartments = [
  {
    title: "약무정보실",
    kicker: "Drug Information",
    accent: "#e85d4f",
    icon: "info",
    links: [
      { label: "신약변경알림", href: "https://pharmacy-notification.pages.dev/" },
      { label: "코드유효성확인", href: "https://drug-code-validator.pages.dev" },
      { label: "약품코드통계", href: "https://drugcode-stats.pages.dev/" },
    ],
  },
  {
    title: "외래약국",
    kicker: "Outpatient Pharmacy",
    accent: "#0ea474",
    icon: "outpatient",
    links: [{ label: "대기시간통계", href: "https://outpatient-wait-stats.pages.dev/" }],
  },
];

const iconPaths = {
  ward: `
    <path d="M5 11h14" />
    <path d="M12 4v14" />
    <path d="M6 7h12a2 2 0 0 1 2 2v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9a2 2 0 0 1 2-2Z" />
  `,
  outpatient: `
    <path d="M8 11h8" />
    <path d="M12 7v8" />
    <path d="M7 3h10l3 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8l3-5Z" />
  `,
  info: `
    <circle cx="12" cy="12" r="9" />
    <path d="M12 10v6" />
    <path d="M12 7h.01" />
  `,
  common: `
    <rect x="4" y="4" width="7" height="7" rx="1.5" />
    <rect x="13" y="4" width="7" height="7" rx="1.5" />
    <rect x="4" y="13" width="7" height="7" rx="1.5" />
    <rect x="13" y="13" width="7" height="7" rx="1.5" />
  `,
};

function linksMarkup(links) {
  return links
    .map((link) =>
      link.disabled
        ? `
        <span class="portal-link kp-chip is-disabled" aria-disabled="true" title="${link.label} (현재 사용 중지)">
          <span>${link.label}</span>
        </span>
      `
        : `
        <a class="portal-link kp-chip" href="${link.href}" target="_blank" rel="noopener" title="${link.label}">
          <span>${link.label}</span>
        </a>
      `
    )
    .join("");
}

function miniBlock(department) {
  return `
    <div class="stack-block" style="--accent:${department.accent}">
      <div class="card-top card-top--compact">
        <div>
          <p class="card-kicker">${department.kicker}</p>
          <h3>${department.title}</h3>
        </div>
        <div class="card-icon card-icon--sm kp-icon-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24">${iconPaths[department.icon]}</svg>
        </div>
      </div>
      <div class="link-list">${linksMarkup(department.links)}</div>
    </div>
  `;
}

// 왼쪽 절반 = 병동약국 단독 카드.
function createWardCard(department) {
  const article = document.createElement("article");
  article.className = "department-card department-card--ward kp-card kp-card--interactive";
  article.dataset.departments = department.title;
  article.style.setProperty("--accent", department.accent);

  article.innerHTML = `
    <div class="card-top">
      <div>
        <p class="card-kicker">${department.kicker}</p>
        <h3>${department.title}</h3>
      </div>
      <div class="card-icon kp-icon-badge" aria-hidden="true">
        <svg viewBox="0 0 24 24">${iconPaths[department.icon]}</svg>
      </div>
    </div>
    <div class="link-list">${linksMarkup(department.links)}</div>
  `;

  return article;
}

// 오른쪽 절반 = 윗줄 deptTop, 아랫줄 deptBottoms(여러 칸)를 한 카드에 담는다.
function createQuadCard(deptTop, deptBottoms) {
  const article = document.createElement("article");
  article.className = "department-card department-card--quad kp-card kp-card--interactive";
  article.dataset.departments = [deptTop, ...deptBottoms].map((d) => d.title).join(" ");

  article.innerHTML = `
    <div class="quad-row quad-row--top">${miniBlock(deptTop)}</div>
    <div class="stack-divider" aria-hidden="true"></div>
    <div class="quad-row quad-row--bottom">
      ${deptBottoms.map(miniBlock).join('<div class="merged-divider" aria-hidden="true"></div>')}
    </div>
  `;

  return article;
}

const grid = document.querySelector("#departmentGrid");
grid.appendChild(createWardCard(departments[0]));
grid.appendChild(createQuadCard(mergedDepartments[0], [mergedDepartments[1], commonDepartment]));

const allDepartments = [...departments, commonDepartment, ...mergedDepartments];

// ===== 검색 =====
const portalSearch = document.querySelector("#portalSearch");
const emptyState = document.querySelector("#emptyState");

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
  const normalizedQuery = query.trim().toLocaleLowerCase("ko-KR");
  let visibleCount = 0;

  document.querySelectorAll(".department-card").forEach((card) => {
    const cardDepartments = allDepartments.filter((department) =>
      card.dataset.departments.split(" ").includes(department.title)
    );

    const searchableText = cardDepartments
      .flatMap((department) => [department.title, department.kicker, ...department.links.map((l) => l.label)])
      .join(" ")
      .toLocaleLowerCase("ko-KR");

    const matched = normalizedQuery === "" || searchableText.includes(normalizedQuery);
    card.hidden = !matched;
    if (matched) visibleCount += 1;

    card.querySelectorAll("a.portal-link").forEach((link) => {
      const label = link.textContent.trim().toLocaleLowerCase("ko-KR");
      link.classList.toggle("is-hit", normalizedQuery !== "" && label.includes(normalizedQuery));
    });
  });

  emptyState.hidden = visibleCount > 0;
}

// ===== 시계 · 날짜 · 인사말 =====
const clock = document.querySelector("#clock");
const heroDate = document.querySelector("#heroDate");
const timeFormat = new Intl.DateTimeFormat("ko-KR", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
const dateFormat = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
});

function updateClock() {
  const now = new Date();
  clock.textContent = timeFormat.format(now);
  heroDate.textContent = dateFormat.format(now);
}

updateClock();
setInterval(updateClock, 15000);

// ===== 히어로 통계 (부서 수 · 바로가기 수 · 방문자 수) =====
(function renderHeroStats() {
  const box = document.querySelector("#heroStats");
  if (!box) return;

  const departmentCount = departments.length + mergedDepartments.length;
  const linkCount = allDepartments.reduce((sum, d) => sum + d.links.length, 0);

  box.innerHTML = `
    <span class="hero-stat"><b>${departmentCount}</b>개 부서</span>
    <span class="hero-stat-divider" aria-hidden="true"></span>
    <span class="hero-stat"><b>${linkCount}</b>개 바로가기</span>
  `;

  // 방문자 수 (Cloudflare KV). 바인딩이 없는 로컬 미리보기에서는 조용히 생략된다.
  const counted = sessionStorage.getItem("kp_visit_counted");
  const method = counted ? "GET" : "POST";

  fetch("/api/hits", { method })
    .then((res) => res.json())
    .then((data) => {
      if (!data || typeof data.count !== "number") return;
      const divider = document.createElement("span");
      divider.className = "hero-stat-divider";
      divider.setAttribute("aria-hidden", "true");
      const stat = document.createElement("span");
      stat.className = "hero-stat";
      stat.innerHTML = `<b>${data.count.toLocaleString("ko-KR")}</b>번째 방문`;
      box.append(divider, stat);
      sessionStorage.setItem("kp_visit_counted", "1");
    })
    .catch(() => {});
})();

// ===== 탭 · 개인 공간 =====
// 개인 바로가기는 서버(Cloudflare KV)에 저장되어 어느 기기에서 열어도 같다. 비밀번호는 서버에서만 확인하고
// (functions/api/personal.js), 열림 상태는 메모리에만 둔다. 새로고침하거나 다시 접속하면 매번 묻는다.
const LEGACY_KEY = "kp_personal_links"; // 예전에 이 브라우저에만 저장하던 목록(한 번 서버로 옮기고 지운다)

let personalPin = "";
let personalList = [];

const tabPortal = document.querySelector("#tabPortal");
const tabPersonal = document.querySelector("#tabPersonal");
const panelPortal = document.querySelector("#panelPortal");
const panelPersonal = document.querySelector("#panelPersonal");
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

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function renderPersonal() {
  personalLinks.innerHTML = personalList
    .map(
      (link, index) => `
        <span class="chip-wrap">
          <a class="portal-link kp-chip" href="${escapeHtml(link.href)}" target="_blank" rel="noopener" title="${escapeHtml(link.label)}">
            <span>${escapeHtml(link.label)}</span>
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
  if (personal) {
    showPersonalBody(Boolean(personalPin));
    if (!personalPin) pinInput.focus();
  }
}

// 저장에 실패하면(서버 오류 · 비밀번호 변경 등) 화면 목록을 되돌리고 이유를 보여 준다.
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
    // 예전에 이 브라우저에 저장해 둔 목록이 있으면 서버로 한 번 옮긴다.
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
