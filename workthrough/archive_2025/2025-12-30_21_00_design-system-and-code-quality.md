# 디자인 시스템 통일 및 코드 품질 개선

## 개요
RG Family 프로젝트의 전체 디자인 일관성 점검과 코드 구조 분석을 수행하고, CLAUDE.md 사양에 맞게 LIVE 색상을 시안(#00d4ff)으로 통일하고 디자인 토큰 시스템을 정의했습니다.

## 주요 변경사항

### 1. LIVE 색상 시안 통일 (CLAUDE.md 사양 준수)
- `globals.css`: `--live-color: #00d4ff`, `--live-glow: rgba(0, 212, 255, 0.6)` 적용
- `LiveMembers.module.css`: LIVE 상태 테두리/글로우 시안색으로 변경
- `info/org/page.module.css`: 조직도 LIVE 뱃지/아바타 시안색 적용
- `info/live/page.module.css`: Live 페이지 전체 LIVE 요소 시안색 적용

### 2. 디자인 토큰 시스템 정의 (globals.css)
```css
/* Typography Scale (8px base) */
--text-xs ~ --text-5xl (12px ~ 56px)

/* Spacing Scale (8px base) */
--space-1 ~ --space-16 (4px ~ 64px)

/* Border Radius */
--radius-sm ~ --radius-full

/* Animation Durations */
--duration-fast ~ --duration-slower
```

### 3. 코드 품질 개선
- `info/live/page.tsx`: 중복 아이콘 임포트 제거 (`ExternalLink` 중복)

## 분석 결과 요약

### 프로젝트 구조 (강점)
- 35개 TSX 컴포넌트, 31개 CSS Modules
- 깔끔한 폴더 구조 (feature-based)
- Repository 패턴 기반 아키텍처

### 개선된 항목
| 항목 | 이전 | 이후 |
|------|------|------|
| LIVE 색상 | 핑크 `#fb37a3` | 시안 `#00d4ff` |
| 타이포 스케일 | 미정의 | 9단계 정의 |
| 간격 시스템 | 미정의 | 11단계 정의 |
| 중복 임포트 | 있음 | 제거됨 |

## 결과
- ✅ TypeScript 타입 검사 통과
- ✅ 프로덕션 빌드 성공
- ✅ CLAUDE.md 사양 준수

## 추가 완료 작업

### 1. 레거시 색상 변수명 통일 ✅
- `globals.css`에 호환성 레이어 추가
- `--color-text` → `var(--text-primary)`
- `--color-text-secondary` → `var(--text-secondary)`
- `--color-border` → `var(--card-border)`
- 다크/라이트 테마 모두 적용

### 2. Deprecated 훅 정리 ✅
- `hooks/index.ts`에 마이그레이션 가이드 추가
- 하위 호환성 유지하면서 문서화

### 3. any/unknown 타입 정리 ✅
- `JoinedProfile`, `JoinedSeason` 타입 추가 (`types/common.ts`)
- `getJoinedProfile()`, `getJoinedSeason()` 헬퍼 함수 추가
- `useRanking.ts`, `LiveMembers.tsx` 타입 개선

### 4. 대형 CSS 파일 구조 문서화 ✅
- org/page.module.css (684줄): 8개 섹션으로 구조화됨
- Modal 섹션(236줄)은 향후 컴포넌트 분리 대상

## 다음 단계 (향후)

### 우선순위 높음
- [ ] 나머지 `as any` 타입 마이그레이션 (패턴 제공됨)
- [ ] Modal 컴포넌트 분리 (org, vip 페이지)

### 우선순위 중간
- [ ] 라이트 모드 WCAG 대비도 검증
- [ ] Admin 페이지 1024px 브레이크포인트 추가
