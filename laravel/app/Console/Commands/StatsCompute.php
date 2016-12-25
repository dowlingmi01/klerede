<?php namespace App\Console\Commands;

use App\Channel;
use App\Stats;
use App\StatStatus;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;
use Illuminate\Support\Facades\DB;

class StatsCompute extends Command {

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'kl:stats_compute';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Compute stats for the given venue, and date, or all pending.';

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
	public function fire() {
		$date = $this->option('date');
		$venue_id = intval($this->option('venue_id'));
		 
		if($date) {
			$this->doCompute($date, $venue_id);
		} else {
			$query = StatStatus::where('status', 'new_data');
			if($venue_id) {
				$query->where('venue_id', $venue_id);
			}
			$stats = $query->get();
			foreach($stats as $stat) {
				$this->doCompute($stat->date, $stat->venue_id);
			}
		}
	}
	private function doCompute($date, $venue_id) {
		Stats::computeSales($venue_id, $date);
		Stats::computeVisits($venue_id, $date);
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
			['date', 'd', InputOption::VALUE_REQUIRED, 'Date.', null],
			['venue_id', 'i', InputOption::VALUE_REQUIRED, 'Venue ID.', 0],
			['channel', 'c', InputOption::VALUE_REQUIRED, 'Channel name.', null],
		];
	}

}
