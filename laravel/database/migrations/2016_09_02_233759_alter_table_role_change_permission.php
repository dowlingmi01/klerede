<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableRoleChangePermission extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('role', function (Blueprint $table) {
            $table->dropColumn('permission');
            $table->string('permissions', 1000)->after('level');
        });

        $roles = array(
                ['id'=>1, 'name' => 'Owner', 'level'=>'10', 'permissions'=>'users-manage|goals-set'],
                ['id'=>2, 'name' => 'Admin', 'level'=>'20', 'permissions'=>'users-manage|goals-set'],
                ['id'=>4, 'name' => 'Basic', 'level'=>'40', 'permissions'=>''],
        );
        DB::table('role')->truncate();
        DB::table('role')->insert($roles);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('role', function (Blueprint $table) {
            $table->dropColumn('permissions');
            $table->string('permission',256)->after('level');
            
        });
    }
}
