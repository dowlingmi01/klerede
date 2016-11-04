<?php

 
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model as Eloquent;

class NoteTest extends TestCase
{

    protected static $db_inited = false;


    protected static function initDB()
    {
        echo "\n---initDB---\n"; // proof it only runs once per test TestCase class
        Artisan::call('migrate');
        App\User::truncate();
        App\Tag::truncate();
        Artisan::call('db:seed', array('--class'=>'TestUserSeeder'));
    }

     
    public function setUp()
    {
        parent::setUp();

        if (!static::$db_inited) {
            static::$db_inited = true;
            static::initDB();
        }

        $this->json('POST', 'api/v1/auth/logout');
    }

    public function testCreateNote()
    {

        $result = $this->post('api/v1/auth/login', ['email'=>'aqua+basic@test.com','password'=>'secretbasic'])
                ->seeJsonStructure([
                 'token'
         ]);
       

       	$token = '';
        
       	$responseData = json_decode($this->response->getContent(), true);
       	$token = $responseData['token'];
    

        $result = $this->post('api/v1/notes?token='.$token, [
        		"header"=>" header test 1",
				"description"=>"description test 1",
				"all_day"=>false,
				"time_start"=>"2016-26-10 12:10:30",
				"time_end"=>"2016-26-10 17:35:55",
				"channels"=> [2,4], 
				"new_tags" => [ "testTag 1"],
				"venue_id"=>1518]
			)->seeJsonStructure(['result', 'id']);

        $this->assertEquals(200, $this->response->status());

        $result = $this->post('api/v1/notes?token='.$token, ["header"=>" header test 2",
												"description"=>"description test 2",
												"all_day"=>false,
												"time_start"=>"2016-26-10 12:10:30",
												"time_end"=>"2016-26-10 17:35:55",
												"channels"=> [2,4], 
								  				"venue_id"=>1588
                                                            ]) 
               ->seeJson(['result' => 'error', 'message' => 'invalid_venue_id']);

        $result = $this->post('api/v1/notes?token='.$token, ["header"=>" header test 2",
												"description"=>"description test 2",
												"all_day"=>false,
												"time_start"=>"2016-26-10 12:10:30",
												"time_end"=>"2016-26-10 17:35:55",
												"channels"=> [2,4], 
								  				"venue_id"=>0
                                                            ]) 
               ->seeJson(['result' => 'error', 'message' => 'invalid_venue_id']);

        $this->assertEquals(400, $this->response->status());

        $result = $this->post('api/v1/notes?token='.$token, [
								        		"header"=>" header test 3",
												"description"=>"description test 3",
												"all_day"=>false,
												"time_start"=>"2016-26-10 12:10:30",
												"time_end"=>"2016-26-10 17:35:55",
												"channels"=> [2,4], 
												"new_tags" => [ "testTag 1"],
												"venue_id"=>1518]) 
               ->seeJson(['result' => 'error', 'message'=>'duplicate_entry', 'entity'=>'tag']);

        $this->assertEquals(400, $this->response->status());

        $result = $this->post('api/v1/notes?token='.$token, [
								        		 
												"description"=>"description test 3",
												"all_day"=>false,
												"time_start"=>"2016-26-10 12:10:30",
												"time_end"=>"2016-26-10 17:35:55",
												 
											 
												"venue_id"=>1518]) 
               ->seeJson(['result' => 'error'  ]);

          $this->assertEquals(400, $this->response->status());

         $result = $this->post('api/v1/notes?token='.$token, [
								        		"header"=>" header test 3",
												 
												"all_day"=>false,
												"time_start"=>"2016-26-10 12:10:30",
												"time_end"=>"2016-26-10 17:35:55",
												 
											 
												"venue_id"=>1518]) 
               ->seeJson(['result' => 'error'  ]);

          $this->assertEquals(400, $this->response->status());

         $result = $this->post('api/v1/notes?token='.$token, [
								        		"header"=>" header test 3", 
												"description"=>"description test 3",
												 
												"time_start"=>"2016-26-10 12:10:30",
												"time_end"=>"2016-26-10 17:35:55",
												 
											 
												"venue_id"=>1518]) 
               ->seeJson(['result' => 'error'  ]);


          $this->assertEquals(400, $this->response->status());


         $result = $this->post('api/v1/notes?token='.$token, [
								        		"header"=>" header test 3", 
												"description"=>"description test 3",
												"all_day"=>false,
												 
												"time_end"=>"2016-26-10 17:35:55",
												 
											 
												"venue_id"=>1518]) 
               ->seeJson(['result' => 'error'  ]);

          $this->assertEquals(400, $this->response->status());


        $result = $this->post('api/v1/notes?token='.$token, [
								        		
								        		"header"=>" header test 3",  
												"description"=>"description test 3",
												"all_day"=>false,
												"time_start"=>"2016-26-10 12:10:30",
												
												 
											 
												"venue_id"=>1518]) 
               ->seeJson(['result' => 'error'  ]);


          $this->assertEquals(400, $this->response->status());


          $result = $this->post('api/v1/notes?token='.$token, [
	 							        		"header"=>" header test 3",  
												"description"=>"description test 3",
												"all_day"=>false,
												"time_start"=>"2016-26-10 12:10:30",
												"time_end"=>"2016-26-10 17:35:55" ]
	 											 ) 
               ->seeJson(['result' => 'error'  ]);


          $this->assertEquals(400, $this->response->status());
	}

   
}
