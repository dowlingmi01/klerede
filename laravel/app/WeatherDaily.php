<?php namespace App;

use App\Helpers\Helper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class WeatherDaily extends Model {
	protected $table = 'weather_daily';
	protected $guarded = [];
	protected $hidden = ['id', 'source', 'created_at', 'updated_at'];

	public function hours() {
		return $this->hasMany('App\WeatherHourly');
	}

	static function getFor($venue_id, $date, $force = false, $reprocess = false) {
		$weather_daily = WeatherDaily::firstOrNew(['venue_id'=>$venue_id, 'date'=>$date]);
		if($weather_daily->exists && !$force) {
			$key = self::getCacheKeyFor($venue_id, $date);
			if(!Cache::has($key)) {
				Cache::forever($key, $weather_daily->source);
			}
			$json = $weather_daily->source;
		}
		if($force || $reprocess || !$weather_daily->exists) {
			if(!$json) {
				$json = self::retrieveJSON($venue_id, $date, $force);
			}
			$data = json_decode($json);
			$hours = ['1'=>10, '2'=>16];
			foreach($hours as $num => $index) {
				if(!isset($data->hourly->data[$index]))
					throw new \Exception(sprintf('Incomplete weather data for %d-%s', $venue_id, $date));
				$hData = $data->hourly->data[$index];
				if(!isset($hData->temperature)||!isset($hData->summary)||!isset($hData->icon))
					throw new \Exception(sprintf('Incomplete weather data for %d-%s', $venue_id, $date));
				$weather_daily->{'temp_'.$num} = $hData->temperature;
				$weather_daily->{'summary_'.$num} = $hData->summary;
				$weather_daily->{'icon_'.$num} = $hData->icon;
			}
			$weather_daily->source = $json;
			if($weather_daily->exists) {
				$weather_daily->hours()->delete();
			}
			$weather_daily->save();
			for($hour = 0; $hour < 24; $hour++) {
				if(!isset($data->hourly->data[$index]))
					throw new \Exception(sprintf('Incomplete weather data for %d-%s', $venue_id, $date));
				$hData = $data->hourly->data[$hour];
				if(!isset($hData->temperature)||!isset($hData->summary)||!isset($hData->icon))
					throw new \Exception(sprintf('Incomplete weather data for %d-%s', $venue_id, $date));
				$hourly = new WeatherHourly();
				$hourly->hour = $hour;
				$hourly->temp = $hData->temperature;
				$hourly->summary = $hData->summary;
				$hourly->icon = $hData->icon;
				$weather_daily->hours()->save($hourly);
			}
		} else {
		}
		return $weather_daily;
	}
	static function queryD($query) {
		if($query->hourly) {
			$dbquery = WeatherDaily::with('hours');
		} else {
			$dbquery = WeatherDaily::query();
		}
		$dbquery->where('venue_id', $query->venue_id);
		if(isset($query->from)) {
			$dbquery->whereBetween('date', [$query->from, $query->to]);
		} else {
			$dbquery->where('date', $query->date);
		}
		$result = $dbquery->get();
		if($query->hourly) {
			foreach($result as &$day) {
				$day->hours->keyBy('hour');
			}
		}
		if(!isset($query->from))
			$result = $result[0];
		return $result;
	}
	public function setDateAttribute($date) {
		$this->attributes['date'] = $date;
		Helper::setPeriodFields($this);
	}
	static public function retrieveJSON($venue_id, $date, $force = false) {
		$key = self::getCacheKeyFor($venue_id, $date);
		$callback = function () use ($venue_id, $date) {
			$baseURL = 'https://api.forecast.io/forecast/';
			$apiKey = env('WEATHER_API_KEY');
			$venue = Venue::find($venue_id);
			$coordinates = sprintf("%.7f,%.7f", $venue->lat, $venue->long);
			$url = sprintf('%s%s/%s,%sT12:00:00', $baseURL, $apiKey, $coordinates, $date);
			return file_get_contents($url);
		};
		if($force) {
			$json = $callback();
			Cache::forever($key, $json);
		} else {
			$json = Cache::rememberForever($key, $callback);
		}
		return $json;
	}
	static private function getCacheKeyFor($venue_id, $date) {
		return sprintf('weather-%s-%s', $venue_id, $date);
	}
	static public function setAll($date, $force = false, $reprocess = false, Batch $batch = null) {
		$venues = Venue::all();
		foreach($venues as $venue) {
			try {
				self::getFor($venue->id, $date, $force, $reprocess);
			} catch( \Exception $e ) {
				if($batch) {
					$batch->warningExc($e);
				} else {
					throw $e;
				}
			}
		}
	}
}
WeatherDaily::saving(function($weather) {
	Helper::setPeriodFields($weather);
});
