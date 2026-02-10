# Footer "RG FAMILY" 로고 가시성 수정

## 개요
푸터의 "RG FAMILY" 텍스트가 라이트 모드에서 보이지 않는 문제를 수정. 하드코딩된 흰색 그라디언트를 CSS 변수 기반 테마 적응형 그라디언트로 변경하여 다크/라이트 모드 모두에서 정상 표시되도록 개선.

## 주요 변경사항
- 수정한 것: Footer.module.css `.logo` 클래스의 그라디언트 색상
- 원인: `rgba(255, 255, 255, ...)` 하드코딩으로 라이트 배경에서 투명하게 보임
- 해결: `var(--text-primary)` + `var(--color-pink)` CSS 변수 사용

## 핵심 코드
```css
/* src/components/Footer.module.css line 48 */

/* Before - 라이트 모드에서 안 보임 */
background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.7) 100%);

/* After - 테마 적응형 */
background: linear-gradient(135deg, var(--text-primary) 0%, var(--color-pink) 100%);
```

## 결과
- ✅ 라이트 모드: 어두운 텍스트 → 핑크 그라디언트 (가독성 확보)
- ✅ 다크 모드: 밝은 텍스트 → 핑크 그라디언트 (가독성 확보)
- ✅ 브라우저 실시간 검증 완료

## 다음 단계
- 다른 컴포넌트에서 하드코딩된 색상 검토 (일관성 점검)
- 테마 전환 시 애니메이션 부드럽게 개선 검토
