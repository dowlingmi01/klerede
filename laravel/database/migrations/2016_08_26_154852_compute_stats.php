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
		Schema::table('box_office_transaction', function(Blueprint $table)
		{
			$table->index(['venue_id', 'time']);
		});
		Schema::table('box_office_transaction_line', function(Blueprint $table)
		{
			$table->index(['box_office_transaction_id']);
		});
		Schema::table('cafe_transaction', function(Blueprint $table)
		{
			$table->index(['venue_id', 'time']);
		});
		Schema::table('cafe_transaction_line', function(Blueprint $table)
		{
			$table->index(['cafe_transaction_id']);
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
