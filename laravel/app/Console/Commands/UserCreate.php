<?php

namespace App\Console\Commands;

use App\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class UserCreate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'kl:user_create {email} {password} {first_name} {last_name} {venue_id} {role_id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add a user to the database';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
		$args = $this->argument();
		$args['password'] = Hash::make($args['password']);
//		$args['role_id'] = intval($args['role_id']);
//		$args['venue_id'] = intval($args['venue_id']);
        User::create($args);
    }
}
