<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Operator extends Model {
	protected $table = 'operator';
	protected $guarded = [];

	static function getFor($venue_id, $code) {
		$operator = self::firstOrNew(['venue_id'=>$venue_id, 'code'=>$code]);
		if(!$operator->exists) {
			$operator->is_online = false;
			$operator->save();
		}
		return $operator;
	}
}
