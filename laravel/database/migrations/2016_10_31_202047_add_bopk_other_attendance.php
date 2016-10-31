<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddBopkOtherAttendance extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		DB::table('box_office_product_kind')->insert([
			['id'=>6, 'code'=>'other_attendance'],
		]);
		DB::table('box_office_product_kind_map')->where('venue_id', 1518)->delete();
		$bopkm_data = App\Helpers\Helper::readCSV(database_path('migrations/data/bopkm_naq.csv'));
		DB::table('box_office_product_kind_map')->insert($bopkm_data);
		$sps = ['sp_compute_stats_visits'];
		foreach($sps as $sp) {
			$sql = file_get_contents(database_path(sprintf('migrations/sp/%s.sql', $sp)));
			DB::unprepared($sql);
		}
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
		DB::table('box_office_product_kind')->where('id', 6)->delete();
    }
}
