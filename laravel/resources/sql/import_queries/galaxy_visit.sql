SELECT u.UsageID AS source_id
     , u.ACP AS acp_id
     , a.FacilityID as facility_id
     , RTRIM(ISNULL(MAX(p.PLU), MAX(t.PLU))) AS box_office_product_code
     , u.VisualID AS ticket_code
     , CASE WHEN MAX(p.PLU) IS NOT NULL THEN 'pass'
            WHEN MAX(t.PLU) IS NOT NULL THEN 'ticket'
            ELSE 'pass'
       END AS kind
     , u.Qty AS quantity
     , u.UseNo AS use_no
     , u.UseTime AS time
  FROM Usage u
  LEFT JOIN Tickets t ON u.VisualID = t.VisualID
  LEFT JOIN Passes p ON u.VisualID = p.VisualID
  LEFT JOIN ACPs a ON u.ACP = a.AcpId
 WHERE code = 0 AND u.Status = 0
   AND u.UsageID > #LAST_USAGE_ID#
 GROUP BY u.UsageID, u.ACP, a.FacilityID, u.VisualID, u.OperationID, u.Qty, u.UseNo, u.UseTime
