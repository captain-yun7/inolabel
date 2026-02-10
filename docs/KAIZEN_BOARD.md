# Kaizen Board 2026-Q1

지속적 개선 추적 보드

**Updated**: 2026-01-12 (아키텍처 실용성 분석 완료)

---

## Current Cycle (2026-01)

### Identified (Backlog)

| ID | Category | Title | Priority | Status |
|----|----------|-------|----------|--------|
| K-001 | Feature | PandaTV API 실시간 LIVE 연동 | HIGH | Identified |
| K-002 | Testing | E2E 테스트 구축 (Playwright) | MEDIUM | Identified |
| K-004 | Infra | Supabase 실제 데이터 연동 | MEDIUM | ✅ Completed |
| K-005 | Refactor | Timeline.tsx 분할 (474줄) | HIGH | ✅ Completed |
| K-006 | Refactor | Admin CRUD 훅 추출 (useAdminCRUD) - 8개 페이지 적용 | MEDIUM | ✅ Completed |
| K-007 | Refactor | Repository 패턴 전역 적용 | MEDIUM | ✅ Completed |
| K-009 | CodeQuality | banners/page.tsx useAdminCRUD 적용 | HIGH | ✅ Completed |
| K-010 | Testing | 단위 테스트 확장 (현재 2개 → 목표 10개+) | MEDIUM | Identified |
| K-011 | Structure | 프로젝트 루트 정리 (scripts/ 폴더) | LOW | ✅ Completed |
| K-012 | CodeQuality | TODO/FIXME 주석 처리 (3개) | LOW | ✅ Completed |
| K-013 | Infra | RLS 마이그레이션 실행 (20260112_rls_vip_live.sql) | 🔴 CRITICAL | 📋 가이드 작성됨 |
| K-014 | Bug | update_donation_total RPC 함수 누락 | 🟠 HIGH | ✅ init_schema에 존재 |
| K-015 | Infra | Admin 계정 생성 및 권한 설정 | 🔴 CRITICAL | 📋 가이드 작성됨 |
| K-016 | Infra | Guestbook 테이블 마이그레이션 실행 | MEDIUM | 📋 가이드 작성됨 |
| K-017 | Infra | 라이브 상태 업데이트 API (/api/live-status/update) | HIGH | ✅ Completed |
| K-018 | Docs | Supabase 설정 종합 가이드 | HIGH | ✅ Completed |
| K-019 | CodeQuality | useAdminCRUD RLS 에러 메시지 개선 | MEDIUM | ✅ Completed |
| K-020 | CodeQuality | useDonationsData RPC 에러 핸들링 | MEDIUM | ✅ Completed |

### In Progress

| ID | Title | Assigned | Progress |
|----|-------|----------|----------|
| - | - | - | - |

### Completed This Cycle

| ID | Title | Before | After | Improvement |
|----|-------|--------|-------|-------------|
| K-100 | Tailwind CSS 4 마이그레이션 | CSS Modules | Tailwind | 구조 개선 |
| K-101 | Supabase Mock Proxy 구현 | 빌드 실패 | 빌드 성공 | 안정성 |
| K-102 | Mock 데이터 보완 | 13개 | 15개 | 완성도 |
| K-103 | SQL 마이그레이션 작성 | 1개 | 15개 | DB 준비 |
| K-104 | 문서 정리 및 최신화 | 13개 | 4개 | 가독성 |
| K-105 | 대형 페이지 분할 (Phase 3) | 618줄+517줄 | 112줄+196줄 | -70% 코드 |
| K-106 | Tribute 텍스트 시인성 + 라이트모드 | 낮은 가독성 | 개선됨 | UX 향상 |
| K-107 | 유틸리티 함수 통합 | 중복 4개소 | 중앙화 | DRY 원칙 |
| K-108 | community/index.ts 추가 | 누락 | 추가됨 | 일관성 |
| K-005 | Timeline.tsx 분할 | 474줄 | 128줄 | -73% SRP |
| K-006 | useAdminCRUD 훅 + 8페이지 적용 | 2,635줄 | 2,220줄 | -16% DRY |
| K-003-4 | 헌정 페이지 테마 + Supabase 연동 | 75% | 95% | Gold/Silver/Bronze 테마 |
| K-007 | Repository 패턴 전역 적용 | 648줄 | 448줄 | -31% Clean Architecture |
| K-003 | Top 1-3 헌정 페이지 완료 | 95% | 100% | 8개 CSS 라이트모드 완성 |
| K-109 | AdminModal 컴포넌트 통합 | 9개 페이지 | 공통 컴포넌트 | -35줄/페이지 |
| K-009 | banners useAdminCRUD 적용 | 387줄 | 339줄 | -48줄, 패턴 통일 |
| K-110 | RankingList 유틸리티 통합 | 로컬 함수 | formatAmountShort | DRY 원칙 |
| K-004 | Supabase 실제 데이터 연동 | Mock only | 15개 테이블 연동 | 프로덕션 Ready |
| K-019 | useAdminCRUD RLS 에러 개선 | 단순 alert | 상세 에러 메시지 | UX 향상 |
| K-020 | useDonationsData RPC 에러 | 무시됨 | warn 로그 + graceful | 안정성 |

---

## Metrics

### Build Performance
- **Build Time**: ~3초 (Turbopack)
- **Pages**: 31개
- **Bundle**: Optimized

### Code Quality
- **ESLint**: Pass
- **TypeScript**: Strict mode
- **Coverage**: TBD

### Architecture Analysis (2026-01-12)

#### Hooks 분석
- **총 줄 수**: 1,016줄 (5개 훅)
- **최대 파일**: useDonationsData (273줄) - SRP 위반
- **패턴**: Repository 패턴 (useOrganizationData만 적용됨)
- **이슈**: Mock/Supabase 분기 중복, 과도한 refetch

#### 컴포넌트 분석
- **300줄+ 파일**: 4개 (Timeline, TributeSections, CsvUploader, DataTable)
- **중복 코드**: ~400줄 (formatAmount, getInitials 등)
- **누락 인덱스**: community/index.ts (수정됨)

#### Admin 페이지 분석 (K-009 완료 후)
- **총 페이지**: 11개
- **useAdminCRUD 적용**: 9개 페이지 (seasons, members, notices, schedules, organization, media, signatures, vip-rewards, banners)
- **미적용**: 2개 (posts - 읽기전용, donations - 업로드 전용)
- **AdminModal 적용**: 9개 페이지 (posts, donations 제외)
- **결과**: 패턴 일관성 100%

---

## Next Actions

### 🔴 즉시 필요 (운영 전 필수)
1. **K-013**: RLS 마이그레이션 실행 → Supabase SQL Editor에서 실행
2. **K-014**: update_donation_total RPC 함수 추가
3. **K-015**: Admin 계정 생성 (role: 'admin')

### 기능 개발
4. **K-001**: PandaTV API 실시간 LIVE 연동
5. **K-002**: E2E 테스트 구축 (Playwright)
6. **K-016**: Guestbook 테이블 (Tribute 페이지용)

### ✅ 완료됨
- ~~**K-005**: Timeline.tsx 분할~~
- ~~**K-006**: useAdminCRUD 제네릭 훅 생성~~
- ~~**K-007**: Repository 패턴 전역 적용~~
- ~~**K-003**: Top 1-3 헌정 페이지~~ (8개 CSS 라이트모드)

---

## Archive

이전 Kaizen 기록: `/workthrough/archive_2025/`
