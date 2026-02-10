# 프론트엔드 디자인 분석 및 가시성 수정

## 개요

shadcn/ui + Tailwind CSS 4 + Mantine 기반 프론트엔드 디자인 시스템 분석 및 다크/라이트 모드 가시성 문제 수정 완료.

## 주요 변경사항

### 누락 CSS 변수 추가

globals.css에 누락된 변수 3개 추가 (다크/라이트 모드 모두):

```css
/* :root (Dark Mode) */
--red: #ef4444;
--logo-bg: var(--color-pink);
--logo-text: #ffffff;

/* [data-theme="light"] (Light Mode) */
--red: #dc2626;  /* 더 진한 red로 라이트 모드 대비 향상 */
--logo-bg: var(--color-pink);
--logo-text: #ffffff;
```

### 영향받는 컴포넌트

| 컴포넌트 | 사용 변수 | 위치 |
|---------|----------|------|
| Notice.module.css | `--logo-bg`, `--logo-text`, `--red` | RG 로고 아이콘, 핀 뱃지 |
| organization/page.module.css | `--red` | 핀 뱃지 |

## 현재 디자인 시스템 분석

### 강점

1. **체계적인 CSS 변수 시스템** (1150+ lines)
   - shadcn/ui HSL 변수 통합
   - Tailwind CSS 4 @theme 설정
   - 다크/라이트 모드 완벽 분리

2. **프리미엄 컬러 시스템**
   - 브랜드: Pink (#c41e7f)
   - 메탈릭: Gold/Silver/Bronze (랭킹용)
   - 시맨틱: Success/Error/Warning/Info

3. **타이포그래피 시스템**
   - Display: Inter
   - Body: Noto Sans KR
   - Major Third 스케일 (1.25)

4. **Mantine 컴포넌트 통합**
   - Admin/Auth 페이지 완전 마이그레이션
   - 1,052 CSS lines 절감

### 하드코딩된 white 색상 분석

발견된 80+ 하드코딩 white 사용 중 **대부분 의도적**:
- 핑크 배경 버튼 (loginBtn, ctaButton, seasonBtn)
- 이미지 오버레이 텍스트 (Hero, Shorts, VOD)
- LIVE 뱃지 (빨간 배경)
- 모달 닫기 버튼

**수정 불필요** - text-shadow 또는 colored 배경으로 가시성 확보됨.

## 디자인 개선 제안

### Phase 1: 즉시 적용 가능

1. **Mantine 확장 적용**
   - 남은 CSS Modules → Mantine 컴포넌트 전환
   - 대상: Calendar, Timeline, OrgTree

2. **shadcn/ui 컴포넌트 도입**
   ```bash
   # 추천 컴포넌트
   npx shadcn@latest add card button badge dialog
   ```

### Phase 2: 중기 개선

1. **CSS Modules → Tailwind 전환**
   - 반복 스타일 → Tailwind 유틸리티
   - 53개 CSS Module 파일 점진적 정리

2. **디자인 토큰 정규화**
   ```css
   /* 현재: 다양한 opacity 변수 */
   --color-pink-overlay-01: rgba(196, 30, 127, 0.01);
   --color-pink-overlay-02: ...

   /* 제안: 단순화된 스케일 */
   --pink-alpha-1 ... --pink-alpha-12
   ```

### Phase 3: 장기 개선

1. **Framer Motion 최적화**
   - 불필요한 re-render 방지
   - AnimatePresence 조건부 로딩

2. **다크 모드 전용 이미지**
   - Hero 배너 다크/라이트 버전 분리
   - 아바타 플레이스홀더 테마 대응

## 결과

- ✅ 빌드 성공 (30/30 pages)
- ✅ 누락 CSS 변수 추가
- ✅ 가시성 문제 해결

## 다음 단계

- [ ] Calendar.module.css → Mantine 마이그레이션
- [ ] shadcn/ui Card 컴포넌트 도입
- [ ] CSS Modules 정리 (사용하지 않는 스타일 제거)
