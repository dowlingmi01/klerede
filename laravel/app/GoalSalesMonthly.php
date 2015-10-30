<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class GoalSalesMonthly extends Model {
	protected $table = 'goal_sales_monthly';
	protected $guarded = [];
	protected $attributes = ['sub_channel_id'=>0, 'goal'=>0];
	public function setMonth($month) {
		$this->year = (int) $month / 100;
	}
}
