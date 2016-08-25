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
}
