<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class VenueTables extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('venue', function(Blueprint $table)
		{
			$table->integer('id');
			$table->string('name');
			$table->string('street');
			$table->string('city');
			$table->string('state');
			$table->string('zip');
			$table->string('country');
			$table->double('lat');
			$table->double('long');
			$table->timestamps();
			$table->primary('id');
		});
		$venue_data = App\Helpers\Helper::readCSV(database_path('migrations/data/venues.csv'));
		DB::table('venue')->insert($venue_data);

		Schema::create('store', function(Blueprint $table)
		{
			$table->integer('id');
			$table->integer('venue_id');
			$table->string('name');
			$table->timestamps();
			$table->primary('id');
		});
		$store_data = App\Helpers\Helper::readCSV(database_path('migrations/data/stores.csv'));
		DB::table('store')->insert($store_data);
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('venue');
		Schema::dropIfExists('store');
	}

}
