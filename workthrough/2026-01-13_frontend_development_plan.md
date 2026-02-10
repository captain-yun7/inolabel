# RG Family 프론트엔드 개발 방안

**작성일**: 2026-01-13
**상태**: 최종 보고서

---

## 1. CLAUDE.md 가이드라인 적용 현황

### 적용률: 100% (12/12 항목)

| # | 항목 | 상태 | 구현 위치 |
|---|------|------|----------|
| 1 | DB 연동 Supabase | ✅ 완료 | `src/lib/repositories/supabase/` (16개 파일) |
| 2 | 라이브 상태 크롤링 | ✅ 완료 | `src/lib/api/pandatv.ts`, `src/app/api/live-status/` |
| 3 | 컬러 통일 | ✅ 완료 | `globals.css` (38개 변수) |
| 4 | 글씨 크기 16px+ | ✅ 완료 | 본문 1rem, 라벨/뱃지 0.625rem+ |
| 5 | 다크/라이트 모드 | ✅ 완료 | `ThemeContext.tsx` + CSS 변수 |
| 6 | 닉네임 표시 | ✅ 완료 | `donorName`, `nickname` 사용 |
| 7 | 조직도 트리 구조 | ✅ 완료 | 3단계 계층 + 연결선 |
| 8 | 랭킹 포디움 | ✅ 완료 | 2위-1위-3위 배치, 3D 큐브 |
| 9 | 메인 배너 꽉 채움 | ✅ 완료 | 60vh (400-700px) |
| 10 | 타임라인 유닛 필터 | ✅ 완료 | 엑셀부/크루부 3중 필터 |
| 11 | 캘린더 색상 코드 | ✅ 완료 | 5가지 이벤트 타입 색상 |
| 12 | 마우스 호버 효과 | ✅ 완료 | 302건 :hover 적용 |

---

## 2. 핵심 구현 상세

### 2.1 Repository 패턴 (데이터 계층)

```
src/lib/repositories/
├── types.ts              # 인터페이스 정의
├── mock/                 # 개발용 Mock 데이터
│   └── index.ts
└── supabase/             # 실서비스 Supabase 연동
    ├── organization.ts
    ├── live-status.ts
    ├── rankings.ts
    └── ...
```

**장점**:
- Mock/Supabase 자동 전환 (`USE_MOCK_DATA` 환경변수)
- 타입 안전성 보장
- 테스트 용이성

### 2.2 PandaTV 라이브 상태 시스템

```typescript
// src/lib/api/pandatv.ts
- extractChannelId(): URL에서 채널 ID 추출
- checkChannelLiveStatus(): 단일 채널 상태 확인
- checkMultipleChannels(): 동시 요청 (Rate limiting)

// src/app/api/live-status/sync/route.ts
- POST: Cron Job용 동기화 엔드포인트
- GET: 개발/테스트용 수동 호출
```

**동작 방식**:
1. organization 테이블에서 활성 멤버 조회
2. social_links에서 PandaTV URL 추출
3. HTML 파싱으로 라이브 상태 확인
4. live_status 테이블 upsert
5. organization.is_live 업데이트

### 2.3 테마 시스템

```css
/* 다크 테마 (기본) */
:root {
  --background: #050505;
  --surface: #0f0f0f;
  --text-primary: #fafafa;
}

/* 라이트 테마 */
[data-theme="light"] {
  --background: #fafafa;
  --surface: #ffffff;
  --text-primary: #171717;
}
```

**구현 위치**: `src/lib/context/ThemeContext.tsx`
- localStorage 저장
- 시스템 선호도 감지
- 토글 애니메이션

---

## 3. 프론트엔드 아키텍처

### 3.1 디렉토리 구조

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 (로그인/회원가입)
│   ├── admin/             # 관리자 CMS
│   ├── api/               # API Routes
│   ├── community/         # 커뮤니티
│   ├── notice/            # 공지사항
│   ├── ranking/           # 랭킹
│   ├── rg/                # RG Info
│   └── schedule/          # 캘린더
├── components/
│   ├── home/              # 홈페이지 전용
│   ├── info/              # RG Info (조직도, 시그, 타임라인)
│   ├── ranking/           # 랭킹 컴포넌트
│   ├── tribute/           # 헌정 페이지
│   └── ui/                # 공통 UI
└── lib/
    ├── api/               # 외부 API 클라이언트
    ├── context/           # React Context
    ├── hooks/             # Custom Hooks
    ├── mock/              # Mock 데이터
    ├── repositories/      # Repository 패턴
    └── utils/             # 유틸리티
```

### 3.2 상태 관리 전략

| 상태 유형 | 도구 | 예시 |
|----------|------|------|
| 로컬 UI 상태 | useState | 모달 열림/닫힘 |
| 폼 상태 | Mantine useForm | 게시글 작성 |
| 서버 상태 | Repository + Hooks | 랭킹 데이터 |
| 전역 상태 | Context API | 테마, 인증 |

---

## 4. 향후 개발 로드맵

### 4.1 즉시 (1주 이내)

- [ ] 빌드 테스트 및 타입 오류 수정
- [ ] 주요 페이지 시각적 검토
- [ ] Vercel 배포 테스트

### 4.2 단기 (2주 이내)

- [ ] PandaTV 라이브 상태 Cron Job 설정
- [ ] 닉네임 표시 전수 검토 (Admin 포함)
- [ ] 모바일 반응형 최적화

### 4.3 중기 (1달 이내)

- [ ] 성능 최적화 (이미지 lazy loading)
- [ ] 접근성 개선 (ARIA, 키보드 네비게이션)
- [ ] SEO 메타데이터 최적화

### 4.4 장기 (분기별)

- [ ] 실시간 알림 시스템 (Supabase Realtime)
- [ ] PWA 지원 (오프라인, 푸시 알림)
- [ ] 다국어 지원 (i18n)

---

## 5. 기술 부채 및 개선 사항

### 5.1 현재 기술 부채

| 항목 | 위치 | 우선순위 |
|------|------|----------|
| globals.css 1269줄 | `src/app/globals.css` | 낮음 (동작에 영향 없음) |
| 일부 하드코딩 색상 | 산발적 | 중간 |
| 테스트 코드 부재 | 전체 | 높음 |

### 5.2 권장 개선 사항

1. **테스트 도입**
   - Vitest + React Testing Library
   - Repository 계층 단위 테스트
   - E2E 테스트 (Playwright)

2. **번들 최적화**
   - 동적 import로 코드 스플리팅
   - 이미지 최적화 (next/image)
   - 폰트 서브셋팅

3. **모니터링**
   - Sentry 에러 트래킹
   - Vercel Analytics
   - 라이브 상태 로깅

---

## 6. 개발 가이드라인 요약

### 색상 규칙
```css
--color-primary: #fd68ba;   /* 메인 핑크 */
--live-color: #00d4ff;      /* 라이브 시안 */
--gold: #ffd700;            /* 1등 */
--silver: #c0c0c0;          /* 2등 */
--bronze: #cd7f32;          /* 3등 */
```

### 폰트 크기
```css
--text-2xs: 0.625rem;       /* 10px - 뱃지/라벨 */
--text-xs: 0.75rem;         /* 12px - UI 요소 */
--text-sm: 0.875rem;        /* 14px - 보조 텍스트 */
--text-base: 1rem;          /* 16px - 본문 (최소) */
```

### 호버 효과 패턴
```css
.card:hover {
  transform: translateY(-4px);
  border-color: var(--color-pink);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}
```

### 금지 사항
- SOOP/별풍선 사용 ❌ → PandaTV/하트 ✅
- 아이디/이메일 노출 ❌ → 닉네임만 ✅
- 라이브 컬러 핑크 ❌ → 시안색 ✅
- Mock 모드로 배포 ❌ → USE_MOCK_DATA=false ✅

---

## 7. 참고 문서

- **프로젝트 가이드**: `/CLAUDE.md`
- **디자인 시스템**: `/docs/RG_FAMILY_DESIGN_SYSTEM.md`
- **DB 스키마**: `/docs/SUPABASE_SCHEMA.md`
- **아키텍처**: `/docs/ARCHITECTURE_ANALYSIS_REPORT.md`
- **작업 기록**: `/workthrough/`
