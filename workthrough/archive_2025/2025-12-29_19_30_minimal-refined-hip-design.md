# Minimal & Refined Hip 디자인 적용

## 개요
레퍼런스 이미지 기반 "Minimal & Refined Hip" 스타일을 RG Family 프로젝트에 적용. 프리미엄 타이포그래피, VIP SECRET 섹션, 디자인 시스템 변수 개선.

## 주요 변경사항

### 개발한 것
- **VIP SECRET 섹션**: 멤버 친필 사인 갤러리 (signatures grid)
- **프리미엄 타이포그래피**: Outfit(헤딩) + Noto Sans KR(본문) 적용

### 수정한 것
- `globals.css`: 폰트 import 및 CSS 변수 추가
- `CLAUDE.md`: 디자인 레퍼런스 및 로드맵 업데이트

### 개선한 것
- VIP 페이지: `signatures` 데이터 구조 및 UI 컴포넌트 추가
- 디자인 시스템: `--live-glow`, `--gold-glow`, `--ease-smooth` 변수

## 핵심 코드

```css
/* globals.css - Typography */
@import url('...Outfit...Noto+Sans+KR...');

:root {
  --font-display: 'Outfit', -apple-system, sans-serif;
  --font-body: 'Noto Sans KR', -apple-system, sans-serif;
  --live-color: #00d4ff;
  --live-glow: rgba(0, 212, 255, 0.6);
}
```

```tsx
// VIP SECRET Signatures Section
<div className={styles.signaturesSection}>
  <div className={styles.secretBadge}>VIP SECRET</div>
  <h2>VIP Exclusive Signatures</h2>
  <div className={styles.signaturesGrid}>
    {signatures.map(sig => <SignatureCard />)}
  </div>
</div>
```

## 결과
- 메인 페이지: 타이포그래피 개선 확인
- 랭킹 페이지: Top 3 포디움 + 게이지 바 정상 작동
- VIP 페이지: SECRET 사인 갤러리 섹션 추가 완료

## 다음 단계
1. **조직도 트리 구조**: 대표 → 팀장 → 멤버 계층 연결선 시각화
2. **실제 사인 이미지**: `/assets/signatures/` 폴더에 멤버별 사인 이미지 추가
3. **Top 1-3 헌정 페이지**: `/ranking/vip/[userId]` 개인 페이지 구현
4. **Hero 배너 멤버 이미지**: 레퍼런스처럼 멤버 인물 사진 오버레이
