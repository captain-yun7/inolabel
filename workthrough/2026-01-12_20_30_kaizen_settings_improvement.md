# Kaizen: 설정 개선 및 운영 준비 가이드

## 개요
Kaizen Board 분석을 통해 운영 전 필수 설정 항목들을 정리하고, 종합 가이드를 작성했습니다.

## 주요 변경사항

### 작성한 문서
- **`docs/SUPABASE_SETUP_GUIDE.md`**: 운영 전 필수 설정 종합 가이드
  - 마이그레이션 실행 순서
  - Admin 계정 생성 방법
  - 환경 변수 설정
  - 검증 체크리스트

### 수정한 것
- **`.env.example`**: 새로운 Supabase 키 형식 + API 보안 키 추가
- **`docs/KAIZEN_BOARD.md`**: K-013~K-018 상태 업데이트

### Kaizen Board 업데이트

| ID | 항목 | 상태 |
|----|------|------|
| K-013 | RLS 마이그레이션 | 📋 가이드 작성됨 |
| K-014 | update_donation_total | ✅ init_schema에 존재 |
| K-015 | Admin 계정 생성 | 📋 가이드 작성됨 |
| K-017 | 라이브 상태 API | ✅ Completed |
| K-018 | 설정 가이드 | ✅ Completed |

## 결과
- ✅ 빌드 성공
- ✅ 운영 전 체크리스트 문서화

## 다음 단계 (Supabase SQL Editor에서 실행 필요)

### 🔴 즉시 필요
1. `20250112_init_schema.sql` 실행 (테이블 + 기본 RLS)
2. `20260112_rls_vip_live.sql` 실행 (Helper 함수 + RLS 강화)
3. Admin 계정 생성 (profiles.role = 'admin')

### 검증 쿼리
```sql
-- 함수 확인
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_type = 'FUNCTION';

-- RLS 정책 확인
SELECT tablename, policyname FROM pg_policies
WHERE schemaname = 'public';
```
