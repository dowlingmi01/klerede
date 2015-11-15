@extends('layout')

@section('content')

    <div class="row">
        <div class="col-xs-12 col-md-12">
            <h2 class="page-title">Goal Setting</h2>
            <div id="time-date"><!-- ReactJS component: TimeDate --></div>
        </div>
    </div>

    

    
    <div class="page">
        <div>Enter monthly goals by channel to populate the dashboard</div>
        <div>Goal in Dollars</div>
        <form id="goal-setting">
            Box Office: <input type="text" value="$000,000" class="empty" />
            <div class="collapse" style="display:none;">
                By Month:
                Jan: <input type="text" value="$0" />
                Feb: <input type="text" value="$0" />
                Mar: <input type="text" value="$0" />
                Apr: <input type="text" value="$0" />
                May: <input type="text" value="$0" />
                Jun: <input type="text" value="$0" />
                Jul: <input type="text" value="$0" />
                Aug: <input type="text" value="$0" />
                Sep: <input type="text" value="$0" />
                Oct: <input type="text" value="$0" />
                Nov: <input type="text" value="$0" />
                Dec: <input type="text" value="$0" />
            </div>
    
            <br><br><br>
            
            Cafe: <input type="text" value="$000,000" class="empty" />
    
            <br><br><br>
    
            Total Membership #: <input type="text" value="000,000" class="empty" />
            <br><br>
            Family #: <input type="text" value="000,000" class="empty" />
            <br><br>
            Individual #: <input type="text" value="000,000" class="empty" />
            <br><br>
            Donor #: <input type="text" value="000,000" class="empty" />
    
            <br><br><br>
    
            Total Membership $: <input type="text" value="$000,000" class="empty" />
            <br><br>
            Family $: <input type="text" value="$000,000" class="empty" />
            <br><br>
            Individual $: <input type="text" value="$000,000" class="empty" />
            <br><br>
            Donor $: <input type="text" value="$000,000" class="empty" />
        </form>
    </div>

@stop