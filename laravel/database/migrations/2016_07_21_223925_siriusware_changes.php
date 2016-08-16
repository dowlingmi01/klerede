<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SiriuswareChanges extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('operator', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('venue_id');
			$table->string('code');
			$table->timestamps();
			$table->unique(['venue_id', 'code']);
		});
		Schema::create('workstation', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('venue_id');
			$table->string('code');
			$table->timestamps();
			$table->unique(['venue_id', 'code']);
		});
		Schema::create('facility', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('venue_id');
			$table->string('code');
			$table->timestamps();
			$table->unique(['venue_id', 'code']);
		});
		Schema::table('membership', function(Blueprint $table) {
			$table->dropUnique('membership_venue_id_sequence_unique');
		});
		Schema::table('box_office_transaction', function (Blueprint $table) {
			$table->dropColumn('agency_id');
		});
		Schema::table('cafe_transaction', function (Blueprint $table) {
			$table->dropColumn('agency_id');
		});

		$bopkm_data = App\Helpers\Helper::readCSV(database_path('migrations/data/bopkm_naq.csv'));
		DB::table('box_office_product_kind_map')->insert($bopkm_data);
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('operator');
		Schema::dropIfExists('workstation');
		Schema::dropIfExists('facility');
	}

}
