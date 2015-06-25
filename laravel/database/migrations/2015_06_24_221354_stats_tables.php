<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class StatsTables extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('channel', function(Blueprint $table)
		{
			$table->smallInteger('id');
			$table->string('code');
		});
		DB::table('channel')->insert([
			['id'=>1, 'code'=>'gate'],
			['id'=>2, 'code'=>'membership'],
			['id'=>3, 'code'=>'cafe'],
			['id'=>4, 'code'=>'store'],
		]);
		Schema::create('box_office_product_kind', function(Blueprint $table)
		{
			$table->smallInteger('id');
			$table->string('code');
		});
		DB::table('box_office_product_kind')->insert([
			['id'=>1, 'code'=>'ga'],
			['id'=>2, 'code'=>'membership'],
			['id'=>3, 'code'=>'group'],
			['id'=>4, 'code'=>'other'],
		]);
		Schema::create('membership_kind', function(Blueprint $table)
		{
			$table->smallInteger('id');
			$table->string('code');
		});
		DB::table('membership_kind')->insert([
			['id'=>1, 'code'=>'individual'],
			['id'=>2, 'code'=>'family'],
		]);
		Schema::create('stat_visits', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('venue_id');
			$table->date('date');
			$table->smallInteger('year');
			$table->smallInteger('quarter');
			$table->smallInteger('month');
			$table->smallInteger('week');
			$table->smallInteger('box_office_product_kind_id');
			$table->integer('units');
			$table->timestamps();
			$table->index(['venue_id', 'date']);
		});
		Schema::create('stat_sales', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('venue_id');
			$table->date('date');
			$table->smallInteger('year');
			$table->smallInteger('quarter');
			$table->smallInteger('month');
			$table->smallInteger('week');
			$table->smallInteger('channel_id');
			$table->smallInteger('box_office_product_kind_id');
			$table->smallInteger('membership_kind_id');
			$table->boolean('members');
			$table->boolean('online');
			$table->integer('units');
			$table->double('amount');
			$table->timestamps();
			$table->index(['venue_id', 'date']);
		});
		Schema::create('box_office_product_kind_map', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('venue_id');
			$table->string('account_code_from');
			$table->string('account_code_to');
			$table->smallInteger('box_office_product_kind_id');
			$table->timestamps();
		});
		DB::table('box_office_product_kind_map')->insert([
			['venue_id'=>1588, 'account_code_from'=>'000110100000'
				, 'account_code_to'=>'000110104999', 'box_office_product_kind_id' => 1],
			['venue_id'=>1588, 'account_code_from'=>'000110105000'
				, 'account_code_to'=>'000110109999', 'box_office_product_kind_id' => 3],
			['venue_id'=>1588, 'account_code_from'=>'000110110000'
				, 'account_code_to'=>'000110119999', 'box_office_product_kind_id' => 2],
			['venue_id'=>1588, 'account_code_from'=>'000110120000'
				, 'account_code_to'=>'000110499999', 'box_office_product_kind_id' => 4],
		]);
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('channel');
		Schema::dropIfExists('box_office_product_kind');
		Schema::dropIfExists('membership_kind');
		Schema::dropIfExists('stat_visits');
		Schema::dropIfExists('stat_sales');
		Schema::dropIfExists('box_office_product_kind_map');
	}

}
