<?php namespace App;

use App\Commands\ProcessImportQuery;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Bus\DispatchesCommands;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Process\Process;

class ImportQuery extends Model {
	use DispatchesCommands;
	protected $table = 'import_query';
	static function getDir() {
		return str_replace('\\', '/', storage_path('app/import_query'));
	}
	function getGZPath() {
		return $this->getFilePath() . '.gz';
	}
	function getFilePath() {
		return self::getDir() . '/' . $this->id;
	}
	function received(UploadedFile $file) {
		$file->move(self::getDir(), $this->id . '.gz');
		$this->status = 'executed';
		$this->time_executed = Carbon::now();
		$this->save();
		$this->dispatch(new ProcessImportQuery($this));
	}
	function process() {
		$cmd = 'gzip -d ' . $this->getGZPath();
		$process = new Process($cmd);
		$process->run();
	}
	public function query_class() {
		return $this->belongsTo('App\ImportQueryClass', 'import_query_class_id');
	}
}
