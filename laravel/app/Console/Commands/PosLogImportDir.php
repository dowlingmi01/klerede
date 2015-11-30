<?php namespace App\Console\Commands;

use App\Batch;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class PosLogImportDir extends Command {

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'kl:poslogimport_dir';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Read all poslog files from the specified dir and import them.';

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
		$batch = Batch::start($this->name, $this->argument());
		try {
			$directory = $this->argument('directory');
			$files = Storage::disk('poslog')->files($directory);
			foreach($files as $file) {
				if(File::extension($file) == 'xml') {
					try {
						Artisan::call('kl:poslogimport', ['file_name'=>$file]);
					} catch(Exception $e) {
					}
				}
			}
			$batch->finish();
		} catch(Exception $e) {
			$batch->error(sprintf("[%s] %s", get_class($e),  $e->getMessage()));
			throw($e);
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
			['directory', InputArgument::REQUIRED, 'Directory to process. Relative to POSLOG_DIR.'],
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
