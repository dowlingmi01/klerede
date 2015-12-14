<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class StatStatusTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('stat_status', function(Blueprint $table)
		{
			$table->increments('id');
			$table->smallInteger('channel_id');
			$table->date('date');
			$table->enum('status', ['new_data', 'computed']);
			$table->dateTime('time_new_data')->nullable();
			$table->dateTime('time_computed')->nullable();
			$table->timestamps();
			$table->unique(['channel_id', 'date']);
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('stat_status');
	}

}
