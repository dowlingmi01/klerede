@extends('layout')

@section('content')
    <div class="row">
        <div class="col-xs-12 col-md-12" id="welcome-text"><!-- ReactJS component: WelcomeText --></div>
    </div>
    <div class="row">
        <div class="col-xs-6 col-sm-4 col-lg-2" id="visits-blocks-filter">
            <!-- ReactJS component: VisitsBlocksFilter -->
        </div>
    </div>
    <div id="visits-blocks-set"><!-- ReactJS component: VisitsBlocksSet --></div>
    <div class="row">
        <div class="col-xs-6 col-md-6">
            <div class="widget" id="totalSalesGoals">
                Total Sales Goals
            </div>
        </div>
        <div class="col-xs-6 col-md-6">
            <div class="widget">Channels</div>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-6 col-md-6">
            <div class="widget">Total Membership Goals</div>
        </div>
        <div class="col-xs-6 col-md-6">
            <div class="widget">Membership</div>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-8 col-md-8">
            <div class="widget">
                Revenue
            </div>
        </div>
        <div class="col-xs-4 col-md-4">
            <div class="widget">
                Revenue
            </div>
        </div>
    </div>
    <div class="row row-eq-height">
        <div class="col-xs-6 col-sm-4 col-lg-2">
            <div class="stat-block stats-bottom member-conversion">
                <div class="label">Member Conversion</div>
                <div class="stat">4.0%</div>
                <div class="change up"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span> 4.8%</div>
            </div>
        </div>
        <div class="col-xs-6 col-sm-4 col-lg-2">
            <div class="stat-block stats-bottom average">
                <div class="label">Average</div>
                <div class="stat">4.1%</div>
                <div class="change up"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span> 3.8%</div>
            </div>
        </div>
        <div class="col-xs-6 col-sm-4 col-lg-2">
            <div class="stat-block stats-bottom frequency">
                <div class="label">Frequency</div>
                <div class="stat">3.6</div>
                <div class="change up"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span> 3.2</div>
            </div>
        </div>
        <div class="col-xs-6 col-sm-4 col-lg-2">
            <div class="stat-block stats-bottom regency">
                <div class="label">Regency</div>
                <div class="stat">4.1</div>
                <div class="change up"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span> 4.8</div>
            </div>
        </div>
        <div class="col-xs-6 col-sm-4 col-lg-2">
            <div class="stat-block stats-bottom members">
                <div class="label">Members</div>
                <div class="stat">4.2k</div>
                <div class="change up"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span> 3.8k</div>
            </div>
        </div>
        <div class="col-xs-6 col-sm-4 col-lg-2">
            <div class="stat-block stats-bottom renewal-velocity">
                <div class="label">Renewal Velocity</div>
                <div class="stat">5.1</div>
                <div class="change up"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span> 4.8</div>
            </div>
        </div>
    </div>
@stop