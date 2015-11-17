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

		Schema::create('store', function(Blueprint $table)
		{
			$table->integer('id');
			$table->integer('venue_id');
			$table->string('name');
			$table->timestamps();
			$table->primary('id');
		});
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
