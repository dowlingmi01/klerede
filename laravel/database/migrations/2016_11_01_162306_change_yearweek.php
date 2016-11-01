<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeYearweek extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		$sps = ['sp_compute_stats_box_office', 'sp_compute_stats_cafe', 'sp_compute_stats_visits'];
		foreach($sps as $sp) {
			$sql = file_get_contents(database_path(sprintf('migrations/sp/%s.sql', $sp)));
			DB::unprepared($sql);
		}
		$tables = ['stat_sales', 'stat_visits', 'weather_daily'];
		foreach($tables as $table) {
			DB::table($table)->update(['week'=>DB::raw('yearweek(date, 3)')]);
		}
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
    }
}
