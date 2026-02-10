-- ===========================================
-- Admin RLS Policies Migration
-- ===========================================
-- This migration adds Admin CRUD policies to all tables
-- Allows users with 'admin' or 'superadmin' role to manage data

-- 1. Create Admin Check Function
-- ===========================================
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role in ('admin', 'superadmin')
  );
end;
$$ language plpgsql security definer;

-- 2. Create Moderator Check Function (includes admin)
-- ===========================================
create or replace function public.is_moderator()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role in ('admin', 'superadmin', 'moderator')
  );
end;
$$ language plpgsql security definer;

-- ===========================================
-- Admin CRUD Policies for Each Table
-- ===========================================

-- Profiles: Admin can manage all profiles
create policy "Admins can insert profiles"
  on public.profiles for insert
  with check (public.is_admin());

create policy "Admins can update any profile"
  on public.profiles for update
  using (public.is_admin());

create policy "Admins can delete profiles"
  on public.profiles for delete
  using (public.is_admin());

-- Seasons: Admin CRUD
create policy "Admins can insert seasons"
  on public.seasons for insert
  with check (public.is_admin());

create policy "Admins can update seasons"
  on public.seasons for update
  using (public.is_admin());

create policy "Admins can delete seasons"
  on public.seasons for delete
  using (public.is_admin());

-- Organization: Admin CRUD
create policy "Admins can insert organization"
  on public.organization for insert
  with check (public.is_admin());

create policy "Admins can update organization"
  on public.organization for update
  using (public.is_admin());

create policy "Admins can delete organization"
  on public.organization for delete
  using (public.is_admin());

-- Donations: Admin CRUD
create policy "Admins can insert donations"
  on public.donations for insert
  with check (public.is_admin());

create policy "Admins can update donations"
  on public.donations for update
  using (public.is_admin());

create policy "Admins can delete donations"
  on public.donations for delete
  using (public.is_admin());

-- VIP Rewards: Admin CRUD
create policy "Admins can insert vip_rewards"
  on public.vip_rewards for insert
  with check (public.is_admin());

create policy "Admins can update vip_rewards"
  on public.vip_rewards for update
  using (public.is_admin());

create policy "Admins can delete vip_rewards"
  on public.vip_rewards for delete
  using (public.is_admin());

-- VIP Images: Admin CRUD
create policy "Admins can insert vip_images"
  on public.vip_images for insert
  with check (public.is_admin());

create policy "Admins can update vip_images"
  on public.vip_images for update
  using (public.is_admin());

create policy "Admins can delete vip_images"
  on public.vip_images for delete
  using (public.is_admin());

-- Signatures: Admin CRUD
create policy "Admins can insert signatures"
  on public.signatures for insert
  with check (public.is_admin());

create policy "Admins can update signatures"
  on public.signatures for update
  using (public.is_admin());

create policy "Admins can delete signatures"
  on public.signatures for delete
  using (public.is_admin());

-- Schedules: Admin CRUD
create policy "Admins can insert schedules"
  on public.schedules for insert
  with check (public.is_admin());

create policy "Admins can update schedules"
  on public.schedules for update
  using (public.is_admin());

create policy "Admins can delete schedules"
  on public.schedules for delete
  using (public.is_admin());

-- Timeline Events: Admin CRUD
create policy "Admins can insert timeline_events"
  on public.timeline_events for insert
  with check (public.is_admin());

create policy "Admins can update timeline_events"
  on public.timeline_events for update
  using (public.is_admin());

create policy "Admins can delete timeline_events"
  on public.timeline_events for delete
  using (public.is_admin());

-- Notices: Admin CRUD
create policy "Admins can insert notices"
  on public.notices for insert
  with check (public.is_admin());

create policy "Admins can update notices"
  on public.notices for update
  using (public.is_admin());

create policy "Admins can delete notices"
  on public.notices for delete
  using (public.is_admin());

-- Media Content: Admin CRUD
create policy "Admins can insert media_content"
  on public.media_content for insert
  with check (public.is_admin());

create policy "Admins can update media_content"
  on public.media_content for update
  using (public.is_admin());

create policy "Admins can delete media_content"
  on public.media_content for delete
  using (public.is_admin());

-- Live Status: Admin CRUD
create policy "Admins can insert live_status"
  on public.live_status for insert
  with check (public.is_admin());

create policy "Admins can update live_status"
  on public.live_status for update
  using (public.is_admin());

create policy "Admins can delete live_status"
  on public.live_status for delete
  using (public.is_admin());

-- Banners: Admin CRUD
create policy "Admins can insert banners"
  on public.banners for insert
  with check (public.is_admin());

create policy "Admins can update banners"
  on public.banners for update
  using (public.is_admin());

create policy "Admins can delete banners"
  on public.banners for delete
  using (public.is_admin());

-- ===========================================
-- Moderator Policies for Posts & Comments
-- ===========================================

-- Posts: Moderators can also manage
create policy "Moderators can update any post"
  on public.posts for update
  using (public.is_moderator());

create policy "Moderators can delete any post"
  on public.posts for delete
  using (public.is_moderator());

-- Comments: Moderators can also manage
create policy "Moderators can update any comment"
  on public.comments for update
  using (public.is_moderator());

create policy "Moderators can delete any comment"
  on public.comments for delete
  using (public.is_moderator());

-- ===========================================
-- Performance Indexes
-- ===========================================
create index if not exists idx_donations_season_id on public.donations(season_id);
create index if not exists idx_donations_donor_id on public.donations(donor_id);
create index if not exists idx_donations_amount_desc on public.donations(amount desc);
create index if not exists idx_posts_board_type on public.posts(board_type);
create index if not exists idx_posts_created_at on public.posts(created_at desc);
create index if not exists idx_comments_post_id on public.comments(post_id);
create index if not exists idx_organization_unit on public.organization(unit);
create index if not exists idx_organization_parent_id on public.organization(parent_id);
create index if not exists idx_notices_is_pinned on public.notices(is_pinned desc, created_at desc);
create index if not exists idx_timeline_events_season on public.timeline_events(season_id, order_index);
create index if not exists idx_schedules_datetime on public.schedules(start_datetime);
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_total_donation on public.profiles(total_donation desc);
