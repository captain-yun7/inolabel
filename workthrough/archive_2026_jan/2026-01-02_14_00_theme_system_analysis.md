# 테마 시스템 분석 및 개선 방안

## 개요
라이트모드와 다크모드를 모두 지원하기 위한 프론트엔드 UI/UX 분석 완료.
총 **220개**의 하드코딩 색상이 27개 파일에서 발견됨.

## 현재 테마 시스템 상태

### ✅ 잘 구현된 부분
1. **ThemeContext**: 다크/라이트 토글 정상 작동
2. **globals.css**: 90+ CSS 변수 정의 (다크/라이트 모두)
3. **Elite 랭킹**: CSS 변수 활용 (`--elite-*` 시리즈)
4. **Metallic 효과**: 변수화됨 (`--metallic-gold`, `--metallic-silver`, etc.)

### ❌ 문제점

#### 1. 하드코딩 색상 분포 (총 220개)
| 카테고리 | 파일 수 | 하드코딩 수 |
|---------|--------|-----------|
| Components | 20 | 167 |
| App Pages | 7 | 53 |

#### 2. 심각도별 파일 목록
| 우선순위 | 파일 | 하드코딩 수 | 문제 유형 |
|---------|------|-----------|----------|
| 🔴 높음 | RankingPodium.module.css | 38 | Gold 효과 하드코딩 |
| 🔴 높음 | Hero.module.css | 31 | 오버레이/그림자 |
| 🔴 높음 | RankingCard.module.css | 27 | 배경/shimmer 효과 |
| 🟡 중간 | rg/live/page.module.css | 18 | LIVE 색상 (red) |
| 🟡 중간 | VOD.module.css | 14 | 오버레이 효과 |
| 🟡 중간 | Shorts.module.css | 13 | 오버레이 효과 |
| 🟢 낮음 | 기타 21개 파일 | 79 | 다양 |

#### 3. 주요 하드코딩 패턴

```css
/* 문제 1: Dark Background 하드코딩 */
background: rgba(20, 20, 23, 0.98); /* ❌ 라이트 모드에서 어두움 */
/* 해결: var(--card-bg) 또는 var(--surface) 사용 */

/* 문제 2: Gold 색상 하드코딩 (rank 1 전용) */
background: linear-gradient(135deg, #b8860b 0%, #ffd700 50%, ...);
/* 이건 의도적 - 1위 특별 효과이므로 유지 */

/* 문제 3: Overlay 색상 하드코딩 */
background: rgba(0, 0, 0, 0.5); /* ❌ 테마 미대응 */
/* 해결: var(--overlay-medium) 사용 */

/* 문제 4: White 하이라이트 하드코딩 */
border-color: rgba(255, 255, 255, 0.1); /* ❌ 라이트 모드에서 안 보임 */
/* 해결: var(--glass-border) 사용 */

/* 문제 5: Live 색상 하드코딩 */
background: rgba(239, 68, 68, 0.15); /* ❌ 변수 미사용 */
/* 해결: var(--live-bg) 정의 후 사용 */
```

## 개선 방안 (우선순위순)

### Phase 1: 핵심 변수 추가 (globals.css)
```css
/* 추가 필요 변수 */
--overlay-black-light: rgba(0, 0, 0, 0.3);
--overlay-black-medium: rgba(0, 0, 0, 0.5);
--overlay-black-heavy: rgba(0, 0, 0, 0.8);
--highlight-white: rgba(255, 255, 255, 0.1);
--shimmer-color: rgba(255, 255, 255, 0.03);
--live-bg: rgba(239, 68, 68, 0.15);
--live-border: rgba(239, 68, 68, 0.3);

/* 라이트 모드용 */
[data-theme="light"] {
  --overlay-black-light: rgba(0, 0, 0, 0.1);
  --overlay-black-medium: rgba(0, 0, 0, 0.2);
  --highlight-white: rgba(0, 0, 0, 0.05);
  --shimmer-color: rgba(0, 0, 0, 0.02);
}
```

### Phase 2: 파일별 수정 (우선순위 높음)
1. **RankingCard.module.css**: 배경 그라데이션 변수화
2. **Hero.module.css**: 오버레이 및 그림자 변수화
3. **rg/live/page.module.css**: LIVE 관련 색상 변수화

### Phase 3: 컴포넌트 일괄 수정
- VOD, Shorts, Navbar 등 오버레이 효과 수정
- 모든 rgba(0,0,0,x), rgba(255,255,255,x) 검색 후 변수 치환

## 예외 항목 (수정 불필요)
1. **Gold 1위 효과**: `#ffd700`, `#b8860b` - 메탈릭 효과는 의도적
2. **Silver/Bronze 효과**: 마찬가지로 특수 랭킹 효과
3. **애니메이션 keyframes 내부**: 일부 고정값 허용

## 결과 예상
- 라이트 모드 가독성 대폭 향상
- 테마 일관성 확보
- 유지보수성 개선 (색상 변경 시 한 곳만 수정)

## 다음 단계
1. globals.css에 누락 변수 추가
2. 우선순위 높은 3개 파일 수정
3. 빌드 검증 후 시각적 확인
