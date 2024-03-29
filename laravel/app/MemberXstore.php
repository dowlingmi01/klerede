<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class MemberXstore extends Model {
	protected $table = 'member_xstore';
	protected $guarded = [];
	static function getForXML($store_id, \SimpleXMLElement $custXML, \SimpleXMLElement $tranPropXML) {
		$store = Store::find($store_id);
		$venue_id = $store ? $store->venue_id : $store_id;
		$name = $custXML->Name;
		$active = filter_var($custXML->ActiveFlag, FILTER_VALIDATE_BOOLEAN);
		$xstore_id = $custXML->AlternateKey[0]->AlternateID;
		$xstore_cust_id = null;
		if($custXML->AlternateKey[1])
			$xstore_cust_id = $custXML->AlternateKey[1]->AlternateID;
		$venue_member_number = null;
		foreach( $tranPropXML as $prop ) {
			$dtvPropAt = $prop->children('dtv', true);
			if($dtvPropAt->PosTransactionPropertyCode == 'VenueMemberNumber')
				$venue_member_number = $dtvPropAt->PosTransactionPropertyValue;
		}
		$member = MemberXstore::firstOrNew(['venue_id'=>$venue_id, 'xstore_id'=>$xstore_id
			, 'xstore_cust_id'=>$xstore_cust_id
			, 'venue_member_number'=>$venue_member_number]);
		$member->name = $name;
		$member->active = $active;
		$member->save();
		return $member;
	}
}
