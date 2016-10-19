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
