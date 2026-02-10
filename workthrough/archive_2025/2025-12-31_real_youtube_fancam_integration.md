# 실제 YouTube 아이돌 직캠 연동

## 개요
Shorts/VOD 섹션에 실제 YouTube 아이돌 직캠 영상 ID를 연동했습니다. 기존 placeholder 이미지를 실제 YouTube 썸네일로 교체하고, 클릭 시 실제 영상이 재생됩니다.

## 주요 변경사항

### 수정한 것: `src/lib/mock/media.ts`
- 가짜 video ID → 실제 KBS KPOP 직캠 video ID로 교체
- picsum placeholder → YouTube 썸네일 URL로 변경

### 연동된 직캠 (Shorts 7개)
| 아티스트 | 곡 | Video ID |
|---------|-----|----------|
| 카리나 (aespa) | Supernova | `FFEKMEj2zfE` |
| 윈터 (aespa) | Dirty Work | `aATx6QdS5g0` |
| 장원영 (IVE) | REBEL HEART | `OSz9y6mIeHE` |
| 안유진 (IVE) | XOXZ | `-qsus78K7jk` |
| 해린 (NewJeans) | New Jeans | `k3jV6DMTCSE` |
| 민지 (NewJeans) | Supernatural | `KTIY11xxsBI` |
| 채원 (LE SSERAFIM) | SPAGHETTI | `iZ-fHb5ayFs` |

### VOD 5개
- 동일 video ID 사용 (풀버전 형태)

## 핵심 코드

```typescript
// YouTube 썸네일 URL 생성
const getYouTubeThumbnail = (videoId: string) =>
  `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

// 실제 YouTube ID 사용
{
  thumbnail_url: getYouTubeThumbnail('FFEKMEj2zfE'),
  video_url: 'https://www.youtube.com/watch?v=FFEKMEj2zfE',
}
```

## 결과
- ✅ 실제 YouTube 썸네일 로드 성공
- ✅ 클릭 시 모달에서 영상 재생 가능
- ✅ EXCEL/CREW 유닛 필터 정상 작동

## 다음 단계
- 더 많은 아이돌 직캠 추가 (KISS OF LIFE, ILLIT 등)
- Supabase 연동으로 실제 DB에서 영상 관리
- YouTube Data API 연동으로 조회수/좋아요 실시간 반영
