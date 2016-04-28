<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class CafeProduct extends Model {
	protected $table = 'cafe_product';
	protected $guarded = [];
	static public function import($data) {
		$product = self::firstOrNew(['venue_id'=>$data->venue_id, 'code'=>$data->code]);
		$product->fill((array) $data);
		$product->save();
	}
}
