<?php namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Stats;
use App\Venue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class VenueController extends Controller {

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		$venue = Venue::find($id);
		$venue->stats_last_date = Stats::lastDate($id);
		return Response::json($venue);
	}
}
