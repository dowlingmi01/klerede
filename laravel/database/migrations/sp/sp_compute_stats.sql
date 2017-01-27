DROP PROCEDURE IF EXISTS sp_compute_stats;
CREATE PROCEDURE sp_compute_stats(IN in_venue_id integer, IN in_date date)
BEGIN
     DECLARE revenue_date varchar(255)
     ;
     DECLARE store_category_id int
     ;
     SELECT id INTO store_category_id FROM category WHERE code = 'store'
     ;
     DELETE FROM stat_sales
      WHERE venue_id = in_venue_id
        AND date = in_date
        AND category_id != store_category_id
     ;
     SELECT value INTO revenue_date
       FROM venue_variable
      WHERE venue_id = in_venue_id
        AND name = 'REVENUE_DATE'
     ;
     IF revenue_date = 'valid_date' THEN
          INSERT stat_sales
               ( venue_id, date, year, quarter, month, week
               , category_id
               , members, online
               , units, amount, transactions
               , created_at, updated_at )
          SELECT t.venue_id, l.valid_date, year(l.valid_date)
               , year(l.valid_date)*100 + quarter(l.valid_date)
               , year(l.valid_date)*100 + month(l.valid_date)
               , yearweek(l.valid_date, 3)
               , cd.category_id
               , IF(l.membership_id IS NOT NULL, 1, 0) as members
               , o.is_online as online
               , sum(quantity*p.is_unit), sum(sale_price)
               , count(distinct t.id)
               , CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            FROM transaction_line l
            STRAIGHT_JOIN transaction t ON l.transaction_id = t.id
            STRAIGHT_JOIN operator o ON t.operator_id = o.id
            STRAIGHT_JOIN product p ON p.id = l.product_id
            STRAIGHT_JOIN category_descendant cd ON cd.descendant_category_id = p.category_id
           WHERE t.venue_id = in_venue_id
             AND l.valid_date = in_date
           GROUP BY t.venue_id, l.valid_date, members, online, cd.category_id
          ;
     ELSE
          INSERT stat_sales
               ( venue_id, date, year, quarter, month, week
               , category_id
               , members, online
               , units, amount, transactions
               , created_at, updated_at )
         SELECT t.venue_id, l.valid_date, year(l.valid_date)
               , year(l.valid_date)*100 + quarter(l.valid_date)
               , year(l.valid_date)*100 + month(l.valid_date)
               , yearweek(l.valid_date, 3)
               , cd.category_id
               , IF(l.membership_id IS NOT NULL, 1, 0) as members
               , o.is_online as online
               , sum(quantity*p.is_unit), sum(sale_price)
               , count(distinct t.id)
               , CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            FROM transaction_line l
            STRAIGHT_JOIN transaction t ON l.transaction_id = t.id
            STRAIGHT_JOIN operator o ON t.operator_id = o.id
            STRAIGHT_JOIN product p ON p.id = l.product_id
            STRAIGHT_JOIN category_descendant cd ON cd.descendant_category_id = p.category_id
           WHERE t.venue_id = in_venue_id
             AND t.time >= in_date
             AND t.time < in_date + interval 1 day
           GROUP BY t.venue_id, l.valid_date, members, online, cd.category_id
          ;
     END IF;
END;
