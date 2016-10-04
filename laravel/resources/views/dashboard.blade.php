@extends('layout')

@section('content')
    <div id="main-action-menu" class="main-action-menu"><!-- ReactJS component: ReportingOn --></div>
    
    <div id="reporting-on" class="printable-block"><!-- ReactJS component: ReportingOn --></div>

    <div id="visits-blocks-widget"  class="printable-block"><!-- ReactJS component: VisitsBlocksSet --></div>

    <div class="row">
        <div id="sales-goals-widget" class="col-xs-6 col-md-6 printable-block"><!-- ReactJS component: SalesGoals --></div>
        <div id="membership-goals-widget" class="col-xs-6 col-md-6 printable-block"><!-- ReactJS component: MembershipGoals --></div>
    </div>
    

    <div id="revenue-row-widget2" class="printable-block"><!-- ReactJS component: Revenue --></div>


    <div id="members-blocks-widget" class="printable-block"><!-- ReactJS component: MembersBlocksSet --></div>
    
    <div id="load-user-js"><!-- calls js loadUser() --></div>

@stop