<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class WeatherDailyTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('weather_daily', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('venue_id');
			$table->date('date');
			$table->string('summary_1');
			$table->string('summary_2');
			$table->string('icon_1');
			$table->string('icon_2');
			$table->double('temp_1');
			$table->double('temp_2');
			$table->mediumText('source')->nullable();
			$table->unique(['venue_id', 'date']);
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
		Schema::dropIfExists('weather_daily');
	}

}
