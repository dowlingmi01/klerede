<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class StoreProductCategoryGroup extends Model {
	protected $table = 'store_product_category_group';
	protected $guarded = [];
	static function getFor($code) {
		return StoreProductCategoryGroup::firstOrCreate(['code'=>$code]);
	}
	public function categories() {
		return $this->hasMany('App\StoreProductCategory');
	}
}
