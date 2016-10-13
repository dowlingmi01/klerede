<?php


//use DatabaseMigrations;

use App\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model as Eloquent;


class UserTest extends TestCase
{

     protected static $db_inited = false;


    protected static function initDB()
    {
        echo "\n---initDB---\n"; // proof it only runs once per test TestCase class
        Artisan::call('migrate');
        App\User::truncate();
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

    //use DatabaseMigrations;
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testNotLoggedIn()
    {
        $this->json('GET', 'api/v1/auth/logged')
             ->seeJson([
                 'error'=>'token_not_provided'
             ]);
    }


    public function testInvalidToken()
    {
        $this->json('GET', 'api/v1/auth/logged?token=XyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZW4iOjE1MTgsInJvbCI6MSwic3ViIjoxLCJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3Q6NDA0MFwvYXBpXC92MVwvYXV0aFwvbG9naW4iLCJpYXQiOjE0NzI4NTk5MzgsImV4cCI6MTQ3MzQ2NDczOCwibmJmIjoxNDcyODU5OTM4LCJqdGkiOiJjMWMwOGFhODEyZjI3Mzg1N2YzM2JjMGI5NmZkZGFkOCJ9.h4mU8VxhEj-MRC_ZoXM98vwk6qyDAtpB3LPFUhLyb4Y')
             ->seeJson([
                 'error'=>'token_invalid'
             ]);
    }

    public function testLogin()
    {
        $this->json('POST', 'api/v1/auth/login', ['email'=>'not+exist+owner@test.com','password'=>'secretowner'])
             ->seeJson(['result'=>'error',
                           'message'=>'user_not_found']);

        $this->assertEquals(404, $this->response->status());

        $this->json('POST', 'api/v1/auth/login', ['email'=>'aqua+owner@test.com','password'=>'publicowner'])
             ->seeJson(['result'=>'error',
                           'message'=>'invalid_credentials']);

        $this->assertEquals(401, $this->response->status());

        $this->json('POST', 'api/v1/auth/login', ['email'=>'aqua+owner@test.com','password'=>'secretowner'])
             ->seeJsonStructure([
                 'token'
             ]);

        $this->assertEquals(200, $this->response->status());
    }

    public function testLogged()
    {
        //$result = $this->json('POST', 'api/v1/auth/login', ['email'=>'aqua+owner@test.com','password'=>'secretowner']);
        

        $result = $this->post('api/v1/auth/login', ['email'=>'aqua+owner@test.com','password'=>'secretowner'])
                ->seeJsonStructure([
                 'token'
         ]);
       

        $token = '';
        
       $responseData = json_decode($this->response->getContent(), true);
       $token = $responseData['token'];
       
        $this->json('GET', 'api/v1/auth/logged?token='.$token)
            ->seeJsonStructure([
                 'user' => [
                     'id', 'name', 'email'
                 ]
             ]); 

        $this->assertEquals(200, $this->response->status());


    }

    public function testCreateUser()
    {

        $result = $this->post('api/v1/auth/login', ['email'=>'aqua+owner@test.com','password'=>'secretowner'])
                ->seeJsonStructure([
                 'token'
         ]);
       

        $token = '';
        
       $responseData = json_decode($this->response->getContent(), true);
       $token = $responseData['token'];
    

        $result = $this->post('api/v1/users?token='.$token, ['first_name'=>'Test Create Name',
                                                    'last_name'=>'Test Create LastN',
                                                    'email'=>'newcreate@test.com',
                                                    'role_id'=>1,
                                                    'venue_id'=>1518
                                                    ])->seeJsonStructure( 
                             [
                                 'result', 'id'
                             ]
                          );
        $this->assertEquals(200, $this->response->status());
                

        $result2 = $this->post('api/v1/users?token='.$token, ['first_name'=>'Test Create Name',
                                                    'last_name'=>'Test Create LastN',
                                                    'email'=>'newcreate2@test.com',
                                                    'role_id'=>1,
                                                    'venue_id'=>1588
                                                    ])->seeJson(['result'=>'error',
                                                                    'message'=>'invalid_venue_id']);
        $this->assertEquals(400, $this->response->status());
 
        //test create user with insuficient priviledges
    
    }

    public function testCreateInvalidUser()
    {

        $result = $this->post('api/v1/auth/login', ['email'=>'aqua+owner@test.com','password'=>'secretowner'])
                ->seeJsonStructure([
                 'token'
         ]);
       

        $token = '';
        
       $responseData = json_decode($this->response->getContent(), true);
       $token = $responseData['token'];
    

       

       $result2 = $this->post('api/v1/users?token='.$token, [ 
                                                    'last_name'=>'Test Create LastN',
                                                    'email'=>'newcreate2@test.com',
                                                    'role_id'=>1,
                                                    'venue_id'=>1518
                                                    ])->seeJson(['result'=>'error' ]);
                
        $this->assertEquals(400, $this->response->status());

         $result2 = $this->post('api/v1/users?token='.$token, ['first_name'=>'Test Create Name',
                                                    
                                                    'email'=>'newcreate2@test.com',
                                                    'role_id'=>1,
                                                    'venue_id'=>1518
                                                    ])->seeJson(['result'=>'error' ]);
                
        $this->assertEquals(400, $this->response->status());

         $result2 = $this->post('api/v1/users?token='.$token, ['first_name'=>'Test Create Name',
                                                    'last_name'=>'Test Create LastN',
                                                     
                                                    'role_id'=>1,
                                                    'venue_id'=>1518
                                                    ])->seeJson(['result'=>'error' ]);
                
        $this->assertEquals(400, $this->response->status());

         $result2 = $this->post('api/v1/users?token='.$token, ['first_name'=>'Test Create Name',
                                                    'last_name'=>'Test Create LastN',
                                                    'email'=>'newcreate2@test.com',
                                                     
                                                    'venue_id'=>1518
                                                    ])->seeJson(['result'=>'error' ]);
                
        $this->assertEquals(400, $this->response->status());

         $result2 = $this->post('api/v1/users?token='.$token, ['first_name'=>'Test Create Name',
                                                    'last_name'=>'Test Create LastN',
                                                    'email'=>'newcreate2@test.com',
                                                    'role_id'=>1,
                                                     
                                                    ])->seeJson(['result'=>'error' ]);
                
        $this->assertEquals(400, $this->response->status());

         $result2 = $this->post('api/v1/users?token='.$token, ['first_name'=>'Test Create Name',
                                                    'last_name'=>'Test Create LastN',
                                                    'email'=>'newcreate2',
                                                    'role_id'=>1,
                                                    'venue_id'=>1518
                                                    ])->seeJson(['result'=>'error' ]);
                
        $this->assertEquals(400, $this->response->status());

         $result2 = $this->post('api/v1/users?token='.$token, ['first_name'=>'Test Create Name',
                                                    'last_name'=>'Test Create LastN',
                                                    'email'=>'newcreate2@test.com',
                                                    'role_id'=>'a',
                                                    'venue_id'=>1518
                                                    ])->seeJson(['result'=>'error' ]);
                
        $this->assertEquals(400, $this->response->status());
        

          $result2 = $this->post('api/v1/users?token='.$token, ['first_name'=>'Test Create Name',
                                                    'last_name'=>'Test Create LastN',
                                                    'email'=>'newcreate2@test.com',
                                                    'role_id'=>1,
                                                    'venue_id'=>'bbb'
                                                    ])->seeJson(['result'=>'error' ]);
                
        $this->assertEquals(400, $this->response->status());
        //echo $this->response->getContent();
  
    
    }

    public function testCreateUserBasicUser()
    {

        $result = $this->post('api/v1/auth/login', ['email'=>'aqua+basic@test.com','password'=>'secretbasic'])
                ->seeJsonStructure([
                 'token'
         ]);
       

        $token = '';
        
       $responseData = json_decode($this->response->getContent(), true);
       $token = $responseData['token'];
    

       

       $result2 = $this->post('api/v1/users?token='.$token, ['first_name'=>'Test Create Name',
                                                    'last_name'=>'Test Create LastN',
                                                    'email'=>'newcreate2@test.com',
                                                    'role_id'=>1,
                                                    'venue_id'=>1518
                                                    ])->seeJson(['result'=>'error', 'message'=>'insufficient_privileges']);
                
        $this->assertEquals(403, $this->response->status());
        //echo $this->response->getContent();
  
    
    }



    public function testUpdateUser()
    {

        $result = $this->post('api/v1/auth/login', ['email'=>'aqua+basic@test.com','password'=>'secretbasic'])
                ->seeJsonStructure([
                 'token'
        ]);

        $token = '';
        
        $responseData = json_decode($this->response->getContent(), true);
        $token = $responseData['token'];
        //echo $token."\n\r";

        $result2 = $this->put('api/v1/users/10?token='.$token, ['first_name'=>'Test Create Name',
                                                    'last_name'=>'Test Create LastN',
                                                    'email'=>'newcreate2@test.com',
                                                    'role_id'=>1,
                                                    'venue_id'=>1518
                                                    ])->seeJson(['result'=> 'error', 'message'=>'user_not_found']);

        $this->assertEquals(404, $this->response->status());
                
        $result3 = $this->put('api/v1/users/2?token='.$token, ['first_name'=>'Test Create Name',
                                                    'last_name'=>'Test Create LastN',
                                                    'email'=>'newcreate2@test.com',
                                                    'role_id'=>1,
                                                    'venue_id'=>1518
                                                    ])->seeJson(['result'=>'error', 'message'=>'invalid_venue_id']);

        $this->assertEquals(400, $this->response->status());

        //$this->assertEquals('Invalid venue id', $this->response->getContent());        


        $result3 = $this->put('api/v1/users/1?token='.$token, ['first_name'=>'Test Create Name',
                                                    'last_name'=>'Test Create LastN',
                                                    'email'=>'newcreate2@test.com',
                                                    'role_id'=>1,
                                                    'venue_id'=>1518
                                                    ])->seeJson(['result'=>'error', 'message'=>'insufficient_privileges']);

        $this->assertEquals(403, $this->response->status());


        $result31 = $this->put('api/v1/users/5?token='.$token, [ 
                                                    'role_id'=>1 
                                                    ])->seeJson(['result'=>'error', 'message'=>'cant_set_role']);

        $this->assertEquals(403, $this->response->status());

         $result4 = $this->put('api/v1/users/5?token='.$token, [
                                                    'last_name'=>'Test Modify LastN'
                                                   
                                                    ])->seeJson(['result'=>'ok']);

         $this->assertEquals(200, $this->response->status());

 
    }

    public function testUpdateInvalidUser(){

          $result = $this->post('api/v1/auth/login', ['email'=>'aqua+basic@test.com','password'=>'secretbasic'])
                ->seeJsonStructure([
                 'token'
        ]);

        $token = '';
        
        $responseData = json_decode($this->response->getContent(), true);
        $token = $responseData['token'];
        //echo $token."\n\r";

        $result4 = $this->put('api/v1/users/5?token='.$token, [
                                                    'email'=>'Test Invalid Email'
                                                   
                                                    ])->seeJson(['result'=>'error']);

        $this->assertEquals(400, $this->response->status());

         $result4 = $this->put('api/v1/users/5?token='.$token, [
                                                    'role_id'=>'Test Invalid role'
                                                   
                                                    ])->seeJson(['result'=>'error']);

        $this->assertEquals(400, $this->response->status());

    }

    public function testUpdateAdminUser()
    {

        $result2 = $this->post('api/v1/auth/login', ['email'=>'aqua+owner@test.com','password'=>'secretowner'])
                ->seeJsonStructure([
                 'token'
        ]);

        $token2 = '';
        
        $responseData2 = json_decode($this->response->getContent(), true);
        $token2 = $responseData2['token'];
        //echo $token2."\n\r";
       
        $result3 = $this->put('api/v1/users/7?token='.$token2, [ 
                                                    'email'=>'aqua+admin+mod@test.com',
                                                     
                                                    ])->seeJson(['result'=>'ok']);

        $this->assertEquals(200, $this->response->status());

        //$result = $this->json('POST', 'api/v1/auth/login', ['email'=>'aqua+owner@test.com','password'=>'secretowner']);
        
    }

    public function testUpdatOwnPasswordUser()
    {
        
        $result2 = $this->post('api/v1/auth/login', ['email'=>'llpa+basic@test.com','password'=>'secretbasic'])
                ->seeJsonStructure([
                 'token'
        ]);

        $responseData = json_decode($this->response->getContent(), true);
        $token = $responseData['token'];

        $result4 = $this->post('api/v1/users/5/pass?token='.$token, [
                            'oldPassword'=>'secretbasic',
                            'password'=>'secretbasic2',
                            ])->seeJson(['result'=>'error', 'message'=>'insufficient_privileges']);

        $this->assertEquals(403, $this->response->status());
    }

    public function testUpdatOwnPasswordAdminUser()
    {
        
        $result2 = $this->post('api/v1/auth/login', ['email'=>'llpa+admin@test.com','password'=>'secretadmin'])
                ->seeJsonStructure([
                 'token'
        ]);

        $responseData = json_decode($this->response->getContent(), true);
        $token = $responseData['token'];

        $result3 = $this->post('api/v1/users/7/pass?token='.$token, [
                            'oldPassword'=>'secretbasic2',
                            'password'=>'secretbasic2',
                            ])->seeJson(["result"=>"error","message"=>"invalid_venue_id"]);

        $this->assertEquals(400, $this->response->status());

        $result4 = $this->post('api/v1/users/6/pass?token='.$token, [
                            'oldPassword'=>'secretbasic2',
                            'password'=>'secretbasic2',
                            ])->seeJson(["result"=>"error","message"=>"invalid_password"]);

        $this->assertEquals(400, $this->response->status());

        $result4 = $this->post('api/v1/users/6/pass?token='.$token, [
                            'oldPassword'=>'secretbasic',
                            'password'=>'secretbasic2',
                            ])->seeJson(["result"=>"ok"]);
        
        $result5 = $this->post('api/v1/auth/login', ['email'=>'llpa+basic@test.com','password'=>'secretbasic2'])
                ->seeJsonStructure([
                 'token'
        ]);

        $this->assertEquals(200, $this->response->status());
         
    }

    public function testDeleteUser()
    {
        $result = $this->post('api/v1/auth/login', ['email'=>'aqua+basic@test.com','password'=>'secretbasic'])
                ->seeJsonStructure([
                 'token'
        ]);

        $token = '';
        
        $responseData = json_decode($this->response->getContent(), true);
        $token = $responseData['token'];
        
        $result2 = $this->delete('api/v1/users/3?token='.$token)->seeJson(['result'=>'error', 'message'=>'insufficient_privileges']);
    
       $this->assertEquals(403, $this->response->status());
  
    

    }


   public function testDeleteAdminUser()
    {
        $result = $this->post('api/v1/auth/login', ['email'=>'aqua+admin@test.com','password'=>'secretadmin'])
                ->seeJsonStructure([
                 'token'
        ]);

        $token = '';
        
        $responseData = json_decode($this->response->getContent(), true);
        $token = $responseData['token'];

         $result2 = $this->delete('api/v1/users/1?token='.$token)->seeJson(['result'=>'error', 'message'=>'cant_delete']);;

         $this->assertEquals(400, $this->response->status());
        
        
        $result2 = $this->delete('api/v1/users/7?token='.$token)->seeJson(['result'=>'ok']);

        $this->assertEquals(200, $this->response->status());

         $result2 = $this->delete('api/v1/users/6?token='.$token)->seeJson(['result'=>'error', 'message'=>'invalid_venue_id']);

         $this->assertEquals(400, $this->response->status());

         

        $result2 = $this->delete('api/v1/users/3?token='.$token)->seeJson(['result'=>'error', 'message'=>'cant_delete']);;

        $this->assertEquals(400, $this->response->status());


        
    }

    public function testListUsers()
    {
         $result = $this->post('api/v1/auth/login', ['email'=>'aqua+basic@test.com','password'=>'secretbasic'])
                ->seeJsonStructure([
                 'token'
        ]);

        $token = '';
        
        $responseData = json_decode($this->response->getContent(), true);
        $token = $responseData['token'];
        
        $result2 = $this->get('api/v1/users/?venue_id=1518&token='.$token)->seeJson(['result'=>'error', 'message'=>'insufficient_privileges']);

        $this->assertEquals(403, $this->response->status());
    }

    public function testListAdminUsers()
    {
        $result = $this->post('api/v1/auth/login', ['email'=>'aqua+admin@test.com','password'=>'secretadmin'])
                ->seeJsonStructure([
                 'token'
        ]);


        $token = '';
        
        $responseData = json_decode($this->response->getContent(), true);
        $token = $responseData['token'];
        
        $result2 = $this->get('api/v1/users/?venue_id=1518&token='.$token);

         $responseList = json_decode($this->response->getContent(), true);

        $this->assertNotEmpty($responseList);

        $this->assertEquals(200, $this->response->status());
    }
}
