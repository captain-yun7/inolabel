-- =============================================================
-- RG Family: Initial Database Schema
-- =============================================================
-- 팬 커뮤니티 웹사이트를 위한 전체 데이터베이스 스키마
--
-- 테이블 목록:
-- 1. profiles (사용자/후원자)
-- 2. seasons (시즌)
-- 3. organization (조직도)
-- 4. donations (후원 내역)
-- 5. vip_rewards (VIP 보상)
-- 6. vip_images (VIP 이미지 갤러리)
-- 7. signatures (시그니처 영상)
-- 8. schedules (일정/캘린더)
-- 9. timeline_events (타임라인)
-- 10. notices (공지사항)
-- 11. posts (커뮤니티 게시글)
-- 12. comments (댓글)
-- 13. media_content (Shorts/VOD)
-- 14. live_status (LIVE 상태)
-- =============================================================

-- ============================================================
-- 1. PROFILES (사용자/후원자)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('member', 'vip', 'moderator', 'admin', 'superadmin')),
  unit VARCHAR(10) CHECK (unit IN ('excel', 'crew') OR unit IS NULL),
  total_donation BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS '사용자/후원자 프로필';
COMMENT ON COLUMN public.profiles.role IS '역할: member, vip, moderator, admin, superadmin';
COMMENT ON COLUMN public.profiles.unit IS '소속 유닛: excel, crew';
COMMENT ON COLUMN public.profiles.total_donation IS '누적 후원금 (하트 단위)';

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_profiles_updated_at();

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- ============================================================
-- 2. SEASONS (시즌)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.seasons (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.seasons IS '후원 시즌 정보';
COMMENT ON COLUMN public.seasons.is_active IS '현재 진행 중인 시즌 여부';

-- RLS Policies
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Seasons are viewable by everyone"
ON public.seasons FOR SELECT
USING (true);

CREATE POLICY "Only admins can modify seasons"
ON public.seasons FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin')
  )
);

-- ============================================================
-- 3. ORGANIZATION (조직도)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.organization (
  id SERIAL PRIMARY KEY,
  unit VARCHAR(10) NOT NULL CHECK (unit IN ('excel', 'crew')),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  position_order INT DEFAULT 0,
  parent_id INT REFERENCES public.organization(id) ON DELETE SET NULL,
  image_url TEXT,
  social_links JSONB DEFAULT '{}',
  is_live BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.organization IS '조직도/멤버 정보';
COMMENT ON COLUMN public.organization.role IS '역할: R대표, G대표, 팀장, 멤버 등';
COMMENT ON COLUMN public.organization.position_order IS '계층 순서 (1=대표, 2=팀장, 3=멤버)';
COMMENT ON COLUMN public.organization.parent_id IS '상위 멤버 ID (자기참조)';
COMMENT ON COLUMN public.organization.social_links IS 'SNS 링크 JSON: {pandatv, chzzk, youtube, instagram}';
COMMENT ON COLUMN public.organization.is_live IS '현재 LIVE 방송 중 여부';

CREATE INDEX idx_org_unit ON public.organization(unit);
CREATE INDEX idx_org_parent ON public.organization(parent_id);

-- RLS Policies
ALTER TABLE public.organization ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organization is viewable by everyone"
ON public.organization FOR SELECT
USING (is_active = true);

CREATE POLICY "Only admins can modify organization"
ON public.organization FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin')
  )
);

-- ============================================================
-- 4. DONATIONS (후원 내역)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.donations (
  id SERIAL PRIMARY KEY,
  donor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  donor_name VARCHAR(100) NOT NULL,
  amount BIGINT NOT NULL CHECK (amount > 0),
  season_id INT NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
  unit VARCHAR(10) CHECK (unit IN ('excel', 'crew') OR unit IS NULL),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.donations IS '후원 내역';
COMMENT ON COLUMN public.donations.amount IS '후원 금액 (하트 단위)';
COMMENT ON COLUMN public.donations.message IS '후원 메시지';

CREATE INDEX idx_donations_season ON public.donations(season_id);
CREATE INDEX idx_donations_donor ON public.donations(donor_id);
CREATE INDEX idx_donations_amount ON public.donations(amount DESC);

-- RLS Policies
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Donations are viewable by everyone"
ON public.donations FOR SELECT
USING (true);

CREATE POLICY "Only admins can insert donations"
ON public.donations FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin')
  )
);

-- Function to update total_donation
CREATE OR REPLACE FUNCTION update_donation_total(p_donor_id UUID, p_amount BIGINT)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET total_donation = total_donation + p_amount
  WHERE id = p_donor_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 5. VIP_REWARDS (VIP 보상)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.vip_rewards (
  id SERIAL PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  season_id INT NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
  rank INT NOT NULL CHECK (rank > 0 AND rank <= 50),
  personal_message TEXT,
  dedication_video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, season_id)
);

COMMENT ON TABLE public.vip_rewards IS 'VIP 보상 정보 (시즌별 Top 50)';
COMMENT ON COLUMN public.vip_rewards.rank IS '순위 (1~50)';
COMMENT ON COLUMN public.vip_rewards.personal_message IS '개인 감사 메시지';
COMMENT ON COLUMN public.vip_rewards.dedication_video_url IS '헌정 영상 URL';

CREATE INDEX idx_vip_rewards_season ON public.vip_rewards(season_id);
CREATE INDEX idx_vip_rewards_rank ON public.vip_rewards(rank);

-- RLS Policies
ALTER TABLE public.vip_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "VIP rewards visible to owners and admins"
ON public.vip_rewards FOR SELECT
USING (
  profile_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin')
  )
);

-- ============================================================
-- 6. VIP_IMAGES (VIP 이미지 갤러리)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.vip_images (
  id SERIAL PRIMARY KEY,
  reward_id INT NOT NULL REFERENCES public.vip_rewards(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  title VARCHAR(255),
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.vip_images IS 'VIP 전용 갤러리 이미지';

CREATE INDEX idx_vip_images_reward ON public.vip_images(reward_id);

-- RLS Policies
ALTER TABLE public.vip_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "VIP images visible to reward owners and admins"
ON public.vip_images FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.vip_rewards
    WHERE vip_rewards.id = vip_images.reward_id
    AND (
      vip_rewards.profile_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'superadmin')
      )
    )
  )
);

-- ============================================================
-- 7. SIGNATURES (시그니처 영상)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.signatures (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  unit VARCHAR(10) NOT NULL CHECK (unit IN ('excel', 'crew')),
  member_name VARCHAR(100) NOT NULL,
  media_type VARCHAR(10) DEFAULT 'video' CHECK (media_type IN ('video', 'image', 'gif')),
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  tags TEXT[],
  view_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.signatures IS '시그니처 영상/이미지';
COMMENT ON COLUMN public.signatures.tags IS '검색 태그 배열';

CREATE INDEX idx_signatures_unit ON public.signatures(unit);
CREATE INDEX idx_signatures_member ON public.signatures(member_name);
CREATE INDEX idx_signatures_featured ON public.signatures(is_featured) WHERE is_featured = true;

-- RLS Policies
ALTER TABLE public.signatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Signatures are viewable by everyone"
ON public.signatures FOR SELECT
USING (true);

CREATE POLICY "Only admins can modify signatures"
ON public.signatures FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin')
  )
);

-- ============================================================
-- 8. SCHEDULES (일정/캘린더)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.schedules (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  unit VARCHAR(10) CHECK (unit IN ('excel', 'crew') OR unit IS NULL),
  event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('broadcast', 'collab', 'event', 'notice', '休')),
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ,
  location VARCHAR(255),
  is_all_day BOOLEAN DEFAULT false,
  color VARCHAR(20),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.schedules IS '일정/캘린더';
COMMENT ON COLUMN public.schedules.event_type IS '이벤트 유형: broadcast, collab, event, notice, 休';
COMMENT ON COLUMN public.schedules.color IS '캘린더 색상 (예: #FF69B4)';

CREATE INDEX idx_schedules_datetime ON public.schedules(start_datetime);
CREATE INDEX idx_schedules_unit ON public.schedules(unit);

-- RLS Policies
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Schedules are viewable by everyone"
ON public.schedules FOR SELECT
USING (true);

CREATE POLICY "Only admins can modify schedules"
ON public.schedules FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin')
  )
);

-- ============================================================
-- 9. TIMELINE_EVENTS (타임라인)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id SERIAL PRIMARY KEY,
  event_date DATE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  category VARCHAR(50),
  season_id INT REFERENCES public.seasons(id) ON DELETE SET NULL,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.timeline_events IS '팬덤 타임라인/역사';
COMMENT ON COLUMN public.timeline_events.category IS '카테고리: founding, event, milestone, member';

CREATE INDEX idx_timeline_date ON public.timeline_events(event_date DESC);
CREATE INDEX idx_timeline_season ON public.timeline_events(season_id);

-- RLS Policies
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Timeline is viewable by everyone"
ON public.timeline_events FOR SELECT
USING (true);

-- ============================================================
-- 10. NOTICES (공지사항)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notices (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('official', 'excel', 'crew')),
  thumbnail_url TEXT,
  is_pinned BOOLEAN DEFAULT false,
  view_count INT DEFAULT 0,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.notices IS '공지사항';
COMMENT ON COLUMN public.notices.category IS '카테고리: official, excel, crew';
COMMENT ON COLUMN public.notices.is_pinned IS '고정 공지 여부';

CREATE INDEX idx_notices_pinned ON public.notices(is_pinned DESC, created_at DESC);
CREATE INDEX idx_notices_category ON public.notices(category);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_notices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notices_updated_at
BEFORE UPDATE ON public.notices
FOR EACH ROW
EXECUTE FUNCTION update_notices_updated_at();

-- RLS Policies
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notices are viewable by everyone"
ON public.notices FOR SELECT
USING (true);

CREATE POLICY "Only admins can modify notices"
ON public.notices FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin')
  )
);

-- ============================================================
-- 11. POSTS (커뮤니티 게시글)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.posts (
  id SERIAL PRIMARY KEY,
  board_type VARCHAR(10) NOT NULL CHECK (board_type IN ('free', 'vip')),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  is_anonymous BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.posts IS '커뮤니티 게시글';
COMMENT ON COLUMN public.posts.board_type IS '게시판 유형: free(자유), vip(VIP 전용)';
COMMENT ON COLUMN public.posts.is_anonymous IS '익명 여부';
COMMENT ON COLUMN public.posts.is_deleted IS '삭제 여부 (soft delete)';

CREATE INDEX idx_posts_board ON public.posts(board_type, created_at DESC);
CREATE INDEX idx_posts_author ON public.posts(author_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION update_posts_updated_at();

-- RLS Policies
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public posts are viewable by everyone"
ON public.posts FOR SELECT
USING (
  is_deleted = false AND (
    board_type = 'free' OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('vip', 'moderator', 'admin', 'superadmin')
    )
  )
);

CREATE POLICY "Users can create posts"
ON public.posts FOR INSERT
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts"
ON public.posts FOR UPDATE
USING (
  auth.uid() = author_id OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('moderator', 'admin', 'superadmin')
  )
);

-- ============================================================
-- 12. COMMENTS (댓글)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.comments (
  id SERIAL PRIMARY KEY,
  post_id INT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id INT REFERENCES public.comments(id) ON DELETE CASCADE,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.comments IS '게시글 댓글';
COMMENT ON COLUMN public.comments.parent_id IS '대댓글의 경우 부모 댓글 ID';

CREATE INDEX idx_comments_post ON public.comments(post_id);
CREATE INDEX idx_comments_parent ON public.comments(parent_id);

-- RLS Policies
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone"
ON public.comments FOR SELECT
USING (is_deleted = false);

CREATE POLICY "Users can create comments"
ON public.comments FOR INSERT
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own comments"
ON public.comments FOR UPDATE
USING (
  auth.uid() = author_id OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('moderator', 'admin', 'superadmin')
  )
);

-- ============================================================
-- 13. MEDIA_CONTENT (Shorts/VOD)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.media_content (
  id SERIAL PRIMARY KEY,
  content_type VARCHAR(10) NOT NULL CHECK (content_type IN ('shorts', 'vod')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  video_url TEXT NOT NULL,
  unit VARCHAR(10) CHECK (unit IN ('excel', 'crew') OR unit IS NULL),
  duration INT,
  view_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.media_content IS '미디어 콘텐츠 (Shorts/VOD)';
COMMENT ON COLUMN public.media_content.duration IS '영상 길이 (초)';

CREATE INDEX idx_media_type ON public.media_content(content_type);
CREATE INDEX idx_media_featured ON public.media_content(is_featured) WHERE is_featured = true;

-- RLS Policies
ALTER TABLE public.media_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Media is viewable by everyone"
ON public.media_content FOR SELECT
USING (true);

-- ============================================================
-- 14. LIVE_STATUS (LIVE 상태)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.live_status (
  id SERIAL PRIMARY KEY,
  member_id INT NOT NULL REFERENCES public.organization(id) ON DELETE CASCADE,
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('chzzk', 'twitch', 'youtube', 'pandatv')),
  stream_url TEXT NOT NULL,
  thumbnail_url TEXT,
  is_live BOOLEAN DEFAULT false,
  viewer_count INT DEFAULT 0,
  last_checked TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_id, platform)
);

COMMENT ON TABLE public.live_status IS '멤버 라이브 방송 상태';
COMMENT ON COLUMN public.live_status.platform IS '방송 플랫폼';
COMMENT ON COLUMN public.live_status.last_checked IS '마지막 상태 확인 시각';

CREATE INDEX idx_live_status_member ON public.live_status(member_id);
CREATE INDEX idx_live_status_live ON public.live_status(is_live) WHERE is_live = true;

-- RLS Policies
ALTER TABLE public.live_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Live status is viewable by everyone"
ON public.live_status FOR SELECT
USING (true);

-- =============================================================
-- 샘플 데이터 삽입 (개발/테스트용)
-- =============================================================

-- 시즌 샘플 데이터
INSERT INTO public.seasons (name, start_date, end_date, is_active) VALUES
  ('시즌 1 - 봄의 시작', '2024-01-01', '2024-03-31', false),
  ('시즌 2 - 여름의 열정', '2024-04-01', '2024-06-30', false),
  ('시즌 3 - 가을의 수확', '2024-07-01', '2024-09-30', false),
  ('시즌 4 - 겨울의 축제', '2024-10-01', NULL, true)
ON CONFLICT DO NOTHING;

-- =============================================================
-- 마이그레이션 완료
-- =============================================================
