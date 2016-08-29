<?php
namespace App\ImportQueryHandlers;

use App\Channel;
use App\VenueVariable;
use Carbon\Carbon;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class SiriuswareBoxOfficeTransactionLine extends ImportQueryHandler {
	protected $columns = ['source_id', 'sequence', 'box_office_product_code', 'sale_price', 'quantity'];
	protected $updateVarColumn = 'sequence';
	protected $updateVarName = 'BOX_OFFICE_LAST_TRAN_DETAIL_ID';
	function process() {
		$cols = ['l.id', 't.id as box_office_transaction_id', 'l.sequence', 'p.id as box_office_product_id'
			, 'l.sale_price', 'l.quantity', 'l.created_at', 't.time'];
/*
		$sel = DB::table('import_galaxy_box_office_transaction_line as l')
			->where('query_id', $this->query->id)
			->join('box_office_transaction as t', function(JoinClause $join) {
				$join->on('l.source_id', '=', 't.source_id')
					->on('l.venue_id', '=', 't.venue_id');
			})->join('box_office_product as p', function(JoinClause $join) {
				$join->on('box_office_product_code', '=', 'p.code')
					->on('l.venue_id', '=', 'p.venue_id');
			})->select($cols)
			->orderBy('l.id');
*/
		$sel = DB::table(DB::raw('import_siriusware_box_office_transaction_line as l
		straight_join box_office_transaction as t on l.source_id = t.source_id and l.venue_id = t.venue_id
		straight_join box_office_product as p on box_office_product_code = p.code and l.venue_id = p.venue_id') )
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
				unset($lineA['time']);
				$lineA['ticket_code'] = '';
				$inserts[] = $lineA;
				$ids[] = $line->id;
				$date = (new Carbon($line->time))->format('Y-m-d');
				$dates[$date] = true;
			}
			DB::table('box_office_transaction_line')->insert($inserts);
			DB::table($this->getTableName())->whereIn('id', $ids)->update(['status'=>'imported']);
		});
		$dates = array_keys($dates);
		$this->setStatStatus($dates, Channel::getFor('gate')->id);
	}
}
