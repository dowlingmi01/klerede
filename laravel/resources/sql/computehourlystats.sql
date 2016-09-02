INSERT stat_hourly_visits
     ( venue_id, date, hour, year, quarter, month, week, box_office_product_kind_id, units )
SELECT p.venue_id, date(v.time), hour(v.time), year(v.time)
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
 GROUP BY p.venue_id, date(v.time), hour(v.time), m.box_office_product_kind_id
;
