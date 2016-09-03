<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddLevelToRoleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('role', function (Blueprint $table) {
            $table->smallInteger('level')->after('name');
            $table->string('permission', 256)->after('level');
        });

        $roles = array(
                ['id'=>1, 'name' => 'Owner', 'level'=>'10', 'permission'=>'UM|GS'],
                ['id'=>2, 'name' => 'Admin', 'level'=>'20', 'permission'=>'UM|GS'],
                ['id'=>3, 'name' => 'Power', 'level'=>'30', 'permission'=>'GS'],
                ['id'=>4, 'name' => 'Basic', 'level'=>'40', 'permission'=>''],
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
            $table->dropColumn('level');
            $table->dropColumn('permission');
        });
    }
        
}
