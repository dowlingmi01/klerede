<?php namespace App;

use App\Helpers\Helper;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Member extends Model {
	protected $table = 'member';
	protected $guarded = [];
	static public function getFor($venue_id, $code) {
		$result = self::firstOrNew(['venue_id'=>$venue_id, 'code'=>$code]);
		if(!$result->exists)
			return false;
		else
			return $result;
	}
	static public function import($data) {
		$member = self::firstOrNew(['venue_id'=>$data->venue_id, 'code'=>$data->code]);
		if(! (new Carbon($data->dob))->gt(Carbon::create(1900, 01, 02)) )
			$data->dob = null;
		$data = (array) $data;
		$location = MemberLocation::getFor($data);
		$data = Helper::array_remove_keys($data, MemberLocation::$cols);
		$data['member_location_id'] = $location->id;
		$member->fill($data);
		$member->save();
	}
}
