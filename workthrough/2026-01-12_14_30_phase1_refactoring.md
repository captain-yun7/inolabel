# Phase 1 프로젝트 구조 리팩토링

## 개요
코드 중복을 제거하고 컴포넌트를 도메인별로 그룹화하여 프로젝트 구조를 개선했습니다. `useOrganizationData` 훅을 생성하여 organization 관련 데이터 로딩 로직을 통합하고, 컴포넌트들을 적절한 폴더로 재배치했습니다.

## 주요 변경사항

### 1. useOrganizationData 훅 생성
- **파일**: `src/lib/hooks/useOrganizationData.ts`
- Repository 패턴을 활용한 데이터 로딩
- 로딩/에러 상태 관리
- 실시간 업데이트 구독 옵션
- 제네릭 타입 지원 `getGroupedByRole` 함수

### 2. 컴포넌트 이동
| 파일 | 이전 | 이후 |
|------|------|------|
| RankingBoard.tsx | `components/` | `components/ranking/` |
| SectionHeader.tsx | `components/` | `components/ui/` |
| SectionSkeleton.tsx | `components/` | `components/ui/` |
| ThemeToggle.tsx | `components/` | `components/ui/` |

### 3. 홈 컴포넌트 그룹화
`components/home/` 폴더 생성 후 이동:
- Hero.tsx
- LiveMembers.tsx
- Notice.tsx
- Shorts.tsx
- VOD.tsx

### 4. Import 경로 업데이트
- `organization/page.tsx`: useOrganizationData 훅 사용으로 ~40줄 코드 감소
- `rg/live/page.tsx`: useOrganizationData 훅 사용으로 ~35줄 코드 감소
- `page.tsx`: 홈 컴포넌트 배럴 import 사용

## 핵심 코드

```typescript
// useOrganizationData 훅 사용 예시
const { members, isLoading, getByUnit, getGroupedByRole } = useOrganizationData();
const unitMembers = getByUnit(activeUnit) as OrgMember[];
const grouped = getGroupedByRole(unitMembers);
```

## 결과
- ✅ 빌드 성공
- ✅ 코드 중복 ~75줄 제거
- ✅ 컴포넌트 루트 파일 6개 감소
- ✅ 도메인별 폴더 구조 개선

## 다음 단계 (Phase 2)
- [ ] RG 라우트 통합 (`/organization` → `/rg/org`)
- [ ] 유틸 함수 통합 (`lib/utils/` 정리)
- [ ] VIP 데이터 파일 통합
- [ ] 타입 정의 분리 (`types/organization.ts`)
