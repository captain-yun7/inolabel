# 조직도 공동 대표 구조 및 시즌별 랭킹 페이지 분리

## 개요
RG Family 조직도를 린아(R대표) + 가애(G대표) 공동 대표 체제로 수정하고, 시즌별 랭킹 페이지가 분리된 URL로 동작하도록 네비게이션 로직을 개선했습니다.

## 주요 변경사항

### 1. 조직도 구조 변경 (`/src/lib/mock/organization.ts`)
- **린아(R대표)**: id: 1, Excel Unit, 공동 대표
- **가애(G대표)**: id: 2, Excel Unit → `crew`에서 `excel`로 변경
- 두 대표가 **Excel Unit에서 공동 대표**로 표시
- Crew Unit: 하린(팀장)이 최상위 리더로 승격 (`parent_id: null`)

### 2. 조직도 페이지 로직 개선 (`/src/app/organization/page.tsx`)
```tsx
// 최상위 리더: 대표 → 부장 → 팀장 순으로 폴백
const topLeaders =
  grouped.leaders.length > 0
    ? grouped.leaders
    : grouped.directors.length > 0
    ? grouped.directors
    : grouped.managers;
```
Crew Unit처럼 대표/부장이 없는 경우 팀장이 최상위로 표시

### 3. 시즌별 랭킹 페이지 분리 (`SeasonSelector.tsx`)
```tsx
interface SeasonSelectorProps {
  navigateToSeasonPage?: boolean // 추가: true이면 시즌 선택 시 페이지 이동
}

const handleSeasonClick = (seasonId: number | null) => {
  if (navigateToSeasonPage && seasonId !== null) {
    router.push(`/ranking/season/${seasonId}`) // 시즌 상세 페이지로 이동
  } else {
    onSelect(seasonId)
  }
}
```
- 메인 랭킹 페이지: `navigateToSeasonPage={true}` → 시즌 선택 시 `/ranking/season/[id]`로 이동
- 시즌 상세 페이지: 기존 탭 네비게이션 유지

## 결과
- ✅ 빌드 성공
- ✅ 린아(R대표) + 가애(G대표) 공동 대표 구조 완료
- ✅ Excel Unit: 공동 대표 → 나노(팀장) → 멤버들
- ✅ Crew Unit: 하린(팀장) → 멤버들
- ✅ 시즌 선택 시 `/ranking/season/[id]`로 페이지 이동

## 다음 단계
- Top 1-3 헌정 페이지 (`/ranking/[userId]`) 구현
- 실시간 PandaTV API 연동
