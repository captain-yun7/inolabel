# 상단 네비게이션 버튼 너비 및 VIP 페이지 레이아웃 수정

## 개요
상단 네비게이션의 홈 버튼이 너무 가로로 긴 문제 해결 및 VIP 상세페이지에 pageNav 추가.

## 주요 변경사항

### 1. 네비게이션 버튼 너비 수정
- `.backBtn` 및 `.navBtn`에 `width: fit-content` 추가
- 수평 패딩 `var(--space-4)` → `var(--space-3)` 축소
- 4개 페이지 CSS 파일 수정

### 2. VIP 상세페이지 pageNav 추가
- `/ranking/vip/[userId]` 페이지에 상단 네비게이션 추가
- 골드 테마 적용 (기존 VIP 페이지 스타일 일관성)
- VIP LOUNGE 타이틀 + 랭킹 링크 버튼

## 수정된 파일

### 네비게이션 버튼 너비
- `src/app/info/live/page.module.css`
- `src/app/ranking/total/page.module.css`
- `src/app/info/org/page.module.css`
- `src/app/ranking/vip/page.module.css`

### VIP 상세페이지
- `src/app/ranking/vip/[userId]/page.tsx` - pageNav JSX 추가
- `src/app/ranking/vip/[userId]/page.module.css` - pageNav 스타일 추가

## 핵심 코드

### 버튼 너비 수정
```css
.backBtn {
  padding: var(--space-2) var(--space-3); /* space-4에서 축소 */
  width: fit-content; /* 추가 */
}
```

### VIP pageNav 스타일
```css
.pageNav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  background: #09090b;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.navTitle {
  color: var(--rank-color); /* 골드 */
}
```

## 결과
- 모든 페이지에서 네비게이션 버튼이 컴팩트하게 표시
- VIP 상세페이지가 다른 페이지들과 동일한 레이아웃 패턴 적용
- 빌드 성공

## 다음 단계
- 레퍼런스 이미지의 ELITE RANKINGS 테이블 스타일 적용 검토
- Tribute 페이지(Top 1-3)에도 pageNav 적용 검토
