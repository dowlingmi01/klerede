<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class BoxOfficeTransactionTables extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('box_office_transaction', function(Blueprint $table)
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
			$table->enum('payment_type', ['cash', 'card'])->nullable();
			$table->integer('card_type_id')->nullable();
			$table->timestamps();
			$table->unique(['venue_id', 'source_id']);
		});
		Schema::create('box_office_transaction_line', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('box_office_transaction_id');
			$table->integer('sequence');
			$table->integer('box_office_product_id');
			$table->string('ticket_code');
			$table->double('sale_price');
			$table->integer('quantity');
			$table->timestamps();
		});
		Schema::create('box_office_transaction_line_galaxy', function(Blueprint $table)
		{
			$table->integer('venue_id');
			$table->integer('source_id');
			$table->integer('sequence');
			$table->string('box_office_product_code');
			$table->string('ticket_code');
			$table->double('sale_price');
			$table->integer('quantity');
			$table->primary(['venue_id', 'source_id', 'sequence'], 'box_office_transction_line_galaxy_pk');
		});
		Schema::create('box_office_product', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('venue_id');
			$table->string('code');
			$table->string('description');
			$table->string('account_code');
			$table->enum('kind', ['ticket', 'pass', 'other']);
			$table->boolean('is_ga');
			$table->integer('visitor_category_id')->nullable();
			$table->smallInteger('membership_kind_id')->nullable();
			$table->integer('delivery_method_id');
			$table->timestamps();
			$table->unique(['venue_id', 'code']);
		});
		Schema::create('visitor_category', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('description');
			$table->timestamps();
		});
		Schema::create('visit_galaxy', function(Blueprint $table)
		{
			$table->integer('source_id');
			$table->integer('venue_id');
			$table->integer('acp_id');
			$table->string('box_office_product_code');
			$table->string('ticket_code');
			$table->enum('kind', ['ticket', 'pass', 'other']);
			$table->integer('operation_id');
			$table->integer('quantity');
			$table->integer('use_no');
			$table->dateTime('time');
			$table->timestamps();
			$table->primary('source_id');
		});
		Schema::create('visit', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('source_id');
			$table->integer('venue_id');
			$table->integer('acp_id');
			$table->integer('box_office_product_id');
			$table->string('ticket_code');
			$table->enum('kind', ['ticket', 'pass', 'other']);
			$table->integer('operation_id');
			$table->integer('quantity');
			$table->integer('use_no');
			$table->dateTime('time');
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
		Schema::dropIfExists('box_office_transaction');
		Schema::dropIfExists('box_office_transaction_line');
		Schema::dropIfExists('box_office_transaction_line_galaxy');
		Schema::dropIfExists('box_office_product');
		Schema::dropIfExists('visitor_category');
		Schema::dropIfExists('visit');
		Schema::dropIfExists('visit_galaxy');
	}

}
