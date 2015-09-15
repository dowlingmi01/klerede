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
			$table->integer('register_id');
			$table->integer('sequence');
			$table->date('business_day');
			$table->dateTime('time_start');
			$table->dateTime('time_end');
			$table->integer('operator_id');
			$table->string('currency');
			$table->enum('status', ['delivered', 'suspended', 'failed']);
			$table->double('net_amount');
			$table->enum('payment_type', ['cash', 'card']);
			$table->integer('card_type_id')->nullable();
			$table->integer('member_id')->nullable();;
			$table->integer('member_xstore_id')->nullable();;
			$table->mediumText('source_xml')->nullable();
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
			$table->integer('store_product_category_id');
			$table->string('code');
			$table->string('description');
			$table->string('scanned_code');
			$table->timestamps();
		});
		Schema::create('store_product_category', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('store_product_category_group_id');
			$table->string('code');
			$table->string('description')->nullable();
			$table->timestamps();
		});
		Schema::create('store_product_category_group', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('code');
			$table->string('description')->nullable();
			$table->timestamps();
		});
		Schema::create('member_xstore', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('venue_id');
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
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('store_transaction_line');
		Schema::dropIfExists('store_transaction');
		Schema::dropIfExists('store_product');
		Schema::dropIfExists('store_product_category');
		Schema::dropIfExists('store_product_category_group');
		Schema::dropIfExists('store_register');
		Schema::dropIfExists('member_xstore');
		Schema::dropIfExists('member');
		Schema::dropIfExists('card_type');
	}

}
