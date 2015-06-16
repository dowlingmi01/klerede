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
