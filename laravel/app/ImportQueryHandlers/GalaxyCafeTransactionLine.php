<?php
namespace App\ImportQueryHandlers;

use App\Channel;
use App\VenueVariable;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class GalaxyCafeTransactionLine extends ImportQueryHandler {
	protected $columns = ['source_id', 'sequence', 'cafe_product_code', 'sale_price', 'quantity'];
	protected $updateVarColumn = 'sequence';
	protected $updateVarName = 'CAFE_LAST_TRAN_DETAIL_ID';
	function process() {
		$cols = ['l.id', 't.id as cafe_transaction_id', 'l.sequence', 'p.id as cafe_product_id'
			, 'l.sale_price', 'l.quantity', 'l.created_at', 't.business_day'];

		$sel = DB::table(DB::raw('import_galaxy_cafe_transaction_line as l
		straight_join cafe_transaction as t on l.source_id = t.source_id and l.venue_id = t.venue_id
		straight_join cafe_product as p on cafe_product_code = p.code and l.venue_id = p.venue_id') )
			->where('query_id', $this->query->id)
			->select($cols)
			->orderBy('l.id');
		$dates = [];
		$sel->chunk(8000, function($lines) use (&$dates) {
			$inserts = [];
			$ids = [];
			foreach($lines as $line) {
				$lineA = (array) $line;
				unset($lineA['id']);
				unset($lineA['business_day']);
				$inserts[] = $lineA;
				$ids[] = $line->id;
				$dates[$line->business_day] = true;
			}
			DB::table('cafe_transaction_line')->insert($inserts);
			DB::table($this->getTableName())->whereIn('id', $ids)->update(['status'=>'imported']);
		});
		$dates = array_keys($dates);
		$this->setStatStatus($dates, Channel::getFor('cafe')->id);
	}
}
