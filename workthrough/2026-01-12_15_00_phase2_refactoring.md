# Phase 2 프로젝트 구조 리팩토링

## 개요
RG 관련 라우트를 `/rg/` 하위로 통합하고, 유틸 함수와 타입 정의를 정리했습니다. Clean Architecture 원칙에 따라 모듈별 응집도를 높이고 결합도를 낮췄습니다.

## 주요 변경사항

### 1. RG 라우트 통합

| 이전 경로 | 새 경로 | 리다이렉트 |
|----------|--------|-----------|
| `/organization` | `/rg/org` | 301 Permanent |
| `/signature` | `/rg/sig` | 301 Permanent |
| `/timeline` | `/rg/history` | 301 Permanent |
| `/rg/live` | `/rg/live` | (유지) |

**설정 파일**: `next.config.ts`에 `redirects()` 추가

### 2. 유틸 함수 통합 (Single Responsibility)

```
src/lib/utils.ts           → shadcn/ui 호환 + re-export
src/lib/utils/
├── cn.ts                  → Tailwind 클래스 병합
├── format.ts              → 날짜/금액 포맷팅
├── ranking.ts             → 랭킹 아이콘/티어
├── youtube.ts             → YouTube URL 파싱
└── index.ts               → 통합 export
```

### 3. 타입 정의 분리 (Interface Segregation)

```
src/types/
├── organization.ts        → (신규) 조직도 관련 타입
│   ├── UnitType
│   ├── UnitFilter
│   ├── OrgMember
│   ├── LiveMember
│   └── GroupableMember
├── common.ts              → 공용 타입
├── database.ts            → DB 스키마 타입
└── index.ts               → (신규) 통합 export
```

### 4. 훅 개선 (Facade Pattern)

```typescript
// useOrganization: useOrganizationData의 Facade
export function useOrganization(options = {}) {
  return useOrganizationData(options)
}
```

## 아키텍처 원칙 적용

| 원칙 | 적용 |
|------|------|
| **SRP** | 유틸 함수 도메인별 분리 |
| **OCP** | 타입 확장 가능 구조 |
| **ISP** | GroupableMember 최소 인터페이스 |
| **DIP** | Repository 패턴 유지 |

## 결과
- ✅ 빌드 성공
- ✅ 라우트 일관성 개선 (`/rg/*`)
- ✅ 타입 충돌 해결
- ✅ 하위 호환성 유지 (re-export)

## 다음 단계 (Phase 3)
- [ ] 대형 페이지 분할 (`ranking/[userId]`, `admin/donations`)
- [ ] VIP 데이터 파일 통합
- [ ] 테스트 파일 co-location
