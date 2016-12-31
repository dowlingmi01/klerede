<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableStatSales extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::rename('stat_sales', 'old_stat_sales');

        Schema::create('stat_sales', function (Blueprint $table) {
            $table->increments('id');
            $table->date('date');
            $table->smallInteger('year');
            $table->mediumInteger('quarter');
            $table->mediumInteger('month');
            $table->mediumInteger('week');
            $table->integer('venue_id');
            $table->integer('category_id');
            $table->boolean('members');
            $table->boolean('online');
            $table->double('amount');
            $table->integer('units');
            $table->integer('transactions');
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
		if( Schema::hasTable('old_stat_sales')) {
			Schema::dropIfExists('stat_sales');
			Schema::rename('old_stat_sales', 'stat_sales');
		}
    }
}
