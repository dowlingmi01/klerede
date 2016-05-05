SELECT RTRIM(PLU) AS code
     , i.Descr AS description
     , o.AccountID AS account_code
     , CASE WHEN i.PassKind > 0 THEN 'pass'
            WHEN i.Category < 800 THEN 'ticket'
            ELSE 'other'
       END AS kind
     , CASE WHEN a.OperationID IS NOT NULL THEN 1
            ELSE 0
       END AS is_ga
     , i.DeliveryMethodGroupID AS delivery_method_id
  FROM Items i
  LEFT JOIN AccessCodes c ON i.AccessCode = c.AccessCode
  LEFT JOIN ( BankDetails d
	   JOIN AdmissionDetails a ON d.AdmissionID = a.AdmHeaderID and a.OperationID = 1
	   ) ON c.BankHeaderID = d.BankHeaderID
  LEFT JOIN COA o ON i.Company = o.CompanyID AND i.Category = o.Category AND i.SubCat = o.SubCat
     AND (i.Kind NOT IN (4, 8, 17, 18) AND o.GLCode = 101
       OR i.Kind = 4 AND o.GLCode = 310
       OR i.Kind = 8 AND o.GLCode = 102
       OR i.Kind = 17 AND o.GLCode = 103
       OR i.Kind = 18 AND o.GLCode = 104
     )
 WHERE i.Company = #BOX_OFFICE_COMPANY_ID#
