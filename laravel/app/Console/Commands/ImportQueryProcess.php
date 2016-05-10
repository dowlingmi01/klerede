<?php namespace App\Console\Commands;

use App\ImportQuery;
use App\ImportQueryHandlers\ImportQueryHandler;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class ImportQueryProcess extends Command {

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'kl:importqueryprocess';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Load and process an import query.';

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
		$query_id = (int) $this->argument('query_id');
		$q = ImportQuery::find($query_id);

		/** @var ImportQueryHandler $h */
		$h = $q->query_class->getHandler($q);
		$h->load();
		$h->process();
	}

	/**
	 * Get the console command arguments.
	 *
	 * @return array
	 */
	protected function getArguments()
	{
		return [
			['query_id', InputArgument::REQUIRED, 'query_id to process.'],
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
