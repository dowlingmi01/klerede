@extends('layout')

@section('content')
    <div class="row">
        <div class="col-xs-12 col-md-12" id="welcome-text"></div>
    </div>
    <div class="row">
        <div class="col-sm-4 col-lg-2">
            <div class="stat-block total-visitors">
                <div class="label">Total Visitors</div>
                <div class="stat" id="totalVisitors">...</div>
                <div class="change up"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span> 9,980</div>
            </div>
        </div>
        <div class="col-sm-4 col-lg-2">
            <div class="stat-block gen-admission">
                <div class="label">Gen Admission</div>
                <div class="stat">8,345</div>
                <div class="change up"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span> 9,456</div>
            </div>
        </div>
        <div class="col-sm-4 col-lg-2">
            <div class="stat-block groups">
                <div class="label">Groups</div>
                <div class="stat">2,105</div>
                <div class="change down"><span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span> 4,640</div>
            </div>
        </div>
        <div class="col-sm-4 col-lg-2">
            <div class="stat-block members">
                <div class="label">Members</div>
                <div class="stat">5,365</div>
                <div class="change up"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span> 5,220</div>
            </div>
        </div>
        <div class="col-sm-4 col-lg-2">
            <div class="stat-block non-members">
                <div class="label">Non-members</div>
                <div class="stat">5,085</div>
                <div class="change down"><span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span> 4,340</div>
            </div>
        </div>
        <div class="col-sm-4 col-lg-2">
            <div class="stat-block total-gate">
                <div class="label">Total Gate</div>
                <div class="stat">$10,500</div>
                <div class="change up"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span> $13,102</div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-6 col-md-6">
            <div class="widget" id="totalSalesGoals">
                Total Sales Goals
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="134.915px" height="134.915px" viewBox="0 0 134.915 134.915" enable-background="new 0 0 134.915 134.915" xml:space="preserve">
                    <style>
                        .style0 {
                            stroke: #000000;
                            stroke-width: 3;
                            stroke-miterlimit: 10;
                            fill: #E30613;
                        }
                    </style>
                    <circle cx="67.5" cy="67.5" r="66" class="style0"/>
                </svg>
            </div>
        </div>
        <div class="col-xs-6 col-md-6">
            <div class="widget" id="test-svg">Channels</div>
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
            <div class="widget">Revenue</div>
        </div>
        <div class="col-xs-4 col-md-4">
            <div class="widget">Revenue</div>
        </div>
    </div>
    <div class="row row-eq-height">
        <div class="col-xs-2 col-md-2">
            <div class="stat-block stats-bottom member-conversion">
                <div class="label">Member Conversion</div>
                <div class="stat">4.0%</div>
                <div class="change up"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span> 4.8%</div>
            </div>
        </div>
        <div class="col-xs-2 col-md-2">
            <div class="stat-block stats-bottom average">
                <div class="label">Average</div>
                <div class="stat">4.1%</div>
                <div class="change up"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span> 3.8%</div>
            </div>
        </div>
        <div class="col-xs-2 col-md-2">
            <div class="stat-block stats-bottom frequency">
                <div class="label">Frequency</div>
                <div class="stat">3.6</div>
                <div class="change up"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span> 3.2</div>
            </div>
        </div>
        <div class="col-xs-2 col-md-2">
            <div class="stat-block stats-bottom regency">
                <div class="label">Regency</div>
                <div class="stat">4.1</div>
                <div class="change up"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span> 4.8</div>
            </div>
        </div>
        <div class="col-xs-2 col-md-2">
            <div class="stat-block stats-bottom members">
                <div class="label">Members</div>
                <div class="stat">4.2k</div>
                <div class="change up"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span> 3.8k</div>
            </div>
        </div>
        <div class="col-xs-2 col-md-2">
            <div class="stat-block stats-bottom renewal-velocity">
                <div class="label">Renewal Velocity</div>
                <div class="stat">5.1</div>
                <div class="change up"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span> 4.8</div>
            </div>
        </div>
    </div>
@stop