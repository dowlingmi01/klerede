<?php
namespace App\ImportQueryHandlers;

use App\ImportQuery;
use App\StatStatus;
use App\VenueVariable;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

abstract class ImportQueryHandler {
	/** @var ImportQuery */
	protected $query;
	protected $updateVarColumn = null;
	protected $updateVarName = null;
	function __construct(ImportQuery $query) {
		$this->query = $query;
	}
	function getTableName() {
		return 'import_' . $this->query->query_class->name;
	}
	public function handle() {
		$this->load();
		$this->setNumRecords();
		$this->updateVariables();
		$this->insertNextQuery();
		$this->process();
		$this->setNumRecordsImported();
		$this->query->processed();
	}
	function load() {
		$input_file = $this->query->getFilePath();
		$table_name = $this->getTableName();
		$query_id = $this->query->id;
		$venue_id = $this->query->venue_id;
		$columns = implode(', ', $this->columns);
		$sql = "LOAD DATA LOCAL INFILE '$input_file'
INTO TABLE $table_name
LINES TERMINATED BY '\\r\\n'
($columns)
SET query_id = $query_id, status = 'pending', venue_id = $venue_id, created_at = CURRENT_TIMESTAMP";
		DB::unprepared($sql);
	}
	function setNumRecords() {
		$num_records = DB::table($this->getTableName())->
			where('query_id', $this->query->id)->count();
		$this->query->num_records = $num_records;
	}
	function setNumRecordsImported() {
		$num_records = DB::table($this->getTableName())
			->where('query_id', $this->query->id)
			->where('status', 'imported')
			->count();
		$this->query->num_records_imported = $num_records;
	}
	function getQueryText() {
		$path = base_path('resources/sql/import_queries/' . $this->query->query_class->name . '.sql');
		$text = file_get_contents($path);
		return VenueVariable::substituteFor($this->query->venue_id, $text);
	}
	public function insertNextQuery($delay = 60) {
		$query = new ImportQuery();
		$query->query_class()->associate($this->query->query_class);
		$query->venue_id = $this->query->venue_id;
		$query->query_text = $this->getQueryText();
		$query->status = 'pending';
		$query->run_after = Carbon::now()->addMinutes($delay);
		$query->time_created = Carbon::now();
		$query->save();
	}
	function updateVariables() {
		if(isset($this->updateVarColumn) && isset($this->updateVarName)) {
			$maxVal = DB::table($this->getTableName())->
				where('query_id', $this->query->id)->max($this->updateVarColumn);
			VenueVariable::setValue($this->query->venue_id, $this->updateVarName, $maxVal);
		}
	}
	abstract function process();
	function addCodes($column, $class) {
		$sel = DB::table($this->getTableName())->where('query_id', $this->query->id)->select($column)->distinct();
		$codes = $sel->get();
		foreach($codes as $code) {
			$class::getFor($this->query->venue_id, $code->{$column});
		}
	}
	function setStatStatus($dates, $channel_id) {
		foreach($dates as $date) {
			StatStatus::newData($channel_id, $date, $this->query->venue_id);
		}
	}
}
