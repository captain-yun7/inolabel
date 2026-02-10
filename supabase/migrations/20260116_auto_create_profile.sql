-- =============================================
-- Auto-create profile on user signup
-- 회원가입 시 자동으로 profiles 테이블에 레코드 생성
-- =============================================

-- 1. 트리거 함수 생성
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

-- 2. 기존 트리거 삭제 (있을 경우)
drop trigger if exists on_auth_user_created on auth.users;

-- 3. 새 트리거 생성
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. profiles 테이블 INSERT 정책 추가 (authenticated users)
-- RLS가 활성화되어 있으므로 INSERT 정책 필요
create policy "Service role can insert profiles"
  on public.profiles for insert
  with check (true);

-- 5. 참고: 이 트리거는 Supabase Auth signup 시 자동 실행됨
-- nickname은 signUp 시 options.data.nickname 으로 전달됨
