<?php namespace App;

use App\Commands\ProcessImportQuery;
use App\ImportQueryHandlers\ImportQueryHandler;
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
		$fs = filesize($this->getGZPath());
		/** @var ImportQueryHandler $handler */
		$handler = $this->query_class->getHandler($this);
		if($fs > 0) {
			$cmd = 'gzip -fd ' . $this->getGZPath();
			$process = new Process($cmd);
			$process->run();

			$handler->handle();
		} else {
			$handler->insertNextQuery();
			$this->processed();
		}
	}
	public function query_class() {
		return $this->belongsTo('App\ImportQueryClass', 'import_query_class_id');
	}
	public function processed() {
		$this->status = 'imported';
		$this->time_imported = Carbon::now();
		$this->save();
	}
}
