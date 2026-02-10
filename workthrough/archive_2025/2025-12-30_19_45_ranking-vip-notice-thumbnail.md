# Ranking VIP 탭 추가 및 Notice 썸네일 구현

## 개요
레퍼런스 디자인에 맞춰 Ranking 페이지에 VIP 탭 필터를 추가하고, Notice 섹션에 게시글 첨부 이미지 썸네일을 표시하도록 개선했습니다.

## 주요 변경사항

### Ranking VIP 탭
- `UnitFilter` 타입에 'vip' 추가
- Ranking 탭: 전체 / 엑셀 / 크루 / VIP (4개)
- VIP 필터: 전체 랭킹에서 Top 50만 표시

### Notice 썸네일
- 게시글에 첨부된 이미지가 있으면 썸네일로 표시
- 이미지 없는 경우 기존 "RG" 로고 폴백
- CSS에 누락된 스타일(.line, .viewAll, .list) 추가

## 핵심 코드

```typescript
// types/common.ts - VIP 필터 타입
export type UnitFilter = 'all' | 'excel' | 'crew' | 'vip'

// useRanking.ts - VIP 필터 로직
if (unitFilter === 'vip') {
  sorted = sorted.slice(0, 50)
}

// Notice.tsx - 썸네일 조건부 렌더링
{notice.thumbnailUrl ? (
  <div className={styles.itemThumbnail}>
    <Image src={notice.thumbnailUrl} alt={notice.title} fill />
  </div>
) : (
  <div className={styles.itemLogo}>RG</div>
)}
```

## 수정된 파일
- `src/types/common.ts` - UnitFilter 타입 확장
- `src/app/ranking/total/page.tsx` - VIP 탭 버튼 추가
- `src/lib/hooks/useRanking.ts` - VIP 필터 로직
- `src/components/Notice.tsx` - 썸네일 이미지 표시
- `src/components/Notice.module.css` - 썸네일 및 누락 스타일

## 결과
- ✅ 빌드 성공 (29개 페이지)
- ✅ TypeScript 컴파일 통과
- ✅ 레퍼런스 디자인 탭 구조 일치

## 다음 단계
- RG Info 조직도 트리 구조 개선 (계층 연결선)
- 타임라인 시즌별 카드형 + 이미지 개선
- 실제 이미지 에셋 추가 (/assets/notices/)
