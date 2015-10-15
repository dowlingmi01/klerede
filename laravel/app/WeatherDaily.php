<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class WeatherDaily extends Model {
	protected $table = 'weather_daily';
	protected $guarded = [];
	protected $hidden = ['id', 'source'];

	static function getForJSON($venue_id, $date, $json) {
		$weather_daily = WeatherDaily::firstOrNew(['venue_id'=>$venue_id, 'date'=>$date]);
		$data = json_decode($json);
		$hours = ['1'=>10, '2'=>16];
		foreach($hours as $num => $index) {
			$hData = $data->hourly->data[$index];
			$weather_daily->{'temp_'.$num} = $hData->temperature;
			$weather_daily->{'summary_'.$num} = $hData->summary;
			$weather_daily->{'icon_'.$num} = $hData->icon;
		}
		$weather_daily->source = $json;
		$weather_daily->save();
		return $weather_daily;
	}
	static function queryD($query) {
		$dbquery = WeatherDaily::where('venue_id', $query->venue_id);
		if(isset($query->from)) {
			$dbquery->whereBetween('date', [$query->from, $query->to]);
			return $dbquery->get();
		} else {
			$dbquery->where('date', $query->date);
			return $dbquery->get()[0];
		}
	}
}
