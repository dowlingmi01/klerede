<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use Gate;
use App\Tag;

class TagController extends Controller
{
    public function __construct()
    {
       $this->middleware('jwt.auth');
    }

    public function index(Request $request)
    {
        $input = (object) $request->all();
        if($input->venue_id != 0){
	        if (Gate::denies('validate-venue', $input->venue_id)) {
	            return Response::json(['result'=>'error', 'message'=>'invalid_venue_id'], 400);
	        }
	        
	        $tags = Tag::where('venue_id', $input->venue_id)->orWhere('venue_id', 0)-orderBy('description');->get();
	        return $tags;
	    } else {
	    	Tag::where('venue_id', 0)-orderBy('description');->get();
	        return $tags;
	    }
    }

    public function store(Request  $request)
    {

        $rules = array(
            'description'       => 'required'
           
        );
        $validator = Validator::make(Input::all(), $rules);
        if ($validator->fails()) {
            $messages = $validator->messages();
            return  Response::json(['result'=>'error', 'message'=>$messages], 400);   ;
        } 
         if($request->venue_id != 0){
	        if(Gate::denies('validate-venue', $request->venue_id)){
	            return Response::json(['result'=>'error', 'message'=>'invalid_venue_id'], 400);
	        }
         
        //$password = generateNewPassword(); //TODO: Generar la funcion

        $tag = new Tag;
        $tag->description       = $request->description;
        $tag->owner_id       = 1;
        $tag->last_editor_id      = 1 ;
        $tag->venue_id = trim($request->venue_id) !== '' ? $request->venue_id : 0;
        $tag->save();


   

        return ['result'=>'ok', 'id'=>$tag->id];
    }
}
