# Supabase 설정 가이드

> 운영 전 필수 설정 체크리스트

## 현재 상태

| 항목 | 상태 | 비고 |
|------|------|------|
| Supabase 프로젝트 | ✅ | eilwlpxvjwyidqjjypqo |
| 테이블 생성 | ⚠️ | 일부 테이블만 생성됨 |
| RLS 정책 | ❌ | 마이그레이션 실행 필요 |
| Helper 함수 | ❌ | 마이그레이션 실행 필요 |
| Admin 계정 | ❌ | 생성 필요 |

---

## 1. 마이그레이션 실행 (순서대로)

Supabase Dashboard → SQL Editor에서 실행

### Step 1: 초기 스키마 (테이블 + RLS 기본)
```sql
-- 파일: supabase/migrations/20250112_init_schema.sql
-- 전체 내용 복사하여 실행
```

### Step 2: 배너 테이블
```sql
-- 파일: supabase/migrations/20241229_create_banners_table.sql
-- 전체 내용 복사하여 실행
```

### Step 3: RLS 정책 + Helper 함수 (중요!)
```sql
-- 파일: supabase/migrations/20260112_rls_vip_live.sql
-- 전체 내용 복사하여 실행
-- 포함 내용:
--   - is_admin(), is_staff(), is_vip_user() 함수
--   - get_user_rank(), get_active_season_id() 함수
--   - 모든 테이블 RLS 정책 재정의
```

### Step 4: 방명록 테이블 (Tribute 페이지용)
```sql
-- 파일: supabase/migrations/20260112_create_guestbook_table.sql
-- 전체 내용 복사하여 실행
```

---

## 2. Admin 계정 생성

### Option A: Supabase Dashboard에서 생성

1. **Authentication → Users → Add User**
2. 이메일/비밀번호로 사용자 생성
3. **Table Editor → profiles**에서 해당 user의 role을 'admin'으로 변경

### Option B: SQL로 직접 생성

```sql
-- 1. Auth 사용자 생성 (Supabase Auth API 사용)
-- Dashboard → Authentication → Users → Add User

-- 2. 생성된 사용자 UUID 확인 후 profiles에 admin 역할 부여
UPDATE public.profiles
SET role = 'admin', nickname = '관리자'
WHERE id = 'USER_UUID_HERE';

-- 또는 새 프로필 삽입
INSERT INTO public.profiles (id, nickname, role)
VALUES ('USER_UUID_HERE', '관리자', 'admin');
```

### 역할 종류

| role | 권한 |
|------|------|
| `user` | 일반 사용자 |
| `vip` | VIP 콘텐츠 접근 |
| `moderator` | Staff 권한 (CMS 접근) |
| `admin` | 전체 관리 권한 |
| `superadmin` | 최고 권한 |

---

## 3. 환경 변수 설정

### 로컬 (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://eilwlpxvjwyidqjjypqo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxx
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxx
NEXT_PUBLIC_USE_MOCK_DATA=false

# 라이브 상태 API 보안
LIVE_STATUS_API_SECRET=your-secure-random-string
```

### Vercel (Production)

Dashboard → Settings → Environment Variables:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | https://eilwlpxvjwyidqjjypqo.supabase.co | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | sb_publishable_xxx | All |
| `SUPABASE_SERVICE_ROLE_KEY` | sb_secret_xxx | Production |
| `NEXT_PUBLIC_USE_MOCK_DATA` | false | Production |
| `LIVE_STATUS_API_SECRET` | (generate) | Production |

---

## 4. 초기 데이터 시딩

```bash
# 로컬에서 실행
npm run db:seed
```

시딩되는 데이터:
- seasons: 4개 시즌
- organization: 14명 멤버
- notices: 3개 공지사항

---

## 5. 검증 체크리스트

### 마이그레이션 검증
```sql
-- 함수 존재 확인
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION';

-- 예상 결과: handle_updated_at, update_donation_total, is_admin,
-- is_staff, is_vip_user, get_user_rank, get_active_season_id 등
```

### RLS 정책 확인
```sql
-- RLS 정책 목록
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
```

### 테이블 데이터 확인
```sql
SELECT 'seasons' as table_name, count(*) FROM seasons
UNION ALL
SELECT 'organization', count(*) FROM organization
UNION ALL
SELECT 'notices', count(*) FROM notices
UNION ALL
SELECT 'profiles', count(*) FROM profiles;
```

---

## 6. 문제 해결

### "permission denied" 에러
- RLS 정책이 적용되지 않았거나 사용자 권한 부족
- 해결: RLS 마이그레이션 재실행

### "function does not exist" 에러
- Helper 함수가 생성되지 않음
- 해결: `20260112_rls_vip_live.sql` 실행

### Admin 페이지 접근 불가
- profiles에 admin 역할이 없음
- 해결: 위 Admin 계정 생성 섹션 참고

---

## 관련 문서

- `/docs/DEVELOPER_COLLABORATION_GUIDE.md`: 개발자 협업 가이드
- `/docs/SUPABASE_SCHEMA.md`: DB 스키마 상세
- `/supabase/migrations/`: SQL 마이그레이션 파일
