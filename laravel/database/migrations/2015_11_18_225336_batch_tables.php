<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class BatchTables extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('batch', function(Blueprint $table)
		{
			$table->increments('id');
			$table->dateTime('time_start');
			$table->dateTime('time_finish')->nullable();
			$table->enum('status', ['started', 'finished', 'error']);
			$table->string('command', 1024);
			$table->string('arguments', 1024);
			$table->timestamps();
		});
		Schema::create('batch_message', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('batch_id');
			$table->enum('type', ['error', 'warning', 'info']);
			$table->string('message', 20000);
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
		Schema::dropIfExists('batch');
		Schema::dropIfExists('batch_message');
	}

}
