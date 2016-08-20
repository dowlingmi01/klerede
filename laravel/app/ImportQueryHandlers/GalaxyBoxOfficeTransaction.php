<?php
namespace App\ImportQueryHandlers;

use App\Channel;
use App\Operator;
use App\StatStatus;
use App\VenueVariable;
use Illuminate\Support\Facades\DB;

class GalaxyBoxOfficeTransaction extends ImportQueryHandler {
	protected $columns = ['source_id', 'register_id', 'sequence', 'business_day',
		'time', 'operator_id'];
	function updateVariables() {
		$lastId = DB::table($this->getTableName())->
			where('query_id', $this->query->id)->max('source_id');
		VenueVariable::setValue($this->query->venue_id, 'BOX_OFFICE_LAST_TRAN_ID', $lastId);
	}
	function process() {
		$this->addCodes('operator_id', Operator::class);
		$cols1 = ['t.venue_id', 'source_id', 'register_id', 'sequence', 'business_day', 'time', 'o.id', 't.created_at'];
		$cols2 = ['venue_id', 'source_id', 'register_id', 'sequence', 'business_day', 'time', 'operator_id', 'created_at'];
		$sel = DB::table($this->getTableName())->where('query_id', $this->query->id)->select($cols1);
		$sel->join('operator as o', 'operator_id', '=', 'o.code');
		$sel->where('o.venue_id', $this->query->venue_id);
		$colsString = implode(', ', $cols2);
		$ins = "INSERT INTO box_office_transaction ($colsString) " . $sel->toSql();
		DB::insert($ins, $sel->getBindings());
		DB::table($this->getTableName())->where('query_id', $this->query->id)->update(['status'=>'imported']);
		$dates = DB::table($this->getTableName())->where('query_id', $this->query->id)
			->select('business_day')->distinct()->get();
		$gate_channel_id = Channel::getFor('gate')->id;
		$membership_channel_id = Channel::getFor('membership')->id;
		foreach($dates as $date) {
			StatStatus::newData($gate_channel_id, $date->business_day);
			StatStatus::newData($membership_channel_id, $date->business_day);
		}
	}
}
