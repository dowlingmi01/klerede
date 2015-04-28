<?php namespace App;

use Illuminate\Database\Eloquent\Model;
use DB;

class StoreTransaction extends Model {
	protected $table = 'store_transaction';
	static function getForXML(\SimpleXMLElement $xmlTran) {
		$transaction = new StoreTransaction();
		$transaction->venue_id = $xmlTran->RetailStoreID;
		$transaction->sequence = $xmlTran->SequenceNumber;
		$transaction->business_day = $xmlTran->BusinessDayDate;
		$transaction->time_start = $xmlTran->BeginDateTime;
		$transaction->time_end = $xmlTran->EndDateTime;
		$transaction->operator_id = $xmlTran->OperatorID;
		$transaction->status = strtolower($xmlTran->RetailTransaction['TransactionStatus']);
		$transaction->currency = $xmlTran->CurrencyCode;
		$transaction->net_amount = $xmlTran->RetailTransaction->Total;
		$transaction->store_register_id = StoreRegister::getFor($transaction->venue_id, $xmlTran->WorkstationID,
			$xmlTran->TillID)->id;
		$transaction->source_xml = $xmlTran->asXML();
		if($xmlTran->RetailTransaction->Customer)
			$transaction->member_id = Member::getForXML($xmlTran->RetailTransaction->Customer,
				$xmlTran->children('dtv', true)->PosTransactionProperties)->id;
		foreach($xmlTran->RetailTransaction->LineItem as $xmlLine)
			if($xmlLine->Tender) {
				if($xmlLine->Tender['TenderType'] == 'Cash')
					$transaction->payment_type = 'cash';
				else if($xmlLine->Tender['TenderType'] == 'CreditDebit') {
					$transaction->payment_type = 'card';
					$transaction->card_type_id = CardType::getFor((string) $xmlLine->Tender->TenderID)->id;
				}
			}
		$transaction->save();
		foreach($xmlTran->RetailTransaction->LineItem as $xmlLine)
			if($xmlLine->Sale || $xmlLine->Return) {
				StoreTransactionLine::getForXML($transaction->id, $xmlLine);
			}
		return $transaction;
	}
	static function importXMLTransactions(\SimpleXMLElement $xmlLog) {
		foreach($xmlLog->Transaction as $xmlTran) {
			$dtvAt = $xmlTran->attributes('dtv', true);
			if( $dtvAt->TransactionType == 'RETAIL_SALE')
				StoreTransaction::getForXML($xmlTran);
		}
	}
	static function queryF($params) {
		$query = DB::table('store_transaction')
			->select('business_day')
			->where('business_day', '>=', $params->date_from)
			->where('business_day', '<=', $params->date_to)
			->where('status', 'delivered')
			->groupBy('business_day')
		;
		if(isset($params->venue_id))
			$query->where('venue_id', $params->venue_id);
		if(isset($params->member)) {
			if($params->member)
				$query->whereNotNull('member_id');
			else
				$query->whereNull('member_id');
		}
		if(isset($params->by_category)) {
			$query->join('store_transaction_line', 'store_transaction_id', '=', 'store_transaction.id')
				->join('store_product', 'store_product_id', '=', 'store_product.id')
				->join('store_product_category', 'store_product_category_id', '=', 'store_product_category.id')
				->groupBy('store_product_category.id', 'store_product_category.code')
				->addSelect('store_product_category.code as category', DB::raw('sum(sale_price) as amount'), DB::raw('cast(sum(quantity) as signed) as number'))
				->orderBy('category', 'asc', 'business_day', 'asc');

			$res = $query->get();
			$result = [];
			foreach($res as $line) {
				$category = $line->category;
				unset($line->category);
				if(!array_key_exists($category, $result))
					$result[$category] = ['category'=>$category, 'sales'=>[]];
				$result[$category]['sales'][] = $line;
			}
			$result = array_values($result);
		} else {
			$query->addSelect(DB::raw('sum(net_amount) as amount'), DB::raw('count(*) as number'));
			$result = $query->get();
		}

		return $result;
	}
}