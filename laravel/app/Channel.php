<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Channel extends Model {
	protected $table = 'channel';
	protected $guarded = [];

	static function getFor($code) {
		return self::firstOrCreate(['code'=>$code]);
	}
}
