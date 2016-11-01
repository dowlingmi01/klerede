DROP PROCEDURE IF EXISTS sp_compute_stats_cafe;
CREATE PROCEDURE sp_compute_stats_cafe(IN in_venue_id integer, IN in_date date)
BEGIN
     DELETE FROM stat_sales
      WHERE venue_id = in_venue_id
        AND date = in_date
        AND channel_id = 3
     ;
     INSERT stat_sales
          ( venue_id, date, year, quarter, month, week
          , channel_id, box_office_product_kind_id
          , membership_kind_id, members, online
          , units, amount
          , created_at, updated_at )
     SELECT t.venue_id, t.business_day, year(t.business_day)
          , year(t.business_day)*100 + quarter(t.business_day)
          , year(t.business_day)*100 + month(t.business_day)
          , yearweek(t.business_day, 3)
          , 3 as channel_id, 0
          , 0, IF(member_id IS NULL , 0, 1) as members, 0
          , sum(quantity), sum(sale_price)
          , CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
       FROM cafe_transaction t
       JOIN cafe_transaction_line l ON l.cafe_transaction_id = t.id
      WHERE t.venue_id = in_venue_id
        AND t.business_day = in_date
      GROUP BY t.venue_id, t.business_day, members
     ;
END;
