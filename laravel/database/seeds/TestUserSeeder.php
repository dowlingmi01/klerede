<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\User;
use App\Role;


class TestUserSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
        $users = array(
                ['id'=>1, 'first_name' => 'Aqua Test', 'last_name' => 'Owner', 'email' => 'aqua+owner@test.com', 'password' => Hash::make('secretowner'), 'venue_id' => 1518, 'role_id' => 1],
                ['id'=>2,'first_name' => 'LLPA Test', 'last_name' => 'Owner', 'email' => 'llpa+owner@test.com', 'password' => Hash::make('secretowner'), 'venue_id' => 1588, 'role_id' => 1],
                ['id'=>3,'first_name' => 'Aqua Test', 'last_name' => 'Admin', 'email' => 'aqua+admin@test.com', 'password' => Hash::make('secretadmin'), 'venue_id' => 1518, 'role_id' => 2],
                ['id'=>4,'first_name' => 'LLPA Test', 'last_name' => 'Admin', 'email' => 'llpa+admin@test.com', 'password' => Hash::make('secretadmin'), 'venue_id' => 1588, 'role_id' => 2],
                ['id'=>5,'first_name' => 'Aqua Test', 'last_name' => 'Basic', 'email' => 'aqua+basic@test.com', 'password' => Hash::make('secretbasic'), 'venue_id' => 1518, 'role_id' => 4],
                ['id'=>6,'first_name' => 'LLPA Test', 'last_name' => 'Basic', 'email' => 'llpa+basic@test.com', 'password' => Hash::make('secretbasic'), 'venue_id' => 1588, 'role_id' => 4],
                ['id'=>7,'first_name' => 'To be', 'last_name' => 'Deleted', 'email' => 'tobe+deleted@test.com', 'password' => Hash::make('secretbasic'), 'venue_id' => 1518, 'role_id' => 4],

        );

        // Loop through each user above and create the record for them in the database
        foreach ($users as $user)
        {
            User::create($user);
        }
	}

}
