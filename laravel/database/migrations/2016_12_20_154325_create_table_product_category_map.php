<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableProductCategoryMap extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_category_map', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('venue_id');
            $table->integer('system_id');
            $table->integer('category_id');
            $table->string('code_from');
            $table->string('code_to');
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
        Schema::drop('product_category_map');
    }
}
