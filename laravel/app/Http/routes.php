<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

use App\StoreTransaction;

Route::get('/', 'WelcomeController@index');

Route::get('home', 'HomeController@index');

Route::controllers([
	'auth' => 'Auth\AuthController',
	'password' => 'Auth\PasswordController',
]);

Route::group(['prefix'=>'api/v1'], function() {
	Route::get('query/store_transactions', function() {
		$input = Request::all();
		$input = (object) $input;
		if(isset($input->member))
			$input->member = filter_var($input->member, FILTER_VALIDATE_BOOLEAN);
		$result = StoreTransaction::queryF($input);
		return Response::json($result);
	});
});
