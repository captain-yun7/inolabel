# 디자인 일관성 및 핑크 색상 중립화

## 개요
하드코딩된 핑크 색상(`rgba(253, 104, 186, ...)`)을 CSS 변수로 교체하고, 텍스트 시인성 및 디자인 일관성을 개선. Apple, Stripe, Linear, Vercel 등 하이엔드 브랜드 웹사이트를 참조한 미니멀한 Dark Professional 테마 완성.

## 주요 변경사항

### 1. 컴포넌트 핑크 색상 중립화
- **Calendar.module.css**: 네비게이션 버튼, 필터, 오늘 날짜, 이벤트 유닛 뱃지 중립화
- **Timeline.module.css**: 시즌 버튼, 프로그레스 라인, 도트, 카드 호버 중립화
- **RankingCard.module.css**: 카드 호버 그림자 중립화
- **RankingBoard.module.css**: 탭 active 상태, 프로그레스 바 중립화
- **OrgTree.module.css**: 루트 카드, 아바타 테두리, 역할 텍스트 중립화
- **SigCard.module.css**: 플레이 버튼, 플레이스홀더, 시그 번호 중립화
- **TabFilter.module.css**: active 탭 중립화
- **Navbar.module.css**: 드롭다운 호버 중립화
- **Footer.module.css**: 링크 호버 중립화

### 2. 페이지 레벨 핑크 색상 제거
- **community/free**: 게시판 호버, 작성 버튼, 댓글 뱃지 중립화
- **auth/login & signup**: 로고, 포커스 링, 제출 버튼 중립화
- **schedule**: 별 배경 효과에서 핑크 제거
- **info/timeline**: 수직 라인 효과 중립화

### 3. 펄스 애니메이션 제거
- Calendar의 `todayPulse` 애니메이션 삭제로 미니멀한 UX 구현

## 핵심 코드

```css
/* 버튼 active 상태 - 핑크에서 중립으로 */
.tab.active {
  background: var(--text-primary);
  color: var(--background);
  box-shadow: var(--shadow-md);
}

/* 호버 효과 - 하드코딩에서 CSS 변수로 */
.card:hover {
  border-color: var(--card-border-hover);
  box-shadow: var(--shadow-xl);
}

/* 인터랙티브 상태 */
.dayCell:hover {
  background: var(--interactive-hover);
}
```

## 결과
- ✅ 빌드 성공 (30개 페이지 정상 생성)
- ✅ 모든 컴포넌트 중립적 색상으로 통일
- ✅ CSS 변수 기반으로 브랜드 컬러 변경 용이

## 다음 단계
- VIP 전용 페이지(`ranking/vip`)의 특수 효과 정리 (현재 가장 많은 핑크 색상 잔존)
- Admin 컴포넌트 중립화 (낮은 우선순위)
- 라이트 모드 테마 테스트 및 조정
- 브랜드 컬러 결정 시 `globals.css`의 Brand Colors 섹션만 수정하면 전체 적용
