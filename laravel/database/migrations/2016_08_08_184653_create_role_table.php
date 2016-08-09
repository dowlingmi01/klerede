<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRoleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('role', function(Blueprint $table)
        {
            $table->increments('id');
            $table->string('name');
            $table->timestamps();
        });

        $roles = array(
                ['id'=>1, 'name' => 'Owner'],
                ['id'=>2, 'name' => 'Admin'],
                ['id'=>3, 'name' => 'Power'],
                ['id'=>4, 'name' => 'Basic'],
        );
		DB::table('role')->insert($roles);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('role');
    }
}
