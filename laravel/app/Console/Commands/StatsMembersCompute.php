<?php

namespace App\Console\Commands;

use App\Stats;
use Carbon\Carbon;
use Illuminate\Console\Command;

class StatsMembersCompute extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'kl:stats_members_compute {venue_id=1518} {date_from?} {date_to?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Compute members and memberships statistics.';

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
    public function handle()
    {
        $date_from = $this->argument('date_from');
		$date_to = $this->argument('date_to');
		if(!$date_from) {
			$date_from = Carbon::today()->subDays(5);
		}
		if(!$date_to) {
			$date_to = Carbon::yesterday();
		}
		Stats::computeMembers($this->argument('venue_id'), $date_from, $date_to);
    }
}
