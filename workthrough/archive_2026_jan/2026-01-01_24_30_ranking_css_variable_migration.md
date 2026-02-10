# 랭킹 페이지 CSS 변수 마이그레이션

## 개요
후원 랭킹 페이지(RankingPodium, RankingList)의 하드코딩된 rgba/hex 색상을 CSS 변수로 마이그레이션하여 다크/라이트 테마 전환 시 일관된 스타일을 보장합니다.

## 주요 변경사항

### RankingPodium.module.css
- `.avatar`: `rgba(255, 255, 255, 0.1)` → `var(--border-overlay-08)`
- `.avatar` box-shadow: 하드코딩 → `var(--shadow-lg)`
- `.rankBadge` box-shadow: `rgba(0, 0, 0, 0.3)` → `var(--shadow-md)`
- `.face` (3D 큐브):
  - background: `rgba(255, 255, 255, 0.05)` → `var(--glass-bg)`
  - border: `rgba(255, 255, 255, 0.2)` → `var(--glass-border)`
  - border-top-color: → `var(--border-overlay-30)`
  - box-shadow inset: → `var(--overlay-subtle)`
- `.top` (홀로그래픽 효과):
  - gradient: → `var(--border-overlay-30)`
  - border: → `var(--glass-border)`
  - box-shadow: → `var(--overlay-medium)`
- `.rank1 .amount`: `rgba(255, 255, 255, 0.9)` → `var(--text-primary)`

### RankingList.module.css
- `.item` background: `rgba(255, 255, 255, 0.02)` → `var(--overlay-subtle)`
- `.item:hover` background: `rgba(255, 255, 255, 0.05)` → `var(--overlay-light)`
- `.item:hover` box-shadow: `rgba(0, 0, 0, 0.2)` → `var(--shadow-md)`

## 결과
- ✅ 빌드 성공 (29페이지)
- ✅ 다크 테마에서 프리미엄 디자인 확인
- ✅ 라이트 테마에서도 정상 작동
- ✅ 3D 글라스 큐브 효과 유지
- ✅ 골드/실버/브론즈 메탈릭 스타일 유지

## 다음 단계
- VIP 페이지 CSS 변수 검토
- 시즌별 랭킹 페이지 스타일 확인
