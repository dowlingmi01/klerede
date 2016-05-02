<?php
namespace App\ImportQueryHandlers;

use App\ImportQuery;
use App\VenueVariable;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

abstract class ImportQueryHandler {
	/** @var ImportQuery */
	protected $query;
	function __construct(ImportQuery $query) {
		$this->query = $query;
	}
	function getTableName() {
		return 'import_' . $this->query->query_class->name;
	}
	public function handle() {
		$this->load();
		$this->updateVariables();
		$this->insertNextQuery();
		$this->process();
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
	function getQueryText() {
		$path = base_path('resources/sql/import_queries/' . $this->query->query_class->name . '.sql');
		$text = file_get_contents($path);
		return VenueVariable::substituteFor($this->query->venue_id, $text);
	}
	public function insertNextQuery($delay = 5) {
		$query = new ImportQuery();
		$query->query_class()->associate($this->query->query_class);
		$query->venue_id = $this->query->venue_id;
		$query->query_text = $this->getQueryText();
		$query->status = 'pending';
		$query->run_after = Carbon::now()->addMinutes($delay);
		$query->time_created = Carbon::now();
		$query->save();
	}
	abstract function updateVariables();
	abstract function process();
}
