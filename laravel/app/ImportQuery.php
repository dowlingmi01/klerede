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
	static function getGZDir() {
		return storage_path('app/import_query');
	}
	function getGZPath() {
		return self::getGZDir() . '/' . $this->id . '.gz';
	}
	function received(UploadedFile $file) {
		$file->move(self::getGZDir(), $this->id . '.gz');
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
}
