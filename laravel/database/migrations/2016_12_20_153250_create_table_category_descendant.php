<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableCategoryDescendant extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('category_descendant', function (Blueprint $table) {
            $table->integer('category_id');
            $table->integer('descendant_category_id');
            $table->primary(['category_id', 'descendant_category_id']);
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
         Schema::drop('category_descendant');
    }
}
