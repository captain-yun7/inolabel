# RG Family 스타일링 가이드

## CSS Variables

### 컬러 시스템
```css
:root {
  /* 브랜드 */
  --color-primary: #fd68ba;
  --color-primary-light: #ff8ed4;
  --primary-deep: #fb37a3;

  /* 배경 */
  --background: #050505;
  --surface: #121212;
  --surface-hover: #1a1a1a;
  --card-bg: #0a0a0a;

  /* 텍스트 */
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --text-muted: #666666;

  /* 랭킹 */
  --gold: #ffd700;
  --silver: #c0c0c0;
  --bronze: #cd7f32;

  /* 상태 */
  --live-color: #00d4ff;
  --red: #ef4444;
}
```

## LIVE 멤버 스타일

### 핑크 링 (인스타그램 스타일)
```css
.avatarWrapper.isLive::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fd68ba 0%, #ff8ed4 50%, #fd68ba 100%);
  z-index: 0;
}

.avatarWrapper.isLive::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(253, 104, 186, 0.5);
  z-index: 0;
}
```

### LIVE 배지
```css
.liveBadge {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  background: #ef4444;
  color: white;
  font-size: 0.5rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 10px;
  z-index: 3;
  border: 1.5px solid var(--background);
}
```

### 비-라이브 멤버
```css
.avatar:not(.avatarLive) {
  opacity: 0.5;
  filter: grayscale(0.4) brightness(0.85);
}

.memberCard:hover .avatar:not(.avatarLive) {
  opacity: 1;
  filter: grayscale(0);
}
```

## 카드 스타일

### 기본 카드
```css
.card {
  background: var(--surface);
  border: 1px solid var(--card-border);
  border-radius: 14px;
  padding: 1.125rem;
  transition: all 0.25s ease;
}

.card:hover {
  background: var(--surface-hover);
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}
```

## 반응형 브레이크포인트

```css
/* 태블릿 */
@media (max-width: 768px) { }

/* 모바일 */
@media (max-width: 480px) { }
```
