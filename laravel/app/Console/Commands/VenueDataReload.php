<?php

namespace App\Console\Commands;

use App\Category;
use App\DashboardBoxVenue;
use App\GoalSalesDaily;
use App\GoalsSales;
use App\Product;
use App\ProductCategoryMap;
use App\VenueCategory;
use Illuminate\Console\Command;

class VenueDataReload extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'kl:venue_data_reload {venue_id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

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
		$venue_id = $this->argument('venue_id');
		Category::import('categories.json');
		VenueCategory::import($venue_id, 'venue_category_'.$venue_id.'.csv');
		ProductCategoryMap::import($venue_id, 'pkm_'.$venue_id.'.csv');
		Product::reCategorizeAll($venue_id);
		DashboardBoxVenue::import($venue_id, database_path('migrations/data/boxes_'.$venue_id.'.csv'));
		$fn = database_path('migrations/data/goals_'.$venue_id.'.csv');
		if(file_exists($fn))
			GoalsSales::import($venue_id, $fn);
		$fn = database_path('migrations/data/goals_daily_units_'.$venue_id.'.csv');
		if(file_exists($fn))
			GoalSalesDaily::import($venue_id, 'units', $fn);
    }
}
