<?php namespace App;

use Illuminate\Database\Eloquent\Model;
use DB;

class Stats {
	static protected function validatePeriod(&$period, $type) {
		if($type != 'date') {
			if(preg_match('/(\d{4})-(\d{1,2})/', $period, $match))
				$period = (int)$match[1]*100 + (int)$match[2];
		}
	}
	static protected function formatPeriod(&$period, $type) {
		if($type != 'date')
			$period = sprintf('%04d-%02d', $period / 100, $period % 100);
	}
	static function querySingle($query) {
		$specs = (object) $query->specs;
		if($specs->type == 'visits')
			$table = 'stat_visits';
		else if($specs->type == 'sales')
			$table = 'stat_sales';
		$dbquery = DB::table($table);
		$includePeriod = true;
		if(is_string($query->periods))
			$periods = (object) ['period'=>$query->periods];
		else
			$periods = (object) $query->periods;
		if(!isset($periods->type))
			$periods->type = 'date';
		if(isset($periods->period)) {
			self::validatePeriod($periods->period, $periods->type);
			$dbquery->where($periods->type, $periods->period);
		} else {
			self::validatePeriod($periods->from, $periods->type);
			self::validatePeriod($periods->to, $periods->type);
			$dbquery->whereBetween($periods->type, [$periods->from, $periods->to]);
			if(!isset($periods->kind) || $periods->kind == 'detail')
				$dbquery->groupBy($periods->type);
			else
				$includePeriod = false;
		}
		if($includePeriod)
			$dbquery->addSelect("$periods->type as period");

		$dbquery->addSelect(DB::raw('sum(units) as units'));
		if($specs->type == 'sales')
			$dbquery->addSelect(DB::raw('sum(amount) as amount'));

		$result = $dbquery->get();
		if($includePeriod)
			foreach($result as &$res)
				self::formatPeriod($res->period, $periods->type);
		if(count($result) == 1)
			$result = $result[0];
		return $result;
	}
	static function queryMulti($queries) {
		$result = [];
		foreach($queries as $name=>$query)
			$result[$name] = self::querySingle((object) $query);
		return $result;
	}
}