# VIP 페이지 - Context 통합 및 Mock 데이터 추가

## 개요
VIP 전용 페이지를 새로운 Clean Architecture Context 시스템과 통합하고, VIP 콘텐츠용 Mock 데이터를 추가했습니다.

## 주요 변경사항

### 개발한 것
- `src/lib/mock/vip-content.ts` - VIP 전용 Mock 데이터 모듈
  - `VipMemberVideo` - 멤버 감사 영상 타입
  - `VipSignature` - VIP 시그니처 타입
  - `VipContent` - VIP 콘텐츠 통합 타입
  - `VipRewardData` - Top 1-3 헌정 페이지 데이터
  - `getVipRewardByProfileId()` - 프로필 ID로 VIP 보상 조회
  - `getVipRewardByRank()` - 순위로 VIP 보상 조회

### 개선한 것
- **VIP 라운지 페이지** (`/ranking/vip`)
  - `useAuth` → `useAuthContext` 마이그레이션
  - Mock 데이터 시스템 통합 (`USE_MOCK_DATA` 활용)
  - Mock 모드에서 항상 VIP로 표시 (개발 편의)

- **VIP 개인 페이지** (`/ranking/vip/[userId]`)
  - `useSupabase` → `useSupabaseContext` 마이그레이션
  - Mock 프로필 및 보상 데이터 연동
  - Top 1-3 골드/실버/브론즈 테마 유지

### 수정한 것
- `src/lib/mock/index.ts` - VIP 콘텐츠 export 추가

## VIP 시스템 구조

```
/ranking/vip                    # VIP 라운지 (Top 50)
├── 접근 제어 (로그인 + 랭킹 50위 이내)
├── 멤버 감사 영상 섹션
├── VIP SECRET 시그니처 섹션
├── FROM RG FAMILY 메시지
├── Top 1-3 Secret Page 배너
└── VIP 멤버 목록

/ranking/vip/[userId]           # Top 1-3 헌정 페이지
├── 프로필 Hero (골드/실버/브론즈 테마)
├── 개인 메시지 (TO. 닉네임)
├── 헌정 영상
├── 스페셜 기프트 이미지
└── 후원 히스토리
```

## Mock 데이터 구조

```typescript
// VIP 콘텐츠 (라운지용)
mockVipContent = {
  memberVideos: VipMemberVideo[],
  thankYouMessage: string,
  signatures: VipSignature[],
}

// VIP 보상 (개인 페이지용)
mockVipRewards = [
  { profileId, rank: 1, personalMessage, giftImages, ... },
  { profileId, rank: 2, personalMessage, giftImages, ... },
  { profileId, rank: 3, personalMessage, giftImages, ... },
]
```

## 결과
- ✅ 빌드 성공 (29 페이지)
- ✅ Context 시스템 통합 완료
- ✅ Mock 데이터 시스템 연동
- ✅ Top 1-3 테마 스타일 유지

## 다음 단계
- Admin에서 VIP 보상 데이터 관리 기능 (이미 `/admin/vip-rewards` 존재)
- 실제 Supabase 연동 시 `USE_MOCK_DATA=false`로 전환
- 헌정 영상 업로드 기능
