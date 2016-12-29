DROP PROCEDURE IF EXISTS sp_compute_stats_members;
CREATE PROCEDURE sp_compute_stats_members(IN in_venue_id integer, IN d_from date, IN d_to date)
BEGIN
SET @mydate = d_to;
WHILE @mydate >= d_from DO
     INSERT stat_members
     ( venue_id, date, recency, frequency, returning_members, current_memberships, current_members
     , created_at, updated_at )
     SELECT in_venue_id, @mydate, avg(dayslastv), avg(nv), count(*), 0, 0
          , CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
       FROM (
          SELECT p.member_id
               , DATEDIFF(@mydate, date(max(u.time))) as dayslastv
               , count(DISTINCT CASE WHEN date(u.time) < date_sub(@mydate, INTERVAL 1 YEAR) THEN NULL
                                     ELSE date(u.time)
								                END) as nv
            FROM (
               SELECT DISTINCT member_id
                 FROM visit u
                 JOIN membership p ON u.membership_id = p.id
                 JOIN product o ON u.product_id = o.id
				        WHERE u.time between @mydate and date_add(@mydate, interval 1 day)
                  AND u.venue_id = in_venue_id
                  AND p.venue_id = in_venue_id
                  AND o.category_id != 26
             ) m
			      JOIN membership p ON m.member_id = p.member_id
            JOIN visit u ON u.membership_id = p.id
            JOIN product o ON u.product_id = o.id
           WHERE u.time < @mydate
             AND u.kind = 'pass'
             AND u.venue_id = in_venue_id
             AND p.venue_id = in_venue_id
             AND o.category_id != 26
           GROUP BY p.member_id
      ) as x
     ON DUPLICATE KEY
     UPDATE recency = VALUES(recency)
          , frequency = VALUES(frequency)
          , returning_members = VALUES(returning_members)
          , updated_at = CURRENT_TIMESTAMP
     ;
     INSERT stat_members
     ( venue_id, date, recency, frequency, returning_members, current_memberships
     , current_members
     , created_at, updated_at )
     SELECT in_venue_id, @mydate, 0, 0, 0, count(x.member_id)
          , sum(case when adult_qty + child_qty > 0 then adult_qty + child_qty else 1 end)
          , CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
       FROM (
            SELECT member_id, max(adult_qty) as adult_qty
                 , max(child_qty) as child_qty
              FROM membership s
             WHERE @mydate BETWEEN date_from AND date_to
               AND s.venue_id = in_venue_id
             GROUP BY member_id
            ) x
     ON DUPLICATE KEY
     UPDATE current_members = VALUES(current_members)
          , current_memberships = VALUES(current_memberships)
          , updated_at = CURRENT_TIMESTAMP
     ;
     SET @mydate = date_sub(@mydate, interval 1 day);
END WHILE;
END;
