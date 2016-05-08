bcp 'SELECT * FROM export..transaction_header ORDER BY source_id' queryout tranheader.txt -cT -d export
bcp 'SELECT * FROM export..transaction_line ORDER BY source_id, sequence' queryout tranline.txt -cT -d export
bcp 'SELECT * FROM export..item ORDER BY code' queryout item.txt -cT -d export
bcp 'SELECT * FROM export..visit ORDER BY source_id' queryout visit.txt -cT -d export
bcp 'SELECT * FROM export..member ORDER BY code' queryout member.txt -cT -d export
bcp 'SELECT * FROM export..membership ORDER BY sequence' queryout membership.txt -cT -d export
bcp 'SELECT * FROM export..transaction_member_info WHERE company_id = 3 ORDER BY source_id' queryout cafetranmemberinfo.txt -cT -d export
bcp 'SELECT * FROM export..cafe_transaction_header ORDER BY source_id' queryout cafetranheader.txt -cT -d export
bcp 'SELECT * FROM export..cafe_transaction_line ORDER BY source_id, sequence' queryout cafetranline.txt -cT -d export
bcp 'SELECT * FROM export..cafe_item ORDER BY code' queryout cafeitem.txt -cT -d export
bcp 'SELECT * FROM export..store_transaction_header ORDER BY time' queryout storetranheader.txt -cT -d export
bcp 'SELECT * FROM export..store_transaction_line ORDER BY sequence' queryout storetranline.txt -cT -d export
bcp 'SELECT * FROM export..store_item ORDER BY code' queryout storeitem.txt -cT -d export
bcp 'SELECT * FROM export..transaction_member_info WHERE company_id = 2' queryout storetranmemberinfo.txt -cT -d export
