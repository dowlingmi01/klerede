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

use App\Category;
use App\GoalsSales;
use App\StoreTransaction, App\Stats, App\Channel;
use App\WeatherDaily;
use App\Helpers\PermissionHelper;
 
Route::get('/', 'WelcomeController@index');

Route::get('home', 'HomeController@index');

Route::group(['prefix'=>'api/v1'], function() {
	Route::post('stats/query', function() {
		$input = Request::all();
        if (Gate::denies('validate-venue', $input['venue_id'])) {
            return Response::json(['result'=> 'error', 'message'=>"invalid_venue_id"],400);
        }
		$result = Stats::queryMulti($input['venue_id'], $input['queries']);
		return Response::json($result);
	})->middleware(['jwt.auth']);
	Route::resource('venue', 'VenueController',
		['only' => ['show']]);
	Route::get('weather/query', function() {
		$input = (object) Request::all(); 
        if (Gate::denies('validate-venue', $input->venue_id)) {
            return Response::json(['result'=> 'error', 'message'=>"invalid_venue_id"],400);
        }
		if(isset($input->hourly))
			$input->hourly = filter_var($input->hourly, FILTER_VALIDATE_BOOLEAN);
		else
			$input->hourly = false;
		$result = WeatherDaily::queryD($input);
		return Response::json($result);
	})->middleware(['jwt.auth']);
	Route::get('goals/sales/{venue_id}/{year}', function($venue_id, $year) {
        if (Gate::denies('validate-venue', $venue_id)) {
            return Response::json(['result'=> 'error', 'message'=>"invalid_venue_id"],400);
        }
		return Response::json(GoalsSales::get($venue_id, $year));
	})->middleware(['jwt.auth']);;
	Route::put('goals/sales/{venue_id}/{year}/{channel}/{type}/{sub_channel?}',
		function($venue_id, $year, $channel, $type, $sub_channel = null) {
        if (Gate::denies('validate-venue', $venue_id)) {
            return Response::json(['result'=> 'error', 'message'=>"invalid_venue_id"],400);
        }
        if (Gate::denies('has-permission', PermissionHelper::GOALS_SET)) {
            return Response::json(['result'=> 'error', 'message'=>"insufficient_privileges"],400);  
        }
		$months = Request::input('months');
		return Response::json(GoalsSales::set($venue_id, $year, $channel, $type, $sub_channel, $months));
	})->middleware(['jwt.auth']);

	Route::post('auth/login', 'AuthenticateController@authenticate');
	Route::get('auth/logged', 'AuthenticateController@getAuthenticatedUser');
	Route::post('auth/logout', 'AuthenticateController@invalidate');
	Route::post('auth/recovery', 'AuthenticateController@recovery');
	Route::post('auth/reset', 'AuthenticateController@reset');
	Route::get('auth/ven', 'AuthenticateController@getVenueId');

	Route::resource('users', 'UserController', ['except' => ['create', 'edit' ]]);
	Route::resource('tags', 'TagController',  ['only' => ['index', 'show', 'store', 'destroy']]);
	Route::resource('notes', 'NoteController',  ['except' => ['create', 'edit' ]]);
	Route::post('users/{user_id}/pass', 'UserController@updatePassword');

	Route::resource('roles', 'RoleController', ['only' => ['index']]);

	Route::controller('import', 'ImportController');


	Route::get('testimportcat', function(){
		Category::import();
	});


	Route::get('channels', function() {
		//FIXME: Move to own controller
		return Response::json(Channel::all());
	});

});

Route::get('dashboard', function()
{
    return View::make('dashboard', ['ga_id'=>config('app.ga_id')]);
});

Route::get('settings', function()
{
    return View::make('settings', ['ga_id'=>config('app.ga_id')]);
});

Route::get('goals', function()
{
    return View::make('goals', ['ga_id'=>config('app.ga_id')]);
});

Route::get('faqs', function()
{
    return View::make('faqs', ['ga_id'=>config('app.ga_id')]);
});

Route::get('login', function()
{
    return View::make('login', ['ga_id'=>config('app.ga_id')]);
});
