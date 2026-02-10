# 텍스트 시인성 대폭 개선

## 개요
사용자 피드백을 반영하여 전체 사이트의 텍스트 시인성을 대폭 강화함. Hero 섹션에서 텍스트가 보이지 않던 심각한 문제를 해결하고, Shorts/VOD 카드의 제목 가독성도 개선함.

## 주요 변경사항

### 1. Hero 섹션 (Hero.module.css)
- **오버레이 강화**: 좌측 85% → 10%까지 점진적 그라데이션으로 전체 커버리지 확대
- **info 컨테이너**: `background: rgba(0,0,0,0.4)` + `backdrop-filter: blur(8px)` 추가
- **subtitle**: 어두운 배경(`rgba(0,0,0,0.5)`) + 강한 text-shadow
- **title**: 4중 레이어 text-shadow (0 0 40px, 4px 20px, 2px 8px, 1px 2px)
- **description**: 3중 레이어 text-shadow 적용
- **badges**: 어두운 배경으로 변경 (`rgba(0,0,0,0.5)`)

### 2. Shorts 섹션 (Shorts.module.css)
- **그라데이션 오버레이**: 40%부터 시작, 90% 불투명도로 강화
- **title text-shadow**: 3중 레이어 (0 0 10px, 2px 4px, 1px 2px)

### 3. VOD 섹션 (VOD.module.css)
- **그라데이션 오버레이**: 30%부터 시작, 90% 불투명도로 강화
- **title text-shadow**: 3중 레이어 적용

## 핵심 코드

```css
/* Hero info 컨테이너 - 반투명 배경 */
.info {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  border-radius: var(--radius-lg);
}

/* 강력한 text-shadow 패턴 */
text-shadow:
  0 0 40px rgba(0, 0, 0, 1),
  0 4px 20px rgba(0, 0, 0, 1),
  0 2px 8px rgba(0, 0, 0, 1),
  0 1px 2px rgba(0, 0, 0, 1);

/* 카드 오버레이 - 더 넓은 커버리지 */
background: linear-gradient(
  to bottom,
  transparent 30%,
  rgba(0, 0, 0, 0.5) 60%,
  rgba(0, 0, 0, 0.9) 100%
);
```

## 결과
- ✅ Hero 섹션: 모든 슬라이드에서 텍스트 완벽 가독
- ✅ Shorts 카드: 하단 제목 선명하게 표시
- ✅ VOD 카드: 제목/날짜 모두 가독 가능
- ✅ 어떤 배경 이미지에서도 텍스트 시인성 확보

## 다음 단계
- [ ] 모바일 환경에서 시인성 테스트
- [ ] 다크/라이트 모드 전환 시 시인성 확인
- [ ] Lighthouse 접근성 점수 측정
