# 디자인 고도화 - UI/UX 프리미엄 개선

## 개요
메인 페이지 및 주요 컴포넌트의 시각적 완성도를 높이기 위한 디자인 고도화 작업 수행. 랭킹 포디움, 조직도 연결선, Hero 배너, LiveMembers, Notice 섹션의 가독성과 프리미엄 감성 강화.

## 주요 변경사항

### 1. 랭킹 포디움 레이아웃
- **구현**: Top 3 카드 높이 차등 배치 (2위-1위-3위 순서)
- **CSS order 속성**: 시각적 순서 재배치
- **translateY 적용**: 1위 카드 24px 상승
- **포디움 베이스**: 핑크 그라디언트 효과
- **파일**: `ranking/total/page.module.css`, `ranking/season/[id]/page.module.css`

### 2. 조직도 계층 연결선
- **연결선 강화**: 회색 → 핑크 그라디언트 + 글로우
- **노드 점 추가**: 연결 시작점에 핑크 원형 점
- **브랜치 엔드포인트**: 각 분기 끝에 작은 점 추가
- **파일**: `info/org/page.module.css`

### 3. Hero 배너 애니메이션
- **네비게이션 버튼**: 글래스모피즘 + 핑크 글로우 호버
- **오버레이**: 하단 그라디언트로 깊이감
- **그레인 텍스처**: SVG 노이즈로 프리미엄 질감
- **샤인 효과**: 슬라이드 호버 시 빛 스윕
- **Framer Motion**: 0.7-0.8s duration, 커스텀 스프링 이징
- **파일**: `Hero.tsx`, `Hero.module.css`

### 4. LiveMembers 가독성
- **라이브 카운트 뱃지**: 시안색 테마로 강조
- **LIVE 뱃지**: 시안 그라디언트 + 펄스 글로우
- **아바타 라이브 상태**: 시안색 테두리 + 글로우 애니메이션
- **비라이브 구분**: 50% 투명도 + 그레이스케일
- **파일**: `LiveMembers.module.css`

### 5. Notice 핀 뱃지
- **북마크 뱃지**: 핑크 그라디언트 + 펄스 애니메이션
- **글로우 효과**: 뱃지 뒤 radial-gradient
- **태그 스타일**: "중요 공지" 핑크 배경/테두리
- **파일**: `Notice.tsx`, `Notice.module.css`

## 핵심 코드

```css
/* 포디움 레이아웃 */
.topRankers > *:nth-child(1) {
  order: 2;
  transform: translateY(-24px);
}

/* 라이브 아바타 글로우 */
.avatar.avatarLive {
  box-shadow:
    0 0 0 2px rgba(0, 212, 255, 0.2),
    0 0 20px rgba(0, 212, 255, 0.4);
  animation: avatarGlow 2s ease-in-out infinite;
}

/* 핀 뱃지 펄스 */
@keyframes pinPulse {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}
```

## 결과
- 빌드 성공
- 브라우저 검증 완료

## 다음 단계
- VIP 헌정 페이지 Top 1-3 개인 페이지 구현
- PandaTV API 연동으로 실시간 라이브 상태 반영
- 다크/라이트 모드 전환 시 애니메이션 부드러움 개선
