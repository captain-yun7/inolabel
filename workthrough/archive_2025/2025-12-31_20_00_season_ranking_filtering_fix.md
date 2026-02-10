# 시즌별 랭킹 필터링 구현

## 개요
`useRanking` 훅의 mock 데이터 모드에서 시즌별 필터링이 작동하지 않던 문제를 수정했습니다.

## 문제점
- `/ranking/season/[id]` 페이지에서 시즌 선택 시 데이터가 변경되지 않음
- 원인: mock 데이터 모드에서 `mockProfiles.total_donation`(누적 합계)만 사용
- `selectedSeasonId`가 있어도 실제로 `mockDonations`를 필터링하지 않음

## 해결 방법
`useRanking.ts`의 mock 데이터 로직을 분기 처리:

```typescript
if (selectedSeasonId) {
  // 1. mockDonations에서 해당 시즌 데이터만 필터링
  let seasonDonations = mockDonations.filter(d => d.season_id === selectedSeasonId)

  // 2. 유닛 필터 적용
  if (unitFilter !== 'all' && unitFilter !== 'vip') {
    seasonDonations = seasonDonations.filter(d => d.unit === unitFilter)
  }

  // 3. 후원자별 합계 계산 (Map 사용)
  // 4. 정렬 및 순위 부여
} else {
  // 시즌 미선택: 기존 mockProfiles 기반 전체 랭킹
}
```

## 변경 파일
| 파일 | 변경 내용 |
|------|----------|
| `src/lib/hooks/useRanking.ts` | 시즌별 후원 데이터 필터링 로직 추가, mockDonations 기반 집계 구현 |

## 결과
- ✅ 빌드 성공 (4.5s)
- ✅ `/ranking/season/4` (시즌 4) - 시즌 4 후원 데이터만 표시
- ✅ `/ranking/season/3` (시즌 3) - 시즌 3 후원 데이터만 표시
- ✅ `/ranking/total` - 전체 누적 랭킹 (mockProfiles 기반)
- ✅ 유닛 필터 (엑셀부/크루부) 정상 동작

## Mock 데이터 구조
```
mockDonations 예시:
- 시즌 4: gul***, 핑크하트, 별빛수호자, 영원한서포터, 나노사랑 등
- 시즌 3: 핑크하트, 별빛수호자, gul*** 등
```

## 다음 단계
- 실제 Supabase 연동 시 동일 로직 검증
- 시즌별 통계 대시보드 추가 고려
