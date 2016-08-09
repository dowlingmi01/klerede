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
        
		
		$roles = array(
                ['id'=>1, 'name' => 'Owner'],
                ['id'=>2, 'name' => 'Admin'],
                ['id'=>3, 'name' => 'Power'],
                ['id'=>4, 'name' => 'Basic'],
        );

		foreach ($roles as $role)
        {
            Role::create($role);
        }

 		$this->call('UserSeeder');

        Model::reguard();
	}

}
