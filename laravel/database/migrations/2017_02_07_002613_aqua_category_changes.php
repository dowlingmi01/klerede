<?php

use App\Category;
use App\Product;
use App\ProductCategoryMap;
use App\VenueCategory;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AquaCategoryChanges extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		Category::import('categories.json');
		VenueCategory::import(1518, 'venue_category_1518.csv');
		ProductCategoryMap::import(1518, 'pkm_1518.csv');
		Product::reCategorizeAll(1518);
		$venue_data = App\Helpers\Helper::readCSV(database_path('migrations/data/boxes_1518.csv'));
		DB::table('dashboard_box_venue')->where('venue_id', 1518)->delete();
		DB::table('dashboard_box_venue')->insert($venue_data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
