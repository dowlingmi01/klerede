<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use Tymon\JWTAuthExceptions\JWTException;
use App\User;
use \Validator;
use \Password;
use \Input;
use Illuminate\Mail\Message;
use \Config;
use \Hash;


class AuthenticateController extends Controller
{

    public function __construct()
    {
       // Apply the jwt.auth middleware to all methods in this controller
       // except for the authenticate method. We don't want to prevent
       // the user from retrieving their token if they don't already have it
       $this->middleware('jwt.auth', ['except' => ['authenticate', 'recovery', 'reset']]);
    }

    public function authenticate(Request $request)
    {
        
        $credentials = $request->only('email', 'password');

        try {
            // verify the credentials and create a token for the user
            if (!$user = User::whereEmail($credentials['email'])->first()) {
                return response()->json(['user_not_found'], 404);
            }

            $claims = ['ven' =>$user->venue_id, 'rol' =>$user->role_id];
            if (! $token = JWTAuth::attempt($credentials, $claims)) {
                return response()->json(['error' => 'invalid_credentials'], 401);
            }
        } catch (JWTException $e) {
            // something went wrong
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        // if no errors are encountered we can return a JWT
        return response()->json(compact('token'));
    }

    public function getVenueId(){
        return JWTAuth::parseToken()->getPayload()->get('ven');
    }

    public function getAuthenticatedUser()
	{

		if(config('jwt.active')){
		    try {

		        if (! $user = JWTAuth::parseToken()->authenticate()) {
		            return response()->json(['user_not_found'], 404);
		        }

		    } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {

		        return response()->json(['token_expired'], $e->getStatusCode());

		    } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {

		        return response()->json(['token_invalid'], $e->getStatusCode());

		    } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {

		        return response()->json(['token_absent'], $e->getStatusCode());

		    }

		    // the token is valid and we have found the user via the sub claim

		} else {
			if (!$user = User::find(config('jwt.mock_user_id'))) {
		        return response()->json(['user_not_found'], 404);
		     }
		}
		return response()->json(compact('user'));
	}



    public function invalidate(Request $request)
    {
        if(config('jwt.active')){
            $response = JWTAuth::parseToken()->invalidate();
            return response()->json($response);
        } else {
            return ['result'=>'ok'];
        }
    }

    public function recovery(Request $request)
    {
        $validator = Validator::make($request->only('email'), [
            'email' => 'required'
        ]);
        if($validator->fails()) {
            throw new ValidationHttpException($validator->errors()->all());
        }
        $response = Password::sendResetLink($request->only('email'), function (Message $message) {
            $message->subject(config('app.recovery_email_subject'));
        });
        switch ($response) {
            case Password::RESET_LINK_SENT:
                return "sent";
            case Password::INVALID_USER:
                return response()->json(['result'=>'error', 'message'=>'user_not_found'], 404);
        }
    }

    public function reset(Request $request)
    {
        $credentials = $request->only(
            'email', 'password', 'token'
        );
        $validator = Validator::make($credentials, [
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required',
        ]);
        if($validator->fails()) {
            throw new ValidationHttpException($validator->errors()->all());
        }
        $credentials['password_confirmation'] = $credentials['password']; //Hack: PasswordBroker validates confirm password;

        $response = Password::reset($credentials, function ($user, $password) {
            $user->password = Hash::make($password);
            $user->save();
        });

        switch ($response) {
            case Password::PASSWORD_RESET:
                if(Config::get('boilerplate.reset_token_release')) {
                    return $this->authenticate($request);
                }
                return ['result'=>'ok', 'message'=>'password_reseted'];
            default:
                return ['result'=>'error', 'message'=>'could_not_reset_password'] ;
        }
    }
}

