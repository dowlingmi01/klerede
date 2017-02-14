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
			$table->boolean('is_online');
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
			$table->boolean('is_ga');
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
		DB::unprepared('ALTER TABLE visit CHANGE acp_id workstation_id int NOT NULL');

		$bopkm_data = App\Helpers\Helper::readCSV(database_path('migrations/data/bopkm_1518.csv'));
		DB::table('box_office_product_kind_map')->insert($bopkm_data);
		DB::table('facility')->insert([
			['venue_id'=>1588, 'code'=>'0',       'is_ga'=> true ],
			['venue_id'=>1588, 'code'=>'1',       'is_ga'=> true ],
			['venue_id'=>1588, 'code'=>'4',       'is_ga'=> false ],
			['venue_id'=>1588, 'code'=>'5',       'is_ga'=> false ],
			['venue_id'=>1518, 'code'=>'0/',      'is_ga'=> true ],
			['venue_id'=>1518, 'code'=>'0/GA01',  'is_ga'=> true ],
			['venue_id'=>1518, 'code'=>'0/MOV02', 'is_ga'=> false ],
		]);
		DB::table('operator')->insert([
			['venue_id'=>1588, 'code'=>'88',    'is_online'=> true ],
			['venue_id'=>1518, 'code'=>'WEBOP', 'is_online'=> true ],
		]);
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
