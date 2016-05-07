<?php
namespace App\ImportQueryHandlers;

use App\VenueVariable;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class GalaxyCafeTransactionLine extends ImportQueryHandler {
	protected $columns = ['source_id', 'sequence', 'cafe_product_code', 'sale_price', 'quantity'];
	function updateVariables() {
		$lastId = DB::table($this->getTableName())->
			where('query_id', $this->query->id)->max('sequence');
		VenueVariable::setValue($this->query->venue_id, 'CAFE_LAST_TRAN_DETAIL_ID', $lastId);
	}
	function process() {
		$cols = ['l.id', 't.id as cafe_transaction_id', 'l.sequence', 'p.id as cafe_product_id'
			, 'l.sale_price', 'l.quantity', 'l.created_at'];

		$sel = DB::table('import_galaxy_cafe_transaction_line as l')
			->where('query_id', $this->query->id)
			->join('cafe_transaction as t', function(JoinClause $join) {
				$join->on('l.source_id', '=', 't.source_id')
					->on('l.venue_id', '=', 't.venue_id');
			})->join('cafe_product as p', function(JoinClause $join) {
				$join->on('cafe_product_code', '=', 'p.code')
					->on('l.venue_id', '=', 'p.venue_id');
			})->select($cols);
		$sel->chunk(1000, function($lines) {
			$inserts = [];
			$ids = [];
			foreach($lines as $line) {
				$lineA = (array) $line;
				unset($lineA['id']);
				$inserts[] = $lineA;
				$ids[] = $line->id;
			}
			DB::table('cafe_transaction_line')->insert($inserts);
			DB::table($this->getTableName())->whereIn('id', $ids)->update(['status'=>'imported']);
		});
	}
}
