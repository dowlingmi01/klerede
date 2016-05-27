INSERT IGNORE INTO weather_daily
SELECT * FROM klerede_prod.weather_daily
 WHERE venue_id = 1588
;
INSERT IGNORE INTO weather_hourly
SELECT * FROM klerede_prod.weather_hourly
 WHERE venue_id = 1588
;
DELETE FROM stat_sales
 WHERE venue_id = 1588
   AND channel_id = 4
   AND date > '2015-01-28'
;
INSERT stat_sales
     ( venue_id, date, year, quarter, month, week, channel_id, box_office_product_kind_id, membership_kind_id
     , members, online, units, amount, created_at, updated_at
     )
SELECT venue_id, date, year, quarter, month, week, channel_id, box_office_product_kind_id, membership_kind_id
     , members, online, units, amount, created_at, updated_at
  FROM klerede_prod.stat_sales
 WHERE venue_id = 1588
   AND date > '2015-01-28'
;
