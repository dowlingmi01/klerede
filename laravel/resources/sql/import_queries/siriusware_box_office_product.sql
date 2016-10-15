SELECT item_id AS code
     , RTRIM(i.department) + '|' + RTRIM(i.category) + '|' + RTRIM(i.item) + '|' + descrip AS description
     , CASE WHEN user_code != '' THEN user_code
            ELSE FORMAT(pr_ctr_1, '000')
       END AS account_code
     , CASE WHEN t.department IS NULL THEN 'other'
            WHEN i.validate2 > 0 THEN 'ticket'
            ELSE 'pass'
       END AS kind
     , CASE WHEN cast(a_no_loc_l as varchar) NOT LIKE '%|1|%' THEN 1
            ELSE 0
       END AS is_ga
  FROM items i
  LEFT JOIN template t
      ON i.department = t.department
     AND i.category = t.category
     AND i.item = t.item
