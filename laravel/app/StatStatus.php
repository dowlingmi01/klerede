<?php namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class StatStatus extends Model {
	protected $table = 'stat_status';
	protected $guarded = [];
	static function newData($channel_id, $date) {
		static::set($channel_id, $date, 'new_data');
	}
	static function computed($channel_id, $date) {
		static::set($channel_id, $date, 'computed');
	}
	static function set($channel_id, $date, $status) {
		$statSatus = static::firstOrNew(['channel_id'=>$channel_id, 'date'=>$date]);
		if(!$statSatus->exists || $statSatus->status != $status) {
			$statSatus->status = $status;
			$statSatus->{'time_'.$status} = new Carbon();
			$statSatus->save();
		}
	}
}
