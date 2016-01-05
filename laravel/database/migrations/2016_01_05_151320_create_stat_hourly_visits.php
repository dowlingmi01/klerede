<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStatHourlyVisits extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('stat_hourly_visits', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('venue_id');
			$table->date('date');
			$table->smallInteger('hour');
			$table->smallInteger('year');
			$table->mediumInteger('quarter');
			$table->mediumInteger('month');
			$table->mediumInteger('week');
			$table->smallInteger('box_office_product_kind_id');
			$table->integer('units');
			$table->timestamps();
			$table->index(['venue_id', 'date']);
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('stat_hourly_visits');
	}

}
