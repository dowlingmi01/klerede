SELECT h.cluster AS source_id
     , d.cluster AS sequence
     , x.item_id AS cafe_product_code
     , d.extension AS sale_price
     , d.quantity
  FROM transact d
  JOIN sale_hdr h ON d.sale_no = h.sale_no
  JOIN items x ON d.department = x.department AND d.category = x.category AND d.item = x.item
 WHERE #CAFE_COND#
   AND d.cluster > #CAFE_LAST_TRAN_DETAIL_ID#
 ORDER BY sequence
