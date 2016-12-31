<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableProduct extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('venue_id')->default(0);
            $table->integer('system_id');
            $table->string('code');
            $table->string('description');
            $table->string('scanned_code');
            $table->string('mapping_code');
            $table->integer('category_id');
            $table->boolean('is_unique_visitor');
            $table->boolean('is_visitor');
            $table->boolean('is_unit');
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
        Schema::dropIfExists('product');
    }
}
