<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class StoreProductCategory extends Model {
	protected $table = 'store_product_category';
	protected $guarded = [];
	static function getFor($code) {
		return StoreProductCategory::firstOrCreate(['code'=>$code]);
	}
}
