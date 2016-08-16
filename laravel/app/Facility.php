<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Facility extends Model {
	protected $table = 'facility';
	protected $guarded = [];

	static function getFor($venue_id, $code) {
		$facility = self::firstOrNew(['venue_id'=>$venue_id, 'code'=>$code]);
		if(!$facility->exists) {
			$facility->is_ga = false;
			$facility->save();
		}
		return $facility;
	}
}
