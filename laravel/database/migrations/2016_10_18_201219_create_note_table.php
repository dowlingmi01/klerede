<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNoteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('note', function (Blueprint $table) {
            $table->increments('id');
            $table->string('header');
            $table->text('description');
            $table->boolean('all_day');

            $table->dateTime('time_start');
            $table->dateTime('time_end');
            $table->integer('owner_id');
            $table->integer('last_editor_id');
            $table->integer('venue_id');
            $table->timestamps();
            $table->index(['venue_id', 'time_start']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('note');
    }
}
