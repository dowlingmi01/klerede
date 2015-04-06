<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class CardType extends Model {
	protected $table = 'card_type';
	protected $guarded = [];
	static function getFor($name) {
		return CardType::firstOrCreate(['name'=>$name]);
	}
}
