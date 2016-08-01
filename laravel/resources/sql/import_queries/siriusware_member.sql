SELECT g.guest_no AS code
     , CASE gender WHEN 'M' THEN 1 WHEN 'F' THEN 2 ELSE 0 END as gender
     , birth_date AS dob
     , a.city
     , a.state
     , a.zip
     , a.country
     , g.last_mod
  FROM guests g
  LEFT JOIN address a ON a.guest_no = g.guest_no
 WHERE g.last_mod > #MEMBER_LAST_UPDATE#
 ORDER BY g.last_mod
