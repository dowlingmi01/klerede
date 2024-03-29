<?php namespace App\Console\Commands;

use App\Batch;
use App\StoreTransaction;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class PosLogImport extends Command {

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'kl:poslogimport';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Read PosLog xml file and import into db.';

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
			if($this->option('output-query-times'))
				DB::connection()->enableQueryLog();
			$fileName = $this->argument('file_name');
			$xmlString = Storage::disk('poslog')->get($fileName);
			$xmlLog = simplexml_load_string($xmlString);
			StoreTransaction::importXMLTransactions($xmlLog, $batch);
			if($this->option('output-query-times')) {
				$queries = DB::getQueryLog();
				foreach($queries as $query)
					fputcsv(STDOUT, [$query['time'], $query['query']]);
			}
			$batch->finish();
		} catch(Exception $e) {
			$batch->errorExc($e);
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
			['file_name', InputArgument::REQUIRED, 'Input file name. Relative to POSLOG_DIR.'],
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
			['output-query-times', null, InputOption::VALUE_NONE, 'Output query times in csv format for debugging purposes.', null]
		];
	}

}
