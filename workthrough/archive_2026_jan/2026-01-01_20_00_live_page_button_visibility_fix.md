# 현재 방송중 멤버 페이지 버튼 및 모달 시인성 수정

## 개요
`/info/live` 페이지에서 활성 버튼(ALL, 전체 탭)의 텍스트가 보이지 않던 문제와 상세 모달의 시인성 문제 해결. 원인은 정의되지 않은 CSS 변수 사용.

## 주요 변경사항

### 1차: 버튼 시인성 수정
- `var(--color-primary)` → `var(--color-pink)` (9곳)
- `var(--color-primary-light)` → `var(--color-pink-light)`
- `var(--color-primary-glow)` → `var(--color-pink-glow)`

### 2차: 모달 시인성 수정
- `var(--item-bg)` → `var(--card-bg)`
- `var(--item-border)` → `var(--card-border)`
- `var(--overlay-medium)` → `var(--card-border)`
- `var(--surface-elevated)` → `var(--surface)`
- `var(--overlay-subtle)` → `var(--surface-secondary)`
- `var(--live-color-dark)` → `#dc2626` (직접 값)

## 수정된 파일
- `src/app/info/live/page.module.css`

## 핵심 코드
```css
/* Before - 정의되지 않은 변수 */
.card {
  background: var(--item-bg);
  border: 1px solid var(--item-border);
}
.modal {
  background: var(--surface-elevated);
}

/* After - 정의된 변수 사용 */
.card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
}
.modal {
  background: var(--surface);
}
```

## 결과
- ✅ ALL/EXCEL 유닛 버튼 시인성 확보
- ✅ 전체/LIVE 탭 버튼 시인성 확보
- ✅ 카드 배경 및 테두리 정상 표시
- ✅ 모달 배경 및 섹션 구분 정상 표시
- ✅ 소셜 링크 버튼 배경 정상 표시
- ✅ "지금 방송 보러가기" 버튼 빨간 그라데이션 정상 표시

## 다음 단계
- 다른 페이지에서도 정의되지 않은 CSS 변수 사용 여부 확인
- globals.css에 자주 사용되는 alias 변수 추가 고려
