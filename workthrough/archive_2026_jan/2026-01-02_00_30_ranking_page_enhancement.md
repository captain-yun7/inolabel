# 랭킹 페이지 개선 및 시즌/전체 차별화

## 개요
후원 랭킹 페이지를 TOP 50 게이지 리스트로 개선하고, 시즌 랭킹과 전체 랭킹 페이지의 시각적 차별화를 구현했습니다. 통계 섹션 추가, 탭 순서 변경(엑셀/크루/전체), 시즌 D-day 표시 등 UX 개선을 완료했습니다.

## 주요 변경사항

### 개발한 것
- `RankingFullList` 컴포넌트: 1-50위 게이지 바 리스트 (Gold/Silver/Bronze 스타일)
- 통계 섹션: 총 후원 하트, 후원자 수, 시즌 D-day 표시
- `RankingItem` 타입 확장: `donationCount`, `messageCount`, `lastDonationDate` 필드

### 수정한 것
- 전체 랭킹 페이지: "4위 이하" → "전체 랭킹 TOP 50" 변경
- 탭 순서: `["all", "excel", "crew", "vip"]` → `["excel", "crew", "all"]`
- 시즌 랭킹 페이지: `RankingPodium` + `RankingFullList` 적용

### 차별화 구현
| 구분 | 전체 랭킹 | 시즌 랭킹 |
|------|----------|----------|
| 테마 | Gold (명예의 전당) | Green (시즌 경쟁) |
| 배지 | "ELITE RANKINGS" | 시즌명 + D-day |
| 통계 | 총 후원 하트 | 시즌 후원 + 남은 일수 |

## 핵심 코드

```typescript
// 시즌 D-day 계산
const daysRemaining = useMemo(() => {
  if (!selectedSeason?.end_date || !selectedSeason.is_active) return null
  const end = new Date(selectedSeason.end_date)
  const diff = Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}, [selectedSeason])
```

## 결과
- ✅ 빌드 성공 (29 pages)
- ✅ 전체 랭킹: Gold 테마 + TOP 50 게이지
- ✅ 시즌 랭킹: Green 테마 + D-day 표시
- ✅ 탭 순서 변경 완료

## 다음 단계
- VIP 랭킹 페이지에도 동일한 스타일 적용
- `useRanking` 훅에서 실제 `donationCount`, `messageCount` 데이터 연동
- 포디움 3D 효과 브라우저 테스트 및 미세 조정
