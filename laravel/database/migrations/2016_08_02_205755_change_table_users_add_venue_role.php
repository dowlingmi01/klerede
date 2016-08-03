<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeTableUsersAddVenueRole extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function(Blueprint $table)
        {
            $table->string('username', 60)->nulleable()->after('email');
            $table->integer('role_id')->after('password');
            $table->integer('venue_id')->after('role_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
    
        Schema::table('users', function(Blueprint $table)
        {
            $table->dropColumn('username');
            $table->dropColumn('role_id');
            $table->dropColumn('venue_id');
        });
    }
}
