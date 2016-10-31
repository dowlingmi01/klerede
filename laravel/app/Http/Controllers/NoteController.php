<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
 
use Response;

 
use Gate;
use App\Tag;
use App\Note;
use App\User;
use \Hash;
use \Validator;
use \Input;
use \DB;

class NoteController extends Controller
{
    public function __construct()
    {
       $this->middleware('jwt.auth');
    }

    /**
     * Return notes between [start, end) range with tags and channels
     *
     * @param  $request->start   (yyyy-MM-ddTHH:mm:ss)
     * @param  $request->end   (yyyy-MM-ddTHH:mm:ss)
     * @param  $request->venue_id (can be 0)
     */
    public function index(Request $request){
    	$rules = array(
        	 
            'start' => 'required',
            'end' => 'required' 

        );
        $validator = Validator::make(Input::all(), $rules);
        if ($validator->fails()) {
            $messages = $validator->messages();
            return  Response::json(['result'=>'error', 'messages'=>$messages], 400);   ;
        } 
        $venues = [0];
    	if($request->venue_id != 0){
	        if(Gate::denies('validate-venue', $request->venue_id)){
	            return Response::json(['result'=>'error', 'message'=>'invalid_venue_id'], 400);
	        }
	        $venues[] = $request->venue_id;
        }
       

    	return Note::with(['channels', 'tags'])
    				->where('time_start', '>=', $request->start)
    				->where('time_end', '<', $request->end)
    				->whereIn('venue_id', $venues)
    				->get();
    }

    public function store(Request  $request)
    {
        $rules = array(
        	'header' => 'required|max:255',
            'description' => 'required',
            'time_start' => 'required',
            'time_end' => 'required',
            'all_day' => 'required'

        );
        $validator = Validator::make(Input::all(), $rules);
        if ($validator->fails()) {
            $messages = $validator->messages();
            return  Response::json(['result'=>'error', 'messages'=>$messages], 400);   ;
        } 
        //Validacion faltantes\
        //si all_day es true, no debe venir hora, y sino debe venir
        //start < end



        if($request->venue_id != 0){
	        if(Gate::denies('validate-venue', $request->venue_id)){
	            return Response::json(['result'=>'error', 'message'=>'invalid_venue_id'], 400);
	        }
        }
        //TODO: Check permission to creat a global note

        $note = new Note;
        $note->header       = $request->header;
        $note->description       = $request->description;
        $note->all_day       = $request->all_day;
        $note->time_start       = $request->time_start;
        $note->time_end       = $request->time_end;
        $note->owner_id       = \Auth::user()->id;  
        $note->last_editor_id       = $note->owner_id;  
        $note->venue_id = trim($request->venue_id) !== '' ? $request->venue_id : 0;
        DB::beginTransaction();
        try{ 
        	$tagsId = $request->tags;
        	if(is_array($request->new_tags) && count($request->new_tags) > 0){
        		foreach ($request->new_tags as $tagMame) {
        			$tag = new Tag;
			        $tag->description       = $tagMame;
			        $tag->owner_id       =  $note->owner_id;  
			        $tag->venue_id = $note->venue_id;
			        try{ 
			            $tag->save();
			        } catch (\Illuminate\Database\QueryException $e){
			            $errorCode = $e->errorInfo[1];
			            if($errorCode == 1062){
			                return Response::json(['result'=>'error', 'message'=>'duplicate_entry', 'entity'=>'tag'], 400);
			            } else {
			                return Response::json(['result'=>'error', 'message'=>$e->getMessage()], 400);
			            }
			        }
			        $tagsId[] = $tag->id;
        		}
        	}
        	 
            $note->save();
            $note->channels()->attach($request->channels);
            $note->tags()->attach($tagsId);
            $note->save();
        } catch (\Illuminate\Database\QueryException $e){
            DB::rollBack();	
            $errorCode = $e->errorInfo[1];
            if($errorCode == 1062){
                return Response::json(['result'=>'error', 'message'=>'duplicate_entry', 'entity'=>'note'], 400);
            } else {
                return Response::json(['result'=>'error', 'message'=>$e->getMessage()], 400);
            }
        }
        DB::commit();
        return ['result'=>'ok', 'id'=>$note->id];
    }


    public function update(Request  $request, $id)
    {
        $rules = array(
        	'header' => 'required|max:255',
            'description' => 'required',
            'time_start' => 'required',
            'time_end' => 'required',
            'all_day' => 'required'

        );
        $validator = Validator::make(Input::all(), $rules);
        if ($validator->fails()) {
            $messages = $validator->messages();
            return  Response::json(['result'=>'error', 'messages'=>$messages], 400);   ;
        } 
        //Validacion faltantes\
        //si all_day es true, no debe venir hora, y sino debe venir
        //start < end



        if($request->venue_id != 0){
	        if(Gate::denies('validate-venue', $request->venue_id)){
	            return Response::json(['result'=>'error', 'message'=>'invalid_venue_id'], 400);
	        }
        }
        //TODO: Check permission to update a global note

        DB::beginTransaction();
        $note = Note::find($id);
        if(!$note){
            return Response::json(['result'=> 'error', 'message'=>'note_not_found'],404);
        }
        $note->header       = $request->header;
        $note->description       = $request->description;
        $note->all_day       = $request->all_day;
        $note->time_start       = $request->time_start;
        $note->time_end       = $request->time_end;
        $note->last_editor_id       = \Auth::user()->id;
      
        
        try{ 
        	$tagsId = $request->tags;
        	if(is_array($request->new_tags) && count($request->new_tags) > 0){
        		foreach ($request->new_tags as $tagMame) {
        			$tag = new Tag;
			        $tag->description       = $tagMame;
			        $tag->owner_id       =  $note->owner_id;  
			        $tag->venue_id = $note->venue_id;
			        try{ 
			            $tag->save();
			        } catch (\Illuminate\Database\QueryException $e){
			            $errorCode = $e->errorInfo[1];
			            if($errorCode == 1062){
			                return Response::json(['result'=>'error', 'message'=>'duplicate_entry', 'entity'=>'tag'], 400);
			            } else {
			                return Response::json(['result'=>'error', 'message'=>$e->getMessage()], 400);
			            }
			        }
			        $tagsId[] = $tag->id;
        		}
        	}
        	 
            $note->save();
            $note->channels()->sync($request->channels);
            $note->tags()->sync($tagsId);
            $note->save();
        } catch (\Illuminate\Database\QueryException $e){
            DB::rollBack();	
            $errorCode = $e->errorInfo[1];
            if($errorCode == 1062){
                return Response::json(['result'=>'error', 'message'=>'duplicate_entry', 'entity'=>'note'], 400);
            } else {
                return Response::json(['result'=>'error', 'message'=>$e->getMessage()], 400);
            }
        }
        DB::commit();
        return ['result'=>'ok', 'id'=>$note->id];
    }

     /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
       if($note = Note::with(['channels','tags'])->find($id)){
            if($note->venue_id != 0){
		        if (Gate::denies('validate-venue', $note->venue_id)) {
		            return Response::json(['result'=>'error', 'message'=>'invalid_venue_id'], 400);
		        }
	    	} 
	             
            return $note;
        }
        Response::json(['result'=> 'error', 'message'=>'note_not_found'], 404);
    }

    public function destroy($id)
    {
         
        $note = Note::find($id);
        if(!$note){
            return Response::json(['result'=> 'error', 'message'=>'note_not_found'], 404);
        }
        if($tag->venue_id != 0){
	        if (Gate::denies('validate-venue', $tag->venue_id)) {
	            return Response::json(['result'=>'error', 'message'=>'invalid_venue_id'], 400);
	        }
    	} else {
    		//TOOD: Who can delete global notes?
    	}
        
        //TODO: check permission for delete somebody elses note

        $result = Note::destroy($id);
        return ['result' => ($result == 1 ? "ok": "error:".$result)];
    }
}
