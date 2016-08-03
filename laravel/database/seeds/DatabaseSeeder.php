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

		//$this->call('StatsSeeder');
		//$this->call('WeatherSeeder');
		
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


		$users = array(
                ['name' => 'Ryan Chenkie', 'email' => 'ryanchenkie@gmail.com', 'password' => Hash::make('secret'), 'venue_id' => 1588, 'role_id' => 1],
                ['name' => 'Chris Sevilleja', 'email' => 'chris@scotch.io', 'password' => Hash::make('secret'), 'venue_id' => 1588, 'role_id' => 1],
                ['name' => 'Holly Lloyd', 'email' => 'holly@scotch.io', 'password' => Hash::make('secret'), 'venue_id' => 1588, 'role_id' => 1],
                ['name' => 'Adnan Kukic', 'email' => 'adnan@scotch.io', 'password' => Hash::make('secret'), 'venue_id' => 1588, 'role_id' => 1],
        );
            
        // Loop through each user above and create the record for them in the database
        foreach ($users as $user)
        {
            User::create($user);
        }

        Model::reguard();
	}

}
