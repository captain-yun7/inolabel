# 랭킹 페이지 통계 제거 및 프리미엄 UI 적용

## 개요
사용자 요청에 따라 총 후원 하트/후원자 수 통계 표시를 제거하고, 전체 랭킹 및 시즌별 랭킹 페이지에 프리미엄 미니멀 디자인을 적용했습니다.

## 주요 변경사항

### 제거한 것
- **statsSection 제거**: 총 후원 하트, 후원자 수, D-day 통계 카드 완전 제거
- **불필요 변수 제거**: `totalDonations`, `totalDonors` 변수 삭제

### 개선한 것
- **프리미엄 히어로 섹션**: 70vh 높이의 드라마틱한 히어로 + 스크롤 인디케이터
- **미니멀 네비게이션**: fixed 투명 그라데이션 네비게이션 바
- **시즌 메타정보**: 날짜 + D-day를 히어로 내 심플하게 표시
- **프리미엄 섹션 카드**: backdrop-filter + 상단 그라데이션 라인

### 파일 변경
- `src/app/ranking/season/[id]/page.tsx`: statsSection 제거, 프리미엄 UI 구조 적용
- `src/app/ranking/season/[id]/page.module.css`: 완전 재작성 (Premium Minimal Design)

## 핵심 코드

```typescript
// 시즌 페이지 - 통계 변수 제거
const top50 = rankings.slice(0, 50)
const top3 = top50.slice(0, 3)
// totalDonations, totalDonors 완전 제거

// 히어로 내 시즌 메타정보 (간결)
<div className={styles.seasonMeta}>
  <span className={styles.dateRange}>
    <Calendar size={14} />
    {formatDate(selectedSeason.start_date)} ~ ...
  </span>
  {daysRemaining > 0 && (
    <span className={styles.daysLeft}>D-{daysRemaining}</span>
  )}
</div>
```

```css
/* 프리미엄 히어로 - Green 글로우 (시즌 전용) */
.hero::before {
  background: radial-gradient(
    ellipse 60% 50% at 50% 30%,
    rgba(34, 197, 94, 0.1) 0%,
    transparent 60%
  );
}

/* 시즌 배지 - 그린 테마 */
.sectionBadge {
  color: var(--success);
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
}
```

## 결과
- ✅ 빌드 성공 (29 pages)
- ✅ 통계 섹션 완전 제거
- ✅ 전체 랭킹/시즌 랭킹 디자인 통일
- ✅ 시즌 페이지만 Green 테마로 차별화

## 다음 단계
- VIP 랭킹 페이지에도 동일한 프리미엄 스타일 적용 검토
- 모바일 반응형 디자인 실제 기기 테스트
- 애니메이션 성능 최적화 (Framer Motion)
