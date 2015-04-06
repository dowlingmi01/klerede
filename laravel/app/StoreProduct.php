<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class StoreProduct extends Model {
	protected $table = 'store_product';
	protected $guarded = [];
	static function getForXML(\SimpleXMLElement $xmlProduct) {
		$store_product = StoreProduct::firstOrNew(['code'=>$xmlProduct->ItemID]);
		$store_product->description = $xmlProduct->Description;
		$store_product->scanned_code = $xmlProduct->children('dtv', true)->ScannedItemID;
		$store_product->save();
		return $store_product;
	}
}
