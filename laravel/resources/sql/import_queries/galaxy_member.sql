SELECT c.CustContactID AS code
     , c.Gender as gender
     , c.AgeGroup as age_group
     , c.DOB as dob
     , a.City as city
     , a.State as state
     , a.Postal as zip
     , 'US' as country
     , CASE WHEN a.LastUpdate IS NULL OR c.LastUpdate > a.LastUpdate
            THEN c.LastUpdate
            ELSE a.LastUpdate
       END as last_changed
  FROM CustContacts c
  JOIN ( SELECT DISTINCT ContactID FROM Passes
          UNION
         SELECT DISTINCT ContactID FROM LoyaltyAccounts
       ) x
    ON x.ContactID = c.CustContactID
  LEFT JOIN Addresses a ON c.AddressID = a.AddressID
 WHERE c.LastUpdate > '#MEMBER_LAST_UPDATE#'
    OR a.LastUpdate > '#MEMBER_LAST_UPDATE#'
 ORDER BY code
