<?php namespace App;

use Illuminate\Database\Eloquent\Model;
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
	static protected function formatPeriod(&$period, $type) {
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

		$dbquery = DB::table($table);
		$dbquery->where('venue_id', $venue_id);
		 
		if(isset($periods->period)) {
			self::validatePeriod($periods->period, $periods->type);
			$dbquery->where($periods->type, $periods->period);
			if(isset($periods->subperiod)) {
				$dbquery->groupBy($periods->subperiod);
				$includePeriod = $periods->subperiod;
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
		if(isset($specs->kinds)) {
			$dbquery->join('box_office_product_kind', 'box_office_product_kind_id', '=', 'box_office_product_kind.id')
				->whereIn('box_office_product_kind.code', $specs->kinds);
		}
		if(isset($specs->channel)) {
			$dbquery->join('channel', 'channel_id', '=', 'channel.id')
				->where('channel.code', $specs->channel);
		}
		if(isset($specs->members)) {
			$specs->members = filter_var($specs->members, FILTER_VALIDATE_BOOLEAN);
			$dbquery->where('members', $specs->members ? 1 : 0);
		}
		if(isset($specs->membership_type)) {
			$dbquery->join('membership_kind', 'membership_kind_id', '=', 'membership_kind.id')
				->where('membership_kind.code', $specs->membership_type);
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
			$dbquery->addSelect(DB::raw('sum(units) as units'));
			if($specs->type == 'sales') {
				$dbquery->whereNotIn('box_office_product_kind_id', [4, 5]);
				$dbquery->addSelect(DB::raw('sum(amount) as amount'));
			}

			if($periods->kind == 'average') {
				$subquery = $dbquery;
				$dbquery = DB::table(DB::raw("({$subquery->toSql()}) as sub"))
					->mergeBindings($subquery);
				$dbquery->addSelect(DB::raw('avg(units) as units'));
				if($specs->type == 'sales')
					$dbquery->addSelect(DB::raw('avg(amount) as amount'));
				$includePeriod = false;
			}
		}

		$result = $dbquery->get();
		if($includePeriod)
			foreach($result as &$res)
				self::formatPeriod($res->period, $includePeriod);
		if(count($result) == 1)
			$result = $result[0];
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
		$last_date = DB::table('stat_sales')->where('venue_id', $venue_id)->groupBy('date')
			->select(['date', DB::raw('count(distinct channel_id) as num_channels')])
			->orderBy('num_channels', 'desc')->orderBy('date', 'desc')->first()->date;
		return $last_date;
	}
}
