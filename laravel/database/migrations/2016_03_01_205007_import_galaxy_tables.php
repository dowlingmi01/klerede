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
		Schema::create('import_galaxy_box_office_transaction', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('query_id');
			$table->enum('status', ['pending', 'imported']);
			$table->integer('venue_id');
			$table->integer('source_id');
			$table->integer('register_id');
			$table->integer('sequence');
			$table->date('business_day');
			$table->dateTime('time');
			$table->integer('operator_id');
			$table->integer('agency_id');
			$table->timestamps();
			$table->index(['query_id', 'source_id'], 'ig_bot_idx');
		});
		Schema::create('import_galaxy_box_office_transaction_line', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('query_id');
			$table->enum('status', ['pending', 'imported']);
			$table->integer('venue_id');
			$table->integer('source_id');
			$table->integer('sequence');
			$table->string('box_office_product_code');
			$table->string('ticket_code');
			$table->double('sale_price');
			$table->integer('quantity');
			$table->timestamps();
			$table->index(['query_id', 'source_id'], 'ig_botl_idx');
		});
		DB::table('import_query_class')->insert([
			['id'=>10, 'name'=>'galaxy_box_office_product'],
			['id'=>20, 'name'=>'galaxy_box_office_transaction'],
			['id'=>30, 'name'=>'galaxy_box_office_transaction_line'],
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
		Schema::dropIfExists('import_galaxy_box_office_transaction');
		Schema::dropIfExists('import_galaxy_box_office_transaction_line');
	}

}
