-- =============================================================
-- RG Family: 누락된 RPC 함수 추가
-- =============================================================

-- update_donation_total: 후원 등록 시 프로필 총 후원금 업데이트
create or replace function public.update_donation_total(
  p_donor_id uuid,
  p_amount integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_donor_id is null then
    return;
  end if;

  update public.profiles
  set total_donation = coalesce(total_donation, 0) + p_amount
  where id = p_donor_id;
end;
$$;

-- 권한 부여
grant execute on function public.update_donation_total(uuid, integer) to authenticated;

-- =============================================================
-- 추가 유틸리티 함수
-- =============================================================

-- recalculate_donation_total: 특정 사용자의 총 후원금 재계산
create or replace function public.recalculate_donation_total(
  p_donor_id uuid
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_total bigint;
begin
  if p_donor_id is null then
    return 0;
  end if;

  select coalesce(sum(amount), 0) into v_total
  from public.donations
  where donor_id = p_donor_id;

  update public.profiles
  set total_donation = v_total
  where id = p_donor_id;

  return v_total;
end;
$$;

-- recalculate_all_donation_totals: 모든 사용자 총 후원금 재계산 (관리자 전용)
create or replace function public.recalculate_all_donation_totals()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer := 0;
  v_donor record;
begin
  -- 모든 고유 donor_id에 대해 재계산
  for v_donor in (
    select distinct donor_id
    from public.donations
    where donor_id is not null
  )
  loop
    perform public.recalculate_donation_total(v_donor.donor_id);
    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;

-- 권한 부여
grant execute on function public.recalculate_donation_total(uuid) to authenticated;
grant execute on function public.recalculate_all_donation_totals() to authenticated;

-- =============================================================
-- View Count 증가 함수들
-- =============================================================

-- increment_notice_view_count: 공지사항 조회수 증가
create or replace function public.increment_notice_view_count(notice_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.notices
  set view_count = coalesce(view_count, 0) + 1
  where id = notice_id;
end;
$$;

-- increment_post_view_count: 게시글 조회수 증가
create or replace function public.increment_post_view_count(post_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.posts
  set view_count = coalesce(view_count, 0) + 1
  where id = post_id;
end;
$$;

-- increment_signature_view_count: 시그니처 조회수 증가
create or replace function public.increment_signature_view_count(sig_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.signatures
  set view_count = coalesce(view_count, 0) + 1
  where id = sig_id;
end;
$$;

-- increment_media_view_count: 미디어 콘텐츠 조회수 증가
create or replace function public.increment_media_view_count(media_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.media_content
  set view_count = coalesce(view_count, 0) + 1
  where id = media_id;
end;
$$;

-- 권한 부여
grant execute on function public.increment_notice_view_count(bigint) to anon, authenticated;
grant execute on function public.increment_post_view_count(bigint) to anon, authenticated;
grant execute on function public.increment_signature_view_count(bigint) to anon, authenticated;
grant execute on function public.increment_media_view_count(bigint) to anon, authenticated;

-- =============================================================
-- 랭킹 관련 함수
-- =============================================================

-- get_season_rankings: 시즌별 랭킹 조회 (집계 쿼리)
create or replace function public.get_season_rankings(
  p_season_id bigint default null,
  p_limit integer default 50
)
returns table(
  rank bigint,
  donor_name text,
  total_amount bigint,
  unit text
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return query
    with donation_totals as (
      select
        d.donor_name,
        sum(d.amount)::bigint as total_amount,
        (array_agg(d.unit order by d.created_at desc))[1] as unit
      from public.donations d
      where (p_season_id is null or d.season_id = p_season_id)
      group by d.donor_name
    )
    select
      row_number() over (order by dt.total_amount desc)::bigint as rank,
      dt.donor_name,
      dt.total_amount,
      dt.unit::text
    from donation_totals dt
    order by dt.total_amount desc
    limit p_limit;
end;
$$;

grant execute on function public.get_season_rankings(bigint, integer) to anon, authenticated;
