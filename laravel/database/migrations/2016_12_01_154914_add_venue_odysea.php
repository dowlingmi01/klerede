<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddVenueOdysea extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		$venue_data = App\Helpers\Helper::readCSV(database_path('migrations/data/venues.02.csv'));
		DB::table('venue')->insert($venue_data);
		$store_data = App\Helpers\Helper::readCSV(database_path('migrations/data/stores.02.csv'));
		DB::table('store')->insert($store_data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
		DB::table('venue')->where('id', 1604)->delete();
		DB::table('store')->where('id', 1604)->delete();
    }
}
