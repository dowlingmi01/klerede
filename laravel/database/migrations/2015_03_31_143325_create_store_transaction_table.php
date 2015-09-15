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
			$table->dateTime('time_start')->nullable();
			$table->dateTime('time_end');
			$table->integer('operator_id');
			$table->string('currency');
			$table->double('net_amount')->nullable();
			$table->enum('payment_type', ['cash', 'card'])->nullable();
			$table->integer('card_type_id')->nullable();
			$table->integer('member_id')->nullable();
			$table->integer('member_xstore_id')->nullable();
			$table->mediumText('source_xml')->nullable();
			$table->timestamps();
			$table->unique(['venue_id', 'register_id', 'sequence']);
		});
		Schema::create('store_transaction_galaxy_member_info', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('venue_id');
			$table->integer('register_id');
			$table->integer('sequence');
			$table->string('member_code');
			$table->unique(['venue_id', 'register_id', 'sequence'], 'store_transaction_galaxy_member_info_unique');
		});
		Schema::create('store_transaction_line', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('store_transaction_id');
			$table->integer('sequence');
			$table->integer('store_product_id');
			$table->double('retail_price')->nullable();
			$table->double('sale_price');
			$table->integer('quantity');
			$table->text('source_xml')->nullable();
			$table->timestamps();
		});
		Schema::create('store_transaction_line_galaxy', function(Blueprint $table)
		{
			$table->integer('venue_id');
			$table->integer('register_id');
			$table->integer('store_transaction_sequence');
			$table->integer('sequence');
			$table->string('store_product_scanned_code');
			$table->double('sale_price');
			$table->integer('quantity');
			$table->timestamps();
			$table->primary(['venue_id', 'register_id', 'store_transaction_sequence', 'sequence'], 'store_transaction_line_galaxy_pk');
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
		Schema::create('store_product_galaxy', function(Blueprint $table)
		{
			$table->integer('venue_id');
			$table->integer('store_product_category_source_id');
			$table->string('code');
			$table->string('description');
			$table->string('scanned_code');
			$table->unique(['venue_id', 'scanned_code']);
		});
		Schema::create('store_product_category', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('code');
			$table->string('description')->nullable();
			$table->timestamps();
		});
		DB::table('store_product_category')->insert([
			['code'=>'ACA', 'description'=>'Accessories Adult'],
			['code'=>'ACY', 'description'=>'Accessories Youth'],
			['code'=>'APA', 'description'=>'Apparel Adult'],
			['code'=>'APY', 'description'=>'Apparel Youth'],
			['code'=>'BKA', 'description'=>'Book Adult'],
			['code'=>'BKY', 'description'=>'Book Youth'],
			['code'=>'CDY', 'description'=>'Candy/Food'],
			['code'=>'CON', 'description'=>'Convenience'],
			['code'=>'GEO', 'description'=>'Geology'],
			['code'=>'HOM', 'description'=>'Home Accent'],
			['code'=>'JYA', 'description'=>'Jewelry Adult'],
			['code'=>'JYY', 'description'=>'Jewelry Youth'],
			['code'=>'MED', 'description'=>'Media'],
			['code'=>'NME', 'description'=>'Non Merchandise'],
			['code'=>'OUT', 'description'=>'Outdoor/Garden'],
			['code'=>'PLT', 'description'=>'Plant'],
			['code'=>'PLU', 'description'=>'Plush'],
			['code'=>'PST', 'description'=>'Poster'],
			['code'=>'SOV', 'description'=>'Souvenirs'],
			['code'=>'STA', 'description'=>'Stationery'],
			['code'=>'TOY', 'description'=>'Toy']
		]);
		Schema::create('store_product_category_galaxy', function(Blueprint $table)
		{
			$table->integer('venue_id');
			$table->increments('source_id');
			$table->string('code');
			$table->unique(['venue_id', 'source_id']);
		});
		DB::table('store_product_category_galaxy')->insert([
			['venue_id'=>1588, 'source_id'=>110, 'code'=>'ACA'],
			['venue_id'=>1588, 'source_id'=>111, 'code'=>'ACY'],
			['venue_id'=>1588, 'source_id'=>115, 'code'=>'APA'],
			['venue_id'=>1588, 'source_id'=>116, 'code'=>'APY'],
			['venue_id'=>1588, 'source_id'=>120, 'code'=>'BKA'],
			['venue_id'=>1588, 'source_id'=>121, 'code'=>'BKY'],
			['venue_id'=>1588, 'source_id'=>125, 'code'=>'CDY'],
			['venue_id'=>1588, 'source_id'=>130, 'code'=>'CON'],
			['venue_id'=>1588, 'source_id'=>135, 'code'=>'GEO'],
			['venue_id'=>1588, 'source_id'=>140, 'code'=>'HOM'],
			['venue_id'=>1588, 'source_id'=>145, 'code'=>'JYA'],
			['venue_id'=>1588, 'source_id'=>146, 'code'=>'JYY'],
			['venue_id'=>1588, 'source_id'=>150, 'code'=>'MED'],
			['venue_id'=>1588, 'source_id'=>155, 'code'=>'OUT'],
			['venue_id'=>1588, 'source_id'=>160, 'code'=>'PLT'],
			['venue_id'=>1588, 'source_id'=>165, 'code'=>'PLU'],
			['venue_id'=>1588, 'source_id'=>170, 'code'=>'PST'],
			['venue_id'=>1588, 'source_id'=>175, 'code'=>'SOV'],
			['venue_id'=>1588, 'source_id'=>180, 'code'=>'STA'],
			['venue_id'=>1588, 'source_id'=>185, 'code'=>'TOY'],
		]);
		Schema::create('member_xstore', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('venue_id');
			$table->string('xstore_id');
			$table->string('xstore_cust_id')->nullable();
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
		Schema::dropIfExists('store_transaction_line_galaxy');
		Schema::dropIfExists('store_transaction');
		Schema::dropIfExists('store_transaction_galaxy_member_info');
		Schema::dropIfExists('store_product');
		Schema::dropIfExists('store_product_galaxy');
		Schema::dropIfExists('store_product_category');
		Schema::dropIfExists('store_product_category_galaxy');
		Schema::dropIfExists('store_product_category_group');
		Schema::dropIfExists('store_register');
		Schema::dropIfExists('member_xstore');
		Schema::dropIfExists('member');
		Schema::dropIfExists('card_type');
	}

}
