# Hero 배너 CTA 버튼 가시성 수정

## 개요
Hero 배너의 "바로가기" (멤버 보기) 버튼이 라이트/다크 모드에서 잘 보이지 않는 문제 수정. 하드코딩된 흰색 배경과 배경색 기반 텍스트 색상을 브랜드 핑크 그라디언트로 변경.

## 주요 변경사항
- 수정한 것: Hero.module.css `.ctaButton` 클래스 스타일
- 원인: `background: white`, `color: var(--background)`로 라이트 모드에서 흰색/흰색 조합
- 해결: 핑크 그라디언트 배경 + 흰색 텍스트로 통일

## 핵심 코드
```css
/* src/components/Hero.module.css */

/* Before - 라이트 모드에서 안 보임 */
.ctaButton {
  background: white;
  color: var(--background);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.9);
}

/* After - 테마 무관 가시성 확보 */
.ctaButton {
  background: linear-gradient(135deg, var(--color-pink) 0%, var(--color-pink-deep) 100%);
  color: white;
  box-shadow: 0 4px 16px var(--color-pink-glow);
  border: 1px solid var(--color-pink-border);
}
```

## 결과
- ✅ 라이트 모드: 핑크 그라디언트 버튼 명확하게 표시
- ✅ 다크 모드: 핑크 그라디언트 버튼 명확하게 표시
- ✅ 호버 시 brightness 효과로 피드백 제공
- ✅ 브랜드 컬러와 일관성 유지

## 다음 단계
- 다른 페이지의 CTA 버튼 스타일 일관성 검토
- 모바일 환경에서 버튼 터치 영역 검증
