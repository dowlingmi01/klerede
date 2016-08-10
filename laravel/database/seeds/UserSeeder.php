<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\User;
use App\Role;

class UserSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		$users = array(
                ['name' => 'Aqua Test Owner', 'email' => 'aqua+owner@klerede.com', 'password' => Hash::make('secretowner'), 'venue_id' => 1518, 'role_id' => 1],
                ['name' => 'LLPA Test Owner', 'email' => 'llpa+owner@klerede.com', 'password' => Hash::make('secretowner'), 'venue_id' => 1588, 'role_id' => 1],
                ['name' => 'Aqua Test Admin', 'email' => 'aqua+admin@klerede.com', 'password' => Hash::make('secretadmin'), 'venue_id' => 1518, 'role_id' => 2],
                ['name' => 'LLPA Test Admin', 'email' => 'llpa+admin@klerede.com', 'password' => Hash::make('secretadmin'), 'venue_id' => 1588, 'role_id' => 2],
        );

        // Loop through each user above and create the record for them in the database
        foreach ($users as $user)
        {
            User::create($user);
        }
	}

}
