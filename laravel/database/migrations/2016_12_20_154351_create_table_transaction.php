<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableTransaction extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transaction', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('venue_id');
            $table->integer('store_id');
            $table->integer('system_id');
            $table->integer('source_id');
            $table->integer('register_id');
            $table->integer('sequence');
            $table->date('business_day');
            $table->dateTime('time');
            $table->integer('operator_id');
            $table->integer('batch_id');
            $table->integer('member_xstore_id')->nullable();;
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('transaction');
    }
}