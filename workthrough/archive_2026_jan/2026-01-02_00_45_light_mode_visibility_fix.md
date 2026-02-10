# 라이트 모드 텍스트 가시성 문제 수정

## 개요
2,3위 Elite 스타일에 하드코딩된 흰색(`rgba(255,255,255,...)`)이 라이트모드 배경에서 보이지 않는 문제를 수정했습니다. CSS 변수를 활용해 다크/라이트 모드 모두에서 올바르게 표시되도록 개선했습니다.

## 주요 변경사항

### 추가한 것
- **globals.css**: Elite/Platinum 전용 CSS 변수 추가
  - `--elite-text`, `--elite-border`, `--elite-glow` 등 10개 변수
  - 다크모드: 흰색/밝은 계열
  - 라이트모드: 어두운 회색 계열

### 수정한 것
- **RankingPodium.module.css**: 하드코딩 → CSS 변수 교체
  - `.elite .avatar` 테두리/그림자
  - `.elite .initials` 그라데이션/필터
  - `.elite .rankBadge` 배경/색상
  - `.elite .name` 텍스트/그림자
  - `.elite .top` 바 그라데이션
  - `.elite .front` 배경/테두리

- **RankingFullList.module.css**: Elite 이니셜 그라데이션 수정

## 핵심 코드

```css
/* globals.css - 다크모드 */
--elite-text: rgba(255, 255, 255, 0.95);
--elite-gradient-mid: rgba(255, 255, 255, 1);
--elite-glow: rgba(255, 255, 255, 0.2);

/* globals.css - 라이트모드 */
--elite-text: #27272a;
--elite-gradient-mid: #27272a;
--elite-glow: rgba(100, 100, 100, 0.15);
```

```css
/* 컴포넌트 - CSS 변수 사용 */
.elite .initials {
  background: linear-gradient(
    135deg,
    var(--elite-gradient-from) 0%,
    var(--elite-gradient-mid) 50%,
    var(--elite-gradient-to) 100%
  );
}
```

## 결과
- ✅ 빌드 성공
- ✅ 라이트모드 텍스트 가시성 확보
- ✅ 다크모드 기존 디자인 유지
- ✅ 2,3위 Elite 스타일 테마 호환

## 다음 단계
- 다른 페이지에서 라이트모드 가시성 문제 확인
- Hero, Navbar 등 핵심 컴포넌트 검증
