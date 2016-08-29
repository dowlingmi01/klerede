<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ComputeStats extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		Schema::table('stat_status', function(Blueprint $table)
		{
			$table->dropUnique('stat_status_channel_id_date_unique');
			$table->integer('venue_id')->default(0)->after('id');
			$table->unique(['venue_id', 'channel_id', 'date']);
		});
		$sps = ['sp_compute_stats_members', 'sp_compute_stats_box_office', 'sp_compute_stats_cafe',
			'sp_compute_stats_visits'];
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
        //
    }
}
