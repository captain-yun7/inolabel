# Mock 데이터 모듈화 리팩토링

## 개요
1130줄 단일 파일(data.ts)을 12개 도메인별 모듈로 분리했습니다. Clean Architecture 원칙에 따라 각 도메인이 독립적인 파일로 관리되며, 기존 import 경로와의 하위 호환성을 유지합니다.

## 주요 변경사항

### 개발한 것
- `src/lib/mock/utils.ts` - 공통 유틸리티 (플레이스홀더 생성)
- `src/lib/mock/profiles.ts` - 후원자 프로필
- `src/lib/mock/seasons.ts` - 시즌 정보
- `src/lib/mock/organization.ts` - 조직도 멤버
- `src/lib/mock/donations.ts` - 후원 내역
- `src/lib/mock/signatures.ts` - 시그니처 콘텐츠
- `src/lib/mock/schedules.ts` - 일정 캘린더
- `src/lib/mock/timeline.ts` - 타임라인 이벤트
- `src/lib/mock/notices.ts` - 공지사항
- `src/lib/mock/posts.ts` - 커뮤니티 게시글
- `src/lib/mock/media.ts` - Shorts/VOD 미디어
- `src/lib/mock/live-status.ts` - 라이브 상태
- `src/lib/mock/banners.ts` - 히어로 배너
- `src/lib/mock/index.ts` - 중앙 re-export

### 개선한 것
- 1130줄 → 12개 모듈로 분리 (평균 ~80줄/파일)
- 도메인별 독립적 관리 가능
- 하위 호환성 유지 (`data.ts`는 re-export)

## 새 구조

```
src/lib/mock/
├── index.ts          # 중앙 export + 헬퍼 함수
├── utils.ts          # 공통 유틸리티
├── profiles.ts       # Profile[]
├── seasons.ts        # Season[]
├── organization.ts   # Organization[]
├── donations.ts      # Donation[]
├── signatures.ts     # Signature[]
├── schedules.ts      # Schedule[]
├── timeline.ts       # TimelineEvent[]
├── notices.ts        # Notice[]
├── posts.ts          # Post[]
├── media.ts          # MediaContent[]
├── live-status.ts    # LiveStatus[]
├── banners.ts        # MockBanner[]
└── data.ts           # (deprecated) 하위 호환용
```

## 사용법

```typescript
// 권장 (새 방식)
import { mockProfiles, mockSeasons } from '@/lib/mock'

// 하위 호환 (기존 코드 유지)
import { mockProfiles } from '@/lib/mock/data'
```

## 결과
- ✅ 빌드 성공 (29개 페이지)
- ✅ 기존 import 경로 호환
- ✅ TypeScript 타입 검증 통과

## 다음 단계
- `data.ts` import를 `index.ts`로 점진적 마이그레이션
- 각 모듈에 Factory 함수 추가 (동적 데이터 생성)
- Mock 데이터 JSON 파일 분리 고려
