<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class StoreProductCategory extends Model {
	protected $table = 'store_product_category';
	protected $guarded = [];
	static function getFor($code) {
		$category = StoreProductCategory::firstOrNew(['code'=>$code]);
		if(!$category->exists) {
			$category->store_product_category_group()->associate(StoreProductCategoryGroup::getFor('STA'));
			$category->save();
		}
		return $category;
	}
	public function store_product_category_group() {
		return $this->belongsTo('App\StoreProductCategoryGroup');
	}
}
