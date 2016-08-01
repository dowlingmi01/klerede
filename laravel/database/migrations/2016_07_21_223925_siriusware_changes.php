<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SiriuswareChanges extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('operator', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('venue_id');
			$table->string('code');
			$table->timestamps();
			$table->unique(['venue_id', 'code']);
		});
		Schema::create('workstation', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('venue_id');
			$table->string('code');
			$table->timestamps();
			$table->unique(['venue_id', 'code']);
		});
		Schema::create('facility', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('venue_id');
			$table->string('code');
			$table->timestamps();
			$table->unique(['venue_id', 'code']);
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('operator');
		Schema::dropIfExists('workstation');
		Schema::dropIfExists('facility');
	}

}
