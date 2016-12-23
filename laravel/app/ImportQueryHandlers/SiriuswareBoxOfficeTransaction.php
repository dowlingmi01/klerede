<?php
namespace App\ImportQueryHandlers;

use App\Operator;
use DB;

class SiriuswareBoxOfficeTransaction extends ImportQueryHandler {
	protected $columns = ['source_id', 'register_id', 'sequence', 'time', 'operator_code'];
	protected $updateVarColumn = 'source_id';
	protected $updateVarName = 'BOX_OFFICE_LAST_TRAN_ID';
	function process() {
		$this->addCodes('operator_code', Operator::class);
		$system_id = $this->query->import_query_class->system_id;
		$cols1 = ['t.venue_id', DB::raw("$system_id as system_id"), 'source_id', 'register_id', 'sequence', 'time',
			'o.id', 't.created_at', DB::raw('date(time)'), 'query_id'];
		$cols2 = ['venue_id', 'system_id', 'source_id', 'register_id', 'sequence', 'time',
			'operator_id', 'created_at', 'business_day', 'query_id'];
		$sel = DB::table('import_siriusware_box_office_transaction as t')->where('query_id', $this->query->id)->select($cols1);
		$sel->join('operator as o', 'operator_code', '=', 'o.code');
		$sel->where('o.venue_id', $this->query->venue_id);
		$colsString = implode(', ', $cols2);
		$ins = "INSERT INTO transaction ($colsString) " . $sel->toSql();
		DB::insert($ins, $sel->getBindings());
		DB::table($this->getTableName())->where('query_id', $this->query->id)->update(['status'=>'imported']);
	}
}
