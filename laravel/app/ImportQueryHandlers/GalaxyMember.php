<?php
namespace App\ImportQueryHandlers;

use App\Member;
use App\VenueVariable;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class GalaxyMember extends ImportQueryHandler {
	protected $columns = ['code', 'gender', 'age_group', 'dob', 'city', 'state', 'zip', 'country', 'last_changed'];
	protected $updateVarColumn = 'last_changed';
	protected $updateVarName = 'MEMBER_LAST_UPDATE';
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
