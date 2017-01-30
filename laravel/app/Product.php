<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Product extends Model {
	protected $table = 'product';
	protected $guarded = [];
	static public function getFor($venue_id, $system_id, $code) {
		return self::where(['venue_id'=>$venue_id, 'system_id'=>$system_id, 'code'=>$code])->first();
	}
	static public function import($data) {
		$product = self::firstOrNew(['venue_id'=>$data->venue_id, 'system_id'=>$data->system_id, 'code'=>$data->code]);
		$product->fill((array) $data);
		$product->setCategory();
		$product->save();
	}
	public function setCategory() {
		$productMap = ProductCategoryMap::getFor($this->venue_id, $this->system_id, $this->mapping_code);
		$fields = ['category_id', 'is_unique_visitor', 'is_visitor', 'is_unit'];
		if( $productMap ) {
			foreach ($fields as $field) {
				$this->$field = $productMap->$field;
			}
		} else {
			foreach ($fields as $field) {
				$this->$field = 0;
			}
		}
	}
	static public function reCategorizeAll($venue_id) {
		$products = self::where('venue_id', $venue_id)->get();
		foreach($products as $product) {
			$product->setCategory();
			$product->save();
		}
	}
}
