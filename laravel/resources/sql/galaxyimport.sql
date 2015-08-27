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

LOAD DATA INFILE 'galaxyimport/visit.txt'
INTO TABLE visit_galaxy
LINES TERMINATED BY '\r\n'
(source_id, venue_id, acp_id, box_office_product_code, ticket_code, kind, operation_id, quantity, use_no, time)
;

INSERT visit
     ( source_id, venue_id, acp_id, box_office_product_id, ticket_code, kind, operation_id, quantity, use_no, time)
SELECT source_id, v.venue_id, acp_id, p.id, ticket_code, v.kind, operation_id, quantity, use_no, time
  FROM visit_galaxy v, box_office_product p
 WHERE v.box_office_product_code = p.code
   AND v.venue_id = p.venue_id
;

LOAD DATA INFILE 'galaxyimport/membership.txt'
INTO TABLE membership_galaxy
FIELDS ESCAPED BY ''
LINES TERMINATED BY '\r\n'
(venue_id, member_code, code, sequence, box_office_product_code, date_from, date_to, @dob, adult_qty, child_qty
, first, middle, last, street_1, street_2, city, state, country, phone)
SET dob = if(@dob > '1900-01-02', @dob, NULL)
;

INSERT member_address
     ( street_1, street_2, city, state, country, phone )
SELECT DISTINCT street_1, street_2, city, state, country, phone
  FROM membership_galaxy
;
INSERT member_name
     ( first, middle, last )
SELECT DISTINCT first, middle, last
  FROM membership_galaxy
;
INSERT member
     ( venue_id, code, last_membership_id)
SELECT DISTINCT venue_id, member_code, 0
  FROM membership_galaxy
;
INSERT membership
     ( venue_id, member_id, member_address_id, member_name_id, code, sequence, box_office_product_id
     , date_from, date_to, dob, adult_qty, child_qty )
SELECT g.venue_id, m.id, a.id, n.id, g.code, g.sequence, p.id
     , date_from, date_to, dob, adult_qty, child_qty
  FROM membership_galaxy g
  JOIN member m ON g.venue_id = m.venue_id AND g.member_code = m.code
  JOIN box_office_product p ON g.venue_id = p.venue_id AND g.box_office_product_code = p.code
  JOIN member_address a ON g.street_1 = a.street_1 AND g.street_2 = a.street_2 AND g.city = a.city
       AND g.state = a.state AND g.country = a.country AND g.phone = a.phone
  JOIN member_name n ON g.first = n.first AND g.middle = n.middle AND g.last = n.last
;
UPDATE member, (SELECT member_id, max(id) as maxid FROM membership GROUP BY member_id) x
   SET member.last_membership_id = x.maxid
 WHERE member.id = x.member_id
;
