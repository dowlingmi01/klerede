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
			<a href="#" data-toggle="modal" data-target="#myModal" onclick="return false;">Manage</a>
			<hr>
		</div> <!-- .content-box -->
	</div> <!-- .settings-box -->

</div> <!--  #settings-page  -->



<!-- Modal -->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">MANAGE USERS</h4>
      </div>
      <div class="modal-body">
        <div class="manage-users-modal">

				<div class="modal-user-name">Jane Wynter</div>
				<div class="modal-user-email">Jane@livingplanet.com</div>
				<div class="modal-acct-type">
					<div class="dropdown">
					  <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					    Admin
					    <span class="caret"></span>
					  </button>
					  <ul class="dropdown-menu" aria-labelledby="dLabel">
					    Basic</br>
					    Editor
					  </ul>
					</div>
				</div>
				<button class="modal-remove-button">REMOVE</button>
				<hr>
				<div class="modal-user-name">Brad Jensen</div>
				<div class="modal-user-email">Brad@livingplanet.com</div>
				<div class="modal-acct-type">
					<div class="dropdown">
					  <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					    Basic
					    <span class="caret"></span>
					  </button>
					  <ul class="dropdown-menu" aria-labelledby="dLabel">
					    Admin</br>
					    Editor
					  </ul>
					</div>
				</div>
				<button class="modal-remove-button">REMOVE</button>
				<hr>
				<div class="modal-user-name">Joel Barrett</div>
				<div class="modal-user-email">Joel@livingplanet.com</div>
				<div class="modal-acct-type">
					<div class="dropdown">
					  <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					    Editor
					    <span class="caret"></span>
					  </button>
					  <ul class="dropdown-menu" aria-labelledby="dLabel">
					    Basic</br>
						Admin
					  </ul>
					</div>
				</div>
				<button class="modal-remove-button">REMOVE</button>
				<hr>
				<div class="modal-user-name">Amit Sachdeva</div>
				<div class="modal-user-email">Amit@livingplanet.com</div>
				<div class="modal-acct-type">
					<div class="dropdown">
					  <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					    Admin
					    <span class="caret"></span>
					  </button>
					  <ul class="dropdown-menu" aria-labelledby="dLabel">
					    Basic</br>
					    Editor
					  </ul>
					</div>
				</div>
				<button class="modal-remove-button">REMOVE</button>
				<hr>


			<h4 class="modal-title">ADD USERS</h4>

		</div><!-- .manage-users-modal -->
      </div>
    </div>
  </div>
</div>







@stop