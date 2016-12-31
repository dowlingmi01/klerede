<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableSystem extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('system', function (Blueprint $table) {
            $table->integer('id');
            $table->string('code');
            $table->timestamps();
        });


        $roles = array(
                ['id'=>1, 'code' => 'xstore'],
                ['id'=>2, 'code' => 'siriusware'],
                ['id'=>3, 'code' => 'galaxy'],
        );
        DB::table('system')->insert($roles);

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('system');
    }
}
