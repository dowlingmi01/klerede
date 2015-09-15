LOAD DATA INFILE 'galaxyimport/tranheader.txt'
INTO TABLE box_office_transaction
LINES TERMINATED BY '\r\n'
(source_id, venue_id, register_id, sequence, business_day, time, operator_id, agency_id)
;

LOAD DATA INFILE 'galaxyimport/tranline.txt'
INTO TABLE box_office_transaction_line_galaxy
LINES TERMINATED BY '\r\n'
(source_id, venue_id, sequence, box_office_product_code, ticket_code, sale_price, quantity)
;

LOAD DATA INFILE 'galaxyimport/item.txt'
INTO TABLE box_office_product
LINES TERMINATED BY '\r\n'
(venue_id, code, description, account_code, kind, is_ga, delivery_method_id)
;
UPDATE box_office_product
   SET membership_kind_id = IF(description LIKE '%family%', 2, 1)
 WHERE kind = 'pass'
;


INSERT box_office_transaction_line
     ( box_office_transaction_id, sequence, box_office_product_id, ticket_code, sale_price, quantity )
SELECT t.id, l.sequence, p.id, l.ticket_code, l.sale_price, l.quantity
  FROM box_office_transaction_line_galaxy l
  STRAIGHT_JOIN box_office_transaction t ON l.venue_id = t.venue_id AND l.source_id = t.source_id
  STRAIGHT_JOIN box_office_product p ON l.box_office_product_code = p.code AND t.venue_id = p.venue_id
;


LOAD DATA INFILE 'galaxyimport/member.txt'
INTO TABLE member_galaxy
FIELDS ESCAPED BY ''
LINES TERMINATED BY '\r\n'
(venue_id, code, gender, age_group, @dob
     , first, middle, last, street_1, street_2, city, state, zip, country, phone)
SET dob = if(@dob > '1900-01-02', @dob, NULL)
;

LOAD DATA INFILE 'galaxyimport/membership.txt'
REPLACE
INTO TABLE membership_galaxy
FIELDS ESCAPED BY ''
LINES TERMINATED BY '\r\n'
(venue_id, member_code, code, sequence, box_office_product_code, date_from, date_to, @dob, adult_qty, child_qty
, first, middle, last, street_1, street_2, city, state, zip, country, phone)
SET dob = if(@dob > '1900-01-02', @dob, NULL)
;

INSERT member_address
     ( street_1, street_2, city, state, zip, country, phone )
SELECT DISTINCT m.street_1, m.street_2, m.city, m.state, m.zip, m.country, m.phone
  FROM member_galaxy m
  LEFT JOIN member_address a
    ON m.street_1 = a.street_1 AND m.street_2 = a.street_2
   AND m.city = a.city AND m.state = a.state AND m.zip = a.zip
   AND m.country = a.country AND m.phone = a.phone
 WHERE a.id IS NULL
;
INSERT member_address
     ( street_1, street_2, city, state, zip, country, phone )
SELECT DISTINCT m.street_1, m.street_2, m.city, m.state, m.zip, m.country, m.phone
  FROM membership_galaxy m
  LEFT JOIN member_address a
    ON m.street_1 = a.street_1 AND m.street_2 = a.street_2
   AND m.city = a.city AND m.state = a.state AND m.zip = a.zip
   AND m.country = a.country AND m.phone = a.phone
 WHERE a.id IS NULL
;
INSERT member_name
( first, middle, last )
SELECT DISTINCT first, middle, last
  FROM member_galaxy
ON DUPLICATE KEY UPDATE id = id
;
INSERT member_name
     ( first, middle, last )
SELECT DISTINCT first, middle, last
  FROM membership_galaxy
ON DUPLICATE KEY UPDATE id = id
;
INSERT member
     ( venue_id, code, member_name_id, member_address_id, gender, age_group, dob)
SELECT venue_id, code, n.id, a.id, gender, age_group, dob
  FROM member_galaxy g
  JOIN member_address a ON g.street_1 = a.street_1 AND g.street_2 = a.street_2 AND g.city = a.city
       AND g.state = a.state AND g.zip = a.zip AND g.country = a.country AND g.phone = a.phone
  JOIN member_name n ON g.first = n.first AND g.middle = n.middle AND g.last = n.last
;
INSERT membership
     ( venue_id, member_id, member_address_id, member_name_id, code, sequence, box_office_product_id
     , date_from, date_to, dob, adult_qty, child_qty )
SELECT g.venue_id, m.id, a.id, n.id, g.code, g.sequence, p.id
     , date_from, date_to, g.dob, adult_qty, child_qty
  FROM membership_galaxy g
  STRAIGHT_JOIN member m ON g.venue_id = m.venue_id AND g.member_code = m.code
  STRAIGHT_JOIN box_office_product p ON g.venue_id = p.venue_id AND g.box_office_product_code = p.code
  JOIN member_address a ON g.street_1 = a.street_1 AND g.street_2 = a.street_2 AND g.city = a.city
       AND g.state = a.state AND g.zip = a.zip AND g.country = a.country AND g.phone = a.phone
  JOIN member_name n ON g.first = n.first AND g.middle = n.middle AND g.last = n.last
;
UPDATE member, (SELECT member_id, max(id) as maxid FROM membership GROUP BY member_id) x
   SET member.last_membership_id = x.maxid
 WHERE member.id = x.member_id
;


LOAD DATA INFILE 'galaxyimport/visit.txt'
INTO TABLE visit_galaxy
LINES TERMINATED BY '\r\n'
(source_id, venue_id, acp_id, box_office_product_code, ticket_code, kind, operation_id, quantity, use_no, time)
;

INSERT visit
     ( source_id, venue_id, acp_id, box_office_product_id, ticket_code, membership_id
     , kind, operation_id, quantity, use_no, time)
SELECT source_id, v.venue_id, acp_id, p.id, ticket_code, m.id
     , v.kind, operation_id, quantity, use_no, time
  FROM visit_galaxy v
  JOIN box_office_product p
    ON v.box_office_product_code = p.code
   AND v.venue_id = p.venue_id
  LEFT JOIN membership m USE INDEX FOR JOIN (membership_venue_id_code_unique)
    ON v.ticket_code = m.code
   AND v.venue_id = m.venue_id
   AND v.kind = 'pass'
;



LOAD DATA INFILE 'galaxyimport/cafetranheader.txt'
INTO TABLE cafe_transaction
LINES TERMINATED BY '\r\n'
(source_id, venue_id, register_id, sequence, business_day, time, operator_id, agency_id)
;

LOAD DATA INFILE 'galaxyimport/cafetranline.txt'
INTO TABLE cafe_transaction_line_galaxy
LINES TERMINATED BY '\r\n'
(source_id, venue_id, sequence, cafe_product_code, sale_price, quantity)
;

LOAD DATA INFILE 'galaxyimport/cafetranmemberinfo.txt'
REPLACE
INTO TABLE cafe_transaction_galaxy_member_info
LINES TERMINATED BY '\r\n'
(source_id, venue_id, @register_id, @sequence, @company_id, member_code)
;

UPDATE cafe_transaction_galaxy_member_info i
STRAIGHT_JOIN cafe_transaction t
    ON t.venue_id = i.venue_id AND t.source_id = i.source_id
STRAIGHT_JOIN member m on i.venue_id = m.venue_id AND i.member_code = m.code
   SET t.member_id = m.id
;

LOAD DATA INFILE 'galaxyimport/cafeitem.txt'
INTO TABLE cafe_product
LINES TERMINATED BY '\r\n'
(venue_id, code, description, account_code)
;

INSERT cafe_transaction_line
     ( cafe_transaction_id, sequence, cafe_product_id, sale_price, quantity )
SELECT t.id, l.sequence, p.id, l.sale_price, l.quantity
  FROM cafe_transaction_line_galaxy l
STRAIGHT_JOIN cafe_transaction t ON l.venue_id = t.venue_id AND l.source_id = t.source_id
STRAIGHT_JOIN cafe_product p ON l.cafe_product_code = p.code AND t.venue_id = p.venue_id
;

LOAD DATA INFILE 'galaxyimport/storetranheader.txt'
INTO TABLE store_transaction
LINES TERMINATED BY '\r\n'
(venue_id, register_id, sequence, business_day, time_end, operator_id)
SET currency = 'USD'
;

LOAD DATA INFILE 'galaxyimport/storetranline.txt'
INTO TABLE store_transaction_line_galaxy
LINES TERMINATED BY '\r\n'
(venue_id, register_id, store_transaction_sequence, sequence, store_product_scanned_code, sale_price, quantity)
;

LOAD DATA INFILE 'galaxyimport/storetranmemberinfo.txt'
REPLACE
INTO TABLE store_transaction_galaxy_member_info
LINES TERMINATED BY '\r\n'
(@source_id, venue_id, register_id, sequence, @company_id, member_code)
;

UPDATE store_transaction_galaxy_member_info i
STRAIGHT_JOIN store_transaction t
    ON t.venue_id = i.venue_id AND t.register_id = i.register_id AND t.sequence = i.sequence
STRAIGHT_JOIN member m on i.venue_id = m.venue_id AND i.member_code = m.code
   SET t.member_id = m.id
;

LOAD DATA INFILE 'galaxyimport/storeitem.txt'
INTO TABLE store_product_galaxy
LINES TERMINATED BY '\r\n'
(venue_id, code, description, scanned_code, store_product_category_source_id)
;

INSERT store_product
     ( store_product_category_id, code, description, scanned_code )
SELECT c.id, p.code, p.description, scanned_code
  FROM store_product_galaxy p
  JOIN store_product_category_galaxy g
    ON p.venue_id = g.venue_id AND p.store_product_category_source_id = g.source_id
  JOIN store_product_category c
    ON g.code = c.code
;

INSERT store_product
     ( store_product_category_id, code
     , description, scanned_code )
SELECT DISTINCT 0, store_product_scanned_code
    , 'Missing PLU in Items table', store_product_scanned_code
  FROM store_transaction_line_galaxy l
  LEFT JOIN store_product p ON l.store_product_scanned_code = p.scanned_code
 WHERE p.id IS NULL
;

INSERT store_transaction_line
     ( store_transaction_id, sequence, store_product_id, sale_price, quantity )
SELECT t.id, l.sequence, p.id, l.sale_price, l.quantity
  FROM store_transaction_line_galaxy l
STRAIGHT_JOIN store_transaction t ON l.venue_id = t.venue_id
      AND l.register_id = t.register_id AND l.store_transaction_sequence = t.sequence
STRAIGHT_JOIN store_product p ON l.store_product_scanned_code = p.scanned_code
;
