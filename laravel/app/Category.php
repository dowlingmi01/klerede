<?php namespace App;

 
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Venue;


class Category extends Model {

    protected $table = 'category';
    protected $guarded = [];
    protected $category_venue = [];

    public function venues()
    {
        return $this->belongsToMany('App\Venue', 'venue_category')
            ->withPivot('goals_period_type','goals_amount','goals_units');
    }
 	 
    static function getFor($code) {
        return self::where('code', '=', $code)->first();
        
    }

    static public function hierarchyByVenue($venue_id){
        
        $hierarchy = Category::addSons($venue_id, 0); //can start with other parent than 0?
        return $hierarchy;
    }

    static private function addSons( $venue_id, $parent_id){
        
        $venue = Venue::find($venue_id);
        $categories = $venue->categories()->where('parent_category_id', $parent_id)->get();
        $hierarchy = [];
        foreach ($categories as $category) {
            //$relation = VenueCategory::where('venue_id', $venue_id)
            //        ->where('category_id', $category->id)->first();
            //if($relation != null){
                $result = [];
                $result['name'] = $category['name'];
                $result['visits_type'] = $category['visits_type'];
                $result['level'] = $category['level'];
                $result['goals_period_type'] = $category->pivot->goals_period_type;
                $result['goals_amount'] = $category->pivot->goals_amount;
                $result['goals_units'] = $category->pivot->goals_units;
                $sub_category= Category::addSons($venue_id, $category->id);
                if(count($sub_category) > 0)
                    $result['sub_category'] = $sub_category;
                $hierarchy[$category->code] = $result; 
            //}
        }
        return $hierarchy;
    }

    static public function import($file_name) {
	    DB::table('category')->truncate();
        $categories = json_decode(file_get_contents(database_path('migrations/data/'.$file_name)));
        Category::createTopCategory($categories, 0,0 );
       
        DB::unprepared('call sp_compute_category_descendant');
    }

    static private function createTopCategory($categories, $parent_id, $level ){
        foreach ($categories as $key => $value) {
            $element = $value;
             
            $id = DB::table('category')->insertGetId([
                    'parent_category_id' => $parent_id, 
                    'code' => $key,
                    'name' => $element->name,
                    'level' => $level,
                    'visits_type' =>  $element->visits_type
                ]);
            if(isset($element->sub_categories)){
                Category::createTopCategory($element->sub_categories, $id, $level+1 );
            }
        }
    }
}
