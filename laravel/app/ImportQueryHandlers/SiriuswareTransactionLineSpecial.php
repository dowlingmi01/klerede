<?php
namespace App\ImportQueryHandlers;

use Carbon\Carbon;
use DB;
use Illuminate\Database\Events\QueryExecuted;

class SiriuswareTransactionLineSpecial extends ImportQueryHandler {
	protected $columns = ['source_id', 'sequence', 'valid_date', 'product_code'];
	protected $updateVarColumn = 'sequence';
	protected $updateVarName = 'LAST_TRAN_DETAIL_SPECIAL_ID';
	protected $dolog = false;
	function process() {
		$this->dolog = true;
		$pepe = $this;
		DB::listen(function(QueryExecuted $q) use ($pepe) {
			if($this->dolog) {
				var_dump($q->sql);
				var_dump($q->bindings);
			}
		});
		$system_id = $this->query->import_query_class->system_id;
		DB::table(DB::raw("import_siriusware_transaction_line_special as l
		straight_join transaction as t on l.source_id = t.source_id and l.venue_id = t.venue_id and t.system_id = $system_id
		straight_join product as p on product_code = p.code and l.venue_id = p.venue_id and p.system_id = $system_id
		straight_join transaction_line as tl on tl.transaction_id = t.id and tl.sequence = l.sequence") )
			->where('l.query_id', $this->query->id)
			->update(['tl.product_id' => DB::raw('p.id'), 'tl.updated_at' => Carbon::now(), 'l.status'=>'imported']);
		$this->dolog = false;
		$dates = DB::table($this->getTableName())
			->where('query_id', $this->query->id)
			->distinct()
			->pluck('valid_date')
		;
		$this->setStatStatus($dates);
	}
}
