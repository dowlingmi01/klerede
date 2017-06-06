<?php

namespace App;

use App\Helpers\Helper;
use Illuminate\Database\Eloquent\Model;
use DB;

class GoalSalesDaily extends Model
{
	protected $table = 'goal_sales_daily';
	protected $guarded = [];
	static public function import($venue_id, $type, $file_name) {
		$data = Helper::readCSV($file_name);
		foreach($data as $line) {
			foreach ($line as $category_code => $goalv) {
				if( $category_code != 'date' ) {
					$q = ['venue_id'=>$venue_id, 'category_id'=>Category::getFor($category_code)->id,
						'type'=>$type, 'date'=>$line['date']];
					$goal = self::firstOrNew($q);
					$goal->date = $line['date'];
					$goal->goal = $goalv;
					$goal->computed = false;
					$goal->save();
				}
			}
		}
		DB::statement('call sp_compute_goals(?)', [$venue_id]);
	}
	public function setDateAttribute($date) {
		$this->attributes['date'] = $date;
		Helper::setPeriodFields($this);
	}
}
