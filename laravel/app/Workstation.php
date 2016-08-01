<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Workstation extends Model {
	protected $table = 'workstation';
	protected $guarded = [];

	static function getFor($venue_id, $code) {
		return self::firstOrCreate(['venue_id'=>$venue_id, 'code'=>$code]);
	}
}
