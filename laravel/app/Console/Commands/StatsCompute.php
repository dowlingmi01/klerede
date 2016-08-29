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
	protected $description = 'Compute stats for the given channel, venue, and date, or all pending.';

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
		$channel = $this->option('channel');
		if($channel) {
			if($channel == 'visit') {
				$channel_id = -1;
			} else {
				$channel_id = Channel::getFor($channel)->id;
			}
		} else {
			$channel_id = 0;
		}
		if($date) {
			$this->doCompute($channel_id, $date, $venue_id);
		} else {
			$query = StatStatus::where('status', 'new_data');
			if($channel_id) {
				$query->where('channel_id', $channel_id);
			}
			if($venue_id) {
				$query->where('venue_id', $venue_id);
			}
			$stats = $query->get();
			foreach($stats as $stat) {
				$this->doCompute($stat->channel_id, $stat->date, $stat->venue_id);
			}
		}
	}
	private function doCompute($channel_id, $date, $venue_id) {
		switch($channel_id) {
			case 1:
				Stats::computeBoxOfficeSales($venue_id, $date);
				break;
			case 3:
				Stats::computeCafeSales($venue_id, $date);
				break;
			case -1:
				Stats::computeVisits($venue_id, $date);
				break;
			case 4:
				Stats::computeStoreSales($date);
				break;
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
			['date', 'd', InputOption::VALUE_REQUIRED, 'Date.', null],
			['venue_id', 'i', InputOption::VALUE_REQUIRED, 'Venue ID.', 0],
			['channel', 'c', InputOption::VALUE_REQUIRED, 'Channel name.', null],
		];
	}

}
