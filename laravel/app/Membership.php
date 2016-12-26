<?php namespace App;

use App\Helpers\Helper;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Membership extends Model {
	protected $table = 'membership';
	protected $guarded = [];
	static public function import($data) {
		$member = Member::getFor($data->venue_id, $data->member_code);
		if(!$member)
			return false;
		$product = Product::getFor($data->venue_id, $data->system_id, $data->box_office_product_code);
		if(!$product)
			return false;
		$membership = self::firstOrNew(['venue_id'=>$data->venue_id, 'code'=>$data->code]);
		if(!isset($data->dob) || ! (new Carbon($data->dob))->gt(Carbon::create(1900, 01, 02)) )
			$data->dob = null;
		$data = (array) $data;
		$location = MemberLocation::getFor($data);
		$data = Helper::array_remove_keys($data, MemberLocation::$cols);
		$data = Helper::array_remove_keys($data, ['member_code', 'box_office_product_code', 'system_id']);
		$data['member_location_id'] = $location->id;
		$data['member_id'] = $member->id;
		$data['product_id'] = $product->id;
		$membership->fill($data);
		$membership->save();
		return true;
	}
}
