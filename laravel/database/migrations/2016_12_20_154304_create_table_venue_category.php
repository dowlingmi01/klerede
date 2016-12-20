<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableVenueCategory extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('venue_category', function (Blueprint $table) {
            $table->integer('category_id');
            $table->integer('venue_id');
            $table->enum('goals_period_type', ['monthly', 'daily', 'none']);
            $table->boolean('goals_amount');
            $table->boolean('goals_units');
            $table->primary(['category_id', 'venue_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('venue_category');
    }
}
