@extends('layout')

@section('content')

	<div class="row">
        <div class="col-xs-12 col-md-12">
            <h2 class="page-title">Settings</h2>
            <div id="time-date"><!-- ReactJS component: TimeDate --></div>
        </div>
    </div>


<div id="settings-page" class="page">

	<div class="content-box">
		
		<div class="image-and-text">
			<div class="user-image"></div>
			<div class="user-image-text">UPLOAD A PHOTO</div>
		</div>

		<div class="settings-box">
			<hr>
			<div class="setting-title">Name:</div>
			<div class="name-content">Jane Wynter</div>
			<a href="????">Edit</a>
			<hr>

			<div class="setting-title">Username:</div>
			<div class="username-content">Jane15</div>
			<a href="????">Edit</a>
			<hr>

			<div class="setting-title">Email:</div>
			<div class="email-content">Jane@livingplanet.com</div>
			<a href="????">Edit</a>
			<hr>

			<div class="setting-title">Password:</div>
			<div class="password-content">xxxxxxx</div>
			<a href="????">Edit</a>
			<hr>

			<div class="setting-title">Account type:</div>
			<div class="acct-type-content">Admin</div>
			<hr>

			<div class="setting-title">Goals:</div>
			<div class="goals-content">Editable</div>
			<a href="????">Manage</a>
			<hr>

			<div class="setting-title">Users:</div>
			<div class="users-content">4 Users</div>
			<a href="????">Manage</a>
			<hr>
		</div> <!-- .content-box --!>
	</div> <!-- .settings-box --!>

</div> <!--  #settings-page  --!>

@stop