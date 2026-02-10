# 프로젝트 구조 리팩토링

## 개요
스파게티 코드 및 파일/폴더 정리 문제를 해결하기 위해 Kaizen 방법론을 적용하여 체계적인 프로젝트 구조 리팩토링을 수행했습니다. 530라인의 과대 컴포넌트 분리, 455라인의 Repository 모듈화, 타입 분리 등을 완료했습니다.

## 주요 변경사항

### 1. TributeSections 컴포넌트 분리 (530 → 74 라인)
- **개발**: `src/components/tribute/sections/` 폴더 생성
- **분리**: 8개 독립 섹션 컴포넌트
  - TributeMessageSection, TributeVideoSection, TributeMemberVideosSection
  - TributeGallerySection, TributeSignaturesSection, TributeGuestbookSection
  - TributeHistorySection
- **결과**: 메인 파일은 조합만 담당 (74라인)

### 2. Repository 모듈화 (455 → 67 라인)
- **분리**: `src/lib/repositories/supabase/` 9개 파일
  - rankings.ts, seasons.ts, profiles.ts, donations.ts
  - organization.ts, notices.ts, posts.ts, timeline.ts, schedules.ts
- **결과**: index.ts는 re-export만 담당 (67라인)

### 3. 타입 도메인별 분리
- **생성**: 5개 타입 파일
  - `types/api.ts` - API 응답 타입
  - `types/ranking.ts` - 랭킹 타입
  - `types/calendar.ts` - 캘린더/일정 타입
  - `types/content.ts` - 게시글/공지/시그니처 타입
  - `types/vip.ts` - VIP/헌정 타입
- **개선**: common.ts는 Supabase Join 헬퍼만 유지

### 4. Admin 공통 모달 컴포넌트
- **추가**: `src/components/admin/AdminModal.tsx`
- **용도**: Admin 페이지 모달 재사용 가능

### 5. Mock 유틸리티 정리
- **이동**: `lib/mock/utils.ts` → `lib/utils/mock.ts`
- **호환**: 기존 경로는 re-export로 유지

## 파일 구조 변경

```
src/
├── components/
│   ├── admin/
│   │   └── AdminModal.tsx (NEW)
│   └── tribute/
│       └── sections/ (NEW - 8 files)
├── lib/
│   ├── repositories/supabase/ (9 files → 분리)
│   └── utils/
│       └── mock.ts (NEW)
└── types/
    ├── api.ts (NEW)
    ├── ranking.ts (NEW)
    ├── calendar.ts (NEW)
    ├── content.ts (NEW)
    └── vip.ts (NEW)
```

## 결과
- ✅ 빌드 성공 (31개 페이지)
- ✅ 하위 호환성 유지 (기존 import 경로 동작)
- ✅ 순환 의존성 없음

## Kaizen 메트릭

| 항목 | Before | After | 개선율 |
|------|--------|-------|--------|
| TributeSections.tsx | 530 LOC | 74 LOC | -86% |
| repositories/supabase/index.ts | 455 LOC | 67 LOC | -85% |
| types/common.ts | 227 LOC | 94 LOC | -59% |

## 다음 단계

### 단기
- [ ] Admin 페이지에서 AdminModal 컴포넌트 적용
- [ ] 과대 CSS 모듈 분리 (org/page.module.css: 1,520 LOC)

### 중기
- [ ] 과대 Admin 페이지 훅 분리 (banners: 425 LOC)
- [ ] RankingList/RankingFullList 공통 컴포넌트 추출

### 장기
- [ ] E2E 테스트 추가
- [ ] 컴포넌트 스토리북 구성
