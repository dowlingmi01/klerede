<?php
namespace App\ImportQueryHandlers;

use App\Membership;
use App\VenueVariable;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SiriuswareMembership extends ImportQueryHandler {
	protected $columns = ['member_code', 'code', 'box_office_product_code', 'date_from', 'date_to', 'last_mod'];
	protected $updateVarColumn = 'last_mod';
	protected $updateVarName = 'MEMBERSHIP_LAST_UPDATE';
	function process() {
		$sel = DB::table($this->getTableName())
			->where('query_id', $this->query->id)
			->orderBy('id');
		$sel->chunk(10000, function($memberships) {
			foreach($memberships as $membership) {
				$id = $membership->id;
				$cols = ['id', 'query_id', 'status', 'last_mod', 'created_at', 'updated_at'];
				foreach($cols as $col) {
					unset($membership->{$col});
				}
				$membership->sequence = 0;
				$membership->adult_qty = 0;
				$membership->child_qty = 0;
				$membership->system_id = $this->query->import_query_class->system_id;

				if(Membership::import($membership)) {
					DB::table($this->getTableName())->where('id', $id)->update(['status'=>'imported']);
				}
			}
		});
	}
}
