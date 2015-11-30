<?php namespace App;

use App\Helpers\Helper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class WeatherDaily extends Model {
	protected $table = 'weather_daily';
	protected $guarded = [];
	protected $hidden = ['id', 'source'];

	static function getFor($venue_id, $date) {
		$weather_daily = WeatherDaily::firstOrNew(['venue_id'=>$venue_id, 'date'=>$date]);
		if(!$weather_daily->exists) {
			$json = self::retrieveJSON($venue_id, $date);
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
		} else {
			$key = self::getCacheKeyFor($venue_id, $date);
			if(!Cache::has($key)) {
				Cache::forever($key, $weather_daily->source);
			}
		}
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
	public function setDateAttribute($date) {
		$this->attributes['date'] = $date;
		Helper::setPeriodFields($this);
	}
	static public function retrieveJSON($venue_id, $date) {
		$key = self::getCacheKeyFor($venue_id, $date);
		$json = Cache::rememberForever($key, function () use ($venue_id, $date) {
			$baseURL = 'https://api.forecast.io/forecast/';
			$apiKey = env('WEATHER_API_KEY');
			$venue = Venue::find($venue_id);
			$coordinates = sprintf("%.7f,%.7f", $venue->lat, $venue->long);
			$url = sprintf('%s%s/%s,%sT12:00:00', $baseURL, $apiKey, $coordinates, $date);
			return file_get_contents($url);
		});
		return $json;
	}
	static private function getCacheKeyFor($venue_id, $date) {
		return sprintf('weather-%s-%s', $venue_id, $date);
	}
	static public function setAll($date) {
		$venues = Venue::all();
		foreach($venues as $venue) {
			self::getFor($venue->id, $date);
		}
	}
}
WeatherDaily::saving(function($weather) {
	Helper::setPeriodFields($weather);
});
