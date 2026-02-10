# UI/UX 최적화 및 딥핑크 컬러 통일

## 개요
Navbar, Hero, Footer 등 주요 컴포넌트의 UI/UX를 개선하고, 전체 프로젝트에서 하드코딩된 이전 핑크 컬러(#fd68ba)를 딥핑크(#c41e7f)로 통일하여 브랜드 일관성을 확보.

## 주요 변경사항

### Navbar 개선
- VIP 빠른 접근 버튼 추가 (골드 테마)
- 모바일 메뉴에 VIP/로그인 액션 버튼 추가
- 로그인 버튼 컬러를 딥핑크로 변경

### Hero 배너 개선
- subtitle 배지 컬러 딥핑크 적용
- badge:first-child 그라디언트 CSS 변수화
- overlay 그라디언트 딥핑크 반영

### Footer 개선
- RG FAMILY 로고 + 브랜드 타이틀 추가
- VIP LOUNGE 빠른 링크 (골드 테마)
- "Made with ♥ by fans, for fans" 하트 애니메이션
- 소셜 링크 호버 시 핑크 컬러 적용
- 상단 핑크 그라디언트 라인 장식

### 하드코딩 컬러 통일 (30+ 파일)
```css
/* Before */
rgba(253, 104, 186, ...)  /* #fd68ba */

/* After */
rgba(196, 30, 127, ...)   /* #c41e7f */
```

수정된 파일:
- `src/app/community/free/page.module.css`
- `src/app/community/vip/page.module.css`
- `src/app/notice/page.module.css`
- `src/app/info/live/page.module.css`
- `src/components/info/SigDetailModal.module.css`
- `src/components/info/MemberDetailModal.module.css`
- `src/components/ranking/SeasonSelector.module.css`
- `src/components/admin/*.module.css`
- `src/app/admin/shared.module.css`

## 핵심 코드

```css
/* Navbar VIP Button */
.vipBtn {
  background: linear-gradient(135deg, var(--metallic-gold-bg), rgba(180, 140, 45, 0.2));
  border: 1px solid var(--metallic-gold-border);
  color: var(--metallic-gold);
}

/* Footer Heart Animation */
.heartIcon {
  color: var(--color-pink);
  animation: heartBeat 1.5s ease-in-out infinite;
}

/* Mobile VIP/Login Actions */
.mobileActions {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid var(--glass-border);
}
```

## 결과
- ✅ 빌드 성공 (30개 페이지)
- ✅ 모든 하드코딩 컬러 딥핑크로 통일
- ✅ Navbar 모바일 UX 개선
- ✅ Footer 브랜드 강화
- ✅ Hero 배너 컬러 일관성 확보

## 다음 단계
- 브라우저에서 실제 UI 시각적 확인
- 모바일 반응형 테스트
- 다크/라이트 모드 전환 시 컬러 확인
- 추가 페이지(schedule, sig) 네비게이션 패턴 통일 검토
