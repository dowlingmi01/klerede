<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ImportGalaxyTables extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('import_galaxy_box_office_product', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('query_id');
			$table->enum('status', ['pending', 'imported']);
			$table->integer('venue_id');
			$table->string('code');
			$table->string('description');
			$table->string('account_code');
			$table->enum('kind', ['ticket', 'pass', 'other']);
			$table->boolean('is_ga');
			$table->integer('delivery_method_id');
			$table->timestamps();
		});
		DB::table('import_query_class')->insert([
			['id'=>10, 'name'=>'galaxy_box_office_product'],
		]);
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('import_galaxy_box_office_product');
	}

}
