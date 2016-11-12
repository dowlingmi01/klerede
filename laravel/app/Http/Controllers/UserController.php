<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
 
use App\User;
use \Hash;
use \Validator;
use \Input;
use JWTAuth;
use \Password;
use Mail;
use Gate; 
use App\Venue;
use App\Helpers\PermissionHelper;
use Illuminate\Support\Facades\Response;
 
class UserController extends Controller
{

     /**
     * The mailer instance.
     *
     * @var \Illuminate\Contracts\Mail\Mailer
     */
    protected $mailer;

    public function __construct( )
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
        if (Gate::denies('validate-venue', $input->venue_id)) {
            return Response::json(['result'=>"error", 'message'=>"invalid_venue_id"],400);
        }
        
        if (Gate::denies('has-permission', PermissionHelper::USER_MANAGE)) {
            return Response::json(['result'=>"error", 'message'=>'insufficient_privileges'],403);
        }

        $users = User::where('venue_id', $input->venue_id)->get();
        return $users;
    }

    private function getMessagesConstants(){
        return  [
            'required' => 'atribute_is_required',
            'email' => 'invalid_email_format',
            'numeric' => 'numeric_field'
        ];
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
            'first_name'       => 'required',
            'last_name'       => 'required',
            'email'      => 'required|email',
            'role_id' => 'required|numeric',
            'venue_id' => 'required|numeric'
        );
        
        $validator = Validator::make(Input::all(), $rules, $this->getMessagesConstants());
        if ($validator->fails()) {
            $messages = $validator->messages();
            return  Response::json(['result'=>'error', 'messasges'=>$messages], 400)  ;
        } 
        
        if(Gate::denies('validate-venue', $request->venue_id)){
            return Response::json(['result'=>"error", 'message'=>"invalid_venue_id"],400); ;
        }
        if (Gate::denies('has-permission', PermissionHelper::USER_MANAGE)) {
            return Response::json(['result'=>"error", 'message'=>'insufficient_privileges'],403);
        }
        //$password = generateNewPassword(); //TODO: Generar la funcion

        $user = new User;
        $user->first_name       = $request->first_name;
        $user->last_name       = $request->last_name;
        $user->email      = $request->email ;
        $user->password      = 'INVALID';
        $user->role_id = $request->role_id;
        $user->venue_id = $request->venue_id;
        $user->save();


        $view = "emails.newuser";
        $this->sendResetLink($user, $view, function ($message) {
                          $message->subject(config('app.new_user_email_subject'));

                    });

        return ['result'=>'ok', 'id'=>$user->id];
    }


    private function sendResetLink($user, $view,  $callback = null)
    {
   
      
        $token = Password::createToken($user);

        $venue = Venue::find($user->venue_id);
 
        return Mail::send($view, compact('token', 'user', 'venue'), function ($m) use ($venue, $user, $token, $callback) {
            $m->to($user->email);

            if (! is_null($callback)) {
                call_user_func($callback, $m, $user, $token);
            }
        });

        return static::RESET_LINK_SENT;
    }

     

 /**
     * Store a newly created resource in storage`with password.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeRaw(Request  $request)
    {

        $rules = array(
            'first_name'       => 'required',
            'last_name'       => 'required',
            'email'      => 'required|email',
            'role_id' => 'required|numeric',
            'venue_id' => 'required|numeric'
        );
        $validator = Validator::make(Input::all(), $rules, $this->getMessagesConstants());
        if ($validator->fails()) {
            $messages = $validator->messages();
            return  Response::json(['result'=>'error', 'messasges'=>$messages], 400)  ;
        } else {
            // store
            if (Gate::denies('validate-venue', $request->venue_id)) {
                return Response::json(['result'=>"error", 'message'=>"invalid_venue_id"],400); ;
            }
            $user = new User;
            $user->first_name       = $request->first_name;
            $user->last_name       = $request->last_name;
            $user->email      = $request->email ;
            $user->password      = Hash::make($request->password);
            $user->role_id = $request->role_id;
            $user->venue_id = $request->venue_id;
            $user->save();

            return ['result'=>'ok', 'id'=>$user->id];
        }
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
        if($user = User::find($id)){
            if (Gate::denies('validate-venue', $user->venue_id)) {
                return Response::json(['result'=>"error", 'message'=>"invalid_venue_id"],400); ;
            }
            if (Gate::denies('user-get', $id)) {
                return Response::json(['result'=>"error", 'message'=>"cant_get_user"],400); ;;
            }
            return $user;
        }
        return Response::json(['result'=>'error', 'message'=>'user_not_found'],404); 
        
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
            'email'   => 'email',
            'role_id' => 'numeric',
        );
        $validator = Validator::make(Input::all(), $rules, $this->getMessagesConstants());
        if ($validator->fails()) {
            $messages = $validator->messages();
            return  Response::json(['result'=>'error', 'messasges'=>$messages], 400)  ;
        } else {
            // store
            $user = User::find($id);
            if(!$user){
                return Response::json(['result'=>'error', 'message'=>'user_not_found'],404);
            }
            if (Gate::denies('validate-venue', $user->venue_id)) {
                return Response::json(['result'=>"error", 'message'=>"invalid_venue_id"],400); ;
            }
            if (Gate::denies('user-set', $id)) {
                return Response::json(['result'=>"error", 'message'=>'insufficient_privileges'],403);
            }
            if ($request->role_id !=0 && Gate::denies('valid-role', $request->role_id)) {
                return Response::json(['result'=>"error", 'message'=>'cant_set_role'],403);; 
            }
            $user->first_name       = trim($request->first_name) !== '' ? $request->first_name : $user->first_name;
            $user->last_name       = trim($request->last_name) !== '' ? $request->last_name : $user->last_name;
            $user->email      = trim($request->email) !== '' ? $request->email : $user->email;
            $user->role_id = $request->role_id != 0 ? $request->role_id : $user->role_id;
            $user->save();
            return ['result'=>'ok', 'id'=>$user->id];
        }
    }

    /**
     * Update password of the specified user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updatePassword(Request $request, $id)
    {
        if (Gate::denies('has-permission', PermissionHelper::USER_MANAGE)) {
            return Response::json(['result'=>'error', 'message'=>"insufficient_privileges"],403);
        }   
        $user = User::find($id);
        if(!$user){
            return Response::json(['result'=>'error', 'message'=>'user_not_found'],404);
         }
        if (Gate::denies('validate-venue', $user->venue_id)) {
            return Response::json(['result'=>"error", 'message'=>"invalid_venue_id"],400); ;
        }

        if(Hash::check($request->oldPassword, $user->password)) {
 
            $user->password = Hash::make($request->password);
            $user->save();
            return ['result'=>'ok', 'id'=>$user->id];
        } else {
            return Response::json( ['result'=>'error', 'message'=>'invalid_password'],400); ;
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
        if (Gate::denies('has-permission', PermissionHelper::USER_MANAGE)) {
            return Response::json(['result'=> 'error', 'message'=>'insufficient_privileges'], 403);
        }
        $user = User::find($id);
        if(!$user){
            return Response::json(['result'=> 'error', 'message'=>'user_not_found'],404);
        }
        if (Gate::denies('validate-venue', $user->venue_id)) {
            return Response::json(['result'=>"error", 'message'=>"invalid_venue_id"],400); 
        }
        if (Gate::denies('delete-user', $id)) {
            return Response::json(['result'=>"error", 'message'=>"cant_delete"],400); 
        }
        $result = User::destroy($id);
        return Response::json(['result' => ($result == 1 ? "ok": "error:".$result)],($result == 1 ? 200:400));
    }
}
