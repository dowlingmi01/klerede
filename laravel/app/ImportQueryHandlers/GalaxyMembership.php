<?php
namespace App\ImportQueryHandlers;

use App\Membership;
use App\VenueVariable;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class GalaxyMembership extends ImportQueryHandler {
	protected $columns = ['member_code', 'code', 'sequence', 'box_office_product_code', 'date_from', 'date_to', 'dob', 'adult_qty', 'child_qty', 'city', 'state', 'zip', 'country', 'last_changed'];
	protected $updateVarColumn = 'last_changed';
	protected $updateVarName = 'MEMBERSHIP_LAST_UPDATE';
	function process() {
		$sel = DB::table($this->getTableName())
			->where('query_id', $this->query->id)
			->orderBy('id');
		$sel->chunk(10000, function($memberships){
			foreach($memberships as $membership) {
				$id = $membership->id;
				$cols = ['id', 'query_id', 'status', 'last_changed', 'created_at', 'updated_at'];
				foreach($cols as $col) {
					unset($membership->{$col});
				}
				if(Membership::import($membership)) {
					DB::table($this->getTableName())->where('id', $id)->update(['status'=>'imported']);
				}
			}
		});
	}
}
