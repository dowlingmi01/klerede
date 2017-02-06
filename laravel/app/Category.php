<?php namespace App;

 
use Illuminate\Database\Eloquent\Model;
use DB;
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
        
        $hierarchy = Category::getChildren($venue_id, 0); //can start with other parent than 0?
        return $hierarchy;
    }

    static private function getChildren( $venue_id, $parent_id){
        
        $venue = Venue::find($venue_id);
        $categories = $venue->categories()->where('parent_category_id', $parent_id)->get();
        $hierarchy = [];
        foreach ($categories as $category) {
            //$relation = VenueCategory::where('venue_id', $venue_id)
            //        ->where('category_id', $category->id)->first();
            //if($relation != null){
                $result = [];
                $result['id'] = $category['id'];
                $result['name'] = $category['name'];
                $result['visits_type'] = $category['visits_type'];
                $result['level'] = $category['level'];
                $result['order'] = $category['order'];
                $result['goals_period_type'] = $category->pivot->goals_period_type;
                $result['goals_amount'] = $category->pivot->goals_amount;
                $result['goals_units'] = $category->pivot->goals_units;
                $sub_category= Category::getChildren($venue_id, $category->id);
                if(count($sub_category) > 0)
                    $result['sub_categories'] = $sub_category;
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
        $order = 0;
        foreach ($categories as $key => $value) {
            $element = $value;
             
            DB::table('category')->insert([
                    'id' => $element->id,
                    'parent_category_id' => $parent_id,
                    'code' => $key,
                    'name' => $element->name,
                    'level' => $level,
                    'visits_type' =>  $element->visits_type,
                    'order' => $order,
                    'created_at' => date('y-m-d G:i'),
                    'updated_at' => date('y-m-d G:i')
                ]);
            if(isset($element->sub_categories)){
                Category::createTopCategory($element->sub_categories, $element->id, $level+1 );
            }
            $order++;
        }
    }
}
