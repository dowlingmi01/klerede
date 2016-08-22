<?php
namespace App\ImportQueryHandlers;

use App\Channel;
use App\Operator;
use App\StatStatus;
use App\VenueVariable;
use Illuminate\Support\Facades\DB;

class GalaxyCafeTransaction extends ImportQueryHandler {
	protected $columns = ['source_id', 'register_id', 'sequence', 'business_day',
		'time', 'operator_id'];
	protected $updateVarColumn = 'source_id';
	protected $updateVarName = 'CAFE_LAST_TRAN_ID';
	function process() {
		$this->addCodes('operator_id', Operator::class);
		$cols1 = ['t.venue_id', 'source_id', 'register_id', 'sequence', 'business_day', 'time', 'o.id', 't.created_at'];
		$cols2 = ['venue_id', 'source_id', 'register_id', 'sequence', 'business_day', 'time', 'operator_id', 'created_at'];
		$sel = DB::table('import_galaxy_cafe_transaction as t')->where('query_id', $this->query->id)->select($cols1);
		$sel->join('operator as o', 'operator_id', '=', 'o.code');
		$sel->where('o.venue_id', $this->query->venue_id);
		$colsString = implode(', ', $cols2);
		$ins = "INSERT INTO cafe_transaction ($colsString) " . $sel->toSql();
		DB::insert($ins, $sel->getBindings());
		DB::table($this->getTableName())->where('query_id', $this->query->id)->update(['status'=>'imported']);
		$dates = DB::table($this->getTableName())->where('query_id', $this->query->id)
			->select('business_day')->distinct()->get();
		foreach($dates as $date) {
			StatStatus::newData(Channel::getFor('cafe')->id, $date->business_day);
		}
	}
}
