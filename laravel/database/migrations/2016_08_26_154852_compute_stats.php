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
