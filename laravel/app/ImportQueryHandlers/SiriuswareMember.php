<?php
namespace App\ImportQueryHandlers;

use App\Member;
use App\VenueVariable;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SiriuswareMember extends ImportQueryHandler {
	protected $columns = ['code', 'gender', 'dob', 'city', 'state', 'zip', 'country', 'last_mod'];
	protected $updateVarColumn = 'last_mod';
	protected $updateVarName = 'MEMBER_LAST_UPDATE';
	function process() {
		$sel = DB::table($this->getTableName())
			->where('query_id', $this->query->id)
			->orderBy('id');
		$sel->chunk(10000, function($members){
			foreach($members as $member) {
				$id = $member->id;
				$cols = ['id', 'query_id', 'status', 'last_mod', 'created_at', 'updated_at'];
				foreach($cols as $col) {
					unset($member->{$col});
				}
				$member->age_group = 0;
				if($member->country == '' || $member->country == 'USA')
					$member->country = 'US';
				Member::import($member);
				DB::table($this->getTableName())->where('id', $id)->update(['status'=>'imported']);
			}
		});
	}
}
