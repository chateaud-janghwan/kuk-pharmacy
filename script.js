const departments = [
  {
    title: "병동약국",
    kicker: "Ward Pharmacy",
    accent: "#3182f6",
    accentBg: "#e8f3ff",
    icon: "ward",
    links: [
      { label: "향정계산기", href: "https://hyangjeong-counter.pages.dev/" },
      {
        label: "폐기량 계산",
        href: "https://drug-disposal-calculator.hidoi.workers.dev/",
      },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
    ],
  },
  {
    title: "외래약국",
    kicker: "Outpatient Pharmacy",
    accent: "#00b894",
    accentBg: "#e5fbf5",
    icon: "outpatient",
    links: [
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
    ],
  },
  {
    title: "약무정보실",
    kicker: "Drug Information",
    accent: "#ff6f61",
    accentBg: "#fff0ee",
    icon: "info",
    links: [
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
    ],
  },
  {
    title: "임상지원실",
    kicker: "Clinical Support",
    accent: "#8b5cf6",
    accentBg: "#f1edff",
    icon: "clinical",
    links: [
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
      { label: "-", href: "#" },
    ],
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
};

function createDepartmentCard(department) {
  const article = document.createElement("article");
  article.className = "department-card";
  article.style.setProperty("--accent", department.accent);
  article.style.setProperty("--accent-bg", department.accentBg);

  const links = department.links
    .map(
      (link) => `
        <a class="portal-link" href="${link.href}">
          <span>${link.label}</span>
          <span aria-hidden="true">›</span>
        </a>
      `
    )
    .join("");

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
    <div class="link-list">${links}</div>
  `;

  return article;
}

const grid = document.querySelector("#departmentGrid");
departments.forEach((department) => grid.appendChild(createDepartmentCard(department)));

const searchToggle = document.querySelector("#searchToggle");
const searchPanel = document.querySelector("#searchPanel");
const portalSearch = document.querySelector("#portalSearch");

searchToggle.addEventListener("click", () => {
  searchPanel.hidden = !searchPanel.hidden;
  if (!searchPanel.hidden) {
    portalSearch.focus();
  } else {
    portalSearch.value = "";
    filterDepartments("");
  }
});

portalSearch.addEventListener("input", (event) => {
  filterDepartments(event.target.value);
});

function filterDepartments(query) {
  const normalizedQuery = query.trim().toLocaleLowerCase("ko-KR");

  document.querySelectorAll(".department-card").forEach((card, index) => {
    const department = departments[index];
    const searchableText = [
      department.title,
      department.kicker,
      ...department.links.map((link) => link.label),
    ]
      .join(" ")
      .toLocaleLowerCase("ko-KR");

    card.hidden = normalizedQuery !== "" && !searchableText.includes(normalizedQuery);
  });
}
