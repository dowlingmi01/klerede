<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class VenueVariable extends Model {
	protected $guarded = [];
	protected $table = 'venue_variable';
	static function substituteFor($venue_id, $string) {
		$variables = VenueVariable::where('venue_id', $venue_id)->get();
		$substs = [];
		foreach($variables as $variable) {
			$substs['#'.$variable->name.'#'] = $variable->value;
		}
		return strtr($string, $substs);
	}
	static function setValue($venue_id, $name, $value) {
		$var = self::firstOrNew(['venue_id'=>$venue_id, 'name'=>$name]);
		$var->value = $value;
		$var->save();
	}
}
