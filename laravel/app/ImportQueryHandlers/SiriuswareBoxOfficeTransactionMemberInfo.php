<?php
namespace App\ImportQueryHandlers;

use App\VenueVariable;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class SiriuswareBoxOfficeTransactionMemberInfo extends ImportQueryHandler {
	protected $columns = ['source_id', 'sequence', 'member_code', 'membership_code', 'info_id'];
	protected $updateVarColumn = 'info_id';
	protected $updateVarName = 'BOX_OFFICE_LAST_TRAN_MEMBER_INFO_ID';
	function process() {
		$cols = ['i.id', 't.id as transaction_id', 'i.sequence',
			'm.id as member_id', 's.id as membership_id'];
		$system_id = $this->query->import_query_class->system_id;
		$sel = DB::table('import_siriusware_box_office_transaction_member_info as i')
			->join('transaction as t', function(JoinClause $join) use ($system_id) {
				$join->on('t.source_id', '=', 'i.source_id')
					->on('t.venue_id', '=', 'i.venue_id')
					->where('t.system_id', '=', $system_id);
			})
			->join('member as m', function(JoinClause $join) {
				$join->on('m.code', '=', 'i.member_code')
					->on('m.venue_id', '=', 'i.venue_id');
			})
			->leftJoin('membership as s', function(JoinClause $join) {
				$join->on('s.code', '=', 'i.membership_code')
					->on('s.venue_id', '=', 'i.venue_id');
			})
			->where('i.query_id', $this->query->id)->select($cols)->orderBy('i.id');

		$sel->chunk(10000, function($lines) {
			$ids = [];
			foreach($lines as $line) {
				$upd = ['member_id'=>$line->member_id];
				if($line->membership_id) {
					$upd['membership_id'] = $line->membership_id;
				}
				DB::table('transaction_line')
					->where('transaction_id', $line->transaction_id)
					->where('sequence', $line->sequence)
					->update($upd);
				$ids[] = $line->id;
			}
			DB::table($this->getTableName())->whereIn('id', $ids)->update(['status'=>'imported']);
		});
	}
}
