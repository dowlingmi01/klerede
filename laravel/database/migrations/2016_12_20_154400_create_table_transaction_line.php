<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableTransactionLine extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transaction_line', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('transaction_id');
            $table->integer('sequence');
            $table->date('valid_date');
            $table->integer('product_id');
            $table->double('sale_price');
            $table->integer('quantity');
            $table->integer('member_id')->nullable();
            $table->integer('membership_id')->nullable();
            $table->timestamps();
            $table->index('transaction_id');
            $table->index('valid_date');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('transaction_line');
    }
}
