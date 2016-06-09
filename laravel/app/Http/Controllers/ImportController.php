<?php

namespace App\Http\Controllers;

use App\ImportQuery;
use Carbon\Carbon;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Response;

class ImportController extends Controller {
	public function getQuery() {
		$venue_id = Request::input('venue_id');
		$last_query_id = Request::input('last_query_id');
		$import_query = ImportQuery::where('venue_id', $venue_id)->where('status', 'pending')
			->where('id', '>', $last_query_id)->where('run_after', '<', Carbon::now())->first();
		if($import_query) {
			$import_query->time_requested = Carbon::now();
			$import_query->save();
			$result = ['query_id' => $import_query->id, 'query_text' => $import_query->query_text];
		} else {
			$result = ['query_id' => 0];
		}
		return Response::json($result);
	}
	public function postQueryResult() {
		$file = Request::file('file');
		$import_query = ImportQuery::find(Request::input('query_id'));
		$import_query->received($file);
		return Response::json(['status' => 0]);
	}
	public function postSessionLog() {
		$venue_id = Request::input('venue_id');
		$file = Request::file('file');
		$file->move(ImportQuery::getDir() . '/logs/' . $venue_id, Carbon::now()->format('Y-m-d\THis') . '.log');
		return Response::json(['status' => 0]);
	}
}
