<?php
namespace App\ImportQueryHandlers;

use App\Channel;
use App\Operator;
use App\StatStatus;
use App\VenueVariable;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class SiriuswareBoxOfficeTransaction extends ImportQueryHandler {
	protected $columns = ['source_id', 'register_id', 'sequence', 'time', 'operator_code'];
	function updateVariables() {
		$lastId = DB::table($this->getTableName())->
			where('query_id', $this->query->id)->max('source_id');
		VenueVariable::setValue($this->query->venue_id, 'BOX_OFFICE_LAST_TRAN_ID', $lastId);
	}
	function process() {
		$sel = DB::table($this->getTableName())->where('query_id', $this->query->id)->select('operator_code')->distinct();
		$operators = $sel->get();
		foreach($operators as $operator) {
			Operator::getFor($this->query->venue_id, $operator->operator_code);
		}
		$cols1 = ['t.venue_id', 'source_id', 'register_id', 'sequence', 'time', 'o.id', 't.created_at', DB::raw('date(time)')];
		$cols2 = ['venue_id', 'source_id', 'register_id', 'sequence', 'time', 'operator_id', 'created_at', 'business_day'];
		$sel = DB::table('import_siriusware_box_office_transaction as t')->where('query_id', $this->query->id)->select($cols1);
		$sel->join('operator as o', 'operator_code', '=', 'o.code');
		$sel->where('o.venue_id', $this->query->venue_id);
		$colsString = implode(', ', $cols2);
		$ins = "INSERT INTO box_office_transaction ($colsString) " . $sel->toSql();
		DB::insert($ins, $sel->getBindings());
		DB::table($this->getTableName())->where('query_id', $this->query->id)->update(['status'=>'imported']);
		$dates = DB::table($this->getTableName())->where('query_id', $this->query->id)
			->select(DB::raw('date(time) as business_day'))->distinct()->get();
		foreach($dates as $date) {
			StatStatus::newData(Channel::getFor('gate')->id, $date->business_day);
			StatStatus::newData(Channel::getFor('membership')->id, $date->business_day);
		}
	}
}
