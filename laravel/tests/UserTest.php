<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model as Eloquent;

class UserTest extends TestCase
{



    public static function setUpBeforeClass()
    {
        $app->withEloquent();
        User::with('email', '=', '1518+owner@test.com')->delete();
        User::with('email', '=', '1588+owner@test.com')->delete();
        User::with('email', '=', '1518+admin@test.com')->delete();
        User::with('email', '=', '1588+admin@test.com')->delete();


        $users = array(
                [ 'first_name' => '1518 Test', 'last_name' => 'Owner', 'email' => '1518+owner@test.com', 'password' => Hash::make('secretowner'), 'venue_id' => 1518, 'role_id' => 1],
                ['first_name' => '1588 Test', 'last_name' => 'Owner', 'email' => '1588+owner@test.com', 'password' => Hash::make('secretowner'), 'venue_id' => 1588, 'role_id' => 1],
                ['first_name' => '1518 Test', 'last_name' => 'Admin', 'email' => '1518+admin@test.com', 'password' => Hash::make('secretadmin'), 'venue_id' => 1518, 'role_id' => 2],
                ['first_name' => '1588 Test', 'last_name' => 'Admin', 'email' => '1588+admin@test.com', 'password' => Hash::make('secretadmin'), 'venue_id' => 1588, 'role_id' => 2],
        );

        // Loop through each user above and create the record for them in the database
        foreach ($users as $user)
        {
            User::create($user);
        }
    }

    public static function xtearDownAfterClass(){
        parent::tearDown();
         User::with('email', '=', '1518+owner@test.com')->delete();
        User::with('email', '=', '1588+owner@test.com')->delete();
        User::with('email', '=', '1518+admin@test.com')->delete();
        User::with('email', '=', '1588+admin@test.com')->delete();


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



        $this->json('POST', 'api/v1/auth/login', ['email'=>'1518+owner@test.com','password'=>'secretowner'])
             ->seeJsonStructure([
                 'token'
             ]);
    }

    public function testLogged()
    {
        //$result = $this->json('POST', 'api/v1/auth/login', ['email'=>'aqua+owner@klerede.com','password'=>'secretowner']);
        

        $result = $this->post('api/v1/auth/login', ['email'=>'1518+owner@test.com','password'=>'secretowner'])
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
    }

    public function testCreateUser()
    {
        //$result = $this->json('POST', 'api/v1/auth/login', ['email'=>'aqua+owner@klerede.com','password'=>'secretowner']);
        

        $result = $this->post('api/v1/auth/login', ['email'=>'1518+owner@test.com','password'=>'secretowner'])
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
    }
}
