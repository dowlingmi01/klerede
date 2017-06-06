DROP PROCEDURE IF EXISTS sp_compute_goals;
CREATE PROCEDURE sp_compute_goals(IN in_venue_id integer)
BEGIN
     DELETE FROM goal_sales_daily
      WHERE venue_id = in_venue_id
        AND computed = 1
     ;
     INSERT goal_sales_daily
          ( venue_id, date, year, quarter, month, week
          , category_id, type
          , goal
          , computed
          , created_at, updated_at )
     SELECT venue_id, date, year, quarter, month, week
          , cd.category_id, type
          , sum(goal)
          , 1
          , CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
       FROM goal_sales_daily g
       STRAIGHT_JOIN category_descendant cd ON cd.descendant_category_id = g.category_id
      WHERE g.venue_id = in_venue_id
        AND cd.category_id != g.category_id
      GROUP BY venue_id, date, year, quarter, month, week, cd.category_id, type
     ;
END;
