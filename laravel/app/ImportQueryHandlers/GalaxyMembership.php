<?php
namespace App\ImportQueryHandlers;

use App\Membership;
use App\VenueVariable;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class GalaxyMembership extends ImportQueryHandler {
	protected $columns = ['member_code', 'code', 'sequence', 'box_office_product_code', 'date_from', 'date_to', 'dob', 'adult_qty', 'child_qty', 'city', 'state', 'zip', 'country', 'last_changed'];
	function updateVariables() {
		$lastChanged = DB::table($this->getTableName())->
			where('query_id', $this->query->id)->max('last_changed');
		VenueVariable::setValue($this->query->venue_id, 'MEMBERSHIP_LAST_UPDATE', $lastChanged);
	}
	function process() {
		$memberships = DB::table($this->getTableName())
			->where('query_id', $this->query->id)
			->get();
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
	}
}
