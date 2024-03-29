INSERT stat_visits
     ( venue_id, date, year, quarter, month, week, box_office_product_kind_id, units )
SELECT p.venue_id, date(v.time), year(v.time)
     , year(v.time)*100 + quarter(v.time)
     , year(v.time)*100 + month(v.time)
     , year(v.time)*100 + week(v.time)
     , m.box_office_product_kind_id, sum(quantity)
  FROM visit v
  STRAIGHT_JOIN box_office_product p ON v.box_office_product_id = p.id
  STRAIGHT_JOIN box_office_product_kind_map m
        ON p.venue_id = m.venue_id
       AND p.account_code BETWEEN m.account_code_from AND m.account_code_to
       AND box_office_product_kind_id < 4
  STRAIGHT_JOIN facility f ON v.facility_id = f.id
 WHERE f.is_ga = 1
 GROUP BY p.venue_id, date(v.time), m.box_office_product_kind_id
;
INSERT stat_sales
     ( venue_id, date, year, quarter, month, week
     , channel_id, box_office_product_kind_id
     , membership_kind_id, members, online
     , units, amount )
SELECT t.venue_id, date(t.time), year(t.time)
     , year(t.time)*100 + quarter(t.time)
     , year(t.time)*100 + month(t.time)
     , year(t.time)*100 + week(t.time)
     , IF(p.kind = 'pass', 2, 1) as channel_id, m.box_office_product_kind_id
     , IFNULL(p.membership_kind_id, 0), IF(p.kind = 'pass', 1, 0) as members, o.is_online as online
     , sum(quantity), sum(sale_price)
  FROM box_office_transaction_line l
  STRAIGHT_JOIN box_office_transaction t ON l.box_office_transaction_id = t.id
  STRAIGHT_JOIN box_office_product p ON p.id = l.box_office_product_id
  STRAIGHT_JOIN box_office_product_kind_map m
        ON p.venue_id = m.venue_id
       AND p.account_code BETWEEN m.account_code_from AND m.account_code_to
  STRAIGHT_JOIN operator o ON t.operator_id = o.id
 GROUP BY t.venue_id, date(t.time), channel_id, m.box_office_product_kind_id
     , p.membership_kind_id, members, online
;
