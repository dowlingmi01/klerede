<?php

use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run() {
		$sql = gzdecode(file_get_contents(database_path('seeds/data/transaction.sql.gz')));
		DB::unprepared($sql);
	}
}
