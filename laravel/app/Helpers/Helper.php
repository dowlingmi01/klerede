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
		$m->week = $m->year * 100 + (int) $date->format("W");
	}
}
