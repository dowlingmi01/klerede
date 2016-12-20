<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Middleware\GetUserFromToken;
use App\User;
use Illuminate\Support\Facades\Response;


class GetUserFromTokenCustom extends GetUserFromToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if(config('jwt.active')){
            $result = parent::handle($request, $next);
            return $result;
            /*if($result->status() >= 400){
                $responseData = json_decode($result->content(), true);
                if($responseData == null)  {
                    return Response::json(['result'=>'error'], 500);
                }
                if(array_key_exists ( 'error' , $responseData )){
                    return Response::json(['result'=>'error', 'message'=>$responseData['error']], $result->status())  ;
                } else {
                    return $result;
                }
            } else {
                return  $result;
            }*/
            
 
        } else {
            //$user = $this->auth->byId(config('jwt.mock_user_id'));
            $user = User::find(config('jwt.mock_user_id'));
            $this->events->fire('tymon.jwt.valid', $user);
            return $next($request);
        }
    }
}
