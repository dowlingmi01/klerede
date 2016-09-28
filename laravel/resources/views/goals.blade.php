@extends('layout')

@section('content')

    <div class="row">
        <div class="col-xs-12 col-md-12">
            <h2 class="page-title">Goal Setting</h2>
            <div id="time-date"><!-- ReactJS component: TimeDate --></div>
        </div>
    </div>

    <div class="page">
        <div class="intro">Enter monthly goals by channel to populate the dashboard</div>

        <div id="goal-setting"><!-- ReactJS component: GoalSetting --></div>
    </div>
    
    <div id="load-user-js"><!-- calls js loadUser() --></div>
    
@stop