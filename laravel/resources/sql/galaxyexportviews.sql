USE export
GO
IF object_id('export..transaction_header') IS NOT NULL
   DROP VIEW transaction_header;
GO
CREATE VIEW transaction_header AS
SELECT JnlTranID AS source_id
     , 1588 AS venue_id
     , NodeNo AS register_id
     , TranNo AS sequence
     , FiscalDate AS business_day
     , TranDate AS time
     , UserId AS operator_id
     , n.Agency AS agency_id
  FROM Galaxy1..JnlHeaders h
  JOIN Galaxy1..Nodes n ON h.NodeNo = n.NodeNumber
 WHERE TranKind = 1
   AND CompanyID = 1
GO
IF object_id('transaction_line') IS NOT NULL
   DROP VIEW transaction_line;
GO
CREATE VIEW transaction_line AS
SELECT d.JnlTranID AS source_id
     , 1588 AS venue_id
     , d.JnlDetailID AS sequence
	 , t.PLU AS box_office_product_code
	 , t.VisualID AS ticket_code
	 , d.Amount AS sale_price
	 , d.Qty AS quantity
  FROM Galaxy1..JnlDetails d
  JOIN Galaxy1..JnlHeaders h WITH (INDEX(CIXJnlHeadersTranDate)) ON h.JnlTranID = d.JnlTranID
  LEFT JOIN Galaxy1..JnlTickets t WITH (INDEX(pkjnlticketsjnldetailid)) ON d.AuxTableID = t.JnlDetailID
  LEFT JOIN Galaxy1..Items i ON t.PLU = i.PLU
 WHERE TranKind = 1
   AND CompanyID = 1
   AND d.JnlCodeID = 101
GO
IF object_id('item') IS NOT NULL
   DROP VIEW item;
GO
CREATE VIEW item AS
SELECT 1588 AS venue_id
     , PLU AS code
	 , i.Descr AS description
	 , CASE WHEN i.PassKind > 0 THEN 'pass'
            WHEN i.Category < 800 THEN 'ticket'
            ELSE 'other'
       END AS kind
	 , CASE WHEN a.OperationID IS NOT NULL THEN 1
            ELSE 0
       END AS is_ga
	 , i.DeliveryMethodGroupID AS delivery_method_id
  FROM Galaxy1..Items i
  LEFT JOIN Galaxy1..AccessCodes c ON i.AccessCode = c.AccessCode
  LEFT JOIN ( Galaxy1..BankDetails d
	   JOIN Galaxy1..AdmissionDetails a ON d.AdmissionID = a.AdmHeaderID and a.OperationID = 1
	   ) ON c.BankHeaderID = d.BankHeaderID
 WHERE i.Company = 1
GO
IF object_id('visit') IS NOT NULL
   DROP VIEW visit;
GO
CREATE VIEW visit AS
SELECT u.UsageID AS source_id
     , 1588 AS venue_id
	 , u.ACP AS acp_id
	 , ISNULL(MAX(p.PLU), MAX(t.PLU)) AS box_office_product_code
	 , u.VisualID AS ticket_code
	 , CASE WHEN MAX(p.PLU) IS NOT NULL THEN 'pass'
            WHEN MAX(t.PLU) IS NOT NULL THEN 'ticket'
            ELSE 'pass'
       END AS kind
	 , u.OperationID AS operation_id
	 , u.Qty AS quantity
	 , u.UseNo AS use_no
	 , u.UseTime AS time
  FROM Galaxy1..Usage u
  LEFT JOIN Galaxy1..Tickets t ON u.VisualID = t.VisualID
  LEFT JOIN Galaxy1..Passes p ON u.VisualID = p.VisualID
 WHERE code = 0 AND u.Status = 0
 GROUP BY u.UsageID, u.ACP, u.VisualID, u.OperationID, u.Qty, u.UseNo, u.UseTime
GO
