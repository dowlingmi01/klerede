<?php namespace App\Console\Commands;

use App\ImportQuery;
use App\ImportQueryClass;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class ImportQueryInit extends Command {

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'kl:importinit';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Init import queries.';

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
		foreach ([10, 20, 30, 40, 50, 60, 70, 80] as $iqcId) {
			/** @var ImportQueryClass $iqc */
			$iqc = ImportQueryClass::find($iqcId);
			$q = new ImportQuery();
			$q->venue_id = 1588;
			$q->query_class()->associate($iqc);
			$h = $iqc->getHandler($q);
			$h->insertNextQuery(0);
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
