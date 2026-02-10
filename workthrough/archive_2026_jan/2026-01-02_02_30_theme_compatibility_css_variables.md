# 다크/라이트 모드 테마 호환성 CSS 변수 통합

## 개요
페이지별로 하드코딩된 rgba() 색상(129개 인스턴스)을 분석하고, CSS 변수로 교체하여 다크모드와 라이트모드 모두에서 제대로 표시되도록 수정했습니다.

## 주요 변경사항

### 수정한 것
- **ranking/page.module.css**: 40개+ 하드코딩 색상 → CSS 변수로 교체
- **ranking/season/[id]/page.module.css**: 42개+ 하드코딩 색상 → CSS 변수로 교체
- **ranking/[userId]/page.module.css**: 골드 색상 하드코딩 → 전역 metallic-gold 변수 사용
- **components/ranking/RankingFullList.module.css**: 테마 호환 스타일로 재작성
- **schedule/page.module.css**: 별 효과 → star 변수로 교체
- **organization/page.module.css**: starfield 배경 → star 변수로 교체
- **timeline/page.module.css**: 수직 조명 효과 → overlay 변수로 교체

### 추가한 것
- **globals.css**: 별 효과 CSS 변수 추가 (`--star-bright`, `--star-dim`, `--star-accent`)
- 다크모드: 흰색 별 효과 / 라이트모드: 투명/미세 효과

## 핵심 코드

```css
/* globals.css - 다크모드 기본 */
--star-bright: rgba(255, 255, 255, 0.35);
--star-dim: rgba(255, 255, 255, 0.2);
--star-accent: rgba(0, 240, 255, 0.3);

/* 라이트모드 오버라이드 */
[data-theme="light"] {
  --star-bright: rgba(0, 0, 0, 0.06);
  --star-dim: rgba(0, 0, 0, 0.03);
  --star-accent: rgba(0, 180, 200, 0.1);
}
```

```css
/* 하드코딩 → CSS 변수 변환 예시 */
/* Before */
background: rgba(255, 255, 255, 0.05);
color: rgba(255, 255, 255, 0.7);

/* After */
background: var(--overlay-subtle);
color: var(--text-tertiary);
```

## 결과
- ✅ 빌드 성공 (29 pages)
- ✅ 129개 하드코딩 색상 중 주요 페이지 모두 수정
- ✅ 다크/라이트 모드 양쪽에서 테마 호환

## 다음 단계
- 나머지 컴포넌트 CSS 파일에서 하드코딩된 색상 검사 및 수정
- 실제 브라우저에서 라이트모드 전환 테스트
- 접근성 대비(contrast) 검증
