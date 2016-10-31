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
               ( venue_id, date, year, quarter, month, week, box_office_product_kind_id, units
               , created_at, updated_at )
          SELECT p.venue_id, v.valid_date, year(v.valid_date)
               , year(v.valid_date)*100 + quarter(v.valid_date)
               , year(v.valid_date)*100 + month(v.valid_date)
               , year(v.valid_date)*100 + week(v.valid_date)
               , m.box_office_product_kind_id, sum(quantity)
               , CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            FROM box_office_transaction_line v
            STRAIGHT_JOIN box_office_transaction t ON v.box_office_transaction_id = t.id
            STRAIGHT_JOIN box_office_product p ON v.box_office_product_id = p.id
            STRAIGHT_JOIN box_office_product_kind_map m
                  ON p.venue_id = m.venue_id
                 AND p.account_code BETWEEN m.account_code_from AND m.account_code_to
                 AND box_office_product_kind_id IN (1, 2, 3, 6)
           WHERE p.is_ga = 1
             AND p.kind = 'ticket'
             AND t.venue_id = in_venue_id
             AND v.valid_date = in_date
           GROUP BY p.venue_id, v.valid_date, m.box_office_product_kind_id
          ;
     ELSE
          INSERT stat_visits
               ( venue_id, date, year, quarter, month, week, box_office_product_kind_id, units
               , created_at, updated_at )
          SELECT p.venue_id, date(v.time), year(v.time)
               , year(v.time)*100 + quarter(v.time)
               , year(v.time)*100 + month(v.time)
               , year(v.time)*100 + week(v.time)
               , m.box_office_product_kind_id, sum(quantity)
               , CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            FROM visit v
            STRAIGHT_JOIN box_office_product p ON v.box_office_product_id = p.id
            STRAIGHT_JOIN box_office_product_kind_map m
                  ON p.venue_id = m.venue_id
                 AND p.account_code BETWEEN m.account_code_from AND m.account_code_to
                 AND box_office_product_kind_id IN (1, 2, 3, 6)
            STRAIGHT_JOIN facility f ON v.facility_id = f.id
           WHERE f.is_ga = 1
             AND v.venue_id = in_venue_id
             AND v.time >= in_date
             AND v.time < in_date + interval 1 day
           GROUP BY p.venue_id, date(v.time), m.box_office_product_kind_id
          ;
          INSERT stat_hourly_visits
               ( venue_id, date, hour, year, quarter, month, week, box_office_product_kind_id, units
               , created_at, updated_at )
          SELECT p.venue_id, date(v.time), hour(v.time), year(v.time)
               , year(v.time)*100 + quarter(v.time)
               , year(v.time)*100 + month(v.time)
               , year(v.time)*100 + week(v.time)
               , m.box_office_product_kind_id, sum(quantity)
               , CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            FROM visit v
            STRAIGHT_JOIN box_office_product p ON v.box_office_product_id = p.id
            STRAIGHT_JOIN box_office_product_kind_map m
                  ON p.venue_id = m.venue_id
                 AND p.account_code BETWEEN m.account_code_from AND m.account_code_to
                 AND box_office_product_kind_id IN (1, 2, 3, 6)
             STRAIGHT_JOIN facility f ON v.facility_id = f.id
           WHERE f.is_ga = 1
             AND v.venue_id = in_venue_id
             AND v.time >= in_date
             AND v.time < in_date + interval 1 day
           GROUP BY p.venue_id, date(v.time), hour(v.time), m.box_office_product_kind_id
          ;
     END IF;
END;
