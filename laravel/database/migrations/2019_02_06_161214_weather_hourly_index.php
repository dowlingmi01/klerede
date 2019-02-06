<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class WeatherHourlyIndex extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		Schema::table('weather_hourly', function (Blueprint $table) {
			$table->index('weather_daily_id');
		});
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
		Schema::table('weather_hourly', function (Blueprint $table) {
			$table->dropIndex('weather_hourly_weather_daily_id_index');
		});
    }
}
