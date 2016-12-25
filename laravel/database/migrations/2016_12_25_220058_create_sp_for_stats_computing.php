<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSpForStatsComputing extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $sps = ['sp_compute_stats_visits', 'sp_compute_stats'];
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
