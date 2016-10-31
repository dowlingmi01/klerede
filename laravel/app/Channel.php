<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Channel extends Model {
	protected $table = 'channel';
	protected $guarded = [];
	protected $hidden = ['pivot'];

	static function getFor($code) {
		return self::firstOrCreate(['code'=>$code]);
	}
}
