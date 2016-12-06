SELECT h.cluster AS source_id
     , d.cluster AS sequence
     , i.guest_no AS member_code
     , CASE WHEN i.guest_no != i.info_num AND i.addit_info IN ('P', '') THEN i.info_num ELSE '' END AS membership_code
     , i.cluster AS info_id
  FROM tr_info i
  JOIN transact d ON i.sale_no = d.sale_no and i.trans_no = d.trans_no
  JOIN sale_hdr h ON d.sale_no = h.sale_no
  JOIN items x ON d.department = x.department AND d.category = x.category AND d.item = x.item
 WHERE #BOP_COND#
   AND i.cluster > #BOX_OFFICE_LAST_TRAN_MEMBER_INFO_ID#
   AND i.guest_no != 0
   AND info_type IN (10, 20, 30)
 ORDER BY info_id
