<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class StoreTransactionLine extends Model {
	protected $table = 'store_transaction_line';
	protected $guarded = [];
	static function  getForXML($store_transaction_id, \SimpleXMLElement $xmlLine) {
		$line = new StoreTransactionLine();
		$line->store_transaction_id = $store_transaction_id;
		$line->sequence = $xmlLine->SequenceNumber;
		$xmlOp = $xmlLine->Sale ? $xmlLine->Sale : $xmlLine->Return;
		$line->store_product_id = StoreProduct::getForXML($xmlOp)->id;
		$line->retail_price = $xmlOp->RegularSalesUnitPrice;
		$line->sale_price = $xmlOp->ActualSalesUnitPrice->count() ? $xmlOp->ActualSalesUnitPrice : 0;
		$line->quantity = $xmlLine->Sale ? $xmlOp->Quantity : -$xmlOp->Quantity;
		$line->source_xml = $xmlLine->asXML();
		$line->save();
		return $line;
	}
}
