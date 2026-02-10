# 다크/라이트 모드 변별력 개선

## 개요
하드코딩된 색상 값을 CSS 변수로 교체하여 다크/라이트 모드 전환 시 각 테마에 맞는 색상이 적용되도록 개선했습니다.

## 주요 변경사항

### 1. globals.css - 테마 적응형 변수 추가
```css
/* 다크 테마 */
--overlay-subtle: rgba(255, 255, 255, 0.05);
--overlay-medium: rgba(255, 255, 255, 0.1);
--item-bg: #111111;
--item-hover: #161616;
--shadow-sm/md/lg: 다크용 쉐도우

/* 라이트 테마 */
--overlay-subtle: rgba(0, 0, 0, 0.03);
--overlay-medium: rgba(0, 0, 0, 0.06);
--item-bg: #f8f9fa;
--item-hover: #f1f3f5;
--shadow-sm/md/lg: 라이트용 쉐도우
```

### 2. 수정된 컴포넌트 CSS
| 파일 | 변경 내용 |
|------|----------|
| Notice.module.css | `.item`, `.rgIcon` 배경/테두리 |
| Hero.module.css | `.background::after`, `.badge`, `.navBtn`, `.dot` |
| RankingBoard.module.css | `.tabs`, `.item` 배경/테두리 |
| RankingBar.module.css | `.container` 배경/테두리 |
| GaugeBar.module.css | `.barBackground`, `.percentage` |
| OrgTree.module.css | `.card`, `.line`, 연결선 |

## 핵심 변경
```css
/* Before (하드코딩) */
background: #111;
border: 1px solid rgba(255, 255, 255, 0.05);

/* After (CSS 변수) */
background: var(--item-bg);
border: 1px solid var(--item-border);
```

## 결과
- ✅ 빌드 성공 (29개 페이지)
- ✅ 다크 모드: 기존과 동일한 UI 유지
- ✅ 라이트 모드: 적절한 밝은 배경/테두리 적용

## 다음 단계
- Shorts.module.css, VOD.module.css 추가 수정
- Calendar.module.css 테마 변수 적용
- 실제 브라우저에서 라이트 모드 전환 테스트
