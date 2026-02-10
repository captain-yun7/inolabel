# RG Family 프로젝트 아키텍처 분석 보고서

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | RG Family - 팬더티비 스트리머 팬 커뮤니티 |
| **목적** | 한국 엑셀방송 + 중국 단보방송 멤버 소개, 후원 랭킹, 팬 소통 |
| **기술 스택** | Next.js 16.1, React 19, TypeScript 5, Supabase |
| **총 코드량** | 13,351 lines (src 폴더) |
| **페이지 수** | 29개 (Static 22개, Dynamic 7개) |

---

## 2. 폴더 스캐폴딩 구조

```
rg-family/
├── public/                          # 정적 자산
│   ├── assets/
│   │   ├── logo/                   # 로고 이미지
│   │   ├── members/                # 멤버 프로필 이미지
│   │   ├── notices/                # 공지사항 이미지
│   │   ├── signatures/             # 시그니처 미디어
│   │   └── thumbnails/             # VOD 썸네일
│   └── samples/                    # CSV 샘플 파일
│
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 # 인증 라우트 그룹
│   │   │   ├── login/             # 로그인 페이지
│   │   │   └── signup/            # 회원가입 페이지
│   │   ├── admin/                  # 관리자 대시보드 (11개 페이지)
│   │   │   ├── banners/           # 배너 관리
│   │   │   ├── donations/         # 후원 관리
│   │   │   ├── members/           # 회원 관리
│   │   │   ├── notices/           # 공지 관리
│   │   │   ├── organization/      # 조직도 관리
│   │   │   ├── posts/             # 게시글 관리
│   │   │   ├── schedules/         # 일정 관리
│   │   │   ├── seasons/           # 시즌 관리
│   │   │   ├── signatures/        # 시그니처 관리
│   │   │   └── vip-rewards/       # VIP 보상 관리
│   │   ├── community/              # 커뮤니티
│   │   │   ├── free/              # 자유게시판
│   │   │   ├── vip/               # VIP 게시판
│   │   │   └── [category]/[id]/   # 게시글 상세
│   │   ├── info/                   # 정보 페이지
│   │   │   ├── org/               # 조직도
│   │   │   ├── sig/               # 시그리스트
│   │   │   └── timeline/          # 타임라인
│   │   ├── notice/                 # 공지사항
│   │   │   └── [id]/              # 공지 상세
│   │   ├── ranking/                # 랭킹
│   │   │   ├── total/             # 전체 랭킹
│   │   │   ├── season/[id]/       # 시즌별 랭킹
│   │   │   ├── vip/               # VIP 라운지
│   │   │   └── vip/[userId]/      # VIP 헌정 페이지
│   │   └── schedule/               # 일정 캘린더
│   │
│   ├── components/                 # 컴포넌트
│   │   ├── admin/                  # Admin 전용 (DataTable, CsvUploader 등)
│   │   ├── community/              # 커뮤니티 (TabFilter)
│   │   ├── info/                   # 정보 (OrgTree, SigCard, Timeline)
│   │   ├── ranking/                # 랭킹 (GaugeBar, RankingCard, RankingList)
│   │   ├── schedule/               # 일정 (Calendar, CalendarGrid, EventList)
│   │   └── *.tsx                   # 공통 컴포넌트
│   │
│   ├── lib/                        # 라이브러리
│   │   ├── context/                # React Context (Theme)
│   │   ├── hooks/                  # Custom Hooks (useAuth, useRanking 등)
│   │   ├── mock/                   # Mock 데이터
│   │   ├── supabase/               # Supabase 클라이언트
│   │   └── utils/                  # 유틸리티 함수
│   │
│   └── types/                      # TypeScript 타입
│       ├── common.ts               # 공통 타입
│       └── database.ts             # Supabase 스키마 타입
│
├── supabase/
│   └── migrations/                 # DB 마이그레이션
│
└── workthrough/                    # 개발 문서
```

---

## 3. 아키텍처 다이어그램

### 3.1 전체 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                            │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Next.js App Router                        │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │   │
│  │  │   Home   │  │  Ranking │  │Community │  │  Admin   │    │   │
│  │  │  page.tsx│  │  /total  │  │  /free   │  │Dashboard │    │   │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │   │
│  │       │             │             │             │           │   │
│  │       └─────────────┴─────────────┴─────────────┘           │   │
│  │                           │                                  │   │
│  │  ┌────────────────────────▼────────────────────────────┐    │   │
│  │  │              COMPONENT LAYER                         │    │   │
│  │  │  Hero │ LiveMembers │ RankingCard │ Calendar │ etc  │    │   │
│  │  └────────────────────────┬────────────────────────────┘    │   │
│  └───────────────────────────┼─────────────────────────────────┘   │
│                              │                                      │
│  ┌───────────────────────────▼─────────────────────────────────┐   │
│  │                      HOOKS LAYER                             │   │
│  │  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌───────────┐  │   │
│  │  │ useAuth  │  │useRanking │  │useSchedule│  │useSupabase│  │   │
│  │  └────┬─────┘  └─────┬─────┘  └─────┬────┘  └─────┬─────┘  │   │
│  │       │              │              │              │         │   │
│  │       └──────────────┴──────────────┴──────────────┘         │   │
│  │                           │                                   │   │
│  │  ┌────────────────────────▼────────────────────────────┐     │   │
│  │  │            DATA SOURCE SWITCH                        │     │   │
│  │  │     USE_MOCK = true  │  USE_MOCK = false            │     │   │
│  │  │          ↓           │          ↓                   │     │   │
│  │  │    Mock Data         │    Supabase Client           │     │   │
│  │  │   (data.ts)          │   (client.ts/server.ts)      │     │   │
│  │  └────────────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ HTTPS/REST
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         SUPABASE BACKEND                            │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ Auth Service │  │  PostgreSQL  │  │   Storage    │              │
│  │   (JWT)      │  │   Database   │  │  (Images)    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                           │                                         │
│  ┌────────────────────────▼────────────────────────────────────┐   │
│  │                    DATABASE TABLES                           │   │
│  │  profiles │ donations │ seasons │ organization │ posts      │   │
│  │  notices  │ comments  │ schedules │ signatures │ vip_rewards│   │
│  │  banners  │ timeline_events │ live_status │ media           │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 데이터 흐름 다이어그램

```
┌───────────────────────────────────────────────────────────────────┐
│                        DATA FLOW                                   │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│   [User Action]                                                    │
│        │                                                           │
│        ▼                                                           │
│   ┌─────────────────┐                                             │
│   │  React Component │                                             │
│   │  (Client Side)   │                                             │
│   └────────┬────────┘                                             │
│            │ calls                                                 │
│            ▼                                                       │
│   ┌─────────────────┐     ┌─────────────────┐                     │
│   │  Custom Hook    │────▶│  State Update   │                     │
│   │  (useRanking)   │     │  (useState)     │                     │
│   └────────┬────────┘     └─────────────────┘                     │
│            │ fetches                   ▲                           │
│            ▼                           │ triggers re-render        │
│   ┌─────────────────┐                  │                           │
│   │  USE_MOCK?      │                  │                           │
│   └────────┬────────┘                  │                           │
│            │                           │                           │
│     ┌──────┴──────┐                    │                           │
│     ▼             ▼                    │                           │
│ ┌───────┐   ┌───────────┐             │                           │
│ │ Mock  │   │ Supabase  │             │                           │
│ │ Data  │   │ Query     │             │                           │
│ └───┬───┘   └─────┬─────┘             │                           │
│     │             │                    │                           │
│     └──────┬──────┘                    │                           │
│            │                           │                           │
│            ▼                           │                           │
│   ┌─────────────────┐                  │                           │
│   │  Data Transform │──────────────────┘                           │
│   │  (TypeScript)   │                                              │
│   └─────────────────┘                                              │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
```

### 3.3 인증 플로우

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐                                              │
│   │  User Login  │                                              │
│   │  (email/pw)  │                                              │
│   └──────┬───────┘                                              │
│          │                                                       │
│          ▼                                                       │
│   ┌──────────────┐      ┌──────────────┐                        │
│   │  useAuth()   │─────▶│  Supabase    │                        │
│   │  signIn()    │      │  Auth        │                        │
│   └──────────────┘      └──────┬───────┘                        │
│                                │                                 │
│                                ▼                                 │
│                         ┌──────────────┐                        │
│                         │  JWT Token   │                        │
│                         │  + Session   │                        │
│                         └──────┬───────┘                        │
│                                │                                 │
│          ┌─────────────────────┼─────────────────────┐          │
│          ▼                     ▼                     ▼          │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐ │
│   │  Client      │      │  Middleware  │      │  Profile     │ │
│   │  Storage     │      │  Refresh     │      │  Fetch       │ │
│   │  (Cookie)    │      │  (SSR)       │      │  (role)      │ │
│   └──────────────┘      └──────────────┘      └──────────────┘ │
│                                                      │          │
│                                                      ▼          │
│                                               ┌──────────────┐  │
│                                               │  Role Check  │  │
│                                               │  isAdmin()   │  │
│                                               │  isVip()     │  │
│                                               └──────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 주요 코드 패턴 분석

### 4.1 Hooks 패턴

| Hook | 역할 | 위치 |
|------|------|------|
| `useSupabase` | Supabase 클라이언트 싱글톤 제공 | `lib/hooks/useSupabase.ts` |
| `useAuth` | 인증 상태 + 역할 관리 | `lib/hooks/useAuth.ts` |
| `useRanking` | 후원 랭킹 데이터 + 필터링 | `lib/hooks/useRanking.ts` |
| `useSchedule` | 캘린더 + 일정 데이터 | `lib/hooks/useSchedule.ts` |
| `useMockData` | Mock 데이터 유틸리티 | `lib/hooks/useMockData.ts` |

### 4.2 컴포넌트 구조

```
Components/
├── 공통 (7개)
│   ├── Hero.tsx              # 메인 히어로 섹션
│   ├── Navbar.tsx            # 네비게이션 바
│   ├── LiveMembers.tsx       # 라이브 멤버 표시
│   ├── Notice.tsx            # 공지사항 프리뷰
│   ├── Shorts.tsx            # 숏폼 콘텐츠
│   ├── VOD.tsx               # VOD 갤러리
│   └── ThemeToggle.tsx       # 다크모드 토글
│
├── Ranking (5개)
│   ├── GaugeBar.tsx          # 게이지 바 시각화
│   ├── RankingCard.tsx       # Top 3 카드
│   ├── RankingList.tsx       # 4위 이하 리스트
│   ├── RankingBar.tsx        # 단순 바
│   └── SeasonSelector.tsx    # 시즌 선택기
│
├── Admin (4개)
│   ├── DataTable.tsx         # 공통 테이블
│   ├── CsvUploader.tsx       # CSV 업로드
│   ├── Sidebar.tsx           # Admin 사이드바
│   └── StatsCard.tsx         # 통계 카드
│
├── Info (5개)
│   ├── OrgTree.tsx           # 조직도 트리
│   ├── SigGallery.tsx        # 시그 갤러리
│   ├── SigCard.tsx           # 시그 카드
│   ├── SigVideoModal.tsx     # 시그 모달
│   └── Timeline.tsx          # 타임라인
│
└── Schedule (3개)
    ├── Calendar.tsx          # 캘린더 컨테이너
    ├── CalendarGrid.tsx      # 캘린더 그리드
    └── EventList.tsx         # 이벤트 목록
```

---

## 5. 발견된 문제점 및 개선 사항

### 5.1 Critical Issues (즉시 수정 필요)

#### Issue #1: Mock 데이터 하드코딩 (13개 파일)

**문제:**
```typescript
// 모든 파일에서 || true로 하드코딩됨
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || true
```

**영향:**
- 프로덕션에서 실제 데이터 사용 불가
- 환경변수 설정이 무시됨

**해결책:**
```typescript
// lib/config.ts 생성
export const USE_MOCK = process.env.NODE_ENV === 'development'
  ? (process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false')
  : (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true')
```

---

#### Issue #2: 타입 안전성 위반 (17개 위치)

**문제:**
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
donorName: (d.profiles as any)?.nickname || '익명',
```

**영향:**
- 런타임 에러 가능성
- IDE 자동완성 불가

**해결책:**
```typescript
// types/supabase-helpers.ts 생성
type DonationWithProfile = Tables<'donations'> & {
  profiles: Pick<Tables<'profiles'>, 'nickname' | 'avatar_url'> | null
}
```

---

### 5.2 High Priority Issues

#### Issue #3: 중복 유틸리티 함수 (11개 파일)

**중복 발견:**
| 함수 | 중복 횟수 | 파일 |
|------|----------|------|
| `formatDate()` | 9회 | 9개 파일에 동일 로직 |
| `formatAmount()` | 5회 | 5개 파일에 동일 로직 |
| `USE_MOCK` 선언 | 13회 | 13개 파일에 동일 패턴 |

**해결책:**
```typescript
// lib/utils/format.ts 생성
export const formatDate = (dateStr: string, options?: Intl.DateTimeFormatOptions) => {
  return new Date(dateStr).toLocaleDateString('ko-KR', options || {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatAmount = (amount: number, unit: '원' | '하트' = '하트') => {
  if (amount >= 100000000) return `${(amount / 100000000).toFixed(1)}억 ${unit}`
  if (amount >= 10000) return `${(amount / 10000).toFixed(1)}만 ${unit}`
  return `${amount.toLocaleString()} ${unit}`
}
```

---

#### Issue #4: Server Component 미활용

**현재 상태:**
- 모든 페이지가 `'use client'` 사용
- 불필요한 JavaScript 번들 증가

**권장 변경:**
```
Before: page.tsx ('use client') → useEffect → fetch
After:  page.tsx (server) → async component → client component
```

---

### 5.3 Medium Priority Issues

| 이슈 | 설명 | 우선순위 |
|------|------|---------|
| 미들웨어 미등록 | `src/lib/supabase/middleware.ts` 존재하나 root에 미연결 | 중간 |
| 에러 바운더리 미구현 | Admin 페이지에 에러 처리 없음 | 중간 |
| 로딩 상태 비일관성 | 일부 페이지만 스켈레톤 사용 | 낮음 |
| TODO 미완료 | `/ranking/vip/page.tsx:90` | 낮음 |

---

## 6. 품질 점수

| 카테고리 | 점수 | 설명 |
|----------|------|------|
| **아키텍처** | 8/10 | 깔끔한 레이어 분리, App Router 활용 |
| **타입 안전성** | 6/10 | `as any` 17개, 개선 필요 |
| **코드 재사용** | 5/10 | 중복 함수 23개 발견 |
| **테스트 커버리지** | 0/10 | 테스트 없음 |
| **문서화** | 7/10 | workthrough 문서 존재 |
| **보안** | 7/10 | Auth 구현됨, Admin 보호 필요 |
| **성능** | 6/10 | Server Component 미활용 |
| **프로덕션 준비도** | 5/10 | Mock 하드코딩 문제 |

**종합 점수: 6.0/10**

---

## 7. 엔터프라이즈 프로덕트 로드맵

### Phase 1: 코드 품질 개선 (1-2주)

```
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1: CODE QUALITY                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Week 1:                                                         │
│  ├── [ ] Mock 데이터 플래그 중앙화 (lib/config.ts)              │
│  ├── [ ] 유틸리티 함수 통합 (lib/utils/format.ts)              │
│  ├── [ ] 타입 안전성 개선 (supabase-helpers.ts)                │
│  └── [ ] 미들웨어 등록 (root middleware.ts)                    │
│                                                                  │
│  Week 2:                                                         │
│  ├── [ ] Server Component 마이그레이션 (ranking, notice)        │
│  ├── [ ] 에러 바운더리 추가 (admin 페이지)                      │
│  ├── [ ] 로딩 상태 일관성 (Suspense + Skeleton)                │
│  └── [ ] ESLint 규칙 강화                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Phase 2: 기능 완성 (2-3주)

```
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 2: FEATURE COMPLETION                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Week 3-4:                                                       │
│  ├── [ ] 실시간 방송 상태 연동 (팬더티비 API)                   │
│  ├── [ ] 후원 랭킹 실시간 업데이트 (Supabase Realtime)          │
│  ├── [ ] 푸시 알림 시스템                                       │
│  ├── [ ] 이미지 최적화 (Next/Image + CDN)                       │
│  └── [ ] SEO 최적화 (메타데이터, sitemap)                       │
│                                                                  │
│  Week 5:                                                         │
│  ├── [ ] 다국어 지원 (한국어/중국어)                            │
│  ├── [ ] 접근성 개선 (ARIA, 키보드 네비게이션)                  │
│  ├── [ ] 성능 모니터링 (Vercel Analytics)                       │
│  └── [ ] 에러 추적 (Sentry)                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Phase 3: 테스트 및 배포 (1-2주)

```
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 3: TESTING & DEPLOYMENT                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Week 6:                                                         │
│  ├── [ ] 단위 테스트 (Vitest + React Testing Library)           │
│  ├── [ ] E2E 테스트 (Playwright)                                │
│  ├── [ ] 성능 테스트 (Lighthouse CI)                            │
│  └── [ ] 보안 감사 (OWASP Top 10)                               │
│                                                                  │
│  Week 7:                                                         │
│  ├── [ ] Staging 환경 배포                                       │
│  ├── [ ] 부하 테스트                                            │
│  ├── [ ] 프로덕션 배포                                          │
│  └── [ ] 모니터링 대시보드 구축                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. 추가 기능 제안

### 8.1 우선순위 높음

| 기능 | 설명 | 예상 복잡도 |
|------|------|------------|
| **실시간 채팅** | 방송 중 팬 소통 | 높음 |
| **후원 알림** | WebSocket 실시간 알림 | 중간 |
| **랭킹 대시보드** | 통계 시각화 차트 | 중간 |
| **모바일 앱** | React Native / PWA | 높음 |

### 8.2 우선순위 중간

| 기능 | 설명 | 예상 복잡도 |
|------|------|------------|
| **팬아트 갤러리** | 이미지 업로드 + 투표 | 중간 |
| **굿즈샵 연동** | 외부 쇼핑몰 링크 | 낮음 |
| **방송 일정 알림** | 카카오/이메일 알림 | 중간 |
| **멤버 인증** | 공식 멤버 배지 시스템 | 낮음 |

---

## 9. 결론

RG Family 프로젝트는 **견고한 기반**을 갖추고 있으나, **프로덕션 배포 전 개선이 필요**합니다.

### 즉시 조치 필요
1. Mock 데이터 하드코딩 제거
2. 타입 안전성 강화
3. 중복 코드 리팩토링

### 장기 목표
1. 테스트 커버리지 80% 이상
2. Server Component 마이그레이션
3. 실시간 기능 구현

### 예상 완료 기간
- 코드 품질 개선: 2주
- 기능 완성: 3주
- 테스트 및 배포: 2주
- **총 7주** (엔터프라이즈 수준)

---

*보고서 생성일: 2025-12-29*
*분석 도구: Claude Code + Task Agent*
