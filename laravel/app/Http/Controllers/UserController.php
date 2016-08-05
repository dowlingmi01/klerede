<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\User;
use \Hash;
use \Validator;
use \Input;



class UserController extends Controller
{
 

public function __construct()
   {
       // Apply the jwt.auth middleware to all methods in this controller
       // except for the authenticate method. We don't want to prevent
       // the user from retrieving their token if they don't already have it
       $this->middleware('jwt.auth');
   }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
         
        $input = (object) $request->all();
        $users = User::where('venue_id', $input->venue_id)->get();
        return $users;
    }

    
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request  $request)
    {

        $rules = array(
            'name'       => 'required',
            'email'      => 'required|email',
          
            'role_id' => 'required|numeric',
            'venue_id' => 'required|numeric'
        );
        $validator = Validator::make(Input::all(), $rules);
        if ($validator->fails()) {
            $messages = $validator->messages();
            $messages->add("result", "error");
            return  $messages  ;
        } else {
            // store
            $user = new User;
            
            $user->name       = $request->name;
            $user->email      = $request->email ;
            $user->password      = Hash::make($request->password);
            $user->role_id = $request->role_id ;
            $user->venue_id = $request->venue_id; 
            $user->save();

            // redirect
         
            return ['result'=>'ok', 'id'=>$user->id];
        }



        //$input = (object) $request->all();
       // $input->password = Hash::make($input->password);
        //User::create($input);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //TODO: only autorized venue and user by role
        return User::find($id);

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //Not implemented
    }

    /**
     * Update the specified resource in storage.
     * Password is not updated
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {

         $rules = array(
             
            'email'      => 'email',
            'role_id' => 'numeric',
            
        );
        $validator = Validator::make(Input::all(), $rules);
        if ($validator->fails()) {
            $messages = $validator->messages();
            $messages->add("result", "error");
            return  $messages  ;
         
        } else {
            // store
            $user = User::find($id);
            if(!$user){
                return ['result'=> 'error', 'message'=>'User not found'];
            }
            $user->name       = trim($request->name) !== '' ? $request->name : $user->name;
            $user->email      = trim($request->email) !== '' ? $request->email : $user->email;
            $user->password      = trim($request->password) !== '' ? Hash::make($request->password) : $user->password;
            $user->role_id = $request->role_id != 0 ? $request->role_id : $user->role_id;
             
            $user->save();
            return ['result'=>'ok', 'id'=>$user->id];
        }

    }

    
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //check $id distinct to logged user
        //check venue_id
        $result = User::destroy($id);
        return ['result' => ($result == 1 ? "ok": "error:".$result)];
    }

    
}
