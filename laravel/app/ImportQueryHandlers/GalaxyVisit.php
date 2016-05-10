<?php
namespace App\ImportQueryHandlers;

use App\VenueVariable;
use Carbon\Carbon;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class GalaxyVisit extends ImportQueryHandler {
	protected $columns = ['source_id', 'acp_id', 'facility_id', 'box_office_product_code',
		'ticket_code', 'kind', 'quantity', 'use_no', 'time'];
	function updateVariables() {
		$lastId = DB::table($this->getTableName())->
			where('query_id', $this->query->id)->max('source_id');
		VenueVariable::setValue($this->query->venue_id, 'LAST_USAGE_ID', $lastId);
	}
	function process() {
		$cols = ['v.id', 'source_id', 'v.venue_id', 'acp_id', 'facility_id', 'p.id as box_office_product_id', 'ticket_code'
			, 'm.id as membership_id', 'v.kind', 'quantity', 'use_no', 'time', 'v.created_at'];
/*
		$sel = DB::table('import_galaxy_visit as v')
			->where('query_id', $this->query->id)
			->join('box_office_product as p', function(JoinClause $join) {
				$join->on('box_office_product_code', '=', 'p.code')
					->on('v.venue_id', '=', 'p.venue_id');
			})->leftJoin('membership as m', function(JoinClause $join) {
				$join->on('ticket_code', '=', 'm.code')
					->on('v.venue_id', '=', 'm.venue_id')
					->where('v.kind', '=', 'pass');
			})->select($cols);
*/
		$sel = DB::table(DB::raw('import_galaxy_visit as v
		straight_join box_office_product as p on box_office_product_code = p.code and v.venue_id = p.venue_id'))
			->where('query_id', $this->query->id)
			->leftJoin('membership as m', function(JoinClause $join) {
				$join->on('ticket_code', '=', 'm.code')
					->on('v.venue_id', '=', 'm.venue_id')
					->where('v.kind', '=', 'pass');
			})->select($cols);
		$dates = [];
		$sel->chunk(1000, function($visits) use ($dates) {
			$inserts = [];
			$ids = [];
			foreach($visits as $visit) {
				$visitA = (array) $visit;
				unset($visitA['id']);
				$inserts[] = $visitA;
				$ids[] = $visit->id;
				$date = (new Carbon($visit->time))->format('Y-m-d');
				$dates[$date] = true;
			}
			DB::table('visit')->insert($inserts);
			DB::table($this->getTableName())->whereIn('id', $ids)->update(['status'=>'imported']);
		});
	}
}
