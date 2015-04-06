<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Member extends Model {
	protected $table = 'member';
	protected $guarded = [];
	static function getForXML(\SimpleXMLElement $custXML, \SimpleXMLElement $tranPropXML) {
		$name = $custXML->Name;
		$active = filter_var($custXML->ActiveFlag, FILTER_VALIDATE_BOOLEAN);
		$xstore_id = $custXML->AlternateKey[0]->AlternateID;
		$xstore_cust_id = $custXML->AlternateKey[1]->AlternateID;
		$venue_member_number = null;
		foreach( $tranPropXML as $prop ) {
			$dtvPropAt = $prop->children('dtv', true);
			if($dtvPropAt->PosTransactionPropertyCode == 'VenueMemberNumber')
				$venue_member_number = $dtvPropAt->PosTransactionPropertyValue;
		}
		$member = Member::firstOrNew(['xstore_id'=>$xstore_id, 'xstore_cust_id'=>$xstore_cust_id
			, 'venue_member_number'=>$venue_member_number]);
		$member->name = $name;
		$member->active = $active;
		$member->save();
		return $member;
	}

}
