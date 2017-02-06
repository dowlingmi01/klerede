SELECT h.cluster AS source_id
     , d.cluster AS sequence
     , #BOTL_VALID_DATE_EXP# AS valid_date
     , #SPECIAL_EXP# AS product_code
  FROM transact d
  JOIN sale_hdr h ON d.sale_no = h.sale_no
 WHERE #SPECIAL_EXP# IS NOT NULL
   AND d.cluster > #LAST_TRAN_DETAIL_SPECIAL_ID#
 ORDER BY sequence
