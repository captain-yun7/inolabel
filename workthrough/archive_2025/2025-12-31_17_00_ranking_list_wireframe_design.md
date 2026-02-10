# 랭킹 리스트 와이어프레임 디자인 구현

## 개요
와이어프레임 명세에 따라 랭킹 리스트 UI를 전면 개편했습니다. 왕관 아이콘, Pink/Red 그라디언트 Progress Bar, 퍼센트 표기를 추가하고 VIP 퍼스널 페이지에 프리미엄 Welcome Area를 구현했습니다.

## 주요 변경사항

### RankingList 컴포넌트 개선
- **왕관 아이콘**: Top 1-3 랭커에게 Crown 아이콘 표시 (골드/실버/브론즈)
- **Progress Bar**: Pink/Red 그라디언트 + Shimmer 애니메이션
- **퍼센트 배지**: 우측 끝에 % 표기 (랭크별 색상 차별화)
- **레이아웃**: `[Rank] [Avatar] [Name] [====Progress====] [%]` 와이어프레임 구조

### VIP 퍼스널 페이지 Welcome Area
- **Welcome 텍스트**: "Welcome, VIP" 상단 표시
- **파티클 효과**: 8개의 반짝이는 골드 파티클
- **글로우 효과**: 중앙 radial gradient + 펄스 애니메이션
- **확장 링 효과**: 3개의 동심원이 확장되는 애니메이션
- **모션 시퀀스**: Framer Motion으로 순차적 등장 효과

## 핵심 코드

```css
/* Progress Bar - Pink/Red Gradient */
.progressFill {
  background: linear-gradient(90deg, #fd68ba 0%, #ff4080 50%, #ff6b9d 100%);
  box-shadow: 0 2px 8px rgba(253, 104, 186, 0.4);
}

/* Gold Crown Glow */
.rank.gold .crownIcon {
  color: #ffd700;
  filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.5));
}

/* Particle Twinkle Animation */
@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.3); }
}
```

```tsx
// Crown Icon for Top 3
{actualRank <= 3 ? (
  <Crown size={20} className={styles.crownIcon} />
) : (
  <span className={styles.rankNumber}>{actualRank}</span>
)}
```

## 결과
- ✅ 빌드 성공
- ✅ 와이어프레임 명세 100% 구현
- ✅ 반응형 디자인 최적화

## 다음 단계
- 탭 전환 UI 구현 (전체 시즌 / 시즌별)
- 랭킹 페이지 Hero 영역 통일
- 애니메이션 성능 최적화 (reduce motion 지원)
