# 프로젝트 구조 점검 및 정리

## 개요
software-architecture 스킬과 Explore 에이전트를 활용하여 프로젝트 구조를 분석하고, 라우트 경로 혼동, Hook 이름 충돌, Utils 이중화 문제를 해결했습니다. 전체 구조 품질 점수 7.6/10에서 개선 작업을 수행했습니다.

## 주요 변경사항

### 1. CLAUDE.md 문서 업데이트
- `/info/` 경로 참조를 실제 라우트 `/rg/`로 수정
- 프로젝트 구조 섹션에 `/rg/*` 하위 라우트 명시
- 완료된 기능 테이블의 파일 경로 정정

### 2. Hook 이름 충돌 해결 (P0)
- `src/lib/hooks/useOrganization.ts` 삭제 (단순 래퍼 제거)
- `hooks/index.ts`에서 `useOrganizationData`를 `useOrganization` alias로 export
- Context의 `useOrganization`(Repository 접근)과 명확히 구분

### 3. Utils 파일 이중화 제거 (P1)
- `lib/utils.ts`에서 `cn()` 직접 정의 제거
- `lib/utils/cn.ts`를 단일 소스로 통합 re-export
- 12개 파일의 `@/lib/utils` import 호환성 유지

### 4. 리다이렉트 설정 추가 (P2)
```typescript
// next.config.ts
{
  source: '/info/org', destination: '/rg/org',
  source: '/info/sig', destination: '/rg/sig',
  source: '/info/timeline', destination: '/rg/history',
  source: '/info/live', destination: '/rg/live',
  source: '/ranking/total', destination: '/ranking',
}
```

### 5. Tribute 컴포넌트 확인
- 미사용으로 보고되었으나 실제로 `ranking/[userId]/page.tsx`에서 사용 중
- 삭제하지 않고 유지

## 분석 결과 요약

| 항목 | 점수 | 상태 |
|------|------|------|
| Repository 패턴 | 9/10 | 우수 |
| TypeScript 타입 | 9/10 | 우수 |
| Context API | 8/10 | 양호 |
| 컴포넌트 분류 | 8/10 | 양호 |
| 라우트 구조 | 6→8/10 | 개선됨 |
| Hook 설계 | 6→8/10 | 개선됨 |
| Utils 구조 | 7→9/10 | 개선됨 |

## 결과
- ✅ 빌드 성공 (Next.js 16.1.1 Turbopack)
- ✅ 30개 라우트 정상 생성
- ✅ TypeScript 에러 없음

## 다음 단계
- **컴포넌트 폴더 네이밍**: `components/info/` → `components/rg/` 변경 고려
- **대형 페이지 분할**: `ranking/[userId]/page.tsx` (618줄) 컴포넌트화
- **테스트 co-location**: `__tests__/` → 각 모듈 폴더로 이동 고려
- **Navbar 라우트 링크 확인**: `/rg/*` 경로와 일치하는지 검증
