# 랭킹 포디움 디자인 개선 및 링크 버그 수정

## 개요
랭킹 페이지의 포디움 디자인을 개선하고, 2/3위를 동일한 엘리트 스타일로 통일했습니다. 또한 프로필 사진 없이도 화려한 닉네임 이니셜을 표시하도록 개선하고, Top 3만 개인 페이지 링크를 제공하도록 수정했습니다.

## 주요 변경사항

### 디자인 개선
- **1위**: Gold Champion 스타일 유지 (특별 대우)
- **2,3위**: 동일한 Elite 스타일 (Platinum/White 톤)
  - silver/bronze 차별화 제거
  - 차별감 없는 동등한 프리미엄 디자인
- **닉네임 이니셜**: 아바타 없을 때 화려한 그라데이션 이니셜 표시
  - 1위: Gold Gradient + Shimmer 애니메이션
  - 2,3위: Elegant White/Platinum Gradient

### 버그 수정
- **링크 경로 수정**: `/ranking/vip/${id}` → `/ranking/${id}` (올바른 라우트)
- **4위 이하 링크 제거**: Top 3만 개인 페이지 접근 가능

## 핵심 코드

```typescript
// 2,3위 동일 스타일
const getRankClass = (rank: number) => {
  if (rank === 1) return styles.rank1;
  return styles.elite; // 2위, 3위 동일
};

// Top 3만 링크 제공
const isTop3 = item.rank >= 1 && item.rank <= 3;
if (isTop3 && item.donorId) {
  return <Link href={`/ranking/${item.donorId}`}>...</Link>;
}
```

## 결과
- ✅ 빌드 성공 (29 pages)
- ✅ 1위만 Gold 특별 디자인
- ✅ 2,3위 동일한 Elite 디자인
- ✅ 닉네임 이니셜 화려하게 표시
- ✅ Top 3만 개인 페이지 링크

## 다음 단계
- 포디움 및 리스트 실제 브라우저 테스트
- 모바일 반응형 디자인 검증
- VIP 랭킹 페이지에도 동일 스타일 적용 검토
