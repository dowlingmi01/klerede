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
			$table->index(['query_id', 'id'], 'ig_bop_idx');
		});
		Schema::create('import_galaxy_member', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('query_id');
			$table->enum('status', ['pending', 'imported']);
			$table->integer('venue_id');
			$table->string('code');
			$table->tinyInteger('gender');
			$table->tinyInteger('age_group');
			$table->date('dob')->nullable();
			$table->string('city');
			$table->string('state');
			$table->string('zip');
			$table->string('country');
			$table->dateTime('last_changed');
			$table->timestamps();
			$table->index(['query_id', 'id'], 'ig_m_idx');
		});
		Schema::create('import_galaxy_membership', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('query_id');
			$table->enum('status', ['pending', 'imported']);
			$table->integer('venue_id');
			$table->string('member_code');
			$table->string('code');
			$table->integer('sequence');
			$table->string('box_office_product_code');
			$table->date('date_from');
			$table->date('date_to');
			$table->date('dob')->nullable();
			$table->integer('adult_qty');
			$table->integer('child_qty');
			$table->string('city');
			$table->string('state');
			$table->string('zip');
			$table->string('country');
			$table->dateTime('last_changed');
			$table->timestamps();
			$table->index(['query_id', 'id'], 'ig_mb_idx');
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
			$table->timestamps();
			$table->index(['query_id', 'id'], 'ig_bot_idx');
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
			$table->index(['query_id', 'id'], 'ig_botl_idx');
		});
		Schema::create('import_galaxy_visit', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('query_id');
			$table->enum('status', ['pending', 'imported']);
			$table->integer('venue_id');
			$table->integer('source_id');
			$table->integer('acp_id');
			$table->integer('facility_id');
			$table->string('box_office_product_code');
			$table->string('ticket_code');
			$table->enum('kind', ['ticket', 'pass', 'other']);
			$table->integer('quantity');
			$table->integer('use_no');
			$table->dateTime('time');
			$table->timestamps();
			$table->index(['query_id', 'id'], 'ig_v_idx');
		});
		Schema::create('import_galaxy_cafe_product', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('query_id');
			$table->enum('status', ['pending', 'imported']);
			$table->integer('venue_id');
			$table->string('code');
			$table->string('description');
			$table->string('account_code');
			$table->timestamps();
			$table->index(['query_id', 'id'], 'ig_cp_idx');
		});
		Schema::create('import_galaxy_cafe_transaction', function(Blueprint $table)
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
			$table->timestamps();
			$table->index(['query_id', 'id'], 'ig_ct_idx');
		});
		Schema::create('import_galaxy_cafe_transaction_line', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('query_id');
			$table->enum('status', ['pending', 'imported']);
			$table->integer('venue_id');
			$table->integer('source_id');
			$table->integer('sequence');
			$table->string('cafe_product_code');
			$table->double('sale_price');
			$table->integer('quantity');
			$table->timestamps();
			$table->index(['query_id', 'id'], 'ig_ctl_idx');
		});
		Schema::create('import_galaxy_cafe_transaction_member_info', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('query_id');
			$table->enum('status', ['pending', 'imported']);
			$table->integer('venue_id');
			$table->integer('source_id');
			$table->integer('sequence');
			$table->string('member_code');
			$table->timestamps();
			$table->index(['query_id', 'id'], 'ig_ctmi_idx');
		});
		DB::table('import_query_class')->insert([
			['id'=>100, 'name'=>'galaxy_box_office_product'],
			['id'=>200, 'name'=>'galaxy_member'],
			['id'=>300, 'name'=>'galaxy_membership'],
			['id'=>400, 'name'=>'galaxy_box_office_transaction'],
			['id'=>500, 'name'=>'galaxy_box_office_transaction_line'],
			['id'=>600, 'name'=>'galaxy_visit'],
			['id'=>700, 'name'=>'galaxy_cafe_product'],
			['id'=>800, 'name'=>'galaxy_cafe_transaction'],
			['id'=>900, 'name'=>'galaxy_cafe_transaction_line'],
			['id'=>1000, 'name'=>'galaxy_cafe_transaction_member_info'],
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
		Schema::dropIfExists('import_galaxy_member');
		Schema::dropIfExists('import_galaxy_membership');
		Schema::dropIfExists('import_galaxy_box_office_transaction');
		Schema::dropIfExists('import_galaxy_box_office_transaction_line');
		Schema::dropIfExists('import_galaxy_visit');
		Schema::dropIfExists('import_galaxy_cafe_product');
		Schema::dropIfExists('import_galaxy_cafe_transaction');
		Schema::dropIfExists('import_galaxy_cafe_transaction_line');
		Schema::dropIfExists('import_galaxy_cafe_transaction_member_info');
	}

}
