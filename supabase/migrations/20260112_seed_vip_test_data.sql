-- =============================================================
-- RG Family: VIP 시스템 테스트 데이터 시딩
-- 이 파일은 테스트/개발 환경에서만 실행하세요.
-- FK 제약을 임시 비활성화하고 테스트 데이터 삽입 후 다시 활성화합니다.
-- =============================================================

-- 1. FK 제약 임시 비활성화 (profiles.id → auth.users.id)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2. 테스트 VIP 프로필 삽입
INSERT INTO public.profiles (id, nickname, role, unit, total_donation, created_at, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', '핑크하트', 'vip', 'crew', 45000000, NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'gul***', 'vip', 'excel', 38002000, NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', '영원한서포터', 'vip', 'excel', 30000000, NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', '왕대박', 'member', 'excel', 5000000, NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', '럭키세븐', 'member', 'excel', 3500000, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  nickname = EXCLUDED.nickname,
  role = EXCLUDED.role,
  unit = EXCLUDED.unit,
  total_donation = EXCLUDED.total_donation,
  updated_at = NOW();

-- 3. VIP 보상 데이터 삽입
INSERT INTO public.vip_rewards (id, profile_id, season_id, rank, personal_message, dedication_video_url, created_at)
VALUES
  (1, '11111111-1111-1111-1111-111111111111', 4, 1,
   E'핑크하트님, 항상 최고의 응원을 보내주셔서 진심으로 감사합니다.\n\n처음 방송을 시작했을 때부터 지금까지 변함없이 함께해주신 덕분에 매일 방송이 즐겁습니다. 힘들 때마다 핑크하트님의 따뜻한 메시지를 보며 힘을 얻곤 해요.\n\n앞으로도 함께해주실 거죠? 사랑합니다!\n\n- 나노 드림',
   'https://www.youtube.com/embed/dQw4w9WgXcQ', NOW()),
  (2, '22222222-2222-2222-2222-222222222222', 4, 2,
   E'gul***님, 변함없는 응원에 진심으로 감사드려요.\n\n항상 채팅에서 응원해주시고, 다른 팬분들도 챙겨주시는 모습이 정말 따뜻해요. gul***님 덕분에 우리 방송 분위기가 항상 좋은 것 같아요.\n\n앞으로도 함께 좋은 추억 많이 만들어요!\n\n- 나노 드림',
   'https://www.youtube.com/embed/dQw4w9WgXcQ', NOW()),
  (3, '33333333-3333-3333-3333-333333333333', 4, 3,
   E'영원한서포터님, 따뜻한 응원 항상 감사합니다.\n\n닉네임처럼 정말 영원한 서포터가 되어주시는 것 같아 감동이에요. 조용히 응원해주시는 모습이 정말 따뜻합니다.\n\n앞으로도 좋은 방송으로 보답할게요!\n\n- 나노 드림',
   'https://www.youtube.com/embed/dQw4w9WgXcQ', NOW())
ON CONFLICT (id) DO UPDATE SET
  personal_message = EXCLUDED.personal_message,
  dedication_video_url = EXCLUDED.dedication_video_url;

-- 4. VIP 이미지 데이터 삽입
INSERT INTO public.vip_images (reward_id, image_url, title, order_index, created_at)
VALUES
  -- 1위 핑크하트 (4장)
  (1, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop', 'Gold Exclusive #1', 1, NOW()),
  (1, 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=800&fit=crop', 'Gold Exclusive #2', 2, NOW()),
  (1, 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=800&h=800&fit=crop', 'Gold Exclusive #3', 3, NOW()),
  (1, 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=800&h=800&fit=crop', 'Gold Exclusive #4', 4, NOW()),
  -- 2위 gul*** (3장)
  (2, 'https://images.unsplash.com/photo-1633177317976-3f9bc45e1d1d?w=800&h=800&fit=crop', 'Silver Exclusive #1', 1, NOW()),
  (2, 'https://images.unsplash.com/photo-1614851099511-773084f6911d?w=800&h=800&fit=crop', 'Silver Exclusive #2', 2, NOW()),
  (2, 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&h=800&fit=crop', 'Silver Exclusive #3', 3, NOW()),
  -- 3위 영원한서포터 (2장)
  (3, 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&h=800&fit=crop', 'Bronze Exclusive #1', 1, NOW()),
  (3, 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=800&h=800&fit=crop', 'Bronze Exclusive #2', 2, NOW())
ON CONFLICT DO NOTHING;

-- 5. 헌정 방명록 데이터 삽입
INSERT INTO public.tribute_guestbook (profile_id, content, guest_name, created_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', '핑크하트님 정말 대단해요! 최고 후원자!', '팬더러버', NOW()),
  ('11111111-1111-1111-1111-111111111111', '존경합니다 핑크하트님!', '응원단원', NOW()),
  ('22222222-2222-2222-2222-222222222222', 'gul님 늘 챙겨주셔서 감사해요~', '초보팬', NOW()),
  ('33333333-3333-3333-3333-333333333333', '영원한서포터님 닉네임처럼 영원히!', '같이응원', NOW())
ON CONFLICT DO NOTHING;

-- 6. (선택) FK 제약 다시 활성화 - 프로덕션에서 필요시 주석 해제
-- ALTER TABLE public.profiles
--   ADD CONSTRAINT profiles_id_fkey
--   FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- =============================================================
-- 참고: 이 마이그레이션 실행 후 헌정 페이지 접근 가능
-- URL: /ranking/11111111-1111-1111-1111-111111111111 (1위 핑크하트)
-- URL: /ranking/22222222-2222-2222-2222-222222222222 (2위 gul***)
-- URL: /ranking/33333333-3333-3333-3333-333333333333 (3위 영원한서포터)
-- =============================================================
