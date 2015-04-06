<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStoreTransactionTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('store_transaction', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('venue_id');
			$table->integer('store_register_id');
			$table->integer('sequence');
			$table->dateTime('time_start');
			$table->dateTime('time_end');
			$table->integer('operator_id');
			$table->string('currency');
			$table->enum('status', ['delivered', 'suspended', 'failed']);
			$table->double('net_amount');
			$table->enum('payment_type', ['cash', 'card']);
			$table->integer('card_type_id')->nullable();
			$table->integer('member_id')->nullable();;
			$table->text('source_xml')->nullable();
			$table->timestamps();
		});
		Schema::create('store_transaction_line', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('store_transaction_id');
			$table->integer('sequence');
			$table->dateTime('time_start');
			$table->dateTime('time_end');
			$table->integer('store_product_id');
			$table->double('retail_price');
			$table->double('sale_price');
			$table->integer('quantity');
			$table->text('source_xml')->nullable();
			$table->timestamps();
		});
		Schema::create('store_product', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('code');
			$table->string('description');
			$table->string('scanned_code');
			$table->timestamps();
		});
		Schema::create('member', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('xstore_id');
			$table->string('xstore_cust_id');
			$table->string('venue_member_number')->nullable();
			$table->string('name');
			$table->boolean('active');
			$table->timestamps();
		});
		Schema::create('card_type', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('name');
			$table->timestamps();
		});
		Schema::create('store_register', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('venue_id');
			$table->integer('local_code');
			$table->bigInteger('global_code');
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
		Schema::drop('store_transaction_line');
		Schema::drop('store_transaction');
		Schema::drop('store_product');
		Schema::drop('store_register');
		Schema::drop('member');
		Schema::drop('card_type');
	}

}
