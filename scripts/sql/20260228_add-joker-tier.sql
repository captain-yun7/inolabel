-- 조커 티어 추가 (잭과 스페이드 사이)
-- 1. 스페이드 이하 티어의 display_order를 1씩 증가
UPDATE starcraft_tiers
SET display_order = display_order + 1
WHERE display_order >= (
  SELECT display_order FROM starcraft_tiers WHERE name = '스페이드' LIMIT 1
);

-- 2. 조커 티어 삽입 (잭의 display_order + 1)
INSERT INTO starcraft_tiers (name, display_order, color, description)
SELECT '조커',
       (SELECT display_order FROM starcraft_tiers WHERE name = '잭' LIMIT 1) + 1,
       '#e11d48',
       '잭과 스페이드 사이 티어'
WHERE NOT EXISTS (SELECT 1 FROM starcraft_tiers WHERE name = '조커');
