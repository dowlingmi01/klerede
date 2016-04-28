<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class BoxOfficeProduct extends Model {
	protected $table = 'box_office_product';
	protected $guarded = [];
	static public function import($data) {
		if($data->kind == 'pass') {
			$membership_kind_code = preg_match('/family/i', $data->description) ? 'family' : 'individual';
			$data->membership_kind_id = MembershipKind::getFor($membership_kind_code)->id;
		}
		$product = self::firstOrNew(['venue_id'=>$data->venue_id, 'code'=>$data->code]);
		$product->fill((array) $data);
		$product->save();
	}
}
