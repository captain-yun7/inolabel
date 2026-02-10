# 전체 페이지 프리미엄 디자인 통일

## 개요
VIP/랭킹 페이지의 프리미엄 디자인을 조직도, 타임라인, 시그니처, 캘린더 페이지에 일관되게 적용했습니다. 골드 악센트 테마와 라이트/다크 모드 지원을 모든 페이지에 통일했습니다.

## 주요 변경사항

### 개발한 것
- `/ranking/season` 시즌별 랭킹 목록 전용 페이지 생성
- 각 페이지에 프리미엄 Hero 섹션 패턴 적용 (heroBadge, 골드 그라디언트 배경)

### 수정한 것
- 조직도 페이지: 프리미엄 네비게이션, 유닛 토글, 멤버 카드 호버 효과
- 타임라인 페이지: 필터 섹션, 카드 스타일링, 골드 라인
- 시그니처 페이지: 카드 호버 효과, 골드 테두리
- 캘린더 페이지: 레전드 스타일링, 펄스 애니메이션

### 개선한 것
- VIP 페이지 라이트 모드 텍스트 가시성 문제 해결
- 모든 페이지에 `:global([data-theme="light"])` 라이트 모드 오버라이드 추가

## 핵심 코드

```css
/* 프리미엄 Hero 배경 패턴 */
.hero::before {
  background: radial-gradient(
    ellipse 60% 60% at 50% 30%,
    rgba(212, 175, 55, 0.08) 0%,
    transparent 60%
  );
}

/* 골드 배지 스타일 */
.heroBadge {
  background: var(--metallic-gold-bg);
  border: 1px solid var(--metallic-gold-border);
  color: var(--metallic-gold);
}

/* 라이트 모드 오버라이드 */
:global([data-theme="light"]) .heroBadge {
  background: linear-gradient(135deg, rgba(184, 134, 11, 0.1), rgba(150, 110, 20, 0.15));
  color: #8b6914;
}
```

## 결과
- ✅ 모든 페이지 프리미엄 디자인 적용 완료
- ✅ 라이트/다크 모드 일관성 확보
- ✅ 메인 홈페이지 컴포넌트 확인 (이미 프리미엄 스타일 적용됨)

## 다음 단계
- Top 1-3 개인 헌정 페이지 (`/ranking/vip/[userId]`) 구현
- PandaTV API 연동으로 실시간 라이브 상태 감지
- 메인 홈페이지 컴포넌트 라이트 모드 세부 조정 (필요시)
