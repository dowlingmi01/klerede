SELECT ContactID as member_code
     , VisualID as code
     , PassNo as sequence
     , PLU as box_office_product_code
     , CASE WHEN ValidFrom IS NOT NULL AND ValidFrom > '2000-01-01'
            THEN ValidFrom
            ELSE DateOpened
       END as date_from
     , ValidUntil as date_to
     , DOB as dob
     , AdultQty as adult_qty
     , ChildQty as child_qty
     , City as city
     , State as state
     , Zip as zip
     , 'US' as country
     , LastUpdate as last_changed
  FROM Passes
 WHERE VisualID != ''
   AND ValidUntil IS NOT NULL
   AND (ValidFrom > '2000-01-01' OR DateOpened IS NOT NULL)
   AND LastUpdate > '#MEMBERSHIP_LAST_UPDATE#'
 ORDER BY sequence
