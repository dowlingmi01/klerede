<?php
namespace App\ImportQueryHandlers;

use App\Facility;
use App\VenueVariable;
use App\Workstation;
use Carbon\Carbon;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class SiriuswareVisitTicket extends ImportQueryHandler {
	protected $columns = ['source_id', 'workstation_code', 'facility_code', 'box_office_product_code',
		'ticket_code', 'kind', 'time'];
	protected $updateVarColumn = 'source_id';
	protected $updateVarName = 'LAST_TICKET_USAGE_ID';
	function getTableName() {
		return 'import_siriusware_visit';
	}
	function process() {
		$this->addCodes('workstation_code', Workstation::class);
		$this->addCodes('facility_code', Facility::class);

		$cols = ['v.id', 'source_id', 'v.venue_id', 'w.id as workstation_id', 'f.id as facility_id', 'p.id as box_office_product_id', 'ticket_code'
			, 'm.id as membership_id', 'v.kind', DB::raw('1 as quantity'), DB::raw('0 as use_no'), 'time', 'v.created_at'];
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
		$sel = DB::table(DB::raw('import_siriusware_visit as v
		straight_join box_office_product as p on box_office_product_code = p.code and v.venue_id = p.venue_id
		straight_join workstation as w on workstation_code = w.code and v.venue_id = w.venue_id
		straight_join facility as f on facility_code = f.code and v.venue_id = f.venue_id
		left join membership as m use index for join (membership_venue_id_code_unique) on ticket_code = m.code and v.venue_id = m.venue_id and v.kind = \'pass\''))
			->where('query_id', $this->query->id)
			->select($cols)
			->orderBy('v.id');
		$dates = [];
		$sel->chunk(5000, function($visits) use (&$dates) {
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
		$dates = array_keys($dates);
		$this->setStatStatus($dates, -1);
	}
}
