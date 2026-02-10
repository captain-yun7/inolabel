# 랭킹/VIP 페이지 프리미엄 디자인 개선

## 개요
랭킹 및 VIP 페이지의 디자인을 프리미엄 럭셔리 스타일로 전면 개선했습니다. 메탈릭 그라디언트, 정교한 글로우 효과, 세련된 호버 인터랙션을 적용하여 고급스러운 사용자 경험을 제공합니다.

## 주요 변경사항

### RankingCard 컴포넌트
- 메탈릭 그라디언트 배경 (골드 #D4AF37, 실버 #B8C4CE, 브론즈 #CD7F32)
- 텍스트 그라디언트 효과로 메탈릭 후원 금액 표시
- Shimmer 애니메이션으로 프리미엄 느낌 강화
- 정교한 글로우/그림자 효과 및 호버 인터랙션

### 전체 랭킹 페이지
- 다크 그라디언트 Hero 섹션 + 골드 글로우 효과
- 통일된 필터 UI (세그먼트 컨트롤 스타일)
- 포디움 아래 골드 글로우 효과

### VIP 페이지
- 럭셔리 골드 테마 Hero (다중 radial gradient)
- 별 장식 트윙클 애니메이션
- 시그니처 갤러리 호버 효과 강화
- 비디오 카드 프리미엄 스타일

### 시즌별 랭킹 페이지
- 전체 랭킹 페이지와 디자인 언어 통일
- 일관된 Hero, 필터, 포디움 스타일

## 핵심 코드

```css
/* 메탈릭 골드 그라디언트 */
.gold .amount {
  background: linear-gradient(135deg, #ffd700 0%, #d4af37 50%, #f0d060 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 프리미엄 카드 효과 */
.card {
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
```

## 결과
- ✅ 빌드 성공
- ✅ 모든 랭킹 페이지 디자인 통일
- ✅ 반응형 디자인 최적화

## 다음 단계
- VIP 개인 페이지 (`/ranking/vip/[userId]`) 디자인 개선
- 메인 페이지 RankingBoard 컴포넌트 스타일 통일
- 애니메이션 성능 최적화 (reduce motion 지원)
