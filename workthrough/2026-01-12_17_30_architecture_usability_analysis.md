# 아키텍처 실용성 분석 보고서

## 개요
"스키마 일치 여부가 아닌, 실제 사용 가능하고 관리 가능한 구조인지" 분석한 결과입니다.

---

## 핵심 발견사항

### 1. 데이터 접근 구조 (Two-Layer Architecture)

```
┌─────────────────────────────────────────────────────┐
│                    Public Pages                      │
│          (ranking, org, sig, schedule...)           │
├─────────────────────────────────────────────────────┤
│              Repository Pattern (READ-ONLY)          │
│    IDataProvider → MockDataProvider / Supabase      │
├─────────────────────────────────────────────────────┤

┌─────────────────────────────────────────────────────┐
│                    Admin Pages                       │
│      (seasons, members, notices, donations...)      │
├─────────────────────────────────────────────────────┤
│          Direct Supabase Calls (CRUD)               │
│         useAdminCRUD / useDonationsData             │
└─────────────────────────────────────────────────────┘
```

**평가**: ✅ 적절한 설계
- Public READ는 Repository로 캐싱/추상화 가능
- Admin WRITE는 직접 호출로 실시간 반영
- 두 레이어가 명확히 분리됨

---

## 운영 준비 상태

### 🔴 CRITICAL: RLS 마이그레이션 미실행

| 마이그레이션 파일 | 상태 | 영향 |
|------------------|------|------|
| `20250112_init_schema.sql` | ✅ 실행됨 | 테이블 생성 완료 |
| `20260112_rls_vip_live.sql` | ❌ **미실행** | Admin CRUD 불가 |
| `20260112_create_guestbook_table.sql` | ❌ 미실행 | Tribute 기능 불가 |

**`20260112_rls_vip_live.sql` 미실행 시 문제점:**

```sql
-- 이 함수들이 없으면:
is_staff(user_id uuid)     -- ❌ Admin 권한 체크 실패
is_vip_user(user_id uuid)  -- ❌ VIP 접근 제어 실패
get_user_rank()            -- ❌ 랭킹 계산 불가
```

**결과**: Admin 페이지에서 INSERT/UPDATE/DELETE 시 **RLS 정책 위반 에러** 발생

---

### 🟠 HIGH: 누락된 RPC 함수

`useDonationsData.ts:119` 에서 호출하는 함수:
```typescript
await supabase.rpc('update_donation_total', {
  p_donor_id: donation.donorId,
  p_amount: donation.amount,
})
```

**문제**: `update_donation_total` 함수가 마이그레이션에 **없음**!

**영향**:
- 후원 등록은 됨
- 하지만 `profiles.total_donation` 자동 업데이트 **안됨**
- 랭킹 집계가 실시간으로 반영되지 않음

**해결**: RPC 함수 추가 필요
```sql
create or replace function public.update_donation_total(
  p_donor_id uuid,
  p_amount integer
)
returns void
language plpgsql
security definer
as $$
begin
  update public.profiles
  set total_donation = coalesce(total_donation, 0) + p_amount
  where id = p_donor_id;
end;
$$;
```

---

## FK 관계 실용성 평가

### ✅ donations.season_id → seasons.id

| 항목 | 상태 |
|------|------|
| FK 제약 | ✅ 적용됨 |
| NULL 허용 | ❌ 필수값 |
| 관리 흐름 | ✅ 적절함 |

**흐름**:
1. 시즌 먼저 생성 (Admin > 시즌 관리)
2. 후원 등록 시 시즌 선택 (기본값: 최신 시즌)
3. CSV 업로드 시 활성 시즌 자동 적용

**실용적**: 시즌 없이 후원 등록 불가 → 데이터 무결성 보장

### ✅ donations.donor_id → profiles.id

| 항목 | 상태 |
|------|------|
| FK 제약 | ✅ 적용됨 |
| NULL 허용 | ✅ 익명 가능 |
| 관리 흐름 | ✅ 유연함 |

**흐름**:
1. 프로필 없는 후원자 = NULL (익명)
2. CSV에서 닉네임 매칭 시 자동 연결
3. 나중에 프로필 생성 후 수동 연결 가능

**실용적**: 기존 PandaTV 데이터 마이그레이션에 적합

---

## Admin CRUD 동작 분석

### useAdminCRUD 적용 현황 (9개 페이지)

| 페이지 | 테이블 | beforeSave | validate |
|--------|--------|------------|----------|
| seasons | seasons | ✅ 다른 시즌 비활성화 | ✅ 이름 필수 |
| members | profiles | - | - |
| notices | notices | - | - |
| schedules | schedules | - | - |
| organization | organization | - | - |
| media | media_content | - | - |
| signatures | signatures | - | - |
| vip-rewards | vip_rewards | - | - |
| banners | banners | - | - |

### 특수 케이스: donations

`useDonationsData` 전용 훅 사용:
- JOIN 쿼리 필요 (profiles, seasons)
- CSV 업로드 기능
- RPC 호출 (total_donation 업데이트)

**평가**: ✅ 복잡한 로직을 전용 훅으로 분리한 것은 적절

---

## 운영 시작 전 필수 체크리스트

### 즉시 실행 필요

```bash
# 1. RLS 마이그레이션 실행 (Supabase SQL Editor)
-- 파일: supabase/migrations/20260112_rls_vip_live.sql

# 2. update_donation_total RPC 함수 추가
-- (위 SQL 참조)

# 3. Admin 계정 생성
INSERT INTO public.profiles (id, role, nickname)
VALUES ('admin-uuid-here', 'admin', '관리자');
```

### 기능별 동작 가능 여부

| 기능 | RLS 실행 전 | RLS 실행 후 |
|------|------------|------------|
| Public 페이지 조회 | ✅ | ✅ |
| Admin 시즌 추가 | ❌ RLS 에러 | ✅ |
| Admin 후원 등록 | ❌ RLS 에러 | ⚠️ total 미업데이트 |
| VIP 페이지 접근 | ❌ 함수 없음 | ✅ |
| 사용자 프로필 수정 | ❌ RLS 에러 | ✅ |

---

## 아키텍처 평가 요약

| 항목 | 점수 | 비고 |
|------|------|------|
| 코드 구조 | ⭐⭐⭐⭐ | Repository + 직접호출 분리 적절 |
| FK 설계 | ⭐⭐⭐⭐ | 실용적인 관계 설정 |
| Admin UX | ⭐⭐⭐⭐ | useAdminCRUD로 일관된 패턴 |
| 마이그레이션 | ⭐⭐ | RLS 미실행, RPC 누락 |
| 운영 준비 | ⭐⭐ | 추가 작업 필요 |

**종합 평가**: 코드 구조는 잘 설계되어 있으나, **DB 마이그레이션 미완료**로 인해 실제 운영 불가 상태

---

## 다음 단계

1. **즉시**: `20260112_rls_vip_live.sql` Supabase에서 실행
2. **즉시**: `update_donation_total` RPC 함수 추가
3. **단기**: Admin 계정 생성 및 테스트
4. **단기**: 시즌 1개 생성 후 후원 데이터 테스트

---

*분석 완료: 2026-01-12*
