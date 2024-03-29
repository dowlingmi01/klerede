<?php

namespace App;
use App\Venue;

class GoalsSales {
	private static function getMonths($q, $year, $fiscal_year_start_month) {
		$months = [];
		if($fiscal_year_start_month > 1)
			$year--;
 		$calculated_year  = $year;
		for( $month = 1; $month <= 12; $month++ ) {
			$calculated_month = (($month  + $fiscal_year_start_month - 2) % 12) + 1;
			if($calculated_month < $fiscal_year_start_month)
					$calculated_year  = $year+1;
			$q['month'] = $calculated_year * 100 + $calculated_month;
			 
			$goal = GoalSalesMonthly::firstOrNew($q);
			$months[$month] = $goal->goal  ;
		} 
		return $months;
	}
	static function get($venue_id, $year, $channel = null, $type = null, $sub_channel = null) {
		$channels = [
			'gate/amount' => [
				'channel'=>'gate',
				'name'=>'Box Office',
				'type'=>'amount',
			], 'membership/amount' => [
				'channel'=>'membership',
				'name'=>'Total Membership $',
				'type'=>'amount',
				'sub_channels'=>[
					'individual'=>['name'=>'Individual'],
					'family'=>['name'=>'Family'],
					'corporate'=>['name'=>'Corporate'],
				],
			], 'membership/units' => [
				'channel'=>'membership',
				'name'=>'Total Membership #',
				'type'=>'units',
				'sub_channels'=>[
					'individual'=>['name'=>'Individual'],
					'family'=>['name'=>'Family'],
					'corporate'=>['name'=>'Corporate'],
				],
			], 'cafe/amount' => [
				'channel'=>'cafe',
				'name'=>'Cafe',
				'type'=>'amount',
			], 'store/amount' => [
				'channel'=>'store',
				'name'=>'Store',
				'type'=>'amount',
			]
		];
		$venue = Venue::find($venue_id);
		$fiscal_year_start_month = $venue->fiscal_year_start_month;

		foreach($channels as &$channel) {
			$channel_id = Channel::getFor($channel['channel'])->id;
			$q = ['venue_id'=>$venue_id, 'channel_id'=>$channel_id, 'type'=>$channel['type'], 'sub_channel_id'=>0];
			if(array_key_exists('sub_channels', $channel)) {
				foreach($channel['sub_channels'] as $sub_channel_code=>&$sub_channel) {
					$sub_channel_id = MembershipKind::getFor($sub_channel_code)->id;
					$q['sub_channel_id'] = $sub_channel_id;
					$sub_channel['months'] = self::getMonths($q, $year,$fiscal_year_start_month);
				}
			} else {
				$channel['months'] = self::getMonths($q, $year,$fiscal_year_start_month);
			}
		}
		return $channels;
	}
	static function set($venue_id, $year, $channel, $type, $sub_channel, $months) {
		$venue = Venue::find($venue_id);
		$fiscal_year_start_month = $venue->fiscal_year_start_month;

		$channel_id = Channel::getFor($channel)->id;
		$sub_channel_id = $sub_channel ? MembershipKind::getFor($sub_channel)->id : 0;
		$q = ['venue_id'=>$venue_id, 'channel_id'=>$channel_id, 'type'=>$type, 'sub_channel_id'=>$sub_channel_id, 'year'=>$year];
		if($fiscal_year_start_month > 1)
			$year--;
		$calculated_year  = $year;
		for( $month = 1; $month <= 12; $month++ ) {
			$calculated_month = (($month  + $fiscal_year_start_month - 2) % 12) + 1;
			if($calculated_month < $fiscal_year_start_month)
				$calculated_year  = $year+1;
			$q['month'] = $calculated_year * 100 + $calculated_month;
			$goal = GoalSalesMonthly::firstOrNew($q);
			$goal->goal = $months[$month];
			$goal->save();
		}
		return true;
	}
}
