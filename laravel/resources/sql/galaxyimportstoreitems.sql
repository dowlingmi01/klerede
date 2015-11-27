LOAD DATA INFILE 'galaxyimport/storeitem.txt'
INTO TABLE store_product_galaxy
LINES TERMINATED BY '\r\n'
(venue_id, code, description, scanned_code, store_product_category_source_id)
;

INSERT store_product
     ( store_product_category_id, code, description, scanned_code )
SELECT c.id, p.code, p.description, scanned_code
  FROM store_product_galaxy p
  JOIN store_product_category_galaxy g
    ON p.venue_id = g.venue_id AND p.store_product_category_source_id = g.source_id
  JOIN store_product_category c
    ON g.code = c.code
;

