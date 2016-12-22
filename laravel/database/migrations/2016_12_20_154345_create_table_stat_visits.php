<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableStatVisits extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::drop('stat_visits');
        Schema::create('stat_visits', function (Blueprint $table) {
            $table->increments('id');
            $table->date('date');
            $table->smallInteger('year');
            $table->mediumInteger('quarter');
            $table->mediumInteger('month');
            $table->mediumInteger('week');
            $table->integer('venue_id');
            $table->integer('category_id');
            $table->boolean('members');
            $table->integer('visits');
            $table->integer('visits_unique');
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
        //create old table?
    }
}
