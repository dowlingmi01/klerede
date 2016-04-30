<?php
namespace App\ImportQueryHandlers;

use App\VenueVariable;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class GalaxyCafeTransactionMemberInfo extends ImportQueryHandler {
	protected $columns = ['source_id', 'sequence', 'member_code'];
	function updateVariables() {
		$lastId = DB::table($this->getTableName())->
			where('query_id', $this->query->id)->max('sequence');
		VenueVariable::setValue($this->query->venue_id, 'CAFE_LAST_TRAN_MEMBER_INFO_ID', $lastId);
	}
	function process() {
		$cols = ['i.id', 'i.venue_id', 'i.source_id', 'm.id as member_id'];
		$sel = DB::table('import_galaxy_cafe_transaction_member_info as i')
			->join('member as m', function(JoinClause $join) {
				$join->on('m.code', '=', 'i.member_code')
					->on('m.venue_id', '=', 'i.venue_id');
			})->where('query_id', $this->query->id)->select($cols);

		$sel->chunk(1000, function($lines) {
			$ids = [];
			foreach($lines as $line) {
				DB::table('cafe_transaction')
					->where('venue_id', $line->venue_id)
					->where('source_id', $line->source_id)
					->update(['member_id'=>$line->member_id]);
				$ids[] = $line->id;
			}
			DB::table($this->getTableName())->whereIn('id', $ids)->update(['status'=>'imported']);
		});
	}
}
