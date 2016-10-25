<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Http\Request;
use Response;

use App\Http\Requests;
use Gate;
use App\Tag;
use App\User;
use \Hash;
use \Validator;
use \Input;

class NoteController extends Controller
{
    public function __construct()
    {
       $this->middleware('jwt.auth');
    }
/*
 $table->increments('id');
            $table->string('header');
            $table->text('description');
            $table->boolean('all_day');

            $table->dateTime('time_start');
            $table->dateTime('time_end');
            $table->integer('owner_id');
            $table->integer('last_editor_id');
            $table->integer('venue_id');
            $table->timestamps();
            $table->index(['venue_id', 'time_start']);
        });
        */

    public function store(Request  $request)
    {
        $rules = array(
        	'header' => 'required|max:255',
            'description' => 'required',
            'all_day' => 'required'

        );
        $validator = Validator::make(Input::all(), $rules);
        if ($validator->fails()) {
            $messages = $validator->messages();
            return  Response::json(['result'=>'error', 'messages'=>$messages], 400);   ;
        } 
         if($request->venue_id != 0){
	        if(Gate::denies('validate-venue', $request->venue_id)){
	            return Response::json(['result'=>'error', 'message'=>'invalid_venue_id'], 400);
	        }
        }
        //$password = generateNewPassword(); //TODO: Generar la funcion

        $note = new Note;
        $note->header       = $request->header;
        $note->description       = $request->description;
        $note->all_day       = $request->all_day;
        $note->time_start       = $request->time_start;
        $note->time_end       = $request->time_end;
        $note->owner_id       = \Auth::user()->id;  
        $note->last_editor_id       = $note->owner_id;  
        $note->venue_id = trim($request->venue_id) !== '' ? $request->venue_id : 0;
        try{ 
            $note->save();
        } catch (\Illuminate\Database\QueryException $e){
            $errorCode = $e->errorInfo[1];
            if($errorCode == 1062){
                return Response::json(['result'=>'error', 'message'=>'duplicate_entry'], 400);
            } else {
                return Response::json(['result'=>'error', 'message'=>$e->getMessage()], 400);
            }
        }
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
       if($note = Note::find($id)){
            if($note->venue_id != 0){
		        if (Gate::denies('validate-venue', $note->venue_id)) {
		            return Response::json(['result'=>'error', 'message'=>'invalid_venue_id'], 400);
		        }
	    	} 
	             
            return $note;
        }
        Response::json(['result'=> 'error', 'message'=>'note_not_found'], 404);
    }
}
