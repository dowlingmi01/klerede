INSERT stat_sales
     ( venue_id, date, year, quarter, month, week
     , channel_id, box_office_product_kind_id
     , membership_kind_id, members, online
     , units, amount )
SELECT t.venue_id, t.business_day, year(t.business_day)
     , year(t.business_day)*100 + quarter(t.business_day)
     , year(t.business_day)*100 + month(t.business_day)
     , year(t.business_day)*100 + week(t.business_day)
     , 3 as channel_id, 0
     , 0, IF(member_id IS NULL , 0, 1) as members, 0
     , sum(quantity), sum(sale_price)
  FROM cafe_transaction t
  JOIN cafe_transaction_line l ON l.cafe_transaction_id = t.id
 GROUP BY t.venue_id, t.business_day, members
;
