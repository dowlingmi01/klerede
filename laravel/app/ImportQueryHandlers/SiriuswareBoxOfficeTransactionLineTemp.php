<?php
namespace App\ImportQueryHandlers;

use App\Channel;
use App\VenueVariable;
use Carbon\Carbon;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class SiriuswareBoxOfficeTransactionLineTemp extends ImportQueryHandler {
	protected $columns = ['source_id', 'sequence', 'valid_date'];
	protected $updateVarColumn = 'sequence';
	protected $updateVarName = 'BOX_OFFICE_LAST_TRAN_TEMP_ID';
	function process() {
	}
}
