<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Middleware\GetUserFromToken;
use App\User;

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
            return parent::handle($request, $next);
        } else {
            //$user = $this->auth->byId(config('jwt.mock_user_id'));
            $user = User::find(config('jwt.mock_user_id'));
            $this->events->fire('tymon.jwt.valid', $user);
            return $next($request);
        }
    }
}
