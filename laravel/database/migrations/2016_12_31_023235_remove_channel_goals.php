<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveChannelGoals extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        
        Schema::rename('goal_sales_monthly', 'old_goal_sales_monthly');
        
        Schema::create('goal_sales_monthly', function(Blueprint $table)
        {
            $table->increments('id');
            $table->integer('venue_id');
            $table->smallInteger('year');
            $table->mediumInteger('month');
            $table->smallInteger('category_id');
            $table->enum('type', ['amount', 'units']);
            $table->double('goal');
            $table->timestamps();
            $table->unique(['venue_id', 'month', 'category_id', 'type'], 'goal_settings_monthly_unique');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('goal_sales_monthly');
        Schema::rename('old_goal_sales_monthly', 'goal_sales_monthly');
    }
}
