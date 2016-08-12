@extends('layout')

@section('content')

    <div id="welcome-text"><!-- ReactJS component: WelcomeText --></div>

    <div id="visits-blocks-widget"><!-- ReactJS component: VisitsBlocksSet --></div>

    <div class="row">
        <div id="sales-goals-widget" class="col-xs-6 col-md-6"><!-- ReactJS component: SalesGoals --></div>
        <div id="membership-goals-widget" class="col-xs-6 col-md-6"><!-- ReactJS component: MembershipGoals --></div>
    </div>
    

    <div id="revenue-row-widget"><!-- ReactJS component: Revenue --></div>

    <div id="attendance-row-widget"><!-- ReactJS component: Attendance --></div>

    <div id="members-blocks-widget"><!-- ReactJS component: MembersBlocksSet --></div>

@stop

@section('scripts')
<script type="text/javascript">

KAPI.auth.getLoggedUser(onUserGet, onUserError);

function onUserGet (user) {
	console.log(user);
};
function onUserError(error) {
	window.location = 'login';
}

</script>
@stop