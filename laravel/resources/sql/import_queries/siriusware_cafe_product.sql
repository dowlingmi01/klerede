SELECT item_id AS code
     , RTRIM(x.department) + '|' + RTRIM(x.category) + '|' + RTRIM(x.item) + '|' + descrip AS description
  FROM items x
  LEFT JOIN template t
      ON x.department = t.department
     AND x.category = t.category
     AND x.item = t.item
 WHERE #CAFE_COND#
