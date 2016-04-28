SELECT d.JnlTranID AS source_id
     , d.JnlDetailID AS sequence
     , ISNULL(t.PLU, i.PLU) AS box_office_product_code
     , t.VisualID AS ticket_code
     , d.Amount AS sale_price
     , d.Qty AS quantity
  FROM JnlDetails d
  JOIN JnlHeaders h WITH (INDEX(CIXJnlHeadersTranDate)) ON h.JnlTranID = d.JnlTranID
  LEFT JOIN JnlTickets t WITH (INDEX(pkjnlticketsjnldetailid)) ON d.JnlCodeID = 101 AND d.AuxTableID = t.JnlDetailID
  LEFT JOIN JnlItems i ON d.JnlCodeID BETWEEN 102 AND 104 AND d.AuxTableID = i.JnlItemID
 WHERE TranKind = 1
   AND CompanyID = #BOX_OFFICE_COMPANY_ID#
   AND d.JnlCodeID BETWEEN 101 AND 104
   AND d.AccountID LIKE '#BOX_OFFICE_COMPANY_ID_4D#%'
   AND d.JnlDetailID > #BOX_OFFICE_LAST_TRAN_DETAIL_ID#
 ORDER BY source_id, sequence
