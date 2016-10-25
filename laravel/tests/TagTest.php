<?php

 
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model as Eloquent;

class TagTest extends TestCase
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

    public function testCreateTag()
    {

        $result = $this->post('api/v1/auth/login', ['email'=>'aqua+owner@test.com','password'=>'secretowner'])
                ->seeJsonStructure([
                 'token'
         ]);
       

       	$token = '';
        
       	$responseData = json_decode($this->response->getContent(), true);
       	$token = $responseData['token'];
    

        $result = $this->post('api/v1/tags?token='.$token, ['description'=>'tag1',
                                                    'venue_id'=>1518 
                                                            ]) 
               ->seeJsonStructure(['result', 'id']);

        $result = $this->post('api/v1/tags?token='.$token, ['description'=>'tag1',
                                                    'venue_id'=>1588 
                                                            ]) 
               ->seeJson(['result' => 'error', 'message' => 'invalid_venue_id']);

        $result = $this->post('api/v1/tags?token='.$token, ['description'=>'tag1',
                                                    'venue_id'=>1518 
                                                            ]) 
               ->seeJson(['result' => 'error', 'message'=>'duplicate_entry']);
	}
}
