<?php
namespace App\ImportQueryHandlers;

use App\Channel;
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
		$cols = array_merge(['venue_id'], $this->columns, ['created_at']);
		$sel = DB::table($this->getTableName())->where('query_id', $this->query->id)->select($cols);
		$colsString = implode(', ', $cols);
		$ins = "INSERT INTO box_office_transaction ($colsString) " . $sel->toSql();
		DB::insert($ins, $sel->getBindings());
		DB::table($this->getTableName())->where('query_id', $this->query->id)->update(['status'=>'imported']);
		$dates = DB::table($this->getTableName())->where('query_id', $this->query->id)
			->select('business_day')->distinct()->get();
		foreach($dates as $date) {
			StatStatus::newData(Channel::getFor('gate')->id, $date->business_day);
			StatStatus::newData(Channel::getFor('membership')->id, $date->business_day);
		}
	}
}
