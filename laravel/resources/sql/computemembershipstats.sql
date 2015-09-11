DROP PROCEDURE IF EXISTS sp_compute_membership_stats;

DELIMITER //

CREATE PROCEDURE sp_compute_membership_stats(IN d_from date, IN d_to date)
BEGIN

SET @mydate = d_to;
WHILE @mydate >= d_from DO
     INSERT stat_members
     ( venue_id, date, recency, frequency, returning_members, current_members
     , created_at, updated_at )
     SELECT venue_id, @mydate, avg(dayslastv), avg(nv), count(*), 0
          , CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
       FROM (
          SELECT p.venue_id
               , p.member_id
               , DATEDIFF(@mydate, date(max(u.time))) as dayslastv
               , count(DISTINCT CASE WHEN date(u.time) < date_sub(@mydate, INTERVAL 1 YEAR) THEN NULL
                                     ELSE date(u.time)
								END) as nv
            FROM (
               SELECT DISTINCT member_id
                 FROM visit u
                 JOIN membership p ON u.membership_id = p.id
				WHERE u.time between @mydate and date_add(@mydate, interval 1 day)
             ) m
			JOIN membership p ON m.member_id = p.member_id
            JOIN visit u  ON u.membership_id = p.id
           WHERE u.time < @mydate
             AND u.kind = 'pass'
           GROUP BY p.venue_id, p.member_id
      ) as x
      GROUP BY venue_id
     ON DUPLICATE KEY
     UPDATE recency = VALUES(recency)
          , frequency = VALUES(frequency)
          , returning_members = VALUES(returning_members)
	      , updated_at = CURRENT_TIMESTAMP
     ;
     INSERT stat_members
     ( venue_id, date, recency, frequency, returning_members, current_members
     , created_at, updated_at )
     SELECT venue_id, @mydate, 0, 0, 0, count(distinct member_id)
          , CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
       FROM membership
      WHERE @mydate BETWEEN date_from AND date_to
      GROUP BY venue_id
     ON DUPLICATE KEY
     UPDATE current_members = VALUES(current_members)
	      , updated_at = CURRENT_TIMESTAMP
     ;
     SET @mydate = date_sub(@mydate, interval 1 day);
END WHILE;
END;//

DELIMITER ;
