SELECT DISTINCT h.cluster AS source_id
     , n.loc_suffix AS register_id
     , h.sale_no AS sequence
     , h.date_time AS time
     , h.operator AS operator_code
  FROM sale_hdr h
  JOIN sales_pt n ON h.salespoint = n.salespoint
  JOIN transact x ON h.sale_no = x.sale_no
 WHERE #CAFE_COND#
   AND h.cluster > #CAFE_LAST_TRAN_ID#
 ORDER BY source_id
