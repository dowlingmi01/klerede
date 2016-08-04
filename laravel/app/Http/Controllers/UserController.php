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


/*


HTTP Verb   CRUD    Entire Collection (e.g. /customers) Specific Item (e.g. /customers/{id})
POST    Create  201 (Created), 'Location' header with link to /customers/{id} containing new ID.    404 (Not Found), 409 (Conflict) if resource already exists..

GET Read    200 (OK), list of customers. Use pagination, sorting and filtering to navigate big lists.   200 (OK), single customer. 404 (Not Found), if ID not found or invalid.

PUT Update/Replace  404 (Not Found), unless you want to update/replace every resource in the entire collection. 200 (OK) or 204 (No Content). 404 (Not Found), if ID not found or invalid.

PATCH   Update/Modify   404 (Not Found), unless you want to modify the collection itself.   200 (OK) or 204 (No Content). 404 (Not Found), if ID not found or invalid.

DELETE  Delete  404 (Not Found), unless you want to delete the whole collection—not often desirable.    200 (OK). 404 (Not Found), if ID not found or invalid.

*/


public function __construct()
   {
       // Apply the jwt.auth middleware to all methods in this controller
       // except for the authenticate method. We don't want to prevent
       // the user from retrieving their token if they don't already have it
       //$this->middleware('jwt.auth');
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
            return ['result' => 'error'];
            /*return Redirect::to('users/create')
                ->withErrors($validator)
                ->withInput(Input::except('password'));*/
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
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {

         $rules = array(
            'name'       => 'required',
            'email'      => 'required|email',
          
            'role_id' => 'required|numeric',
            'venue_id' => 'required|numeric'
        );
        $validator = Validator::make(Input::all(), $rules);
        if ($validator->fails()) {
            return ['result' => 'error1'];
            /*return Redirect::to('users/create')
                ->withErrors($validator)
                ->withInput(Input::except('password'));*/
        } else {
            // store
            $user = User::find($id);
            $user->name       = $request->name;
            $user->email      = $request->email ;
            
            $origPassword = $user->password;
            if(trim($request->password) !== ''){
                $user->password = $origPassword;
            } else {
                $user->password = Hash::make($request->password);
            }

            $user->role_id = $request->role_id ;
            $user->venue_id = $request->venue_id; 
            $user->save();

            // redirect
         
            return ['result'=>'ok', 'id'=>$user->id, 'pass'=>'|'.$request->password.'|'.$user->password.'|'];
        }


       // $userUpdate=\Request::all();
      //  return $request;

        /*
        $user=User::find($id);
        $origPassword = $user->password;
        if($userUpdate->password !== ''){
            $userUpdate->password = $origPassword;
        } else {
            $userUpdate->password = Hash::make($userUpdate->password);
        }
        $result = $user->update($userUpdate);
        return ['result' => $result];   
    */
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

     /**
     * Change role of the specified user.
     *
     * @param  int  $id
     * @param  int  $role_id
     * @return \Illuminate\Http\Response
     */
    public function changeRole($id, $role_id)
    {
        //check $id distinct to logged user
        //check venue_id
        $user = User::findOrFail($id);
        $user->role_id = $role_id;
        $result = $user->save();
        return ['result' => ($result == 1 ? "ok": "error:".$result)];
    }
}
