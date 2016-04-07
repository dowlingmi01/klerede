<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class WeatherHourlyTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('weather_hourly', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('weather_daily_id');
			$table->smallInteger('hour');
			$table->string('summary');
			$table->string('icon');
			$table->double('temp');
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('weather_hourly');
	}

}
