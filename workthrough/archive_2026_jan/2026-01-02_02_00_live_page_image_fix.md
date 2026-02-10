# LIVE 페이지 이미지 로드 문제 수정

## 개요
LIVE 페이지에서 멤버 프로필 이미지가 보이지 않던 문제를 수정했습니다. CSS의 `::after` 가상 요소가 이미지를 덮어서 발생한 문제였습니다.

## 주요 변경사항

### 수정한 것
- **page.module.css**: `.avatarRing` 스타일 수정
  - `::after` → `::before`로 변경
  - `z-index: 0` 추가로 배경 레이어 설정
  - `display: flex` 추가로 중앙 정렬

- **`.avatarImage`**: z-index 추가
  - `position: relative; z-index: 1` 로 이미지가 배경 위로 표시

- **`.avatarPlaceholder`**: z-index 추가
  - `position: relative; z-index: 1; border-radius: 50%`

## 핵심 코드

```css
/* 수정 전 - 이미지가 ::after에 의해 가려짐 */
.avatarRing::after {
  content: '';
  position: absolute;
  inset: 3px;
  background: var(--card-bg);
}

/* 수정 후 - ::before로 변경하고 z-index 적용 */
.avatarRing::before {
  content: '';
  position: absolute;
  inset: 3px;
  background: var(--card-bg);
  z-index: 0;  /* 배경 레이어 */
}

.avatarImage {
  position: relative;
  z-index: 1;  /* 이미지가 배경 위에 표시 */
}
```

## 결과
- ✅ LIVE 멤버 이미지 정상 표시
- ✅ 오프라인 멤버 이미지 정상 표시 (grayscale 필터 적용)
- ✅ 애니메이션 링 효과 유지
- ✅ LIVE 뱃지 정상 표시

## 원인 분석
- `::after` 가상 요소가 `position: absolute`로 이미지 위에 렌더링
- Next.js Image 컴포넌트의 `fill` 속성이 부모 기준으로 동작
- z-index 없이는 DOM 순서대로 ::after가 위에 표시됨
