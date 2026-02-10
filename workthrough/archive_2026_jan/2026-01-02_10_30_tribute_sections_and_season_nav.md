# VIP 헌정 페이지 섹션 추가 및 시즌 버튼 위치 변경

## 개요

개인 VIP 헌정 페이지(`/ranking/[userId]`)에 누락된 멤버 감사 영상, 갤러리, 시그니처 섹션을 추가하고, 랭킹 페이지의 "시즌별 랭킹 보러가기" 버튼을 더 적절한 위치(필터 영역)로 이동했습니다.

## 주요 변경사항

### 1. 데이터 구조 확장 (`hall-of-fame.ts`)
- `TributeMemberVideo` 인터페이스 추가: 멤버별 감사 영상 정보
- `TributeSignature` 인터페이스 추가: VIP 전용 시그니처 리액션
- `HallOfFameHonor` 확장:
  - `tributeImages?: string[]` - 복수 이미지 지원
  - `memberVideos?: TributeMemberVideo[]` - 멤버 감사 영상 배열
  - `exclusiveSignatures?: TributeSignature[]` - 시그니처 리액션 배열

### 2. 헌정 페이지 섹션 추가 (`/ranking/[userId]/page.tsx`)
- **멤버 감사 영상 섹션**: 3-column 그리드, 유닛 뱃지 표시
- **갤러리 섹션**: 복수 이미지 그리드 + 호버 오버레이
- **VIP 시그니처 섹션**: 멤버별 시그니처 리액션 카드
- **Empty State**: 각 섹션별 Admin 업로드 안내 플레이스홀더

### 3. 시즌 버튼 위치 변경 (`/ranking/page.tsx`)
- Hero 섹션에서 제거
- Filters 섹션 우측으로 이동 (unitFilter | seasonNav 레이아웃)
- 현재 시즌 표시 + 시즌별 랭킹 링크 버튼

## 핵심 코드

```typescript
// 새 데이터 타입
interface TributeMemberVideo {
  id: string
  memberName: string
  memberUnit: 'excel' | 'crew'
  message: string
  videoUrl?: string
  thumbnailUrl?: string
}

// 필터 섹션 레이아웃
<div className={styles.filters}>
  <div className={styles.unitFilter}>...</div>
  <div className={styles.seasonNav}>
    <span className={styles.currentSeason}>
      <span className={styles.seasonLive} />
      {currentSeason.name}
    </span>
    <Link href="/ranking/season" className={styles.seasonBtn}>
      <Calendar size={12} />
      <span>시즌별 랭킹</span>
    </Link>
  </div>
</div>
```

## 결과

- ✅ 빌드 성공 (30/30 pages)
- ✅ VIP 헌정 페이지에 4개 섹션 추가 (멤버 영상, 갤러리, 시그니처, Empty State)
- ✅ 시즌 버튼 필터 영역으로 재배치

## 다음 단계

- Admin CMS에서 멤버 감사 영상/시그니처 업로드 기능 구현
- 실제 영상 URL 연동 (현재 Mock 데이터)
- 갤러리 이미지 라이트박스 모달 추가
