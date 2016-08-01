<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeMembershipTables extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::dropIfExists('member_name');
		Schema::dropIfExists('member_address');
		Schema::dropIfExists('member');
		Schema::dropIfExists('membership');
		Schema::dropIfExists('member_galaxy');
		Schema::dropIfExists('membership_galaxy');
		Schema::create('member_location', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('city');
			$table->string('state');
			$table->string('zip');
			$table->string('country');
			$table->timestamps();
			$table->unique(['city', 'state', 'zip', 'country']);
		});
		Schema::create('member', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('venue_id');
			$table->string('code');
			$table->integer('last_membership_id')->nullable();
			$table->integer('member_location_id');
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
			$table->integer('member_location_id')->nullable();
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
			$table->index(['date_from', 'date_to']);
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
		Schema::dropIfExists('member_location');
	}

}
