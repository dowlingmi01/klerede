<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Venue extends Model {
	protected $table = 'venue';

	public function categories()
    {
        return $this->belongsToMany('App\Category', 'venue_category')
        	->withPivot('goals_period_type','goals_amount','goals_units');
    }
}
