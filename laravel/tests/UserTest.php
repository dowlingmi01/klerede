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



        $this->json('POST', 'api/v1/auth/login', ['email'=>'aqua+owner@test.com','password'=>'secretowner'])
             ->seeJsonStructure([
                 'token'
             ]);
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
    }

    public function testCreateUser()
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
    }
}
