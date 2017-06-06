<?php namespace App;

use DB;

class Stats {
	static protected function validatePeriod(&$period, $type) {
		if($type != 'date') {
			if(preg_match('/(\d{4})-(\d{1,2})/', $period, $match))
				$period = (int)$match[1]*100 + (int)$match[2];
		} else if(preg_match('/(\d{4})-(\d{1,2})-(\d{1,2})/', $period, $match)) {
			$period = sprintf('%04d-%02d-%02d', (int)$match[1], (int)$match[2], (int)$match[3]);
		}
	}
	static public function formatPeriod(&$period, $type) {
		if($type != 'date' && $type != 'year')
			$period = sprintf('%04d-%02d', $period / 100, $period % 100);
	}
	static function querySingle($venue_id, $query) {
		
		if(is_string($query->periods))
			$periods = (object) ['period'=>$query->periods];
		else
			$periods = (object) $query->periods;
		if(!isset($periods->type))
			$periods->type = 'date';
		if(!isset($periods->kind))
			$periods->kind = 'detail';
		if(isset($periods->hourly))
			$periods->hourly = filter_var($periods->hourly, FILTER_VALIDATE_BOOLEAN);
		else
			$periods->hourly = false;

		$includePeriod = $periods->type;

		$specs = (object) $query->specs;

		if($specs->type == 'visits')
			$table = $periods->hourly ? 'stat_hourly_visits' : 'stat_visits';
		else if($specs->type == 'sales')
			$table = 'stat_sales';
		else if($specs->type == 'members')
			$table = 'stat_members';
		else if($specs->type == 'goals')
			$table = 'goal_sales_daily';

		$dbquery = DB::table($table);
		$dbquery->where('venue_id', $venue_id);
		if(isset($periods->limit_date)) {
			$dbquery->where('date', '<=', $periods->limit_date);
		}
		if(isset($periods->period)) {
			self::validatePeriod($periods->period, $periods->type);
			$dbquery->where($periods->type, $periods->period);
			if(isset($periods->subperiod)) {
				$dbquery->groupBy($periods->subperiod);
				$includePeriod = $periods->subperiod;
			} else {
				$includePeriod = false;
			}
		} else {
			self::validatePeriod($periods->from, $periods->type);
			self::validatePeriod($periods->to, $periods->type);
			$dbquery->whereBetween($periods->type, [$periods->from, $periods->to]);
			if($periods->kind == 'detail' || ($specs->type != 'members' && $periods->kind == 'average'))
				$dbquery->groupBy($periods->type);
			else
				$includePeriod = false;
		}

		if(isset($specs->expanded))
			$specs->expanded = filter_var($specs->expanded, FILTER_VALIDATE_BOOLEAN);
		else
			$specs->expanded = false;

		if($specs->type != 'members') {
			if(isset($specs->category)) {
				$category = Category::getFor($specs->category);
				$category_id = $category->id;
				$parent_category_id = $category->parent_category_id;
			} else {
				$category_id = 0;
				$parent_category_id = 0;
			}

			if($specs->expanded) {
				$dbquery->join('category_descendant as cd', "$table.category_id", '=', 'cd.descendant_category_id')
					->join('category', "$table.category_id", '=', 'category.id');
				$dbquery->groupBy("$table.category_id");
				$dbquery->addSelect(['category.code', "$table.category_id", 'parent_category_id']);
				$dbquery->where('cd.category_id', $category_id);
			} else if($category_id) {
				$dbquery->where('category_id', $category_id);
			} else {
				$dbquery->join('category', "$table.category_id", '=', 'category.id')
					->where('parent_category_id', $category_id);
			}
		}
	 	if(isset($specs->members)) {
			$specs->members = filter_var($specs->members, FILTER_VALIDATE_BOOLEAN);
			$dbquery->where('members', $specs->members ? 1 : 0);
		}
	 
		if(isset($specs->online)) {
			$specs->online = filter_var($specs->online, FILTER_VALIDATE_BOOLEAN);
			$dbquery->where('online', $specs->online ? 1 : 0);
		}

		if($includePeriod)
			$dbquery->addSelect("$includePeriod as period");

		if($periods->hourly) {
			$dbquery->addSelect('hour');
			$dbquery->groupBy('hour');
		}

		if($specs->type == 'members') {
			if($periods->kind == 'average') {
				$dbquery->addSelect([DB::raw('avg(current_members) as current_members')
					, DB::raw('avg(current_memberships) as current_memberships')
					, DB::raw('avg(frequency) as frequency')
					, DB::raw('avg(recency) as recency')]);
			} else {
				$dbquery->addSelect(['current_members', 'current_memberships', 'frequency', 'recency']);
			}
		} else {
			if($specs->type == 'visits') {
				$dbquery->addSelect(DB::raw('sum(visits) as visits, sum(visits_unique) as visits_unique'));
			} else if($specs->type == 'goals') {
				if( isset($specs->goal_type) && $specs->goal_type == 'amount') {
					$dbquery->addSelect(DB::raw('sum(goal) as amount'));
					$dbquery->where('type', 'amount');
				} else {
					$dbquery->addSelect(DB::raw('sum(goal) as visits, sum(goal) as visits_unique'));
					$dbquery->where('type', 'units');
				}
			} else {
				if($specs->type == 'sales') {
					$dbquery->addSelect(DB::raw('sum(amount) as amount, sum(units) as units, sum(transactions) as transactions'));
				}
			}

			if($periods->kind == 'average') {
				$subquery = $dbquery;
				$dbquery = DB::table(DB::raw("({$subquery->toSql()}) as sub"))
					->mergeBindings($subquery);
				if($specs->expanded) {
					$dbquery->groupBy('category_id');
					$dbquery->addSelect(['code', 'category_id', 'parent_category_id']);
				}
				if($specs->type == 'visits' || $specs->type == 'goals' ) {
					$dbquery->addSelect(DB::raw('avg(visits) as visits, avg(visits_unique) as visits_unique'));
				} else if($specs->type == 'sales')
					$dbquery->addSelect(DB::raw('avg(amount) as amount, avg(units) as units, avg(transactions) as transactions'));
				$includePeriod = false;
			}
		}

		$result = $dbquery->get();

		$periods = [];
		if($includePeriod) {
			foreach($result as &$res)
				self::formatPeriod($res->period, $includePeriod);
			unset($res);
			foreach($result as $res) {
				$period = $res->period;
				unset($res->period);
				if($specs->expanded) {
					$periods[$period][] = $res;
				} else {
					$periods[$period] = $res;
				}
			}
		} else if($specs->expanded) {
			$periods[0] = $result;
		} else {
			$periods = $result;
		}
		if($specs->expanded) {
			foreach($periods as &$periodr) {
				$parents = [];
				foreach($periodr as $res) {
					$parents[$res->parent_category_id][] = $res;
				}
				$periodr = self::getChildren($parents, $parent_category_id);
				if($category_id)
					$periodr = array_values($periodr)[0];
			}
			unset($periodr);
		}
		$result = $periods;
		if(!$includePeriod && count($result) == 1)
			$result = array_values($result)[0];
		return $result;
	}

	static private function getChildren($parents, $category_id){
		$result = [];
		if(array_key_exists($category_id, $parents))
			foreach($parents[$category_id] as $res) {
				$sub_categories = self::getChildren($parents, $res->category_id);
				if(count($sub_categories))
					$res->sub_categories = $sub_categories;
				$code = $res->code;
				unset($res->category_id);
				unset($res->parent_category_id);
				unset($res->code);
				$result[$code] = $res;
			}
		return $result;
	}

	static function queryMulti($venue_id, $queries) {
		
		$result = [];
		foreach($queries as $name=>$query)
			$result[$name] = self::querySingle($venue_id, (object) $query);
		return $result;
	}
	 
	static function computeMembers($venue_id, $dateFrom, $dateTo) {
		DB::statement('call sp_compute_stats_members(?, ?, ?)', [$venue_id, $dateFrom, $dateTo]);
	}
	static function computeSales($venue_id, $date) {
		DB::statement('call sp_compute_stats(?, ?)', [$venue_id, $date]);
 	}

	static function computeVisits($venue_id, $date) {
		DB::statement('call sp_compute_stats_visits(?, ?)', [$venue_id, $date]);
		StatStatus::computed($date, $venue_id);
	}

 	static function lastDate($venue_id) {
		$last_date = DB::table('stat_sales')
			->join('category', 'category_id', '=', 'category.id')
			->where('category.level', 0)
			->where('venue_id', $venue_id)->groupBy('date')
			->select(['date', DB::raw('count(distinct category_id) as num_categories')])
			->orderBy('num_categories', 'desc')->orderBy('date', 'desc')->first()->date;
		return $last_date;
	}
}
