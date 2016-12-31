<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTagTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tag', function (Blueprint $table) {
            $table->increments('id');
            $table->string('description');
            $table->integer('venue_id');
            $table->integer('owner_id');
            $table->timestamps();
            $table->unique(['description', 'venue_id']);
        });

        $tags = array(
                ['description' => 'Facility'  , 'venue_id' => 0, 'owner_id' => 0 ],
                ['description' => 'Weather'  , 'venue_id' => 0, 'owner_id' => 0 ],
                ['description' => 'Group visit' , 'venue_id' => 0, 'owner_id' => 0 ],
                ['description' => 'Special exhibit'  , 'venue_id' => 0, 'owner_id' => 0 ],
                ['description' => 'Private event' , 'venue_id' => 0, 'owner_id' => 0 ],
                ['description' => 'Local event'  , 'venue_id' => 0, 'owner_id' => 0 ],
                ['description' => 'Campaign'  , 'venue_id' => 0, 'owner_id' => 0 ],
                ['description' => 'State holiday'  , 'venue_id' => 0, 'owner_id' => 0 ],
                ['description' => 'School holiday' , 'venue_id' => 0, 'owner_id' => 0 ],

                
        );
        DB::table('tag')->insert($tags);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tag');
    }
}
