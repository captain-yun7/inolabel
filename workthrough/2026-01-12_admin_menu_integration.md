# Admin 메뉴 UI/UX 설계 및 프론트엔드/백엔드 연동 점검

## 개요
Admin 계정으로 로그인 시 Navbar에 Admin 메뉴 버튼이 표시되도록 UI/UX를 구현하고, 프론트엔드와 백엔드 간의 권한 체크 로직 일관성을 점검/수정했습니다.

## 주요 변경사항

### 1. Admin 메뉴 버튼 추가 (Navbar)

**데스크톱 & 모바일 모두 지원**

| 항목 | 설명 |
|------|------|
| 노출 조건 | `admin`, `superadmin`, `moderator` 역할 |
| 링크 | `/admin` |
| 아이콘 | Shield (Lucide) |
| 스타일 | 보라색 그라데이션 (VIP 버튼과 구분) |

```typescript
// 권한 확인 로직
const canAccessAdmin = useMemo(() => {
  if (!user || !profile) return false;
  return ['admin', 'superadmin', 'moderator'].includes(profile.role);
}, [user, profile]);
```

### 2. 권한 체크 로직 일관성 수정

**Before (불일치)**
| 위치 | 허용 역할 |
|------|----------|
| AdminLayout | superadmin, admin, moderator |
| checkAdminAccess() | superadmin, admin |

**After (일관성 확보)**
```typescript
// checkAdminAccess - 기본 Admin 접근 (moderator 포함)
export function checkAdminAccess(profile: Profile | null): boolean {
  if (!profile) return false
  return ['admin', 'superadmin', 'moderator'].includes(profile.role)
}

// checkFullAdminAccess - 완전한 Admin 권한만
export function checkFullAdminAccess(profile: Profile | null): boolean {
  return profile?.role === 'admin' || profile?.role === 'superadmin'
}
```

### 3. 프론트엔드/백엔드 연동 현황

| 구분 | Mock 모드 | Supabase 모드 | 상태 |
|------|-----------|--------------|------|
| **인증** | Mock Admin 계정 (admin/admin) | Supabase Auth | ✅ 동작 |
| **프로필 role** | mockAdminProfile (superadmin) | profiles.role 컬럼 | ✅ 연동됨 |
| **Admin 접근** | Mock profile 기반 | Supabase profile 기반 | ✅ 일관됨 |
| **VIP 자격** | hasHonorPageQualification() | TODO: Supabase 구현 | ⚠️ 부분 |

### 4. 역할 계층 구조

```
superadmin (최고 관리자)
    ↓
admin (일반 관리자)
    ↓
moderator (운영진) ← Admin 페이지 접근 가능
    ↓
vip (VIP 회원) ← VIP 라운지/헌정 페이지 접근
    ↓
member (일반 회원)
```

## 결과
- ✅ 빌드 성공
- ✅ Admin 버튼 Navbar 노출
- ✅ 권한 체크 로직 일관성 확보
- ✅ Mock/Supabase 양쪽 지원

## 수정된 파일
- `src/components/Navbar.tsx` - Admin 버튼 추가
- `src/components/Navbar.module.css` - Admin 버튼 스타일
- `src/lib/auth/access-control.ts` - 권한 함수 일관성 수정

## Admin 버튼 스타일

```css
.adminBtn {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(139, 92, 246, 0.25));
  border: 1px solid rgba(139, 92, 246, 0.4);
  color: #a78bfa;  /* 보라색 */
}
```

## 다음 단계
- Supabase에서 VIP 자격 확인 로직 구현
- Admin 세부 권한 분리 (moderator별 제한된 메뉴)
- Admin 활동 로깅 시스템
