<?php namespace App;

 
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Category extends Model {

    protected $table = 'category';
    protected $guarded = [];
 	 
    static function getFor($code) {
        return self::where('code', '=', $code)->first();
        
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
