# 딥핑크 컬러 시스템 적용

## 개요
2025-12-26 회의록 결정에 따라 밝은 핑크(#fd68ba)에서 채도 낮은 딥핑크(#c41e7f, 딥 로즈)로 브랜드 컬러 변경 완료.

## 주요 변경사항
- 수정한 것: `globals.css` 핑크 컬러 팔레트 전면 교체
- 변경된 색상:
  - `--color-pink`: #fd68ba → #c41e7f
  - `--color-pink-light`: #ff8ed4 → #d84a9a
  - `--color-pink-deep`: #fb37a3 → #9a1a66
- 연관 변수 업데이트: glow, bg, border, progress-gradient

## 핵심 코드
```css
/* Pink Accent - 일반 UI용 (Deep Rose #c41e7f) */
--color-pink: #c41e7f;
--color-pink-light: #d84a9a;
--color-pink-deep: #9a1a66;
--color-pink-glow: rgba(196, 30, 127, 0.4);
--color-pink-bg: rgba(196, 30, 127, 0.1);
--color-pink-border: rgba(196, 30, 127, 0.25);

/* Progress Bar Gradient */
--progress-gradient: linear-gradient(90deg, #c41e7f 0%, #d84a9a 50%, #e070b0 100%);
```

## 결과
- ✅ 빌드 성공 (30개 페이지)
- ✅ CSS 변수 참조 체계 유지 (--color-primary가 자동 상속)
- ✅ 다크/라이트 모드 모두 적용

## 다음 단계
- 브라우저에서 전체 페이지 시각적 확인
- 호버/포커스 상태 색상 점검
- (선택) 부서별 테마 강화 - 엑셀부/크루부 컬러 비중 차별화
