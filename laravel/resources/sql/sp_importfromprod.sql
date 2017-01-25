DROP PROCEDURE IF EXISTS sp_importfromprod;

DELIMITER //

CREATE PROCEDURE sp_importfromprod()
BEGIN
DECLARE store_category_id int
;

SELECT id INTO store_category_id FROM category WHERE code = 'store'
;
INSERT IGNORE INTO weather_daily
SELECT * FROM klerede_prod.weather_daily
 WHERE venue_id in (1518, 1588, 1204, 1597, 1519, 1529, 1604)
;
DELETE FROM stat_sales
 WHERE venue_id = 1588
   AND category_id = store_category_id
   AND date > '2015-01-28'
;
DELETE FROM stat_sales
 WHERE venue_id IN (1518, 1204, 1597, 1519, 1529, 1604)
   AND category_id = store_category_id
;
INSERT stat_sales
     ( venue_id, date, year, quarter, month, week, category_id
     , members, online, transactions, units, amount, created_at, updated_at
     )
SELECT venue_id, date, year, quarter, month, week, store_category_id
     , members, online, units, units, amount, created_at, updated_at
  FROM klerede_prod.stat_sales
 WHERE venue_id = 1588
   AND date > '2015-01-28'
;
INSERT stat_sales
     ( venue_id, date, year, quarter, month, week, category_id
     , members, online, transactions, units, amount, created_at, updated_at
     )
SELECT venue_id, date, year, quarter, month, week, store_category_id
     , members, online, units, units, amount, created_at, updated_at
  FROM klerede_prod.stat_sales
 WHERE venue_id IN (1518, 1204, 1597, 1519, 1529, 1604)
;

END;//

DELIMITER ;
