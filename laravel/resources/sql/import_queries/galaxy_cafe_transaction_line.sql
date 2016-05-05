SELECT d.JnlTranID AS source_id
     , d.JnlDetailID AS sequence
     , RTRIM(i.PLU) AS cafe_product_code
     , d.Amount AS sale_price
     , d.Qty AS quantity
  FROM JnlDetails d
  JOIN JnlHeaders h WITH (INDEX(CIXJnlHeadersTranDate)) ON h.JnlTranID = d.JnlTranID
  JOIN JnlItems i ON d.AuxTableID = i.JnlItemID
 WHERE TranKind = 1
   AND CompanyID = #CAFE_COMPANY_ID#
   AND d.JnlCodeID BETWEEN 101 AND 104
   AND d.AccountID LIKE '#CAFE_COMPANY_ID_4D#%'
   AND d.JnlDetailID > #CAFE_LAST_TRAN_DETAIL_ID#
 ORDER BY source_id, sequence
