<?php namespace App\Console\Commands;

use App\WeatherDaily;
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
	protected $description = 'Command description.';

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
		$coordinates = '40.5324486,-111.893979';
		$timeFormatF = 'Y-m-d\TH';
		$interval = new \DateInterval('P1D');
		$venue_id = 1588;
		$dir = $this->argument('dir');
		$date = new \DateTime('2015-01-01 12:00', new \DateTimeZone('PST') );
		for($i = 0; $i < 274; $i++) {
			$json = file_get_contents(sprintf('%s/%s,%s.json', $dir, $coordinates, $date->format($timeFormatF)));
			WeatherDaily::getForJSON($venue_id, $date->format('Y-m-d'), $json);
			$date->add($interval);
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
			['dir', InputArgument::REQUIRED, 'Input directory.'],
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
			['example', null, InputOption::VALUE_OPTIONAL, 'An example option.', null],
		];
	}

}
