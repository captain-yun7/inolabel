# 코드 개선 및 테스트 인프라 구축

## 개요
중복 코드 통합, 미사용 코드 정리, 테스트 인프라 구축을 완료했습니다. `formatAmount`, `getRankIcon`, `getInitials` 등 8개 파일에 분산된 중복 함수를 중앙화하고, 미사용 훅 15개를 삭제하고, Vitest 기반 테스트 환경을 구축했습니다.

## 주요 변경사항

### 유틸리티 통합
- **생성**: `/src/lib/utils/ranking.ts` - `getRankIcon`, `getRankTier`, `getInitials`
- **추가**: `/src/lib/utils/format.ts` - `formatCurrency`, `formatAmountShort`
- **수정**: `/src/lib/utils.ts` - 모든 유틸리티 re-export

### 컴포넌트 수정 (7개)
- RankingCard, GaugeBar, RankingPodium, RankingFullList, RankingList
- TributeHero, TributeDonationTimeline

### 페이지 수정 (5개)
- ranking/[userId], ranking/season/[id]
- admin/page, admin/donations, admin/members

### 미사용 코드 삭제
- `/src/lib/hooks/useMockData.ts` (15개 미사용 훅)

### 테스트 인프라
- Vitest + React Testing Library 설치
- `vitest.config.ts`, `setup.tsx` 생성
- 40개 유닛 테스트 작성 및 통과

## 핵심 코드

```typescript
// /src/lib/utils/ranking.ts
export const getRankIcon = (rank: number, variant: 'standard' | 'minimal' = 'standard') => {
  if (rank === 1) return Crown
  if (variant === 'minimal') return rank <= 3 ? Star : null
  if (rank === 2) return Medal
  if (rank === 3) return Award
  return null
}
```

## 결과
- ✅ 빌드 성공 (30 routes)
- ✅ 테스트 통과 (40/40)
- ✅ 중복 코드 제거 완료
- ✅ 미사용 코드 정리 완료

## 다음 단계
- 컴포넌트 테스트 추가 (RankingCard, GaugeBar 등)
- E2E 테스트 환경 구축 (Playwright)
- 코드 커버리지 목표 설정 (70% 이상)
