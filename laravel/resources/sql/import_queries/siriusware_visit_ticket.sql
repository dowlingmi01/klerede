SELECT u.cluster AS source_id
     , u.location AS workstation_code
     , u.location2 AS facility_code
     , i.item_id AS box_office_product_code
     , u.ref_no AS ticket_code
     , 'ticket' AS kind
     , u.date_time AS time
  FROM acc_actv u
  JOIN access a ON u.ref_no = a.pass_no
  JOIN items i ON a.department = i.department AND a.category = i.category AND a.item = i.item
 WHERE u.activ_type = 110
   AND u.cluster > #LAST_TICKET_USAGE_ID#
 ORDER BY source_id
