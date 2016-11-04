<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeRolePermissions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('role')->where('id', 1)->update(['permissions' => 'users-manage|goals-set|notes-manage']);
        DB::table('role')->where('id', 2)->update(['permissions' => 'users-manage|goals-set|notes-manage']);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('role')->where('id', 1)->update(['permissions' => 'users-manage|goals-set']);
        DB::table('role')->where('id', 2)->update(['permissions' => 'users-manage|goals-set']);
    }
}
