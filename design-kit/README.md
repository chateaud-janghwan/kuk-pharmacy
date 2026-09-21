# 약제부 포털 디자인 키트

메인페이지에서 쓰는 공용 디자인 시스템. 무보더 · 플랫 · 화이트/그레이 베이스 +
블루 액센트 (토스증권류 톤앤매너). 바로가기로 연결되는 다른 프로젝트에도 그대로
복사해서 붙이면 전체 사이트가 같은 느낌을 갖게 됩니다.

## 구성

- `tokens.css` — 색, 반경, 그림자, 폰트, 간격 CSS 변수 (`--kp-*`). 라이트/다크 자동 대응.
- `components.css` — 리셋 + 공용 컴포넌트 클래스 (`.kp-card`, `.kp-chip`, `.kp-btn`, `.kp-input`, `.kp-topbar` 등).

## 다른 프로젝트에 적용하는 법

1. 이 두 파일(`tokens.css`, `components.css`)을 대상 프로젝트에 그대로 복사.
2. `<head>`에 Pretendard Variable 폰트 다음, 그 프로젝트 자체 CSS보다 먼저 불러오기:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
/>
<link rel="stylesheet" href="design-kit/tokens.css" />
<link rel="stylesheet" href="design-kit/components.css" />
<link rel="stylesheet" href="styles.css" />
<!-- 이 프로젝트만의 레이아웃/페이지 스타일 -->
```

3. 그 프로젝트의 `styles.css`(페이지 전용 스타일)에서는 색상/반경/그림자를 새로 정의하지
   말고 무조건 `var(--kp-*)` 토큰을 참조. 레이아웃(그리드, 여백, 페이지 구조)만 그 안에 둔다.
4. 버튼/카드/칩/인풋은 직접 스타일링하지 말고 아래 클래스를 쓴다.

## 컴포넌트 사용법

**카드**
```html
<article class="kp-card kp-card--interactive">...</article>
```

**칩(바로가기, 태그 등)**
```html
<a class="kp-chip" href="...">라벨</a>
```

**버튼**
```html
<button class="kp-btn kp-btn--primary">주요 동작</button>
<button class="kp-btn kp-btn--secondary">보조 동작</button>
```

**검색/인풋**
```html
<label class="kp-input">
  <svg>...</svg>
  <input type="search" placeholder="..." />
</label>
```

**아이콘 배지** (부서/카테고리 컬러 포인트용)
```html
<div class="kp-icon-badge" style="--kp-badge-bg: ...; --kp-badge-fg: ...">
  <svg>...</svg>
</div>
```

## 원칙

- 그라데이션 블롭, 유리질(glassmorphism), 과한 그림자·애니메이션 금지 — 배경은 평평한
  `--kp-bg` / `--kp-surface`만 쓴다.
- 카드/칩/버튼에 테두리(border)를 거의 쓰지 않는다. 면 색 차이와 아주 옅은 그림자
  (`--kp-shadow`)로만 구분한다.
- 강조는 파란색(`--kp-blue`) 하나로 통일. 부서/카테고리별 포인트 컬러가 필요하면
  `--kp-badge-bg` / `--kp-badge-fg`처럼 아이콘 배지에만 국한해서 쓴다.
- 헤드라인은 굵게(800), 본문/보조 텍스트는 굵기를 낮추고 회색(`--kp-muted`,
  `--kp-faint`)으로 위계를 준다.

## 적용 대상 후보 (Desktop/Claude 하위 바로가기 프로젝트)

메인페이지에서 링크로 연결된 프로젝트들이 각각 별도 디렉터리/배포로 존재합니다.
전체 통일을 원하면 이 키트를 각 프로젝트에 순서대로 적용해야 합니다 — 몇 개나
어떤 순서로 먼저 할지 정해서 요청해주세요.
