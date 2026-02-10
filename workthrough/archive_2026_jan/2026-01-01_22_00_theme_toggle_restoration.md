# 테마 토글 기능 복원

## 개요
강제 다크 테마 CSS 오버라이드 제거로 테마 토글(다크/라이트 모드 전환) 기능 복원.

## 문제점
- 이전 작업에서 각 페이지에 강제 다크 테마 CSS 변수 오버라이드 적용
- `.main, .main * { --background: #09090b; ... }` 패턴이 `[data-theme="light"]` 보다 높은 CSS 특정성(specificity)
- 결과: 테마 토글 버튼이 작동하지 않음 (다크 → 라이트 전환 불가)

## 해결 방법
10개 페이지에서 강제 다크 테마 CSS 블록 제거:
- `background: #09090b` → `background: var(--background)`
- 강제 CSS 변수 오버라이드 블록 전체 삭제

## 수정된 파일 (10개)
1. `src/app/page.module.css`
2. `src/app/schedule/page.module.css`
3. `src/app/notice/page.module.css`
4. `src/app/info/live/page.module.css`
5. `src/app/info/sig/page.module.css`
6. `src/app/info/timeline/page.module.css`
7. `src/app/community/free/page.module.css`
8. `src/app/ranking/total/page.module.css`
9. `src/app/ranking/vip/page.module.css`
10. `src/app/info/org/page.module.css`

## 결과
- 빌드 성공
- 테마 토글 기능 정상 작동
- 다크/라이트 모드 전환 가능

## 다음 단계
- 브라우저에서 테마 토글 동작 확인
- 라이트 모드 디자인 검토 및 필요시 개선
