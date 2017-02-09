<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DashboardBoxes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		Schema::create('dashboard_box_venue', function (Blueprint $table) {
			$table->increments('id');
			$table->integer('venue_id');
			$table->string('box_code');
			$table->integer('row');
			$table->integer('column');
			$table->timestamps();
		});
		$venue_data = App\Helpers\Helper::readCSV(database_path('migrations/data/boxes_1204.csv'));
		DB::table('dashboard_box_venue')->insert($venue_data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
		Schema::dropIfExists('dashboard_box_venue');
    }
}
