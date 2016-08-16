SELECT u.cluster AS source_id
     , u.location AS workstation_code
     , u.location2 AS facility_code
     , i.item_id AS box_office_product_code
     , u.ref_no AS ticket_code
     , 'pass' AS kind
     , u.date_time AS time
  FROM gst_actv u
  JOIN gst_pass a ON u.ref_no = a.pass_no
  JOIN items i ON a.department = i.department AND a.category = i.category AND a.item = i.item
 WHERE u.activ_type = 110
   AND u.cluster > #LAST_PASS_USAGE_ID#
