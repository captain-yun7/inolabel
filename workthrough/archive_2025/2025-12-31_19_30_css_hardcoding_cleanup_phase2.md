# CSS 하드코딩 제거 Phase 2

## 개요
Hero, Calendar, Navbar 컴포넌트의 하드코딩된 색상값을 CSS 변수로 교체하고, 시안색/요일 색상 변수를 추가했습니다.

## 주요 변경사항

### globals.css - 새 변수 추가
- **Cyan Accent** (`--cyan`, `--cyan-bg`, `--cyan-glow`): 캘린더 CREW 강조색
- **Calendar Colors** (`--sunday-color`, `--saturday-color`): 요일 색상

### 수정된 컴포넌트

| 파일 | 변경 내용 |
|------|----------|
| `Hero.module.css` | `#ffffff` → `white`, `#09090b` → `var(--background)` |
| `Calendar.module.css` | `#00d4ff` → `var(--cyan)`, `#ef4444` → `var(--sunday-color)` |
| `Navbar.module.css` | `#ef4444` → `var(--live-color)` |

## 핵심 코드

```css
/* globals.css */
--cyan: #00d4ff;
--cyan-bg: rgba(0, 212, 255, 0.2);
--cyan-glow: rgba(0, 212, 255, 0.3);
--sunday-color: #ef4444;
--saturday-color: #3b82f6;
```

```css
/* Calendar - 변경 전 */
background: #00d4ff;
color: #ef4444;

/* Calendar - 변경 후 */
background: var(--cyan);
color: var(--sunday-color);
```

## 결과
- ✅ 빌드 성공 (30개 페이지)
- ✅ 모든 핵심 컴포넌트 CSS 변수화 완료

## 다음 단계
- ThemeToggle.module.css 테마 색상 정리
- Notice.module.css, VOD.module.css 등 남은 하드코딩 정리
- 라이트 모드 테스트
