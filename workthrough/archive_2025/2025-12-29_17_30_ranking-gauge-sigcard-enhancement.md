# 후원 랭킹 게이지 바 & 시그리스트 재생 버튼 강화

## 개요
후원 랭킹 페이지의 게이지 바 시각화를 개선하고, 시그리스트 카드의 재생 버튼에 펄스 애니메이션과 미디어 타입별 아이콘을 추가했습니다.

## 주요 변경사항

### 1. GaugeBar 컴포넌트 개선
- Shimmer 애니메이션 효과 추가
- 퍼센티지 배지 스타일 강화 (랭크별 색상)
- 바 높이 증가 및 inset shadow 추가
- 하트 단위 표시 추가

### 2. SigCard 컴포넌트 개선
- 미디어 타입별 아이콘 (Film, Sparkles, Image)
- 미디어 타입별 배지 색상 (영상=핑크, GIF=보라, 이미지=파랑)
- 미니 재생 버튼 (항상 표시, 펄스 애니메이션)
- 호버 시 재생 버튼 펄스 + 텍스트 표시

## 수정된 파일
- `src/components/ranking/GaugeBar.tsx`
- `src/components/ranking/GaugeBar.module.css`
- `src/components/info/SigCard.tsx`
- `src/components/info/SigCard.module.css`

## 핵심 코드

```css
/* GaugeBar - Shimmer 효과 */
.barFill::after {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shimmer 2s infinite;
}

/* SigCard - 펄스 애니메이션 */
.miniPlayButton {
  animation: miniPulse 2s ease-in-out infinite;
}
@keyframes miniPulse {
  50% { transform: scale(1.1); box-shadow: 0 4px 16px rgba(253, 104, 186, 0.6); }
}
```

```tsx
// SigCard - 미디어 타입별 아이콘
const getMediaIcon = () => {
  switch (signature.mediaType) {
    case 'video': return <Film size={14} />
    case 'gif': return <Sparkles size={14} />
    default: return <ImageIcon size={14} />
  }
}
```

## 결과
- 빌드 성공 (29개 페이지)
- TypeScript 오류 없음

## 다음 단계
- [ ] LIVE MEMBERS 핑크색 펄스 애니메이션 (테두리)
- [ ] VIP 페이지 프리미엄 UI 개선
- [ ] 타임라인 카드형 레이아웃 개선
