<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMembershipTables extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('member', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('venue_id');
			$table->string('code');
			$table->integer('last_membership_id')->nullable();
			$table->integer('member_name_id');
			$table->integer('member_address_id');
			$table->tinyInteger('gender');
			$table->tinyInteger('age_group');
			$table->date('dob')->nullable();
			$table->timestamps();
			$table->unique(['venue_id', 'code']);
		});
		Schema::create('membership', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('venue_id');
			$table->integer('member_id');
			$table->integer('member_name_id');
			$table->integer('member_address_id');
			$table->string('code');
			$table->integer('sequence');
			$table->integer('box_office_product_id');
			$table->date('date_from');
			$table->date('date_to');
			$table->date('dob')->nullable();
			$table->integer('adult_qty');
			$table->integer('child_qty');
			$table->timestamps();
			$table->unique(['venue_id', 'sequence']);
			$table->unique(['venue_id', 'code']);
			$table->index(['member_id']);
		});
		Schema::create('member_name', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('first');
			$table->string('middle');
			$table->string('last');
			$table->timestamps();
			$table->unique(['first', 'middle', 'last']);
		});
		Schema::create('member_address', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('street_1');
			$table->string('street_2');
			$table->string('city');
			$table->string('state');
			$table->string('zip');
			$table->string('country');
			$table->string('phone');
			$table->timestamps();
			$table->index(['street_1', 'street_2', 'city']);
		});
		Schema::create('member_galaxy', function(Blueprint $table)
		{
			$table->integer('venue_id');
			$table->string('code');
			$table->string('first');
			$table->string('middle');
			$table->string('last');
			$table->tinyInteger('gender');
			$table->tinyInteger('age_group');
			$table->date('dob')->nullable();
			$table->string('street_1');
			$table->string('street_2');
			$table->string('city');
			$table->string('state');
			$table->string('zip');
			$table->string('country');
			$table->string('phone');
			$table->unique(['venue_id', 'code']);
		});
		Schema::create('membership_galaxy', function(Blueprint $table)
		{
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
			$table->string('first');
			$table->string('middle');
			$table->string('last');
			$table->string('street_1');
			$table->string('street_2');
			$table->string('city');
			$table->string('state');
			$table->string('zip');
			$table->string('country');
			$table->string('phone');
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
		Schema::dropIfExists('member');
		Schema::dropIfExists('membership');
		Schema::dropIfExists('member_name');
		Schema::dropIfExists('member_address');
		Schema::dropIfExists('member_galaxy');
		Schema::dropIfExists('membership_galaxy');
	}
}
