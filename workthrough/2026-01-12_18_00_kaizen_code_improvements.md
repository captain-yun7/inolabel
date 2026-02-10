# Kaizen 코드 개선 (K-019, K-020)

## 개요
아키텍처 분석에서 발견된 코드 레벨 문제점들을 개선했습니다.

## 주요 변경사항

### 1. useAdminCRUD RLS 에러 메시지 개선 (K-019)

**파일**: `src/lib/hooks/useAdminCRUD.ts`

**Before**:
```typescript
alert('등록에 실패했습니다.')
```

**After**:
```typescript
function getRLSErrorMessage(error: PostgrestError, action: string): string {
  // RLS 정책 위반
  if (code === '42501' || message.includes('permission denied')) {
    return `${action} 권한이 없습니다. 관리자 계정으로 로그인했는지 확인하세요.`
  }
  // FK 제약 위반
  if (code === '23503' || message.includes('foreign key')) {
    return `연결된 데이터가 존재합니다. 먼저 관련 데이터를 삭제해주세요.`
  }
  // ...
}
```

**효과**: 사용자가 에러 원인을 명확히 알 수 있음

### 2. useDonationsData RPC 에러 핸들링 (K-020)

**파일**: `src/lib/hooks/useDonationsData.ts`

**Before**:
```typescript
// RPC 호출 실패 시 무시됨
await supabase.rpc('update_donation_total', {...})
```

**After**:
```typescript
const { error: rpcError } = await supabase.rpc('update_donation_total', {...})
if (rpcError) {
  console.warn('총 후원금 업데이트 실패 (RPC 함수 미설치?):', rpcError.message)
}
```

**효과**: RPC 함수 미설치 시에도 후원 등록은 성공, 경고만 출력

### 3. Supabase 통합 설정 스크립트

**파일**: `scripts/supabase-setup.sql`

기존 3개 마이그레이션 파일을 통합한 단일 실행 스크립트:
- Helper Functions (is_admin, is_staff, is_vip_user)
- RPC Functions (update_donation_total, recalculate_*)
- RLS Policies (15개 테이블)
- 초기 데이터 (첫 번째 시즌)

## 결과

| 항목 | Before | After |
|------|--------|-------|
| RLS 에러 메시지 | "등록에 실패했습니다" | 권한/FK/인증 구분 |
| RPC 에러 | 무시 (silent fail) | warn 로그 + 계속 진행 |
| 설정 스크립트 | 3개 파일 | 1개 통합 파일 |

## 빌드 검증
```
✓ Compiled successfully in 3.6s
✓ 32 pages generated
```

## 다음 단계
사용자가 Supabase SQL Editor에서 실행 필요:
1. `scripts/supabase-setup.sql` 실행
2. Admin 계정 생성 (profiles 테이블에 role='admin' INSERT)
