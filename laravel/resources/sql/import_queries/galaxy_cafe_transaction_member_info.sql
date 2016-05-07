SELECT d.JnlTranID AS source_id
     , d.JnlDetailID as sequence
     , a.ContactID as member_code
  FROM JnlDetails d
  JOIN JnlHeaders h WITH (INDEX(CIXJnlHeadersTranDate)) ON h.JnlTranID = d.JnlTranID
  JOIN JnlLoyaltyAccounts j ON d.AuxTableID = j.JnlLoyaltyAccountID
  JOIN LoyaltyAccounts a ON j.AccountNo = a.AccountNo
 WHERE TranKind = 1
   AND d.JnlCodeID = 1014
   AND h.CompanyID = #CAFE_COMPANY_ID#
   AND d.JnlDetailID > #CAFE_LAST_TRAN_MEMBER_INFO_ID#
