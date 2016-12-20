<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableCategory extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
         Schema::create('category', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('parent_category_id')->default(0);
            $table->string('code');
            $table->string('name');
            $table->integer('level')->default(0);
            $table->enum('visits_type', ['none', 'unique', 'total']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('category');
    }
}
