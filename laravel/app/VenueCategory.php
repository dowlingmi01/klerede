<?php namespace App;

 
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Category;


class VenueCategory extends Model {

    protected $table = 'venue_category';
    protected $guarded = [];
 	 
	static public function import($file_name) {
	    DB::table('venue_category')->truncate();
        $map_data = \App\Helpers\Helper::readCSV(database_path('migrations/data/'.$file_name));
        $insert_data = [];
        for ($i = 1; $i < count($map_data); $i++) {
            $category = Category::getFor($map_data[$i]['category']);
            if($category != null) {
                $insert_data[$i]['category_id'] = $category->id;
            } else {
                $insert_data[$i]['category_id'] = -1;
            }
            $insert_data[$i]['venue_id'] = $map_data[$i]['venue_id'];
            $insert_data[$i]['goals_period_type'] = $map_data[$i]['goals_period_type'];
            $insert_data[$i]['goals_amount'] = $map_data[$i]['goals_amount'];
            $insert_data[$i]['goals_units'] = $map_data[$i]['goals_unit'];
            $insert_data[$i]['created_at'] = date('y-m-d G:i');
            $insert_data[$i]['updated_at'] = date('y-m-d G:i');
            
        }

        DB::table('venue_category')->insert($insert_data);
        
        
         
    }


     
}
