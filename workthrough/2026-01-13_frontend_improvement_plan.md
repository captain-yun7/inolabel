# RG Family 프론트엔드 개선 방안

**작성일**: 2026-01-13
**상태**: 진행 중

---

## 1. 완료된 작업

### 1.1 타임라인 엑셀부/크루부 필터 추가
- **파일**: `src/components/info/TimelineFilter.tsx`, `src/lib/hooks/useTimelineData.ts`
- **내용**: 타임라인에서 엑셀부/크루부별 필터링 기능 추가
- **적용 범위**: 타입 정의 → Repository 인터페이스 → Mock 구현 → Hook → UI

### 1.2 메인 배너 높이 조정
- **파일**: `src/components/home/Hero.module.css`
- **변경**: 200px → 60vh (min: 400px, max: 700px)
- **반응형**:
  - 태블릿: 50vh (350-550px)
  - 모바일: 45vh (300-450px)
  - 작은 모바일: 40vh (250-350px)

### 1.3 폰트 크기 최소 기준 적용
- **기준**: 최소 0.625rem (10px)
- **수정된 파일**:
  - `LiveMembers.module.css` (0.5rem → 0.625rem)
  - `RankingBoard.module.css` (0.55rem → 0.625rem)
  - `VOD.module.css` (0.55rem → 0.625rem)
  - `Shorts.module.css` (0.55rem → 0.625rem)
  - `rg/org/page.module.css` (0.55rem → 0.625rem)
  - `TributeSections.module.css` (0.6rem → 0.625rem)
  - `ranking/[userId]/page.module.css` (0.6rem → 0.625rem)
  - `ranking/vip/page.module.css` (0.6rem → 0.625rem)

### 1.4 호버 효과 확인
- **상태**: 주요 인터랙티브 요소에 호버 효과 적용됨
- **적용 요소**: 카드, 버튼, 링크, 뱃지 등

---

## 2. 추가 권장 개선 사항

### 2.1 폰트 크기 추가 규준화 (중기)

아직 0.75rem(12px) 이하인 요소들이 존재합니다. 본문 텍스트는 1rem(16px) 이상을 권장합니다.

**확인 필요 영역**:
- 뱃지/라벨: 0.625rem~0.75rem 유지 가능 (보조 UI)
- 본문 텍스트: 1rem 이상 권장
- 캡션/메타데이터: 0.75rem~0.875rem 허용

**검토 필요 파일** (0.75rem 이하 다수 사용):
- `Navbar.module.css`
- `Footer.module.css`
- `community/free/page.module.css`
- `notice/page.module.css`
- `ranking/page.module.css`
- `ranking/season/[id]/page.module.css`

### 2.2 컬러 시스템 통일 (단기)

**현재 상태**: 대부분 CSS 변수 사용 중
**권장 사항**:
- 하드코딩된 색상 값을 CSS 변수로 교체
- `--color-pink`, `--live-color` 등 통일된 변수 사용

### 2.3 호버 효과 통일 (중기)

**표준 호버 패턴 제안**:
```css
/* 카드 호버 */
.card:hover {
  transform: translateY(-4px);
  border-color: var(--color-pink);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

/* 버튼 호버 */
.button:hover {
  background: var(--color-pink-light);
  transform: translateY(-2px);
}

/* 링크 호버 */
.link:hover {
  color: var(--color-pink);
}
```

### 2.4 애니메이션 성능 최적화 (장기)

**권장 사항**:
- `will-change` 속성 신중하게 사용
- `transform`과 `opacity`만 애니메이션 (리플로우 방지)
- Framer Motion의 `layoutId` 활용하여 레이아웃 애니메이션 최적화

---

## 3. 개발 가이드라인

### 3.1 CSS 작성 규칙

```css
/* 1. CSS 변수 사용 */
color: var(--text-primary);  /* O */
color: #ffffff;              /* X */

/* 2. 최소 폰트 크기 */
font-size: 0.625rem;         /* 최소 (뱃지/라벨) */
font-size: 1rem;             /* 본문 권장 */

/* 3. 호버 효과 필수 */
.interactive:hover {
  /* 반드시 시각적 피드백 제공 */
}

/* 4. 반응형 브레이크포인트 */
@media (max-width: 1024px) { /* 태블릿 */ }
@media (max-width: 768px)  { /* 모바일 */ }
@media (max-width: 480px)  { /* 작은 모바일 */ }
```

### 3.2 컴포넌트 구조

```
src/components/
├── home/           # 홈페이지 전용
├── info/           # RG Info 관련 (조직도, 시그, 타임라인)
├── ranking/        # 랭킹 관련
├── tribute/        # 헌정 페이지
├── community/      # 커뮤니티
├── admin/          # 관리자
└── ui/             # 공통 UI (버튼, 모달 등)
```

### 3.3 상태 관리

- **로컬 상태**: `useState`, `useReducer`
- **서버 상태**: Repository 패턴 + Custom Hooks
- **전역 상태**: Context API (`ThemeContext`, `AuthContext`)

---

## 4. 우선순위별 작업 목록

### 즉시 (1주 이내)
- [ ] 빌드 테스트 및 오류 수정
- [ ] 주요 페이지 시각적 검토

### 단기 (2주 이내)
- [ ] 컬러 하드코딩 → CSS 변수 변환
- [ ] 반응형 디자인 점검

### 중기 (1달 이내)
- [ ] 폰트 크기 추가 규준화
- [ ] 호버 효과 패턴 통일
- [ ] 접근성 개선 (색상 대비, 키보드 네비게이션)

### 장기 (분기별)
- [ ] 애니메이션 성능 최적화
- [ ] 코드 스플리팅 및 번들 최적화
- [ ] 라이트하우스 점수 개선

---

## 5. 참고 문서

- **디자인 시스템**: `/docs/RG_FAMILY_DESIGN_SYSTEM.md`
- **프로젝트 가이드**: `/CLAUDE.md`
- **DB 스키마**: `/docs/SUPABASE_SCHEMA.md`
- **아키텍처**: `/docs/ARCHITECTURE_ANALYSIS_REPORT.md`
