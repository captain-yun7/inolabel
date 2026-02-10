# 회원가입 기능 수정

## 개요
회원가입/로그인 페이지의 무한 로딩 문제를 해결하고, Supabase에 프로필 자동 생성 트리거를 추가했습니다.

## 주요 변경사항
- **로그인/회원가입 페이지 수정**: 인증 로딩 상태 체크 제거로 폼이 즉시 표시되도록 개선
- **Supabase 트리거 추가**: 회원가입 시 `profiles` 테이블에 자동으로 레코드 생성

## 핵심 코드

### 프로필 자동 생성 트리거 (`20260116_auto_create_profile.sql`)
```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nickname, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nickname', split_part(new.email, '@', 1)),
    new.email,
    'member'::public.user_role
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 결과
- ✅ 빌드 성공 (37개 페이지)
- ✅ main 브랜치에 푸시 완료
- ✅ Supabase SQL 트리거 적용 완료

## 다음 단계
1. 배포 완료 후 회원가입 기능 테스트
2. 이메일 인증 설정 확인 (Supabase Auth 설정)
