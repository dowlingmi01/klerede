<?php
namespace App\ImportQueryHandlers;

use App\CafeProduct;
use DB;

class SiriuswareCafeProduct extends ImportQueryHandler {
	protected $columns = ['code', 'description'];
	function updateVariables() {
	}
	function process() {
		$products = DB::table($this->getTableName())
			->where('query_id', $this->query->id)
			->get();
		foreach($products as $product) {
			$id = $product->id;
			$cols = ['id', 'query_id', 'status', 'created_at', 'updated_at'];
			foreach($cols as $col) {
				unset($product->{$col});
			}
			$product->account_code = '';
			CafeProduct::import($product);
			DB::table($this->getTableName())->where('id', $id)->update(['status'=>'imported']);
		}
	}
}
