<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ImportSiriuswareTables extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('import_siriusware_box_office_product', function(Blueprint $table)
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
			$table->timestamps();
		});
		Schema::create('import_siriusware_member', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('query_id');
			$table->enum('status', ['pending', 'imported']);
			$table->integer('venue_id');
			$table->string('code');
			$table->tinyInteger('gender');
			$table->date('dob')->nullable();
			$table->string('city');
			$table->string('state');
			$table->string('zip');
			$table->string('country');
			$table->integer('last_mod');
			$table->timestamps();
			$table->index(['query_id', 'id'], 'is_m_idx');
		});
		Schema::create('import_siriusware_membership', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('query_id');
			$table->enum('status', ['pending', 'imported']);
			$table->integer('venue_id');
			$table->string('member_code');
			$table->string('code');
			$table->string('box_office_product_code');
			$table->date('date_from');
			$table->date('date_to');
			$table->integer('last_mod');
			$table->timestamps();
			$table->index(['query_id', 'id'], 'is_mb_idx');
		});
		Schema::create('import_siriusware_box_office_transaction', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('query_id');
			$table->enum('status', ['pending', 'imported']);
			$table->integer('venue_id');
			$table->integer('source_id');
			$table->integer('register_id');
			$table->integer('sequence');
			$table->dateTime('time');
			$table->string('operator_code');
			$table->timestamps();
			$table->index(['query_id', 'id'], 'is_bot_idx');
		});
		Schema::create('import_siriusware_box_office_transaction_line', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('query_id');
			$table->enum('status', ['pending', 'imported']);
			$table->integer('venue_id');
			$table->integer('source_id');
			$table->integer('sequence');
			$table->string('box_office_product_code');
			$table->double('sale_price');
			$table->integer('quantity');
			$table->timestamps();
			$table->index(['query_id', 'id'], 'is_botl_idx');
		});
		Schema::create('import_siriusware_visit', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('query_id');
			$table->enum('status', ['pending', 'imported']);
			$table->integer('venue_id');
			$table->integer('source_id');
			$table->string('acp_code');
			$table->string('facility_code');
			$table->string('box_office_product_code');
			$table->string('ticket_code');
			$table->enum('kind', ['ticket', 'pass', 'other']);
			$table->dateTime('time');
			$table->timestamps();
			$table->index(['query_id', 'id'], 'is_v_idx');
		});
		DB::table('import_query_class')->insert([
			['id'=>1100, 'name'=>'siriusware_box_office_product'],
			['id'=>1200, 'name'=>'siriusware_member'],
			['id'=>1300, 'name'=>'siriusware_membership'],
			['id'=>1400, 'name'=>'siriusware_box_office_transaction'],
			['id'=>1500, 'name'=>'siriusware_box_office_transaction_line'],
			['id'=>1600, 'name'=>'siriusware_visit_ticket'],
			['id'=>1700, 'name'=>'siriusware_visit_pass'],
		]);
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('import_siriusware_box_office_product');
		Schema::dropIfExists('import_siriusware_member');
		Schema::dropIfExists('import_siriusware_membership');
		Schema::dropIfExists('import_siriusware_box_office_transaction');
		Schema::dropIfExists('import_siriusware_box_office_transaction_line');
		Schema::dropIfExists('import_siriusware_visit');
		DB::table('import_query_class')->whereBetween('id', [1100, 1700])->delete();
	}

}
