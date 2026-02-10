# 레퍼런스 기반 레이아웃 개선

## 개요
3개 레퍼런스 이미지(VIP LOUNGE, ELITE RANKINGS, ORG CHART) 분석 후 일관된 네비게이션 및 레이아웃 시스템 적용.

## 주요 변경사항

### 1. 네비게이션 바 통일 (Grid 레이아웃)
- 모든 페이지에 3-column grid 네비게이션 적용
- 왼쪽: 뒤로가기 버튼
- 중앙: 페이지 타이틀 (아이콘 + 텍스트)
- 오른쪽: 액션 버튼들

### 2. VIP LOUNGE (`/ranking/vip`)
- 중앙 타이틀 "VIP LOUNGE" 추가
- 골드 컬러 아이콘 강조
- 네비게이션 버튼 정리

### 3. ELITE RANKINGS (`/ranking/total`)
- 중앙 타이틀 "ELITE RANKINGS" 추가
- Star 아이콘 적용
- VIP/전체 버튼 간소화

### 4. ORG CHART (`/info/org`)
- 중앙 타이틀 "RG INFO" 추가
- 상단 로고 섹션 (RG 원형 로고 + 서브텍스트)
- Starfield 배경 효과 (header + orgChart 영역)
- z-index 정리로 요소 레이어링 개선

## 수정된 파일
```
src/app/ranking/vip/page.tsx
src/app/ranking/vip/page.module.css
src/app/ranking/total/page.tsx
src/app/ranking/total/page.module.css
src/app/info/org/page.tsx
src/app/info/org/page.module.css
```

## 핵심 CSS 패턴
```css
/* 3-Column Grid Navigation */
.pageNav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
}

/* Centered Title */
.navTitle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  color: var(--metallic-gold);
  letter-spacing: 2px;
}

/* Starfield Background */
.header::before {
  background-image:
    radial-gradient(1px 1px at 10% 20%, rgba(255, 255, 255, 0.4) ...);
}
```

## 결과
- ✅ 빌드 성공 (30개 페이지)
- ✅ 레퍼런스 이미지 레이아웃 반영
- ✅ 일관된 네비게이션 시스템 구축

## 다음 단계
- 브라우저에서 각 페이지 시각적 확인
- 모바일 반응형 테스트
- 추가 페이지 (info/live, info/sig, info/timeline) 네비게이션 통일
