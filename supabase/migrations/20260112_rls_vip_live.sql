-- =============================================================
-- RG Family: RLS normalization + VIP helpers + live status support
-- =============================================================

-- =============================================================
-- Helper functions (role / VIP / ranking)
-- =============================================================
create or replace function public.is_admin(user_id uuid)
returns boolean
language sql
stable
as $$
  select exists(
    select 1
    from public.profiles
    where id = user_id
      and role in ('admin', 'superadmin')
  );
$$;

create or replace function public.is_staff(user_id uuid)
returns boolean
language sql
stable
as $$
  select exists(
    select 1
    from public.profiles
    where id = user_id
      and role in ('moderator', 'admin', 'superadmin')
  );
$$;

create or replace function public.get_active_season_id()
returns bigint
language sql
stable
as $$
  select id
  from public.seasons
  where is_active = true
  order by start_date desc nulls last
  limit 1;
$$;

create or replace function public.get_user_rank(
  p_user_id uuid,
  p_season_id bigint default null
)
returns table(rank integer, total_amount bigint)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if p_user_id is null then
    return;
  end if;

  if p_season_id is null then
    return query
      with totals as (
        select
          donor_id,
          sum(amount)::bigint as total_amount,
          dense_rank() over (order by sum(amount) desc) as rank
        from public.donations
        where donor_id is not null
        group by donor_id
      )
      select totals.rank, totals.total_amount
      from totals
      where totals.donor_id = p_user_id;
  else
    return query
      with totals as (
        select
          donor_id,
          sum(amount)::bigint as total_amount,
          dense_rank() over (order by sum(amount) desc) as rank
        from public.donations
        where donor_id is not null
          and season_id = p_season_id
        group by donor_id
      )
      select totals.rank, totals.total_amount
      from totals
      where totals.donor_id = p_user_id;
  end if;
end;
$$;

create or replace function public.get_user_rank_active_season(
  p_user_id uuid
)
returns table(rank integer, total_amount bigint, season_id bigint)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_season_id bigint;
begin
  if p_user_id is null then
    return;
  end if;

  select public.get_active_season_id() into v_season_id;
  if v_season_id is null then
    return;
  end if;

  return query
    select r.rank, r.total_amount, v_season_id
    from public.get_user_rank(p_user_id, v_season_id) as r;
end;
$$;

grant execute on function public.get_user_rank(uuid, bigint) to anon, authenticated;
grant execute on function public.get_user_rank_active_season(uuid) to anon, authenticated;

create or replace function public.is_vip_user(user_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_rank integer;
begin
  if user_id is null then
    return false;
  end if;

  if exists (
    select 1
    from public.profiles
    where id = user_id
      and role in ('vip', 'moderator', 'admin', 'superadmin')
  ) then
    return true;
  end if;

  select rank into v_rank
  from public.get_user_rank(user_id, null)
  limit 1;

  return v_rank is not null and v_rank <= 50;
end;
$$;

-- =============================================================
-- RLS 정책 재정의
-- =============================================================

-- profiles
alter table public.profiles enable row level security;
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id or public.is_staff(auth.uid()))
  with check (auth.uid() = id or public.is_staff(auth.uid()));
drop policy if exists "Staff can insert profiles" on public.profiles;
create policy "Staff can insert profiles"
  on public.profiles for insert
  with check (public.is_staff(auth.uid()));

-- seasons
alter table public.seasons enable row level security;
drop policy if exists "Seasons are viewable by everyone" on public.seasons;
drop policy if exists "Only admins can modify seasons" on public.seasons;
create policy "Seasons are viewable by everyone"
  on public.seasons for select
  using (true);
create policy "Staff can manage seasons"
  on public.seasons for all
  using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));

-- organization
alter table public.organization enable row level security;
drop policy if exists "Organization is viewable by everyone" on public.organization;
drop policy if exists "Only admins can modify organization" on public.organization;
create policy "Organization is viewable by everyone"
  on public.organization for select
  using (is_active = true);
create policy "Staff can manage organization"
  on public.organization for all
  using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));

-- donations
alter table public.donations enable row level security;
drop policy if exists "Donations are viewable by everyone" on public.donations;
drop policy if exists "Only admins can insert donations" on public.donations;
create policy "Donations are viewable by everyone"
  on public.donations for select
  using (true);
create policy "Staff can manage donations"
  on public.donations for all
  using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));

-- vip_rewards
alter table public.vip_rewards enable row level security;
drop policy if exists "VIP rewards visible to owners and admins" on public.vip_rewards;
drop policy if exists "VIP Rewards are viewable by everyone" on public.vip_rewards;
create policy "VIP rewards visible to owners and staff"
  on public.vip_rewards for select
  using (
    profile_id = auth.uid()
    or public.is_staff(auth.uid())
  );
create policy "Staff can manage vip_rewards"
  on public.vip_rewards for all
  using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));

-- vip_images
alter table public.vip_images enable row level security;
drop policy if exists "VIP images visible to reward owners and admins" on public.vip_images;
drop policy if exists "VIP Images are viewable by everyone" on public.vip_images;
create policy "VIP images visible to owners and staff"
  on public.vip_images for select
  using (
    exists (
      select 1
      from public.vip_rewards
      where vip_rewards.id = vip_images.reward_id
        and (vip_rewards.profile_id = auth.uid() or public.is_staff(auth.uid()))
    )
  );
create policy "Staff can manage vip_images"
  on public.vip_images for all
  using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));

-- signatures
alter table public.signatures enable row level security;
drop policy if exists "Signatures are viewable by everyone" on public.signatures;
drop policy if exists "Only admins can modify signatures" on public.signatures;
create policy "Signatures are viewable by everyone"
  on public.signatures for select
  using (true);
create policy "Staff can manage signatures"
  on public.signatures for all
  using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));

-- schedules
alter table public.schedules enable row level security;
drop policy if exists "Schedules are viewable by everyone" on public.schedules;
drop policy if exists "Only admins can modify schedules" on public.schedules;
create policy "Schedules are viewable by everyone"
  on public.schedules for select
  using (true);
create policy "Staff can manage schedules"
  on public.schedules for all
  using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));

-- timeline_events
alter table public.timeline_events enable row level security;
drop policy if exists "Timeline is viewable by everyone" on public.timeline_events;
drop policy if exists "Timeline events are viewable by everyone" on public.timeline_events;
create policy "Timeline events are viewable by everyone"
  on public.timeline_events for select
  using (true);
create policy "Staff can manage timeline events"
  on public.timeline_events for all
  using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));

-- notices
alter table public.notices enable row level security;
drop policy if exists "Notices are viewable by everyone" on public.notices;
drop policy if exists "Only admins can modify notices" on public.notices;
create policy "Notices are viewable by everyone"
  on public.notices for select
  using (true);
create policy "Staff can manage notices"
  on public.notices for all
  using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));

-- posts
alter table public.posts enable row level security;
drop policy if exists "Public posts are viewable by everyone" on public.posts;
drop policy if exists "Posts are viewable by everyone" on public.posts;
drop policy if exists "Users can create posts" on public.posts;
drop policy if exists "Authenticated users can create posts" on public.posts;
drop policy if exists "Users can update own posts" on public.posts;
drop policy if exists "Users can delete own posts" on public.posts;
create policy "Posts are viewable by everyone"
  on public.posts for select
  using (
    is_deleted = false
    and (
      board_type = 'free'
      or public.is_vip_user(auth.uid())
    )
  );
create policy "Users can create posts"
  on public.posts for insert
  with check (
    auth.uid() = author_id
    and (
      board_type = 'free'
      or public.is_vip_user(auth.uid())
    )
  );
create policy "Users can update own posts"
  on public.posts for update
  using (
    auth.uid() = author_id
    or public.is_staff(auth.uid())
  )
  with check (
    auth.uid() = author_id
    or public.is_staff(auth.uid())
  );
create policy "Users can delete own posts"
  on public.posts for delete
  using (
    auth.uid() = author_id
    or public.is_staff(auth.uid())
  );

-- comments
alter table public.comments enable row level security;
drop policy if exists "Comments are viewable by everyone" on public.comments;
drop policy if exists "Users can create comments" on public.comments;
drop policy if exists "Authenticated users can create comments" on public.comments;
drop policy if exists "Users can update own comments" on public.comments;
drop policy if exists "Users can delete own comments" on public.comments;
create policy "Comments are viewable by everyone"
  on public.comments for select
  using (is_deleted = false);
create policy "Users can create comments"
  on public.comments for insert
  with check (auth.uid() = author_id);
create policy "Users can update own comments"
  on public.comments for update
  using (
    auth.uid() = author_id
    or public.is_staff(auth.uid())
  )
  with check (
    auth.uid() = author_id
    or public.is_staff(auth.uid())
  );
create policy "Users can delete own comments"
  on public.comments for delete
  using (
    auth.uid() = author_id
    or public.is_staff(auth.uid())
  );

-- media_content
alter table public.media_content enable row level security;
drop policy if exists "Media is viewable by everyone" on public.media_content;
drop policy if exists "Media content is viewable by everyone" on public.media_content;
create policy "Media content is viewable by everyone"
  on public.media_content for select
  using (true);
create policy "Staff can manage media content"
  on public.media_content for all
  using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));

-- live_status
alter table public.live_status enable row level security;
drop policy if exists "Live status is viewable by everyone" on public.live_status;
create policy "Live status is viewable by everyone"
  on public.live_status for select
  using (true);
create policy "Staff can manage live status"
  on public.live_status for all
  using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));

-- banners
alter table public.banners enable row level security;
drop policy if exists "Allow public read access for active banners" on public.banners;
drop policy if exists "Allow admin full access to banners" on public.banners;
drop policy if exists "Banners are viewable by everyone" on public.banners;
create policy "Banners are viewable by everyone"
  on public.banners for select
  using (is_active = true);
create policy "Staff can manage banners"
  on public.banners for all
  using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));
