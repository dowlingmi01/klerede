SELECT PLU AS code
     , i.Descr AS description
     , o.AccountID AS account_code
  FROM Items i
  LEFT JOIN COA o ON i.Company = o.CompanyID AND i.Category = o.Category AND i.SubCat = o.SubCat
     AND (i.Kind NOT IN (4, 8, 17, 18) AND o.GLCode = 101
       OR i.Kind = 4 AND o.GLCode = 310
       OR i.Kind = 8 AND o.GLCode = 102
       OR i.Kind = 17 AND o.GLCode = 103
       OR i.Kind = 18 AND o.GLCode = 104
     )
 WHERE i.Company = #CAFE_COMPANY_ID#
