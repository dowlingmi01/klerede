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
        DB::table('goal_sales_monthly')->truncate();
        
        Schema::table('goal_sales_monthly', function(Blueprint $table)
        {
            $table->dropUnique('goal_settings_monthly_unique');
            $table->dropColumn('channel_id');
            $table->dropColumn('sub_channel_id');
            $table->integer('category_id')->after('month');
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
        DB::table('goal_sales_monthly')->truncate();
        Schema::table('goal_sales_monthly', function(Blueprint $table)
        {
           $table->dropUnique('goal_settings_monthly_unique');
           $table->dropColumn('category_id');
           $table->integer('channel_id')->after('month');
           $table->integer('sub_channel_id')->after('sub_channel_id');
           $table->unique(['venue_id', 'month', 'channel_id', 'sub_channel_id', 'type'], 'goal_settings_monthly_unique');
        });
    }
}
