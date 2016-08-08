<?php

namespace App\Helpers;

use \JWTAuth;

class VenueHelper {

	public static function getVenueId(){
		return JWTAuth::parseToken()->getPayload()->get('ven');
	}

	public static function isValid($venue_id){
		if(config('jwt.active')){ 
			return $venue_id == JWTAuth::parseToken()->getPayload()->get('ven');
		} else {
			return true;
		}
	}
 
}