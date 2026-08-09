const SLOT_COUNT = 10;

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
      { label: "점심메뉴", href: "https://lunch-menu-5ok.pages.dev/" },
      { label: "재고분석", href: "https://drug-stock-analyzer.pages.dev" },
    ],
  },
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
  // 추후 추가 시 아래 주석 해제
  // {
  //   title: "외래약국",
  //   kicker: "Outpatient Pharmacy",
  //   accent: "#0ea474",
  //   icon: "outpatient",
  //   links: [],
  // },
  // {
  //   title: "임상지원실",
  //   kicker: "Clinical Support",
  //   accent: "#8b5cf6",
  //   icon: "clinical",
  //   links: [],
  // },
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
};

function createDepartmentCard(department) {
  const article = document.createElement("article");
  article.className = "department-card";
  article.style.setProperty("--accent", department.accent);

  const realLinks = department.links
    .map(
      (link) => `
        <a class="portal-link" href="${link.href}" target="_blank" rel="noopener">
          <span>${link.label}</span>
        </a>
      `
    )
    .join("");

  const emptySlots = Array.from(
    { length: Math.max(0, SLOT_COUNT - department.links.length) },
    () => `<span class="portal-link is-empty" aria-hidden="true">미지정</span>`
  ).join("");

  article.innerHTML = `
    <div class="card-top">
      <div>
        <p class="card-kicker">${department.kicker}</p>
        <h3>${department.title}</h3>
      </div>
      <div class="card-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">${iconPaths[department.icon]}</svg>
      </div>
    </div>
    <div class="link-list">${realLinks}${emptySlots}</div>
  `;

  return article;
}

const grid = document.querySelector("#departmentGrid");
departments.forEach((department) => grid.appendChild(createDepartmentCard(department)));

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

  document.querySelectorAll(".department-card").forEach((card, index) => {
    const department = departments[index];
    const searchableText = [
      department.title,
      department.kicker,
      ...department.links.map((link) => link.label),
    ]
      .join(" ")
      .toLocaleLowerCase("ko-KR");

    const matched = normalizedQuery === "" || searchableText.includes(normalizedQuery);
    card.hidden = !matched;
    if (matched) visibleCount += 1;

    card.querySelectorAll("a.portal-link").forEach((link, linkIndex) => {
      const label = department.links[linkIndex].label.toLocaleLowerCase("ko-KR");
      link.classList.toggle(
        "is-hit",
        normalizedQuery !== "" && label.includes(normalizedQuery)
      );
    });
  });

  emptyState.hidden = visibleCount > 0;
}

// ===== 시계 · 날짜 =====
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

// ===== 방문자 카운터 (Cloudflare KV) =====
(function visitorCounter() {
  const box = document.querySelector("#visitCounter");
  const out = document.querySelector("#visitCount");
  if (!box || !out) return;

  // 같은 세션에서 새로고침해도 1회만 증가
  const counted = sessionStorage.getItem("kp_visit_counted");
  const method = counted ? "GET" : "POST";

  fetch("/api/hits", { method })
    .then((res) => res.json())
    .then((data) => {
      if (!data || typeof data.count !== "number") return; // 바인딩 없으면 숨김 유지
      out.textContent = data.count.toLocaleString("ko-KR");
      box.hidden = false;
      sessionStorage.setItem("kp_visit_counted", "1");
    })
    .catch(() => {});
})();
