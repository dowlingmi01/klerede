<?php namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class StatStatus extends Model {
	protected $table = 'stat_status';
	protected $guarded = [];
	static function newData($date, $venue_id = 0) {
		static::set($venue_id, $date, 'new_data');
	}
	static function computed($date, $venue_id = 0) {
		static::set($venue_id, $date, 'computed');
	}
	static function set($venue_id, $date, $status) {
		$statSatus = static::firstOrNew(['venue_id'=>$venue_id, 'date'=>$date]);
		if(!$statSatus->exists || $statSatus->status != $status) {
			$statSatus->status = $status;
			$statSatus->{'time_'.$status} = new Carbon();
			$statSatus->save();
		}
	}
}
