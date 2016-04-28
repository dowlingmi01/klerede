<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ImportTables extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('venue_variable', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('venue_id');
			$table->string('name');
			$table->string('value');
			$table->timestamps();
			$table->unique(['venue_id', 'name']);
		});
		Schema::create('import_query_class', function(Blueprint $table)
		{
			$table->integer('id');
			$table->string('name');
			$table->primary('id');
		});
		Schema::create('import_query', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('import_query_class_id');
			$table->integer('venue_id');
			$table->string('query_text', 2000);
			$table->enum('status', ['pending', 'executed', 'imported']);
			$table->dateTime('time_created');
			$table->dateTime('time_executed')->nullable();
			$table->dateTime('time_imported')->nullable();
			$table->timestamps();
			$table->index(['venue_id', 'status', 'id']);
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('venue_variable');
		Schema::dropIfExists('import_query_class');
		Schema::dropIfExists('import_query');
	}

}
