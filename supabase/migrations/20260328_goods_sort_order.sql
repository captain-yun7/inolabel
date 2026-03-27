-- goods 테이블에 상품 순서 컬럼 추가
ALTER TABLE goods ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- 기존 상품에 created_at 순서로 초기값 설정
UPDATE goods SET sort_order = sub.rownum
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) AS rownum
  FROM goods
) sub
WHERE goods.id = sub.id;
