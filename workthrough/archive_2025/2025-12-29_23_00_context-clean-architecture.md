# Clean Architecture - Context Provider 구조 개선

## 개요
전체 프로젝트에 Clean Architecture 기반 Context 구조를 적용했습니다. Supabase, Auth, DataProvider를 Context로 분리하여 전역 상태를 효율적으로 관리하고, 기존 훅과의 하위 호환성을 유지합니다.

## 주요 변경사항

### 개발한 것
- `SupabaseContext` - Singleton Supabase 클라이언트
- `AuthContext` - 전역 인증 상태 (기존 useAuth 훅 대체)
- `DataProviderContext` - 전역 데이터 접근 계층
- `context/index.ts` - 중앙 export

### 개선한 것
- useAuth → Context 기반 (상태 공유)
- useSupabase → Context 기반 (singleton)
- useDataProvider → Context 기반

### 수정한 것
- Providers.tsx - 4개 Provider 합성
- 기존 훅 → deprecated wrapper로 변환

## 새 구조

```
src/lib/context/
├── index.ts              # 중앙 export
├── ThemeContext.tsx      # 테마 (기존)
├── SupabaseContext.tsx   # Supabase 클라이언트
├── AuthContext.tsx       # 인증 상태
└── DataProviderContext.tsx  # 데이터 접근
```

## Provider 의존성

```
SupabaseProvider
  └── AuthProvider (supabase 필요)
      └── DataProviderProvider (supabase 필요)
          └── ThemeProvider (독립)
```

## 사용법

```typescript
// 권장 (Context 직접 사용)
import { useAuthContext, useDataProviderContext } from '@/lib/context'

const { user, isAuthenticated, signIn } = useAuthContext()
const { provider } = useDataProviderContext()

// 하위 호환 (deprecated)
import { useAuth, useDataProvider } from '@/lib/hooks'
```

## 결과
- ✅ 빌드 성공 (29개 페이지)
- ✅ 기존 훅 하위 호환
- ✅ 전역 상태 공유 (Auth)

## 다음 단계
- 기존 컴포넌트에서 useAuth → useAuthContext 마이그레이션
- React Query/SWR 통합으로 캐싱 레이어 추가
- Error Boundary 통합
