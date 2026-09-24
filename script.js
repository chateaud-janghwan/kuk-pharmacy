// 병동약국은 단독 카드로, 나머지 세 부서는 카드 하나를 절반씩 나눠 담는다
// (좌: 약무정보실 / 우: 외래약국·임상지원실 상하 분할).
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
      { label: "매뉴얼챗봇", href: "https://pharm-manual.pages.dev" },
      { label: "상비품체커", href: "https://sangbipum-checklist.pages.dev" },
    ],
  },
];

const commonDepartment = {
  title: "공통",
  kicker: "Common",
  accent: "#64748b",
  icon: "common",
  links: [{ label: "통합매뉴얼", href: "https://pharm-hub-75r.pages.dev/" }],
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
  {
    title: "임상지원실",
    kicker: "Clinical Support",
    accent: "#8b5cf6",
    icon: "clinical",
    links: [{ label: "복약지도문제작", href: "https://chemo-guide.pages.dev/" }],
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
  clinical: `
    <path d="M10 3v6l-5 8a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-5-8V3" />
    <path d="M8 3h8" />
    <path d="M8 15h8" />
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
    .map(
      (link) => `
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

// 왼쪽 절반 = deptLeft 전체, 오른쪽 절반 = deptTop / deptBottom 을 상하로 분할.
function createMergedCard(deptLeft, deptTop, deptBottom) {
  const article = document.createElement("article");
  article.className = "department-card department-card--merged kp-card kp-card--interactive";
  article.dataset.departments = `${deptLeft.title} ${deptTop.title} ${deptBottom.title}`;

  article.innerHTML = `
    <div class="merged-half" style="--accent:${deptLeft.accent}">
      <div class="card-top">
        <div>
          <p class="card-kicker">${deptLeft.kicker}</p>
          <h3>${deptLeft.title}</h3>
        </div>
        <div class="card-icon kp-icon-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24">${iconPaths[deptLeft.icon]}</svg>
        </div>
      </div>
      <div class="link-list">${linksMarkup(deptLeft.links)}</div>
    </div>
    <div class="merged-divider" aria-hidden="true"></div>
    <div class="merged-half merged-half--stack">
      ${miniBlock(deptTop)}
      <div class="stack-divider" aria-hidden="true"></div>
      ${miniBlock(deptBottom)}
    </div>
  `;

  return article;
}

// 병동약국 카드 옆에 공통(통합매뉴얼)을 세로 구분선으로 이어붙여, 그리드 칸 수를 늘리지 않는다.
function createStackedDeptCard(deptLeft, deptRight) {
  const article = document.createElement("article");
  article.className = "department-card department-card--merged kp-card kp-card--interactive department-card--stacked";
  article.dataset.departments = `${deptLeft.title} ${deptRight.title}`;

  article.innerHTML = `
    <div class="merged-half" style="--accent:${deptLeft.accent}">
      <div class="card-top">
        <div>
          <p class="card-kicker">${deptLeft.kicker}</p>
          <h3>${deptLeft.title}</h3>
        </div>
        <div class="card-icon kp-icon-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24">${iconPaths[deptLeft.icon]}</svg>
        </div>
      </div>
      <div class="link-list">${linksMarkup(deptLeft.links)}</div>
    </div>
    <div class="merged-divider" aria-hidden="true"></div>
    <div class="merged-half" style="--accent:${deptRight.accent}">
      <div class="card-top">
        <div>
          <p class="card-kicker">${deptRight.kicker}</p>
          <h3>${deptRight.title}</h3>
        </div>
        <div class="card-icon kp-icon-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24">${iconPaths[deptRight.icon]}</svg>
        </div>
      </div>
      <div class="link-list">${linksMarkup(deptRight.links)}</div>
    </div>
  `;

  return article;
}

const grid = document.querySelector("#departmentGrid");
grid.appendChild(createStackedDeptCard(departments[0], commonDepartment));
grid.appendChild(createMergedCard(mergedDepartments[0], mergedDepartments[1], mergedDepartments[2]));

const allDepartments = [...departments, commonDepartment, ...mergedDepartments];

// ===== 검색 =====
const portalSearch = document.querySelector("#portalSearch");
const emptyState = document.querySelector("#emptyState");

portalSearch.addEventListener("input", (event) => {
  filterDepartments(event.target.value);
});

document.addEventListener("keydown", (event) => {
  const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName || "");
  if (event.key === "/" && !typing) {
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
