# 라이트 테마 텍스트 시인성 개선

## 개요
라이트 테마에서 랭킹, 시즌 페이지의 텍스트 가독성이 낮은 문제를 해결했다. CSS 변수 색상과 직접 오버라이드를 조합하여 WCAG 대비 기준에 맞는 시인성을 확보했다.

## 주요 변경사항
- **랭킹 페이지 (`page.module.css`)**:
  - ELITE 배지: 골드 브라운(#8b6914)으로 변경, text-shadow 제거
  - RANKINGS 제목: 다크 그라데이션(#1a1a1a → #3a3a3a)
  - subtitle: 회색(#52525b)으로 대비 강화

- **시즌 페이지 (`season/page.module.css`)**:
  - SEASON RANKINGS 배지: 틸(#0d9488)로 변경
  - SEASONS 제목: 다크 그라데이션 적용
  - LIVE 배지: 틸 계열로 통일
  - 날짜/메타 정보: 회색 계열로 가독성 확보

- **VIP 페이지**: 이미 완전한 라이트 테마 오버라이드 존재 (1183-1475 라인)

## 핵심 코드
```css
/* 라이트 테마 오버라이드 패턴 */
:global([data-theme="light"]) .heroBadge {
  color: #8b6914;
  text-shadow: none;
}

:global([data-theme="light"]) .title {
  background: linear-gradient(180deg, #1a1a1a 0%, #3a3a3a 100%);
  -webkit-background-clip: text;
  background-clip: text;
}
```

## 결과
- 랭킹 페이지 라이트 모드: ELITE 배지 + 제목 시인성 크게 개선
- 시즌 페이지 라이트 모드: 모든 텍스트 요소 가독성 확보
- VIP 페이지: 기존 오버라이드 유지

## 다음 단계
- 다른 페이지들(community, notice 등)도 라이트 테마 점검 필요
- globals.css의 라이트 테마 CSS 변수 체계적 정리 고려
