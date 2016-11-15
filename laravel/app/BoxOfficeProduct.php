<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class BoxOfficeProduct extends Model {
	protected $table = 'box_office_product';
	protected $guarded = [];
	static public function getFor($venue_id, $code) {
		$result = self::firstOrNew(['venue_id'=>$venue_id, 'code'=>$code]);
		if(!$result->exists)
			return false;
		else
			return $result;
	}
	static public function import($data) {
		$productKind = BoxOfficeProductKindMap::getKindFor($data->venue_id, $data->account_code);
		if($productKind && $productKind->code == 'membership') {
			if( preg_match('/MBRCM/i', $data->description) ) {
				$membership_kind_code = 'corporate';
			} elseif( preg_match('/family/i', $data->description) ) {
				$membership_kind_code = 'family';
			} else {
				$membership_kind_code = 'individual';
			}
			$data->membership_kind_id = MembershipKind::getFor($membership_kind_code)->id;
		}
		$product = self::firstOrNew(['venue_id'=>$data->venue_id, 'code'=>$data->code]);
		$product->fill((array) $data);
		$product->save();
	}
}
