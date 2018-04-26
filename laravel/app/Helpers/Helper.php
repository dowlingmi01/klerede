<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Model;

class Helper {
	public static function readCSV($filename) {
		$rows = array_map('str_getcsv', file($filename));
		$header = array_shift($rows);
		$csv = array();
		foreach ($rows as $row) {
			$csv[] = array_combine($header, $row);
		}
		return $csv;
	}
	public static function setPeriodFields(Model $m) {
		$date = new \DateTime($m->date);
		$m->year = (int) $date->format("Y");
		$m->month = $m->year * 100 + (int) $date->format("m");
		$m->quarter = $m->year * 100 + ceil(((int) $date->format("m")) / 3);
		$m->week = (int) $date->format("oW");
	}
	public static function array_subkeys($array, $keys) {
		return array_intersect_key($array, array_flip($keys));
	}
	public static function array_remove_keys($array, $keys) {
		return array_diff_key($array, array_flip($keys));
	}
	public static function getFiscalYearForMonth($month, $fiscal_year_start_month) {
		$year = (int) $month / 100;
		if($fiscal_year_start_month > 1 && $fiscal_year_start_month <= $month % 100)
			$year++;
		return $year;
	}
	public static function getMonthsForFiscalYear($year, $fiscal_year_start_month) {
		$months = [];
		if($fiscal_year_start_month > 1)
			$year--;
		$calculated_year  = $year;
		for( $month = 1; $month <= 12; $month++ ) {
			$calculated_month = (($month  + $fiscal_year_start_month - 2) % 12) + 1;
			if($calculated_month < $fiscal_year_start_month)
				$calculated_year  = $year+1;
			$months[$month] = $calculated_year * 100 + $calculated_month;
		}
		return $months;
	}
	public static function shallowClone($object){
		$result = new \stdClass();
		foreach ($object as $key => $value) {
			$result->{$key} = $value;
		}
		return $result;
	}
}
