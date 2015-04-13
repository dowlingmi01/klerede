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
			->select('business_day', DB::raw('sum(net_amount) as amount'), DB::raw('count(*) as number'))
			->where('business_day', '>=', $params->date_from)
			->where('business_day', '<=', $params->date_to)
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
		return $query->get();
	}
}
