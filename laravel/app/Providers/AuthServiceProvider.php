<?php

namespace App\Providers;

use Illuminate\Contracts\Auth\Access\Gate as GateContract;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Helpers\PermissionHelper;


class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register any application authentication / authorization services.
     *
     * @param  \Illuminate\Contracts\Auth\Access\Gate  $gate
     * @return void
     */
    public function boot(GateContract $gate)
    {
        $this->registerPolicies($gate);

        $gate->define('validate-venue', function ($user, $venue_id) {
            return $user->venue_id == $venue_id;
        });

        $gate->define('user-get', function ($user, $user_id) {
            return $user->user_id == $user_id || PermissionHelper::has_permission($user, 'UM');
        });

        $gate->define('user-set', function ($user, $user_id) {
            return $user->user_id == $user_id || PermissionHelper::has_permission($user, 'UM');
        });

        $gate->define('has-permission', function ($user, $permission) {
            return PermissionHelper::has_permission($user, $permission);
        });

         $gate->define('valid-role', function ($user, $role_id) {

            $user_role = \App\Role::find($user->role_id);
            $role = \App\Role::find($role_id);
            if(!$role || !$user_role)
                return false;

            return $role->level <= $user_role->level;
        });
    }
 
}