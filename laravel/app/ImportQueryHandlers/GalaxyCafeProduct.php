<?php
namespace App\ImportQueryHandlers;

use App\CafeProduct;
use Illuminate\Support\Facades\DB;

class GalaxyCafeProduct extends ImportQueryHandler {
	protected $columns = ['code', 'description', 'account_code'];
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
			CafeProduct::import($product);
			DB::table($this->getTableName())->where('id', $id)->update(['status'=>'imported']);
		}
	}
}
