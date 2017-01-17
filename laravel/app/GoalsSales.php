<?php

namespace App;
use App\Venue;

class GoalsSales {
	private static function getMonths($q, $year, $fiscal_year_start_month) {
		$months = [];
		if($fiscal_year_start_month > 1)
			$year--;
 		$calculated_year  = $year;
		for( $month = 1; $month <= 12; $month++ ) {
			$calculated_month = (($month  + $fiscal_year_start_month - 2) % 12) + 1;
			if($calculated_month < $fiscal_year_start_month)
					$calculated_year  = $year+1;
			$q['month'] = $calculated_year * 100 + $calculated_month;
			 
			$goal = GoalSalesMonthly::firstOrNew($q);
			$months[$month] = $goal->goal  ;
		} 
		return $months;
	}
	static function get($venue_id, $year, $category = null, $type = null) {
		$venue = Venue::find($venue_id);
		$fiscal_year_start_month = $venue->fiscal_year_start_month;
		$hierarchy = Category::hierarchyByVenue($venue_id);
		self::getChildren($hierarchy, $venue_id, $year, $fiscal_year_start_month);
		return $hierarchy;
	}
	static function getChildren(&$hierarchy, $venue_id, $year, $fiscal_year_start_month) {
		$types = ['units', 'amount'];
		$ret = [];
		foreach($hierarchy as $name => &$category) {
			$has = [];
			if($category['goals_period_type'] == 'monthly') {
				foreach($types as $type) {
					if($category["goals_$type"]) {
						$q = ['venue_id'=>$venue_id, 'category_id'=>$category['id'], 'type'=>$type];
						$has[$type] = self::getMonths($q, $year, $fiscal_year_start_month);
						$category["goals_$type"] = $has[$type];
					}
				}
			}
			if(array_key_exists('sub_categories', $category)) {
				$hasCh = self::getChildren($category['sub_categories'], $venue_id, $year, $fiscal_year_start_month);
				if(count($hasCh) > 0) {
					$has = $hasCh;
					foreach ($types as $type) {
						if (array_key_exists($type, $has)) {
							$category["goals_sum_$type"] = $has[$type];
						}
					}
				}
			}
			if(count($has) > 0) {
				foreach($types as $type) {
					if(array_key_exists($type, $has)) {
						if(array_key_exists($type, $ret)) {
							foreach ($ret[$type] as $key => &$value) {
								$value += $has[$type][$key];
							}
						} else {
							$ret[$type] = $has[$type];
						}
					}
				}
			} else {
				unset($hierarchy[$name]);
			}
		}
		return $ret;
	}
	static function set($venue_id, $year, $category, $type, $months) {
		$venue = Venue::find($venue_id);
		$fiscal_year_start_month = $venue->fiscal_year_start_month;

		$category_id = Category::getFor($category)->id;
		 
		$q = ['venue_id'=>$venue_id, 'category_id'=>$category_id, 'type'=>$type, 'year'=>$year];
		if($fiscal_year_start_month > 1)
			$year--;
		$calculated_year  = $year;
		for( $month = 1; $month <= 12; $month++ ) {
			$calculated_month = (($month  + $fiscal_year_start_month - 2) % 12) + 1;
			if($calculated_month < $fiscal_year_start_month)
				$calculated_year  = $year+1;
			$q['month'] = $calculated_year * 100 + $calculated_month;
			$goal = GoalSalesMonthly::firstOrNew($q);
			$goal->goal = $months[$month];
			$goal->save();
		}
		return true;
	}
}
