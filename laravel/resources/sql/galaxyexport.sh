bcp 'SELECT * FROM export..transaction_header ORDER BY source_id' queryout tranheader.txt -cT -d export
bcp 'SELECT * FROM export..transaction_line ORDER BY source_id, sequence' queryout tranline.txt -cT -d export
bcp 'SELECT * FROM export..item ORDER BY code' queryout item.txt -cT -d export
bcp 'SELECT * FROM export..visit ORDER BY source_id' queryout visit.txt -cT -d export
bcp 'SELECT * FROM export..member ORDER BY code' queryout member.txt -cT -d export
bcp 'SELECT * FROM export..membership ORDER BY sequence' queryout membership.txt -cT -d export
