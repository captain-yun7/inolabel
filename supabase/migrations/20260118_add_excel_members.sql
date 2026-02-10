-- 조직도 엑셀부 멤버 INSERT
-- 생성일: 2026-01-18
-- social_links.pandatv는 ID만 저장 (URL 아님)

INSERT INTO organization (name, unit, role, position_order, profile_info, social_links) VALUES
('채은', 'excel', '멤버', 1, '{"birthday": "2004-03-24"}', '{"pandatv": "hj042300"}'),
('가윤', 'excel', '멤버', 2, '{"birthday": "1996-01-03"}', '{"pandatv": "juuni9613"}'),
('설윤', 'excel', '멤버', 3, '{"birthday": "2000-01-10"}', '{"pandatv": "xxchosun"}'),
('한세아', 'excel', '멤버', 4, '{"birthday": "1992-12-14"}', '{"pandatv": "kkrinaa"}'),
('청아', 'excel', '멤버', 5, '{"birthday": "2004-01-03"}', '{"pandatv": "mandoooo"}'),
('손밍', 'excel', '멤버', 6, '{"birthday": "1996-07-25"}', '{"pandatv": "sonming52"}'),
('해린', 'excel', '멤버', 7, '{"birthday": "2005-07-05"}', '{"pandatv": "qwerty3490"}'),
('키키', 'excel', '멤버', 8, '{"birthday": "1999-02-10"}', '{"pandatv": "kiki0210"}'),
('한백설', 'excel', '멤버', 9, '{"birthday": "1997-11-26"}', '{"pandatv": "firstaplus121"}'),
('홍서하', 'excel', '멤버', 10, '{"birthday": "2001-08-30"}', '{"pandatv": "lrsehwa"}'),
('퀸로니', 'excel', '멤버', 11, '{"birthday": "1991-09-30"}', '{"pandatv": "tjdrks1771"}');

-- 월아는 생일 연도 불명 (????.04.02) - 나중에 추가
-- INSERT INTO organization (name, unit, role, position_order, profile_info) VALUES
-- ('월아', 'excel', '멤버', 0, '{"birthday": "????-04-02"}');
