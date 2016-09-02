<?php

namespace App\Helpers;

use App\Role;

class PermissionHelper {
	 
	const OWNER_LEVEL = 10;
	const USER_MANAGE = 'UM';
	const GOALS_SET = 'GS';

	public static function permissions($user) {
		$role = Role::find($user->role_id);
		return explode("|", $role->permission);
	}

	public static function has_permission($user, $permission) {
		$permissions = self::permissions($user);
		return in_array($permission, $permissions);
	}
}
