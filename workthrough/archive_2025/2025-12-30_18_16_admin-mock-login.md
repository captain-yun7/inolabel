# Admin Mock 로그인 기능 구현

## 개요
개발 모드(Mock 데이터 사용 시)에서 admin/admin 계정으로 어드민 페이지에 접근할 수 있도록 구현했습니다.

## 주요 변경사항

### 1. Mock Admin 프로필 추가
- `mockAdminProfile` 생성 (role: 'superadmin')
- `mockProfiles` 배열에 포함

### 2. AuthContext Mock 로그인 기능
- `USE_MOCK_DATA=true` 환경에서 admin/admin 로그인 지원
- Mock User, Session 객체 생성
- Mock 로그아웃 처리

## 사용 방법

### 로그인
1. `/login` 페이지 접속
2. 이메일: `admin` 또는 `admin@rgfamily.com`
3. 비밀번호: `admin`
4. 로그인 후 `/admin` 페이지 접근 가능

### 권한
- Role: `superadmin`
- Admin CMS 11개 페이지 모두 접근 가능

## 수정된 파일
- `src/lib/mock/profiles.ts` - mockAdminProfile 추가
- `src/lib/mock/index.ts` - export 추가
- `src/lib/context/AuthContext.tsx` - Mock 로그인/로그아웃 로직

## 결과
- 빌드 성공 (29개 페이지)
- Mock 모드에서 admin/admin 로그인 가능
- 어드민 페이지 접근 권한 정상 작동

## 다음 단계
- 실제 Supabase Admin 계정 설정
- Admin 로그아웃 버튼 UI 개선
