# 코드 클린업 - ESLint 오류 수정

## 개요
전체 프로젝트에서 사용하지 않는 import, 변수, 코드를 제거하여 코드 품질을 개선했습니다.

## 주요 변경사항

### 제거한 것
- `admin/donations/page.tsx`: `Trash2` import, unused `err` 변수
- `admin/media/page.tsx`: `Play` import
- `admin/members/page.tsx`: `Plus` import
- `admin/seasons/page.tsx`: `Check` import
- `admin/posts/page.tsx`: `Trash2` import
- `admin/vip-rewards/page.tsx`: `User` import
- `components/info/Timeline.tsx`: `ChevronDown` import
- `components/ranking/SeasonSelector.tsx`: `ChevronDown` import, unused `currentSeason` prop, `getSelectedLabel` 함수
- `components/schedule/EventList.tsx`: `MapPin` import
- `repositories/index.ts`: 중복 `MockDataProvider` import

### 개선한 것
- `useMockData.ts`: `month`, `year` 파라미터를 `_month`, `_year`로 변경 (의도적 미사용 표시)
- `ranking/total/page.tsx`: `SeasonSelector` 호출에서 제거된 `currentSeason` prop 제거

## 결과
- ✅ 빌드 성공 (29개 페이지)
- ✅ 사용하지 않는 import 제거 (12개 파일)
- ✅ ESLint 경고 43개 → 주로 data fetching 패턴 (합리적)

## 남은 ESLint 메시지 (정상)
`set-state-in-effect` 오류는 다음에서 발생:
- Admin 페이지들: 데이터 페칭 패턴 (useEffect + setState)
- `useMockData.ts`: Mock 데이터 로딩 패턴
- `ThemeContext.tsx`: SSR hydration을 위한 `setMounted(true)` 패턴

이는 React에서 일반적으로 사용되는 패턴이며, 빌드에 영향을 주지 않습니다.

## 다음 단계
- 데이터 페칭 패턴을 React Query/SWR로 마이그레이션 (선택적)
- Admin 페이지들의 데이터 로딩 로직 Context/Provider로 분리 (선택적)
