<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ImportAquaBoxes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		$venue_data = App\Helpers\Helper::readCSV(database_path('migrations/data/boxes_aqua.csv'));
		DB::table('dashboard_box_venue')->insert($venue_data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
		DB::table('dashboard_box_venue')->where('venue_id', 1518)->delete();
    }
}
