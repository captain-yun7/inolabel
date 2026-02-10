# 디자인 시스템 통일 - CSS 변수화

## 개요
랭킹/VIP 페이지들의 디자인 일관성 문제를 해결하기 위해 하드코딩된 색상, spacing, border-radius, shadow 값들을 CSS 변수로 통일했습니다. 모든 랭킹 관련 페이지에서 동일한 디자인 토큰을 사용하도록 개선했습니다.

## 주요 변경사항

### globals.css - 디자인 토큰 추가
- **Success 상태 색상**: `--success`, `--success-bg`, `--success-border`
- **VIP Hero 배경**: `--vip-hero-bg` (프리미엄 골드 그라디언트)
- **Spacing 추가**: `--space-1-5` (6px)

### Season 랭킹 페이지 CSS 변수화
- Hero 섹션: `var(--hero-padding)`, `var(--hero-bg)`, `var(--hero-glow)`
- Typography: `var(--text-*)`, `var(--font-*)`
- Spacing: `var(--space-*)` 전환
- Border-radius: `var(--radius-*)` 전환
- Metallic 색상: `var(--metallic-gold-*)` 사용

### VIP 페이지 CSS 변수화
- 모든 하드코딩된 `#d4af37`, `rgba(212, 175, 55, ...)` 제거
- `var(--metallic-gold-*)` 통일 사용
- 멤버 랭크 배지: 골드/실버/브론즈 그라디언트 변수 적용
- Signatures 섹션: 일관된 변수 시스템 적용

## 핵심 코드

```css
/* globals.css - Success 상태 색상 */
--success: #4ade80;
--success-bg: rgba(34, 197, 94, 0.15);
--success-border: rgba(34, 197, 94, 0.3);

/* VIP Hero 배경 */
--vip-hero-bg: linear-gradient(165deg,
  #050505 0%, #0a0a0c 10%, #12100d 25%,
  #1a1610 40%, #201a12 50%, ...);

/* 통일된 멤버 랭크 스타일 */
.memberRank[data-rank="1"] {
  background: var(--metallic-gold-gradient);
}
.memberRank[data-rank="2"] {
  background: var(--metallic-silver-gradient);
}
.memberRank[data-rank="3"] {
  background: var(--metallic-bronze-gradient);
}
```

## 결과
- ✅ 빌드 성공
- ✅ 3개 페이지 CSS 변수화 완료 (total, season, vip)
- ✅ RankingCard/RankingList 컴포넌트 통일
- ✅ 디자인 일관성 확보

## 다음 단계
- 다른 페이지들(info, schedule, community)도 동일한 변수 시스템 적용
- 라이트 모드 지원 시 테마 변수 전환 구현
- 반응형 breakpoint 변수화 검토
