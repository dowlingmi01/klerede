<?php namespace App;

 
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Category;
use App\System;

class ProductCategoryMap extends Model {

    protected $table = 'product_category_map';
    protected $guarded = [];
 	 
	static public function import($file_name) {
	    DB::table('product_category_map')->truncate();
        $map_data = \App\Helpers\Helper::readCSV(database_path('migrations/data/'.$file_name));
        $insert_data = [];
        for ($i = 1; $i < count($map_data); $i++) {
            $category = Category::getFor($map_data[$i]['category']);
            if($category != null) {
                $insert_data[$i]['category_id'] = $category->id;
            } else {
                $insert_data[$i]['category_id'] = -1;
            }
             $system = System::getFor($map_data[$i]['system']);
            if($system != null) {
                $insert_data[$i]['system_id'] = $system->id;
            } else {
                $insert_data[$i]['system_id'] = -1;
            }
            $insert_data[$i]['venue_id'] = $map_data[$i]['venue_id'];
            $insert_data[$i]['code_from'] = $map_data[$i]['code_from'];
            $insert_data[$i]['code_to'] = $map_data[$i]['code_to'];
            $insert_data[$i]['is_unique_visitor'] = $map_data[$i]['is_unique_visitor'];
            $insert_data[$i]['is_visitor'] = $map_data[$i]['is_visitor'];
            $insert_data[$i]['is_unit'] = $map_data[$i]['is_unit'];
            $insert_data[$i]['created_at'] = date('y-m-d G:i');
            $insert_data[$i]['updated_at'] = date('y-m-d G:i');

        }

        DB::table('product_category_map')->insert($insert_data);
        
       
         
    }


     
}
