# 코드 품질 개선: 설정 및 유틸리티 중앙화

## 개요
프로젝트 전체에 분산된 USE_MOCK 하드코딩(13개 파일)과 중복 유틸리티 함수(formatDate 9개, formatAmount 5개)를 중앙화하여 코드 품질을 개선했습니다.

## 주요 변경사항

### 신규 파일 생성
- `src/lib/config.ts` - 중앙화된 환경 설정 (USE_MOCK_DATA, APP_CONFIG, PAGINATION)
- `src/lib/utils/format.ts` - 통합 포맷팅 유틸리티 (formatDate, formatAmount, formatRelativeTime 등)
- `src/lib/utils/index.ts` - 유틸리티 내보내기

### 수정된 파일 (13개)
1. `src/lib/hooks/useMockData.ts`
2. `src/components/Notice.tsx`
3. `src/components/VOD.tsx`
4. `src/components/Shorts.tsx`
5. `src/components/LiveMembers.tsx`
6. `src/components/info/Timeline.tsx`
7. `src/components/info/SigGallery.tsx`
8. `src/app/notice/page.tsx`
9. `src/app/notice/[id]/page.tsx`
10. `src/app/community/free/page.tsx`
11. `src/app/community/vip/page.tsx`
12. `src/app/community/[category]/[id]/page.tsx`
13. `src/app/info/org/page.tsx`

## 핵심 코드

```typescript
// src/lib/config.ts
export const USE_MOCK_DATA =
  process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false'
    : process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

export const APP_CONFIG = {
  name: 'RG Family',
  platform: 'pandatv',
  donation: { unit: '하트', unitSymbol: '♥' },
  vip: { threshold: 50, topRankerThreshold: 3 },
} as const
```

```typescript
// src/lib/utils/format.ts
export const formatDate = (dateStr: string | Date, options?: Intl.DateTimeFormatOptions) => {...}
export const formatRelativeTime = (dateStr: string | Date) => {...}  // "3일 전"
export const formatShortDate = (dateStr: string | Date) => {...}     // "2025.12.29"
export const formatAmount = (amount: number, unit: '하트' | '원') => {...}
export const parsePandaTvDate = (dateStr: string) => {...}           // CSV 파싱
```

## 결과
- ✅ 빌드 성공 (29개 페이지)
- ✅ TypeScript 오류 없음
- ✅ 13개 파일 `|| true` 하드코딩 제거
- ✅ 중복 formatDate 함수 통합

## 다음 단계
- [ ] 17개 `as any` 타입 캐스팅 제거 (supabase-helpers.ts 생성)
- [ ] 나머지 중복 유틸리티 함수 통합 (formatAmount 등)
- [ ] ESLint 규칙 강화 (no-explicit-any)
- [ ] 테스트 코드 작성 (유틸리티 함수)
