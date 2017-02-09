<?php

namespace App;

use App\Helpers\Helper;
use Illuminate\Database\Eloquent\Model;

class DashboardBoxVenue extends Model
{
	protected $table = 'dashboard_box_venue';
	static function getFor($venue_id) {
		$boxes = json_decode(file_get_contents(resource_path('data/boxes.json')));
		$venue_boxes = self::where('venue_id', $venue_id)->get();
		$result = [];
		foreach ($venue_boxes as $venue_box) {
			$result[$venue_box->row][$venue_box->column] = $boxes->{$venue_box->box_code};
		}
		return $result;
	}
	static function import($venue_id, $filename) {
		$venue_data = Helper::readCSV($filename);
		self::where('venue_id', $venue_id)->delete();
		self::insert($venue_data);
	}
}
