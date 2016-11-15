SELECT item_id AS code
     , RTRIM(x.department) + '|' + RTRIM(x.category) + '|' + RTRIM(x.item) + '|' + descrip AS description
     , #BOP_ACCT_CODE_EXP# AS account_code
     , #BOP_KIND_EXP# AS kind
     , #BOP_IS_GA_EXP# AS is_ga
  FROM items x
  LEFT JOIN template t
      ON x.department = t.department
     AND x.category = t.category
     AND x.item = t.item
 WHERE #BOP_COND#
