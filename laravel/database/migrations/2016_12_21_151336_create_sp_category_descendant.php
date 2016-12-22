<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class FillTableCategory extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('category')->truncate();
        $categories = json_decode(file_get_contents(database_path('migrations/data/categories.json')));
        $this->createTopCategory($categories, 0,0 );
       
        $sql = file_get_contents(database_path('migrations/sp/sp_compute_category_descendant.sql'));
        DB::unprepared($sql);
        DB::unprepared('call sp_compute_category_descendant');
    }

    private function createTopCategory($categories, $parent_id, $level ){
        foreach ($categories as $key => $value) {
            $element = $value;
            $dt = new DateTime;
            $id = DB::table('category')->insertGetId([
                    'parent_category_id' => $parent_id, 
                    'code' => $key,
                    'name' => $element->name,
                    'level' => $level,
                    'visits_type' =>  $element->visits_type
                ]);
            if(isset($element->sub_categories)){
                $this->createTopCategory($element->sub_categories, $id, $level+1 );
            }
        }
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('category')->truncate();
    }
}
