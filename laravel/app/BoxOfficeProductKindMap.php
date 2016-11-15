<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BoxOfficeProductKindMap extends Model
{
	protected $table = 'box_office_product_kind_map';
	protected $guarded = [];
	static public function getKindFor($venue_id, $account_code) {
		$result = self::where('venue_id', $venue_id)->where('account_code_from', '<=', $account_code)->where('account_code_to', '>=', $account_code)->first();
		if(!$result)
			return false;
		else
			return BoxOfficeProductKind::find($result->box_office_product_kind_id);
	}

}
