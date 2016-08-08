<?php 
namespace App\Providers;

use Illuminate\Contracts\Auth\Access\Gate as GateContract;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class VenueGateServiceProvider extends ServiceProvider
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
     * Register any application authentication / authorization services.
     *
     * @param  \Illuminate\Contracts\Auth\Access\Gate  $gate
     * @return void
     */
    public function boot(GateContract $gate)
    {
        $this->registerPolicies($gate);

        $gate->define('venue-access', function ($user, $venue_id) {
            return $user->venue_id == $venue_id;
        });
    }
}