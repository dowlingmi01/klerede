<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\User;
use App\Role;

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Model::unguard();

		$this->call('StatsSeeder');
		$this->call('WeatherSeeder');
 
 		$this->call('UserSeeder');

        Model::reguard();
	}

}
