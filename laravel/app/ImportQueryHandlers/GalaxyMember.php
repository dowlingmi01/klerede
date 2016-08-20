<?php
namespace App\ImportQueryHandlers;

use App\Member;
use App\VenueVariable;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class GalaxyMember extends ImportQueryHandler {
	protected $columns = ['code', 'gender', 'age_group', 'dob', 'city', 'state', 'zip', 'country', 'last_changed'];
	function updateVariables() {
		$lastChanged = DB::table($this->getTableName())->
			where('query_id', $this->query->id)->max('last_changed');
		VenueVariable::setValue($this->query->venue_id, 'MEMBER_LAST_UPDATE', $lastChanged);
	}
	function process() {
		$sel = DB::table($this->getTableName())
			->where('query_id', $this->query->id)
			->orderBy('id');
		$sel->chunk(10000, function($members){
			foreach($members as $member) {
				$id = $member->id;
				$cols = ['id', 'query_id', 'status', 'last_changed', 'created_at', 'updated_at'];
				foreach($cols as $col) {
					unset($member->{$col});
				}
				Member::import($member);
				DB::table($this->getTableName())->where('id', $id)->update(['status'=>'imported']);
			}
		});
	}
}
