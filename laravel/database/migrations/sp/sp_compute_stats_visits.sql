DROP PROCEDURE IF EXISTS sp_compute_stats_visits;
CREATE PROCEDURE sp_compute_stats_visits(IN in_venue_id integer, IN in_date date)
BEGIN
     DECLARE visits_source varchar(255)
     ;
     DELETE FROM stat_visits
      WHERE venue_id = in_venue_id
        AND date = in_date
     ;
     DELETE FROM stat_hourly_visits
     WHERE venue_id = in_venue_id
           AND date = in_date
     ;
     SELECT value INTO visits_source
       FROM venue_variable
      WHERE venue_id = in_venue_id
        AND name = 'VISITS_SOURCE'
     ;
     IF visits_source = 'sales' THEN
          INSERT stat_visits
               ( venue_id, date, year, quarter, month, week, category_id, members, visits, visits_unique
               , created_at, updated_at )
          SELECT t.venue_id, v.valid_date, year(v.valid_date)
               , year(v.valid_date)*100 + quarter(v.valid_date)
               , year(v.valid_date)*100 + month(v.valid_date)
               , yearweek(v.valid_date, 3)
               , cd.category_id
               , IF(v.membership_id IS NOT NULL, 1, 0) as members
               , sum(quantity*p.is_visitor), sum(quantity*p.is_unique_visitor)
               , CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            FROM transaction_line v
            STRAIGHT_JOIN transaction t ON v.transaction_id = t.id
            STRAIGHT_JOIN product p ON v.product_id = p.id
            STRAIGHT_JOIN category_descendant cd ON cd.descendant_category_id = p.category_id
           WHERE (p.is_visitor = 1 OR p.is_unique_visitor = 1)
             AND t.venue_id = in_venue_id
             AND v.valid_date = in_date
           GROUP BY t.venue_id, v.valid_date, cd.category_id
          ;
     ELSE
          INSERT stat_visits
               ( venue_id, date, year, quarter, month, category_id, week, members, visits, visits_unique
               , created_at, updated_at )
          SELECT v.venue_id, date(v.time), year(v.time)
               , year(v.time)*100 + quarter(v.time)
               , year(v.time)*100 + month(v.time)
               , yearweek(v.time, 3)
               , cd.category_id
               , IF(v.membership_id IS NOT NULL, 1, 0) as members
               , sum(quantity*p.is_visitor), sum(quantity*p.is_unique_visitor)
               , CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            FROM visit v
            STRAIGHT_JOIN product p ON v.product_id = p.id
            STRAIGHT_JOIN facility f ON v.facility_id = f.id
            STRAIGHT_JOIN category_descendant cd ON cd.descendant_category_id = p.category_id
           WHERE f.is_ga = 1
             AND v.venue_id = in_venue_id
             AND v.time >= in_date
             AND v.time < in_date + interval 1 day
           GROUP BY v.venue_id, date(v.time), cd.category_id
          ;
           
     END IF;
END;
