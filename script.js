// 바로가기 수정 방법:
// links 배열에 { label: "버튼 이름", href: "https://주소" }를 넣으면 됩니다.
const projects = [
  {
    title: "Pharmacy Tools",
    description: "반복되는 약제 업무를 더 빠르고 정확하게 처리하기 위한 실무 도구 모음.",
    background: "#e9f2ff",
    text: "#17294a",
    image: "assets/pharmacy-hero.png",
    links: [
      { label: "향정계산기", href: "https://hyangjeong-counter.pages.dev/" },
      {
        label: "폐기량 계산",
        href: "https://drug-disposal-calculator.hidoi.workers.dev/",
      },
    ],
  },
  {
    title: "F1 Show",
    description: "최신 Formula 1 뉴스를 한곳에 모아 빠르게 확인할 수 있는 뉴스 큐레이션 사이트.",
    background: "#f0f0f3",
    text: "#1d1d1f",
    image: "assets/f1-show-illustration.png",
    links: [{ label: "F1 뉴스 보기", href: "https://f1show.pages.dev" }],
  },
  {
    title: "주식 용어사전",
    description: "처음 주식을 시작하는 사람도 어려운 투자 용어를 쉽고 빠르게 이해할 수 있는 입문자용 사전.",
    background: "#edf7f1",
    text: "#173b2a",
    image: "assets/stock-chart-illustration.png",
    links: [
      {
        label: "용어사전 보기",
        href: "https://c02e0919.stock-beginner-glossary.pages.dev",
      },
    ],
  },
];

function createShortcut(link) {
  const isReady = Boolean(link.href);
  const element = document.createElement(isReady ? "a" : "span");
  element.className = `shortcut-button${isReady ? "" : " disabled"}`;
  element.textContent = link.label;

  if (isReady) {
    element.href = link.href;
    element.target = "_blank";
    element.rel = "noopener noreferrer";
    element.insertAdjacentHTML("beforeend", '<span aria-hidden="true">↗</span>');
  }

  return element;
}

function createProjectCard(project, index) {
  const card = document.createElement("article");
  card.className = "project-card";
  card.dataset.dark = String(Boolean(project.dark));
  card.style.setProperty("--card-bg", project.background);
  card.style.setProperty("--card-text", project.text);

  const copy = document.createElement("div");
  copy.className = "project-copy";
  copy.innerHTML = `
    <p class="project-number">${String(index + 1).padStart(2, "0")}</p>
    <h3>${project.title}</h3>
    <p class="project-description">${project.description}</p>
  `;

  const shortcuts = document.createElement("div");
  shortcuts.className = "shortcut-list";
  project.links.forEach((link) => shortcuts.appendChild(createShortcut(link)));
  copy.appendChild(shortcuts);

  const visual = document.createElement("div");
  visual.className = "project-visual";

  if (project.image) {
    visual.innerHTML = `
      <div class="device-frame">
        <img src="${project.image}" alt="${project.title} 프로젝트 미리보기" />
      </div>
    `;
  } else {
    visual.innerHTML = '<div class="abstract-visual" aria-hidden="true"></div>';
    const shape = visual.querySelector(".abstract-visual");
    shape.style.setProperty("--visual-a", project.colors[0]);
    shape.style.setProperty("--visual-b", project.colors[1]);
  }

  card.append(copy, visual);
  return card;
}

const projectList = document.querySelector("#projectList");
projects.forEach((project, index) => {
  projectList.appendChild(createProjectCard(project, index));
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.animate(
        [
          { opacity: 0, transform: "translateY(36px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 700,
          easing: "cubic-bezier(.2,.8,.2,1)",
          fill: "both",
        }
      );
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".project-card").forEach((card) => observer.observe(card));
