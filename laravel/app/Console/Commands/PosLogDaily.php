<?php namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class PosLogDaily extends Command {

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'kl:poslog_daily';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Process incoming poslog files.';

	/**
	 * Create a new command instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		parent::__construct();
	}

	/**
	 * Execute the console command.
	 *
	 * @return mixed
	 */
	public function fire()
	{
		$storage = Storage::disk('poslog');
		$files = collect($storage->files())->filter(function($file){return File::extension($file) == 'xml';}) ;
		if($files) {
			$dirname = Carbon::now()->format('Ymd');
			$storage->makeDirectory($dirname);
			foreach($files as $file) {
				$storage->move($file, $dirname.'/'.$file);
			}
			Artisan::call('kl:poslogimport_dir', ['directory'=>$dirname]);
			$storage->move($dirname, 'proc/'.$dirname);
		}
	}

	/**
	 * Get the console command arguments.
	 *
	 * @return array
	 */
	protected function getArguments()
	{
		return [
		];
	}

	/**
	 * Get the console command options.
	 *
	 * @return array
	 */
	protected function getOptions()
	{
		return [
		];
	}

}
