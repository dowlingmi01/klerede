<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Product extends Model {
	protected $table = 'product';
	protected $guarded = [];
	static public function getFor($venue_id, $system_id, $code) {
		return self::where(['venue_id'=>$venue_id, 'system_id'=>$system_id, 'code'=>$code])->first();
	}
	static public function import($data) {
		$productMap = ProductCategoryMap::getFor($data->venue_id, $data->system_id, $data->mapping_code);
		$fields = ['category_id', 'is_unique_visitor', 'is_visitor', 'is_unit'];
		if( $productMap ) {
			foreach ($fields as $field) {
				$data->$field = $productMap->$field;
			}
		} else {
			foreach ($fields as $field) {
				$data->$field = 0;
			}
		}
		$product = self::firstOrNew(['venue_id'=>$data->venue_id, 'system_id'=>$data->venue_id, 'code'=>$data->code]);
		$product->fill((array) $data);
		$product->save();
	}
}
