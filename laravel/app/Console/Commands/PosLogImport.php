<?php namespace App\Console\Commands;

use App\StoreTransaction;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
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
		if($this->option('output-query-times'))
			DB::connection()->enableQueryLog();
		$fileName = $this->argument('file_name');
		$xmlLog = simplexml_load_file($fileName);
		StoreTransaction::importXMLTransactions($xmlLog);
		if($this->option('output-query-times')) {
			$queries = DB::getQueryLog();
			foreach($queries as $query)
				fputcsv(STDOUT, [$query['time'], $query['query']]);
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
			['file_name', InputArgument::REQUIRED, 'Input file name.'],
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
