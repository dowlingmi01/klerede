<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class GoalSalesMonthlyTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('goal_sales_monthly', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('venue_id');
			$table->smallInteger('year');
			$table->mediumInteger('month');
			$table->smallInteger('channel_id');
			$table->smallInteger('sub_channel_id');
			$table->enum('type', ['amount', 'units']);
			$table->double('goal');
			$table->timestamps();
			$table->unique(['venue_id', 'month', 'channel_id', 'sub_channel_id', 'type'], 'goal_settings_monthly_unique');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('goal_sales_monthly');
	}

}
