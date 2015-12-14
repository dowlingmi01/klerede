<?php namespace App;

use Illuminate\Database\Eloquent\Model;
use DB;

class StoreTransaction extends Model {
	protected $table = 'store_transaction';
	protected $guarded = [];

	static function getForXML(\SimpleXMLElement $xmlTran, Batch $batch) {
		$store_id = $xmlTran->RetailStoreID;
		$sequence = $xmlTran->SequenceNumber;
		$register_id = $xmlTran->WorkstationID;
		$transaction = StoreTransaction::firstOrNew(['store_id'=>$store_id,
			'register_id'=>$register_id, 'sequence'=>$sequence]);
		if($transaction->exists) {
			if($transaction->source_xml == $xmlTran->asXML()) {
				$batch->info(sprintf("Matching transaction %d-%d-%d already processed", $store_id, $register_id, $sequence));
				return $transaction;
			} else {
				throw new \Exception(sprintf("Duplicate transaction %d-%d-%d mismatch", $store_id, $register_id, $sequence));
			}
		}
		$transaction->business_day = $xmlTran->BusinessDayDate;
		$transaction->time_start = $xmlTran->BeginDateTime;
		$transaction->time_end = $xmlTran->EndDateTime;
		$transaction->operator_id = $xmlTran->OperatorID;
		$transaction->currency = $xmlTran->CurrencyCode;
		$transaction->net_amount = $xmlTran->RetailTransaction->Total;
		$transaction->source_xml = $xmlTran->asXML();
		$transaction->batch_id = $batch->id;
		if($xmlTran->RetailTransaction->Customer)
			$transaction->member_xstore_id = MemberXstore::getForXML($transaction->store_id,
				$xmlTran->RetailTransaction->Customer,
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
			if( $xmlLine['VoidFlag'] != 'true' && ($xmlLine->Sale || $xmlLine->Return)) {
				StoreTransactionLine::getForXML($transaction->id, $xmlLine);
			}
		StatStatus::newData(Channel::getFor('store')->id, $transaction->business_day);
		return $transaction;
	}
	static function importXMLTransactions(\SimpleXMLElement $xmlLog, $batch) {
		foreach($xmlLog->Transaction as $xmlTran) {
			$dtvAt = $xmlTran->attributes('dtv', true);
			if( $dtvAt->TransactionType == 'RETAIL_SALE' && $xmlTran->RetailTransaction['TransactionStatus'] == 'Delivered')
				StoreTransaction::getForXML($xmlTran, $batch);
		}
	}
	static function queryF($params) {
		$query = DB::table('store_transaction')
			->select('business_day')
			->where('business_day', '>=', $params->date_from)
			->where('business_day', '<=', $params->date_to)
			->groupBy('business_day')
		;
		if(isset($params->store_id))
			$query->where('store_id', $params->store_id);
		if(isset($params->member)) {
			if($params->member)
				$query->whereNotNull('member_xstore_id');
			else
				$query->whereNull('member_xstore_id');
		}
		if(isset($params->by_category)) {
			$query->join('store_transaction_line', 'store_transaction_id', '=', 'store_transaction.id')
				->join('store_product', 'store_product_id', '=', 'store_product.id')
				->join('store_product_category', 'store_product_category_id', '=', 'store_product_category.id')
				->join('store_product_category_group', 'store_product_category_group_id', '=', 'store_product_category_group.id')
				->groupBy('store_product_category_group.id')
				->addSelect('store_product_category_group.id as category', DB::raw('sum(sale_price) as amount'), DB::raw('cast(sum(quantity) as signed) as number'))
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
