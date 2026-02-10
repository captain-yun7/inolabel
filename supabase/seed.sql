-- =============================================================
-- RG Family: 샘플 데이터 시딩
-- Supabase SQL Editor에서 실행
-- =============================================================

-- 시즌 데이터 (이미 있으면 스킵)
INSERT INTO public.seasons (name, start_date, end_date, is_active) VALUES
  ('시즌 1 - 봄의 시작', '2024-01-01', '2024-03-31', false),
  ('시즌 2 - 여름의 열정', '2024-04-01', '2024-06-30', false),
  ('시즌 3 - 가을의 수확', '2024-07-01', '2024-09-30', false),
  ('시즌 4 - 겨울의 축제', '2024-10-01', NULL, true)
ON CONFLICT DO NOTHING;

-- 조직도 데이터
INSERT INTO public.organization (unit, name, role, position_order, parent_id, image_url, is_live, is_active) VALUES
  -- EXCEL 유닛
  ('excel', '리나', 'R대표', 1, NULL, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop', false, true),
  ('excel', '가애', 'G대표', 1, NULL, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', true, true),
  ('excel', '민지', '팀장', 2, 1, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop', false, true),
  ('excel', '수진', '멤버', 3, 3, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop', false, true),
  ('excel', '예진', '멤버', 3, 3, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', false, true),
  -- CREW 유닛
  ('crew', '하늘', '팀장', 2, NULL, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', false, true),
  ('crew', '도윤', '멤버', 3, 6, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', true, true),
  ('crew', '서연', '멤버', 3, 6, 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop', false, true)
ON CONFLICT DO NOTHING;

-- 공지사항 데이터
INSERT INTO public.notices (title, content, category, is_pinned, view_count) VALUES
  ('RG 패밀리 시즌 4 오픈!', '안녕하세요, RG 패밀리 여러분! 드디어 시즌 4가 시작되었습니다. 새로운 시즌과 함께 다양한 이벤트가 준비되어 있으니 많은 참여 부탁드립니다.', 'official', true, 1523),
  ('연말 특별 이벤트 안내', '연말을 맞아 특별 이벤트를 진행합니다. 12월 한 달간 후원 시 2배 포인트 적립!', 'official', true, 892),
  ('엑셀부 정기 방송 일정 변경', '엑셀부 정기 방송 시간이 변경되었습니다. 매주 화/목 오후 8시 → 오후 9시', 'excel', false, 456),
  ('크루부 신규 멤버 영입', '크루부에 새로운 멤버가 합류했습니다! 많은 관심 부탁드려요.', 'crew', false, 678),
  ('VIP 라운지 업데이트', 'VIP 전용 콘텐츠가 업데이트되었습니다. Top 50 후원자분들께서는 확인해주세요!', 'official', false, 234)
ON CONFLICT DO NOTHING;

-- 타임라인 이벤트
INSERT INTO public.timeline_events (event_date, title, description, category, season_id, order_index) VALUES
  ('2024-01-15', 'RG 패밀리 창단', 'RG 패밀리가 공식 출범했습니다!', 'founding', 1, 1),
  ('2024-02-14', '발렌타인 특별 방송', '발렌타인 데이 기념 합동 방송 진행', 'event', 1, 2),
  ('2024-03-01', '시즌 1 종료 기념 이벤트', '시즌 1 마무리 기념 팬미팅', 'milestone', 1, 3),
  ('2024-04-01', '시즌 2 시작', '새로운 시즌의 시작!', 'milestone', 2, 1),
  ('2024-05-05', '어린이날 특별 방송', '어린이날 기념 게임 이벤트', 'event', 2, 2),
  ('2024-07-01', '시즌 3 시작', '여름 시즌 개막', 'milestone', 3, 1),
  ('2024-08-15', '광복절 기념 방송', '광복절 특별 콘텐츠', 'event', 3, 2),
  ('2024-10-01', '시즌 4 시작', '겨울 시즌 개막!', 'milestone', 4, 1),
  ('2024-10-31', '할로윈 특별 이벤트', '할로윈 코스튬 방송', 'event', 4, 2),
  ('2024-12-25', '크리스마스 특별 방송', '크리스마스 기념 합동 방송 예정', 'event', 4, 3)
ON CONFLICT DO NOTHING;

-- 일정 데이터
INSERT INTO public.schedules (title, description, unit, event_type, start_datetime, end_datetime, is_all_day, color) VALUES
  ('리나 정기 방송', '리나의 정기 방송입니다', 'excel', 'broadcast', '2026-01-17 20:00:00+09', '2026-01-17 23:00:00+09', false, '#fd68ba'),
  ('가애 콜라보 방송', '특별 게스트와 함께하는 콜라보', 'excel', 'collab', '2026-01-18 21:00:00+09', '2026-01-18 23:00:00+09', false, '#8b5cf6'),
  ('크루부 합동 방송', '크루부 전체 합동 방송', 'crew', 'broadcast', '2026-01-19 19:00:00+09', '2026-01-19 22:00:00+09', false, '#22c55e'),
  ('시즌 4 마감 D-Day', '시즌 4 종료일', NULL, 'notice', '2026-01-31 00:00:00+09', NULL, true, '#ef4444'),
  ('휴방', '개인 일정으로 휴방합니다', 'excel', '休', '2026-01-20 00:00:00+09', NULL, true, '#6b7280')
ON CONFLICT DO NOTHING;

-- 시그니처 데이터
INSERT INTO public.signatures (title, description, unit, member_name, media_type, media_url, thumbnail_url, tags, view_count, is_featured) VALUES
  ('리나 시그니처 인사', '리나의 시그니처 인사 영상입니다', 'excel', '리나', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop', ARRAY['인사', '시그니처', '리나'], 1234, true),
  ('가애 댄스 시그니처', '가애의 댄스 시그니처', 'excel', '가애', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop', ARRAY['댄스', '시그니처', '가애'], 987, true),
  ('민지 노래 시그니처', '민지의 노래 시그니처', 'excel', '민지', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=300&fit=crop', ARRAY['노래', '시그니처', '민지'], 567, false),
  ('하늘 게임 시그니처', '하늘의 게임 시그니처', 'crew', '하늘', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', ARRAY['게임', '시그니처', '하늘'], 432, true),
  ('도윤 먹방 시그니처', '도윤의 먹방 시그니처', 'crew', '도윤', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop', ARRAY['먹방', '시그니처', '도윤'], 321, false)
ON CONFLICT DO NOTHING;

-- 미디어 콘텐츠 (Shorts/VOD)
INSERT INTO public.media_content (content_type, title, description, thumbnail_url, video_url, unit, duration, view_count, is_featured) VALUES
  ('shorts', '리나 일상 브이로그 #1', '리나의 일상을 담은 짧은 영상', 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=600&fit=crop', 'https://youtube.com/shorts/abc123', 'excel', 60, 5432, true),
  ('shorts', '가애 댄스 챌린지', '최신 댄스 챌린지!', 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=400&h=600&fit=crop', 'https://youtube.com/shorts/def456', 'excel', 45, 8765, true),
  ('shorts', '크루부 일상', '크루부 멤버들의 일상', 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=600&fit=crop', 'https://youtube.com/shorts/ghi789', 'crew', 30, 2345, false),
  ('vod', '시즌 3 종료 기념 방송', '시즌 3 마무리 특별 방송 다시보기', 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&h=450&fit=crop', 'https://www.youtube.com/watch?v=xyz123', NULL, 7200, 12345, true),
  ('vod', '할로윈 특별 방송', '할로윈 코스튬 파티 다시보기', 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=800&h=450&fit=crop', 'https://www.youtube.com/watch?v=abc456', NULL, 5400, 9876, true)
ON CONFLICT DO NOTHING;

-- 배너 데이터
INSERT INTO public.banners (title, image_url, link_url, display_order, is_active) VALUES
  ('RG 패밀리 시즌 4', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=400&fit=crop', '/ranking', 1, true),
  ('VIP 특별 혜택', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=400&fit=crop', '/ranking/vip', 2, true),
  ('신규 멤버 소개', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=400&fit=crop', '/rg/org', 3, true)
ON CONFLICT DO NOTHING;

-- 라이브 상태 데이터
INSERT INTO public.live_status (member_id, platform, stream_url, thumbnail_url, is_live, viewer_count) VALUES
  (2, 'pandatv', 'https://www.pandalive.co.kr/live/gaae', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop', true, 1523),
  (7, 'chzzk', 'https://chzzk.naver.com/doyun', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop', true, 876)
ON CONFLICT DO NOTHING;

-- =============================================================
-- 완료!
-- =============================================================
