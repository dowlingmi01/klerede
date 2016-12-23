<?php
namespace App\ImportQueryHandlers;

use App\Channel;
use App\VenueVariable;
use Carbon\Carbon;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class SiriuswareBoxOfficeTransactionLine extends ImportQueryHandler {
	protected $columns = ['source_id', 'sequence', 'valid_date', 'box_office_product_code', 'sale_price', 'quantity'];
	protected $updateVarColumn = 'sequence';
	protected $updateVarName = 'BOX_OFFICE_LAST_TRAN_DETAIL_ID';
	function process() {
		$cols = ['l.id', 't.id as transaction_id', 'l.sequence', 'l.valid_date', 'p.id as product_id'
			, 'l.sale_price', 'l.quantity', 'l.created_at', 't.time'];
		$system_id = $this->query->import_query_class->system_id;
		$sel = DB::table(DB::raw("import_siriusware_box_office_transaction_line as l
		straight_join transaction as t on l.source_id = t.source_id and l.venue_id = t.venue_id and t.system_id = $system_id
		straight_join product as p on box_office_product_code = p.code and l.venue_id = p.venue_id and p.system_id = $system_id") )
			->where('l.query_id', $this->query->id)
			->select($cols)
			->orderBy('l.id');
		$dates = [];
		$sel->chunk(8000, function($lines) use (&$dates) {
			$inserts = [];
			$ids = [];
			foreach($lines as $line) {
				$lineA = (array) $line;
				unset($lineA['id']);
				unset($lineA['time']);
				$inserts[] = $lineA;
				$ids[] = $line->id;
				$date = $line->valid_date;
				$dates[$date] = true;
			}
			DB::table('transaction_line')->insert($inserts);
			DB::table($this->getTableName())->whereIn('id', $ids)->update(['status'=>'imported']);
		});
		$dates = array_keys($dates);
		$this->setStatStatus($dates);
	}
}
