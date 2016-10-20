<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMembershipKindCorporate extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		DB::table('membership_kind')->insert([
			['id'=>3, 'code'=>'corporate'],
		]);
		$sps = ['sp_compute_stats_members'];
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
		DB::table('membership_kind')->where('id', 3)->delete();
    }
}
