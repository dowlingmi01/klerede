<?php namespace App;

use App\Helpers\Helper;
use Illuminate\Database\Eloquent\Model;

class MemberLocation extends Model {
	protected $table = 'member_location';
	protected $guarded = [];
	static $cols = ['city', 'state', 'zip', 'country'];
	static function getFor($data) {
		if(isset($data['city'])) {
			return self::firstOrCreate(Helper::array_subkeys($data, self::$cols));
		} else {
			return new self();
		}
	}
}
