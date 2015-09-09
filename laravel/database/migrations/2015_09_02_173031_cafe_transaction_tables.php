<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CafeTransactionTables extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('cafe_transaction', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('venue_id');
			$table->integer('source_id');
			$table->integer('register_id');
			$table->integer('sequence');
			$table->date('business_day');
			$table->dateTime('time');
			$table->integer('operator_id');
			$table->integer('agency_id');
			$table->integer('member_id')->nullable();
			$table->enum('payment_type', ['cash', 'card'])->nullable();
			$table->integer('card_type_id')->nullable();
			$table->timestamps();
			$table->unique(['venue_id', 'source_id']);
		});
		Schema::create('cafe_transaction_galaxy_member_info', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('venue_id');
			$table->integer('source_id');
			$table->string('member_code');
			$table->unique(['venue_id', 'source_id']);
		});
		Schema::create('cafe_transaction_line', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('cafe_transaction_id');
			$table->integer('sequence');
			$table->integer('cafe_product_id');
			$table->double('sale_price');
			$table->integer('quantity');
			$table->timestamps();
		});
		Schema::create('cafe_transaction_line_galaxy', function(Blueprint $table)
		{
			$table->integer('venue_id');
			$table->integer('source_id');
			$table->integer('sequence');
			$table->string('cafe_product_code');
			$table->double('sale_price');
			$table->integer('quantity');
			$table->primary(['venue_id', 'source_id', 'sequence'], 'cafe_transaction_line_galaxy_pk');
		});
		Schema::create('cafe_product', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('venue_id');
			$table->string('code');
			$table->string('description');
			$table->string('account_code');
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
		Schema::dropIfExists('cafe_transaction');
		Schema::dropIfExists('cafe_transaction_galaxy_member_info');
		Schema::dropIfExists('cafe_transaction_line');
		Schema::dropIfExists('cafe_transaction_line_galaxy');
		Schema::dropIfExists('cafe_product');
	}

}
