# Clean Architecture - Repository Pattern 적용

## 개요
RG Family 프로젝트에 SOLID 원칙 기반의 Clean Architecture를 적용했습니다. Repository Pattern과 DataProvider 추상화를 통해 Mock/Supabase 데이터 소스 간 전환이 쉬워지고, 컴포넌트와 데이터 접근 로직이 분리되었습니다.

## 주요 변경사항

### 개발한 것
- **Repository 인터페이스** (`src/lib/repositories/types.ts`)
  - IRankingRepository, ISeasonRepository, IProfileRepository 등 7개 인터페이스
  - IDataProvider 통합 인터페이스

- **Mock 구현체** (`src/lib/repositories/mock/index.ts`)
  - 모든 Repository 인터페이스의 Mock 구현
  - Singleton 패턴으로 인스턴스 관리

- **Supabase 구현체** (`src/lib/repositories/supabase/index.ts`)
  - 실제 DB 쿼리를 수행하는 Repository 구현

- **Factory & Hook** (`src/lib/repositories/index.ts`, `src/lib/hooks/useDataProvider.ts`)
  - USE_MOCK_DATA 설정에 따른 자동 Provider 전환
  - useDataProvider, useRankingRepository 등 편의 훅

### 수정한 것
- Post 타입의 `category` → `board_type` 필드명 수정
- Supabase profiles join 타입 캐스팅 오류 수정

## 핵심 코드

```typescript
// Factory Pattern - 환경에 따른 Provider 자동 선택
export function createDataProvider(supabase?: SupabaseClient): IDataProvider {
  return USE_MOCK_DATA ? mockDataProvider : new SupabaseDataProvider(supabase)
}

// Hook - 컴포넌트에서 사용
export function useDataProvider() {
  const supabase = useSupabase()
  const provider = useMemo(() => createDataProvider(supabase), [supabase])
  return { provider, isReady: true }
}
```

## 아키텍처 구조

```
src/lib/repositories/
├── types.ts          # 인터페이스 정의 (D: Dependency Inversion)
├── index.ts          # Factory (O: Open/Closed)
├── mock/index.ts     # Mock 구현체
└── supabase/index.ts # Supabase 구현체
```

## 결과
- ✅ 빌드 성공 (29개 페이지)
- ✅ TypeScript 타입 검증 통과
- ✅ SOLID 원칙 적용 완료

## 다음 단계
- 기존 컴포넌트들을 새 useDataProvider 훅으로 마이그레이션
- useMockData 훅을 점진적으로 deprecated 처리
- 캐싱 레이어 추가 (React Query 또는 SWR 통합)
- 에러 핸들링 표준화 (Result 패턴)
