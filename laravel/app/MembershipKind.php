<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class MembershipKind extends Model {
	protected $table = 'membership_kind';
	protected $guarded = [];

	static function getFor($code) {
		return self::firstOrCreate(['code'=>$code]);
	}
}
