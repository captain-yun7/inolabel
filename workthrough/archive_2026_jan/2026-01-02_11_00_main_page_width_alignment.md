# 메인 페이지 Hero/Content 너비 정렬 수정

## 개요
메인 페이지에서 Hero 배너와 아래 콘텐츠 영역의 좌우 너비가 맞지 않는 문제를 분석하고 해결.

## 문제 분석
1. **초기 문제**: Hero(1280px) vs Content(1440px) - 160px 차이
2. **근본 원인**: CSS Grid의 `1fr`이 컨텐츠 크기에 따라 확장
   - Content의 `grid-template-columns: 1fr`이 1480px로 계산
   - live-notice-grid의 `1fr 1fr`도 724px씩으로 확장

## 해결방안
- `minmax(0, 1fr)` 사용하여 그리드 컬럼이 컨테이너 제약을 준수하도록 강제

## 핵심 코드
```css
/* page.module.css */
.content {
  grid-template-columns: minmax(0, 1fr); /* 1fr → minmax(0, 1fr) */
}

/* globals.css */
.live-notice-grid {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}

/* Hero.module.css */
.container {
  max-width: var(--max-width-wide); /* 1440px */
  padding: 0 2rem;
}
```

## 결과
- Carousel: 1376px (left: 267, right: 1643)
- Grid: 1376px (left: 267, right: 1643)
- Shorts/VOD: 1376px (left: 267, right: 1643)
- **모든 섹션 완벽 정렬**

## 핵심 교훈
CSS Grid에서 `1fr`은 "남은 공간"이 아닌 "컨텐츠 기반 최소 너비"를 가짐.
`minmax(0, 1fr)`을 사용해야 컨테이너 제약을 준수함.
