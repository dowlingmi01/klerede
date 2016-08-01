SELECT DISTINCT h.cluster AS source_id
     , n.loc_suffix AS register_id
     , h.sale_no AS sequence
     , h.date_time AS time
     , h.operator AS operator_code
  FROM sale_hdr h
  JOIN sales_pt n ON h.salespoint = n.salespoint
  JOIN transact t ON h.sale_no = t.sale_no
 WHERE (RTRIM(t.department) + '|' + RTRIM(t.category))
      NOT IN ('**TRANS**|**TRANS**', 'MISCREV|DR-ADM', 'MISCREV|PAC-CONV')
   AND h.cluster > #BOX_OFFICE_LAST_TRAN_ID#
 ORDER BY source_id
