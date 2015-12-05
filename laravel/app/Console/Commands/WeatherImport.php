<?php namespace App\Console\Commands;

use App\Batch;
use App\WeatherDaily;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class WeatherImport extends Command {

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'kl:weatherimport';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Retrieve weather data for the given date for all venues.';

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
		$date = $this->argument('date');
		WeatherDaily::setAll($date, $this->option('force'), $batch);
		$batch->finish();
	}

	/**
	 * Get the console command arguments.
	 *
	 * @return array
	 */
	protected function getArguments()
	{
		return [
			['date', InputArgument::OPTIONAL, 'Date to import.', Carbon::yesterday()->format('Y-m-d')],
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
			['force', null, InputOption::VALUE_NONE, 'Force retrieval regardless of cache state.', null],
		];
	}

}
