<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Response;

use App\Http\Requests;
use Gate;
use App\Tag;
use App\User;
use \Hash;
use \Validator;
use \Input;
use App\Helpers\PermissionHelper;
 
 

class TagController extends Controller
{
    public function __construct()
    {
       $this->middleware('jwt.auth');
    }

    public function index(Request $request)
    {
        $input = (object) $request->all();
        if(trim($request->venue_id) !== '' && $input->venue_id != 0){
	        if (Gate::denies('validate-venue', $input->venue_id)) {
	            return Response::json(['result'=>'error', 'message'=>'invalid_venue_id'], 400);
	        }
 	        $tags = Tag::where('venue_id', $input->venue_id)->orWhere('venue_id', 0)->orderBy('description')->get();
 	    } else {
	    	$tags = Tag::where('venue_id', 0)->orderBy('description')->get();
	        
	    }
	    return $tags;
    }

    public function store(Request  $request)
    {

         
        $rules = array(
            'description' => 'required'
        );
        $validator = Validator::make(Input::all(), $rules);
        if ($validator->fails()) {
            $messages = $validator->messages();
            return  Response::json(['result'=>'error', 'messages'=>$messages], 400);
        } 
         
        if(Gate::denies('validate-venue', $request->venue_id)){
            return Response::json(['result'=>'error', 'message'=>'invalid_venue_id'], 400);
        }
        
      
        $tag = new Tag;
        $tag->description       = $request->description;
        $tag->owner_id       = \Auth::user()->id;  
        $tag->venue_id = trim($request->venue_id) !== '' ? $request->venue_id : 0;
        try{ 
            $tag->save();
        } catch (\Illuminate\Database\QueryException $e){
            $errorCode = $e->errorInfo[1];
            if($errorCode == 1062){
                return Response::json(['result'=>'error', 'message'=>'duplicate_entry'], 400);
            } else {
                return Response::json(['result'=>'error', 'message'=>$e->getMessage()], 400);
            }
        }
        return ['result'=>'ok', 'id'=>$tag->id];
    }

    public function show($id)
    {
        
        if($tag = Tag::find($id)){
            if($tag->venue_id != 0){
		        if (Gate::denies('validate-venue', $tag->venue_id)) {
		            return Response::json(['result'=>'error', 'message'=>'invalid_venue_id'], 400);
		        }
	    	} 
	             
            return $tag;
        }
        Response::json(['result'=> 'error', 'message'=>'tag_not_found'], 404);
        
    }

    public function destroy($id)
    {
       
        $tag = Tag::find($id);
        if(!$tag){
            return Response::json(['result'=> 'error', 'message'=>'tag_not_found'], 404);
        }

        if ($tag->owner_id != \Auth::user()->id && Gate::denies('has-permission', PermissionHelper::NOTE_MANAGE)) {
            return  Response::json(['result'=>'error', 'messages'=>'insufficient_privileges'], 403); 
        }

      
        if (Gate::denies('validate-venue', $tag->venue_id)) {
            return Response::json(['result'=>'error', 'message'=>'invalid_venue_id'], 400);
        }

 
        $canDelete = 1;
        if(trim($request->merge_to) !== ''){
            $merge_to = (int)$request->merge_to;
            $notes = $tag->notes();
            foreach ($notes as $note) {
                $note->detach($id);
                $note->attach($merge_to);
                $note->save();
            }

        } else {
            if($tag->notes()->count() > 0){
                return Response::json(['result' => 'error', 'message' => 'used_tag'], 400);
            }
        }

        $result = Tag::destroy($id);
        return Response::json(['result' => ($result == 1 ? "ok": "error", 'message'=>($result == 1 ? "": $result)], ($result == 1 ? 200: 400);
     }
 }



 