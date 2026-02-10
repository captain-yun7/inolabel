# 디자인 시스템 CSS 변수 통합

## 개요
`RG_FAMILY_DESIGN_SYSTEM.md` 비전에 맞춰 CSS 하드코딩을 제거하고, Pink/Gold 하이브리드 색상 시스템을 구축했습니다. 접근성(prefers-reduced-motion) 지원도 추가했습니다.

## 주요 변경사항

### 색상 시스템 통합
- **Pink Accent** (`--color-pink`): 일반 UI, 버튼, 링크용
- **Gold Accent** (`--color-gold`): VIP, 랭킹 Top 3, 프리미엄용
- **LIVE 색상** (`--live-color`): 빨강 유지 (#ef4444)

### CSS 하드코딩 제거
- `RankingBoard.module.css`: rank1/2/3 색상 → CSS 변수
- `GaugeBar.module.css`: gold/silver/bronze → CSS 변수
- `LiveMembers.module.css`: 핑크/레드 → CSS 변수
- `MemberCard.module.css`: 하드코딩 색상 → CSS 변수
- `MemberDetailModal.module.css`: 하드코딩 색상 → CSS 변수

## 핵심 코드

```css
/* globals.css - Pink/Gold 하이브리드 */
--color-pink: #fd68ba;
--color-pink-light: #ff8ed4;
--color-pink-glow: rgba(253, 104, 186, 0.4);
--color-pink-bg: rgba(253, 104, 186, 0.1);
--color-gold: var(--metallic-gold);
--color-primary: var(--color-pink);

/* LIVE Status */
--live-color: #ef4444;
--live-color-dark: #dc2626;
--live-glow: rgba(239, 68, 68, 0.25);
```

```css
/* 변경 전 */
color: #ffd700;

/* 변경 후 */
color: var(--metallic-gold);
```

## 결과
- ✅ 빌드 성공 (30개 페이지)
- ✅ TypeScript 오류 없음
- ✅ 모든 컴포넌트 CSS 변수 사용

## 다음 단계
- Hero.module.css 하드코딩 색상 정리 (`#ffffff` 등)
- Calendar.module.css 시안색 변수화
- ThemeToggle.module.css 테마 색상 변수화
- 라이트 모드 UI 테스트 및 조정
