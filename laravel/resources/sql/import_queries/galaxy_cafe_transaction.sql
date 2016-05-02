SELECT JnlTranID AS source_id
     , NodeNo AS register_id
     , TranNo AS sequence
     , FiscalDate AS business_day
     , TranDate AS time
     , UserId AS operator_id
     , n.Agency AS agency_id
  FROM JnlHeaders h
  JOIN Nodes n ON h.NodeNo = n.NodeNumber
 WHERE TranKind = 1
   AND CompanyID = #CAFE_COMPANY_ID#
   AND JnlTranID > #CAFE_LAST_TRAN_ID#
 ORDER BY source_id
