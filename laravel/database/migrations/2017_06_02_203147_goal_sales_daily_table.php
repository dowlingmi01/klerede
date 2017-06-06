<?php

use App\GoalSalesDaily;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class GoalSalesDailyTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		Schema::create('goal_sales_daily', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('venue_id');
			$table->date('date');
			$table->smallInteger('year');
			$table->mediumInteger('quarter');
			$table->mediumInteger('month');
			$table->mediumInteger('week');
			$table->smallInteger('category_id');
			$table->enum('type', ['amount', 'units']);
			$table->double('goal');
			$table->boolean('computed');
			$table->timestamps();
			$table->unique(['venue_id', 'date', 'category_id', 'type'], 'goal_settings_daily_unique');
		});
		$sps = ['sp_compute_goals'];
		foreach($sps as $sp) {
			$sql = file_get_contents(database_path(sprintf('migrations/sp/%s.sql', $sp)));
			\DB::unprepared($sql);
		}
		GoalSalesDaily::import(1518, 'units', database_path('migrations/data/goals_daily_units_1518.csv'));
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
		Schema::dropIfExists('goal_sales_daily');
    }
}
