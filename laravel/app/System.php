<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class System extends Model {
	protected $table = 'system';
	protected $guarded = [];
	 
	static function getFor($code) {
		return self::where('code', '=', $code)->first();
	}
}
