# Deprecated 훅 마이그레이션 및 정리 완료

## 개요
프로젝트 전체에서 deprecated 훅(`useSupabase`, `useAuth`)을 새로운 Context 훅(`useSupabaseContext`, `useAuthContext`)으로 마이그레이션하고, 미사용 파일을 삭제하여 코드베이스 정리 완료.

## 주요 변경사항
- **마이그레이션**: `@/lib/hooks/useSupabase` → `@/lib/context` (useSupabaseContext)
- **마이그레이션**: `@/lib/hooks/useAuth` → `@/lib/context` (useAuthContext)
- **대상 파일**: Components 7개, App 페이지 10개, Admin 페이지 13개, Auth 페이지 2개, 내부 훅 2개
- **삭제**: `useSupabase.ts`, `useAuth.ts` (deprecated 파일 제거)
- **정리**: `index.ts` 에서 deprecated export 제거

## 핵심 코드
```typescript
// Before
import { useSupabase } from '@/lib/hooks/useSupabase'
import { useAuth } from '@/lib/hooks/useAuth'

// After
import { useSupabaseContext, useAuthContext } from '@/lib/context'
```

## 결과
- ✅ 빌드 성공 (29개 라우트)
- ✅ TypeScript 검사 통과
- ✅ Deprecated 훅 사용 0건
- ✅ 미사용 파일 삭제 완료

## 추가 정리 (Phase 2)
- **삭제**: `useDataProvider.ts` (미사용 deprecated 파일)
- **정리**: `index.ts`에서 Repository 패턴 export 제거

## 최종 hooks 디렉토리 구조
```
src/lib/hooks/
├── index.ts        # Context re-export
├── useMockData.ts  # Mock 데이터 훅
├── useRanking.ts   # 랭킹 도메인 훅
└── useSchedule.ts  # 일정 도메인 훅
```

## 다음 단계
- `useMockData` 훅 최적화 검토
- 도메인 훅 테스트 추가
