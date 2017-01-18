<?php namespace App;

use App\Helpers\Helper;
use Illuminate\Database\Eloquent\Model;

class GoalSalesMonthly extends Model {
	protected $table = 'goal_sales_monthly';
	protected $guarded = [];
	protected $attributes = ['goal'=>0];
	public function setMonthAttribute($month) {
		$fiscal_year_start_month = Venue::find($this->venue_id)->fiscal_year_start_month;
		$this->year = Helper::getFiscalYearForMonth($month, $fiscal_year_start_month);
		$this->attributes['month'] = $month;
	}
}
