<?php
namespace App\ImportQueryHandlers;

use App\Product;
use Illuminate\Support\Facades\DB;

class SiriuswareBoxOfficeProduct extends ImportQueryHandler {
	protected $columns = ['code', 'description', 'mapping_code'];
	function updateVariables() {
	}
	function process() {
		$products = DB::table($this->getTableName())
			->where('query_id', $this->query->id)
			->get();
		foreach($products as $product) {
			$id = $product->id;
			$product->system_id = $this->query->import_query_class->system_id;
			$cols = ['id', 'query_id', 'status', 'created_at', 'updated_at'];
			foreach($cols as $col) {
				unset($product->{$col});
			}
			Product::import($product);
			DB::table($this->getTableName())->where('id', $id)->update(['status'=>'imported']);
		}
	}
}
