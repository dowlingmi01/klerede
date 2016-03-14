<?php namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class ImportQuery extends Model {
	protected $table = 'import_query';
	function received($file) {
		$file->move(storage_path('app/import_query'), $this->id . '.gz');
		$this->status = 'executed';
		$this->time_executed = Carbon::now();
		$this->save();
	}
}
