<?php

namespace App\Helpers;

use App\Role;

class PermissionHelper {
	 
	const OWNER_LEVEL = 10;
	const USER_MANAGE = 'user_manage';
	const GOALS_SET = 'goals_set';

	public static function permissions($user) {
		$role = Role::find($user->role_id);
		return explode("|", $role->permissions);
	}

	public static function has_permission($user, $permissions) {
		$user_permissions = self::permissions($user);
		return in_array($permissions, $user_permissions);
	}
}
