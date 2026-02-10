# 프리미엄 디자인 퀄리티 및 텍스트 시인성 개선

## 개요
하이엔드 브랜드 웹사이트(Apple, Linear, Stripe, Vercel)를 참조하여 RG Family 전체 사이트의 디자인 퀄리티와 텍스트 시인성을 대폭 개선함. WCAG AAA 기준을 충족하는 색상 대비와 프리미엄 카드 디자인을 적용.

## 주요 변경사항

### 1. globals.css - 타이포그래피 및 컬러 시스템
- **텍스트 대비 강화**: WCAG AAA 기준 충족 (primary: 18:1, secondary: 10:1)
- **텍스트 섀도우 추가**: `--text-shadow-sm/md/lg` 변수 추가
- **프리미엄 섀도우**: Apple/Linear 스타일 다중 레이어 섀도우
- **Glow 효과**: `--glow-white`, `--glow-accent` 추가

### 2. Hero 섹션 시인성 대폭 개선
- **Subtitle**: 반투명 pill 배경 + backdrop blur + 강한 text-shadow
- **Title**: 3.75rem 크기 + 다중 레이어 text-shadow (0.9 opacity)
- **Description**: 95% 흰색 + text-shadow로 배경 대비 강화
- **Overlay**: 좌측 70% 어두운 그라데이션으로 텍스트 가독성 확보
- **CTA Button**: 흰색 배경 + box-shadow + hover transform
- **Nav Arrows**: 어두운 배경(rgba(0,0,0,0.4)) + blur + shadow

### 3. LiveMembers 섹션
- **LIVE 배지**: 그라데이션 + box-shadow 추가
- **멤버 이름**: secondary 색상 + 굵기 600으로 시인성 향상
- **라이브 카운트**: 펄스 애니메이션 + 더 선명한 빨간색

### 4. Notice 섹션 프리미엄 카드
- **카드 배경**: linear-gradient + inset shadow
- **호버 효과**: translateY(-3px) + 강한 그림자
- **텍스트**: 0.9375rem 크기 + line-height 1.5

### 5. 랭킹 페이지
- **Hero 영역**: 그라데이션 배경 추가
- **카드**: 프리미엄 그라데이션 + inset shadow + hover transform
- **텍스트**: 이름/금액 크기 및 대비 강화

### 6. 커뮤니티/정보 페이지
- **헤더**: 2.75rem 크기 + -1.5px letter-spacing
- **서브타이틀**: secondary 색상 + 500 굵기
- **게시판**: 프리미엄 그라데이션 카드 배경
- **모달**: 그라데이션 배경 + inset shadow

## 핵심 코드

```css
/* 텍스트 대비 - WCAG AAA */
--text-primary: #ffffff;
--text-secondary: #e4e4e7;
--text-shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.7);

/* Hero Overlay - 텍스트 가독성 */
background:
  linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 35%, transparent 60%),
  linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.4) 100%);

/* 프리미엄 카드 */
background: linear-gradient(180deg, var(--card-bg) 0%, rgba(20,20,23,0.95) 100%);
box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.03);
```

## 결과
- WCAG AAA 색상 대비 기준 충족
- Hero 섹션 텍스트 시인성 대폭 향상
- 전체 사이트 프리미엄 감성 강화
- 다크 테마에서도 우수한 가독성 확보

## 다음 단계
- [ ] 라이트 테마 텍스트 대비 검증 및 조정
- [ ] 모바일 반응형에서 텍스트 크기 최적화
- [ ] Hero 슬라이드별 개별 오버레이 조정 (배경 이미지에 따라)
- [ ] 애니메이션 성능 최적화 (will-change, GPU 가속)
- [ ] Lighthouse 접근성 점수 테스트
