<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class StoreRegister extends Model {
	protected $table = 'store_register';
	protected $guarded = [];
	static function getFor($venue_id, $local_code, $global_code) {
		return StoreRegister::firstOrCreate( ['venue_id'=>$venue_id,
			'local_code'=>$local_code, 'global_code'=>$global_code]);
	}
}
