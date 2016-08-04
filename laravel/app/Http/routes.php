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

use App\GoalsSales;
use App\StoreTransaction, App\Stats;
use App\WeatherDaily;


Route::get('/', 'WelcomeController@index');

Route::get('home', 'HomeController@index');


/*
Route::controllers([
	'auth' => 'Auth\AuthController',
	'password' => 'Auth\PasswordController',
]);

*/

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
	Route::resource('venue', 'VenueController',
		['only' => ['show']]);
	Route::get('weather/query', function() {
		$input = (object) Request::all();
		if(isset($input->hourly))
			$input->hourly = filter_var($input->hourly, FILTER_VALIDATE_BOOLEAN);
		else
			$input->hourly = false;
		$result = WeatherDaily::queryD($input);
		return Response::json($result);
	});
	Route::get('goals/sales/{venue_id}/{year}', function($venue_id, $year) {
		return Response::json(GoalsSales::get($venue_id, $year));
	});
	Route::put('goals/sales/{venue_id}/{year}/{channel}/{type}/{sub_channel?}',
		function($venue_id, $year, $channel, $type, $sub_channel = null) {
		$months = Request::input('months');
		return Response::json(GoalsSales::set($venue_id, $year, $channel, $type, $sub_channel, $months));
	});


    //pruebas
	//Route::resource('authenticate', 'AuthenticateController', ['only' => ['index']]);
	Route::post('auth/login', 'AuthenticateController@authenticate');
	Route::get('auth/logged', 'AuthenticateController@getAuthenticatedUser')->middleware('jwt.auth');
	//Route::get('auth/user', 'AuthenticateController@getAuthenticatedUser')->middleware('jwt.auth');
	//Route::get('auth/user', 'UserController@index');	
	Route::resource('users', 'UserController', ['except' => ['create', 'edit', 'update']]);
	Route::post('users/{user_id}', 'UserController@update');
	Route::resource('roles', 'RoleController', ['only' => ['index']]);//->middleware('jwt.auth');
	Route::post('users/role/{user_id}/{role_id}', 'UserController@changeRole');


	//Route::post('logout', 'AuthenticateController@logout');
	Route::controller('import', 'ImportController');
});

Route::get('dashboard', function()
{
    return View::make('dashboard');
});

Route::get('settings', function()
{
    return View::make('settings');
});

Route::get('goals', function()
{
    return View::make('goals');
});

Route::get('help', function()
{
    return View::make('help');
});
