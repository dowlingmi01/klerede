SELECT guest_no as member_code
     , pass_no as code
     , i.item_id as box_office_product_code
     , start_date as date_from
     , expires as date_to
     , p.last_mod
  FROM gst_pass p
  JOIN items i ON p.department = i.department AND p.category = i.category AND p.item = i.item
 WHERE p.last_mod > #MEMBERSHIP_LAST_UPDATE#
 ORDER BY p.last_mod
