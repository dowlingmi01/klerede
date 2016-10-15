SELECT h.cluster AS source_id
     , d.cluster AS sequence
     , CAST(CASE WHEN i.validate2 > 0 THEN d.start_date ELSE d.date_time END AS date) AS valid_date
     , i.item_id AS box_office_product_code
     , d.extension AS sale_price
     , d.quantity
  FROM transact d
  JOIN sale_hdr h ON d.sale_no = h.sale_no
  JOIN items i ON d.department = i.department AND d.category = i.category AND d.item = i.item
 WHERE (RTRIM(d.department) + '|' + RTRIM(d.category))
      NOT IN ('**TRANS**|**TRANS**', 'MISCREV|DR-ADM', 'MISCREV|PAC-CONV')
   AND d.cluster > #BOX_OFFICE_LAST_TRAN_DETAIL_ID#
 ORDER BY sequence
