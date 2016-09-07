DROP PROCEDURE IF EXISTS sp_compute_stats_box_office;
CREATE PROCEDURE sp_compute_stats_box_office(IN in_venue_id integer, IN in_date date)
BEGIN
     DELETE FROM stat_sales
      WHERE venue_id = in_venue_id
        AND date = in_date
        AND channel_id IN (1,2)
     ;
     INSERT stat_sales
          ( venue_id, date, year, quarter, month, week
          , channel_id, box_office_product_kind_id
          , membership_kind_id, members, online
          , units, amount
          , created_at, updated_at )
     SELECT t.venue_id, date(t.time), year(t.time)
          , year(t.time)*100 + quarter(t.time)
          , year(t.time)*100 + month(t.time)
          , year(t.time)*100 + week(t.time)
          , IF(p.kind = 'pass', 2, 1) as channel_id, m.box_office_product_kind_id
          , IFNULL(p.membership_kind_id, 0), IF(p.kind = 'pass', 1, 0) as members, o.is_online as online
          , sum(quantity), sum(sale_price)
          , CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
       FROM box_office_transaction t
       STRAIGHT_JOIN box_office_transaction_line l ON l.box_office_transaction_id = t.id
       STRAIGHT_JOIN box_office_product p ON p.id = l.box_office_product_id
       STRAIGHT_JOIN box_office_product_kind_map m
             ON p.venue_id = m.venue_id
            AND p.account_code BETWEEN m.account_code_from AND m.account_code_to
       STRAIGHT_JOIN operator o ON t.operator_id = o.id
       WHERE t.venue_id = in_venue_id
         AND t.time >= in_date
         AND t.time < in_date + interval 1 day
      GROUP BY t.venue_id, date(t.time), channel_id, m.box_office_product_kind_id
          , p.membership_kind_id, members, online
     ;
END;