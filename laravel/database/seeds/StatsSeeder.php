<?php

use Illuminate\Database\Seeder;

class StatsSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run() {
		$sql = gzdecode(file_get_contents(database_path('seeds/data/stats.sql.gz')));
		DB::unprepared($sql);
		$sql = gzdecode(file_get_contents(database_path('seeds/data/stats_hourly.sql.gz')));
		DB::unprepared($sql);
	}
}
