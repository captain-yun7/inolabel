# VIP 헌정 페이지 시스템 시딩 완료

## 개요
Top 3 후원자 헌정 페이지(`/ranking/[userId]`)가 Supabase 백엔드에서 동작하도록 시드 데이터와 마이그레이션을 추가했습니다. `useTributeData` hook은 이미 Supabase 쿼리를 구현하고 있어, 시드 데이터만 추가하면 됩니다.

## 주요 변경사항

### 시드 데이터 추가 (seed-database.ts)
- `vipProfilesData`: Top 3 VIP 테스트 프로필 (5개)
- `vipRewardsData`: VIP 보상 데이터 (3개 - 시즌 4 Top 1-3)
- `vipImagesData`: VIP 전용 갤러리 이미지 (9개)
- `tributeGuestbookData`: 헌정 방명록 (4개)

### SQL 마이그레이션 추가
- `20260112_seed_vip_test_data.sql`: FK 제약 우회하여 테스트 데이터 삽입

### 타입 수정
- `IBannerRepository`: `toggleActive`, `reorder` 메서드 추가

## 테스트 사용자 ID

| 순위 | 닉네임 | UUID | 총 후원금 |
|-----|--------|------|----------|
| 1위 | 핑크하트 | `11111111-1111-1111-1111-111111111111` | 45,000,000 |
| 2위 | gul*** | `22222222-2222-2222-2222-222222222222` | 38,002,000 |
| 3위 | 영원한서포터 | `33333333-3333-3333-3333-333333333333` | 30,000,000 |

## 결과
- 빌드 성공 (35개 페이지)
- TypeScript 컴파일 성공

## 사용법

### 1. SQL 마이그레이션 실행 (Supabase Dashboard)
```sql
-- supabase/migrations/20260112_seed_vip_test_data.sql 내용 실행
```

### 2. 또는 시드 스크립트 실행
```bash
npx tsx scripts/seed-database.ts
```

### 3. 헌정 페이지 접근
- `/ranking/11111111-1111-1111-1111-111111111111` (1위 핑크하트)
- `/ranking/22222222-2222-2222-2222-222222222222` (2위 gul***)
- `/ranking/33333333-3333-3333-3333-333333333333` (3위 영원한서포터)

## 다음 단계

1. **실시간 라이브 연동**: PandaTV API → `live_status` 테이블 자동 업데이트
2. **VIP 보상 Admin**: Admin CMS에서 VIP 보상 관리 기능 확인
