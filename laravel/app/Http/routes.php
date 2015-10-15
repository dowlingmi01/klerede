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

use App\StoreTransaction, App\Stats;

Route::get('/', 'WelcomeController@index');

Route::get('home', 'HomeController@index');

Route::controllers([
	'auth' => 'Auth\AuthController',
	'password' => 'Auth\PasswordController',
]);

Route::group(['prefix'=>'api/v1'], function() {
	Route::resource('store-product-category-group', 'StoreProductCategoryGroupController');
	Route::get('query/store_transactions', function() {
		$input = Request::all();
		$input = (object) $input;
		if(isset($input->member))
			$input->member = filter_var($input->member, FILTER_VALIDATE_BOOLEAN);
		$result = StoreTransaction::queryF($input);
		return Response::json($result);
	});
	Route::post('stats/query', function() {
		$input = Request::all();
		$result = Stats::queryMulti($input['venue_id'], $input['queries']);
		return Response::json($result);
	});
	Route::get('weather/query', function() {
		$input = (object) Request::all();
		$result = \App\WeatherDaily::queryD($input);
		return Response::json($result);
	});
});

Route::get('dashboard', function()
{
    return View::make('dashboard');
});