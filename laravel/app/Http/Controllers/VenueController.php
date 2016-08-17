<?php namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Stats;
use App\Venue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Gate;

class VenueController extends Controller {


	public function __construct()
    {
       // Apply the jwt.auth middleware to all methods in this controller
       // except for the authenticate method. We don't want to prevent
       // the user from retrieving their token if they don't already have it
       $this->middleware('jwt.auth');
    }



	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
        if (Gate::denies('validate-venue', $id)) {
            return Response::json(["error"=>"Invalid venue id"]);
        }
		$venue = Venue::find($id);
		$venue->stats_last_date = Stats::lastDate($id);
		return Response::json($venue);
	}
}
