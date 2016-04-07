<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class WeatherHourly extends Model {
	protected $table = 'weather_hourly';
	protected $guarded = [];
	protected $hidden = ['id', 'weather_daily_id', 'created_at', 'updated_at', 'hour'];
}
