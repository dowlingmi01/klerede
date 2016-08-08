<?php 
namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use JWTAuth;

class JwtAuthGuardServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
    /**
     * Boot the authentication services for the application.
     *
     * @return void
     */
    public function boot()
    {
        $this->app['auth']->extend('jwt-auth', function ($app, $name, array $config) {
            $guard = new JwtAuthGuard(
                JWTAuth,
                $app['auth']->createUserProvider($config['provider']),
                $app['request']
            );
            $app->refresh('request', $guard, 'setRequest');
            return $guard;
        });
    }
}