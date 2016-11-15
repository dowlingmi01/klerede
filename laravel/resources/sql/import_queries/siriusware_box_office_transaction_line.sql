SELECT h.cluster AS source_id
     , d.cluster AS sequence
     , #BOTL_VALID_DATE_EXP# AS valid_date
     , x.item_id AS box_office_product_code
     , d.extension AS sale_price
     , d.quantity
  FROM transact d
  JOIN sale_hdr h ON d.sale_no = h.sale_no
  JOIN items x ON d.department = x.department AND d.category = x.category AND d.item = x.item
 WHERE #BOP_COND#
   AND d.cluster > #BOX_OFFICE_LAST_TRAN_DETAIL_ID#
 ORDER BY sequence
