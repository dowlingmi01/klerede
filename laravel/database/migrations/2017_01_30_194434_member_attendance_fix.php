<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class MemberAttendanceFix extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		Schema::table('stat_visits', function (Blueprint $table) {
			$table->unique(['venue_id', 'category_id', 'date', 'members']);
		});
		$sps = ['sp_compute_stats_visits', 'sp_compute_stats_members'];
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
		Schema::table('stat_visits', function (Blueprint $table) {
			$table->dropIndex('stat_visits_venue_id_category_id_date_members_unique');
		});
    }
}
