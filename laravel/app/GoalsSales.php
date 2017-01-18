<?php

namespace App;

use App\Helpers\Helper;

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
	static function get($venue_id, $year) {
		$venue = Venue::find($venue_id);
		$fiscal_year_start_month = $venue->fiscal_year_start_month;
		$hierarchy = Category::hierarchyByVenue($venue_id);
		$ret = self::getChildren($hierarchy, $venue_id, $year, $fiscal_year_start_month);
		return $ret;
	}
	static function getChildren($hierarchy, $venue_id, $year, $fiscal_year_start_month) {
		$types = ['units', 'amount'];
		$ret = [];
		$fields = ['name', 'order', 'goals_amount', 'goals_units', 'sub_categories'];
		foreach($hierarchy as $name => $category) {
			$add = false;
			if($category['goals_period_type'] == 'monthly') {
				foreach($types as $type) {
					if($category["goals_$type"]) {
						$q = ['venue_id'=>$venue_id, 'category_id'=>$category['id'], 'type'=>$type];
						$category["goals_$type"] = self::getMonths($q, $year, $fiscal_year_start_month);
					}
				}
				$add = true;
			}
			if(array_key_exists('sub_categories', $category)) {
				$children = self::getChildren($category['sub_categories'], $venue_id, $year, $fiscal_year_start_month);
				if(count($children) > 0) {
					if($category['level'] == 0) {
						$sum = [];
						$order = 0;
						foreach($children as &$child) {
							$child['order'] = $order;
							$order++;
							foreach($types as $type) {
								if($child["goals_$type"]) {
									if(array_key_exists($type, $sum)) {
										foreach ($sum[$type] as $key => &$value) {
											$value += $child["goals_$type"][$key];
										}
									} else {
										$sum[$type] = $child["goals_$type"];
									}
								}
							}
						}
						$category['sub_categories'] = $children;
						foreach($types as $type) {
							if (array_key_exists($type, $sum)) {
								$category["goals_$type"] = $sum[$type];
							}
						}
						$add = true;
					} else {
						$ret = array_merge($ret, $children);
					}
				}
			}
			if($add) {
				$category = Helper::array_subkeys($category, $fields);
				$ret[$name] = $category;
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
	static function import($venue_id, $file_name) {
		$data = Helper::readCSV($file_name);
		foreach($data as $line) {
			$q = ['venue_id'=>$venue_id, 'category_id'=>Category::getFor($line['category_code'])->id,
				'type'=>$line['type'], 'month'=>$line['month']];
			$goal = GoalSalesMonthly::firstOrNew($q);
			$goal->month = $line['month'];
			$goal->goal = $line['goal'];
			$goal->save();
		}
	}
}
