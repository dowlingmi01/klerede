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

        <div id="goal-setting"><!-- ReactJS component: GoalSetting --></div>

        <form class="form-horizontal">
            <div class="form-group">
                <label for="goal-boxoffice" class="col-sm-2 control-label">Box Office:</label>
                <div class="col-sm-4">
                    <input type="text" id="goal-boxoffice" placeholder="$000,000" class="form-control empty" />
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
                </div>
            </div>
            <div class="form-group">
                <label for="goal-cafe" class="col-sm-2 control-label">Cafe:</label>
                <div class="col-sm-4">
                    <input type="text" id="goal-cafe" placeholder="$000,000" class="form-control empty" />
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
                </div>
            </div>
            <div class="form-group">
                <label for="goal-mem-num" class="col-sm-2 control-label">Total Membership #:</label>
                <div class="col-sm-4">
                    <input type="text" id="goal-mem-num" placeholder="000,000" class="form-control empty" />
                    <div class="form-group">
                        <label for="goal-mem-num-fam" class="col-sm-4 control-label">Family #:</label>
                        <div class="col-sm-8">
                            <input type="text" id="goal-mem-num-fam" placeholder="000,000" class="form-control empty" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="goal-mem-num-ind" class="col-sm-4 control-label">Individual #:</label>
                        <div class="col-sm-8">
                            <input type="text" id="goal-mem-num-ind" placeholder="000,000" class="form-control empty" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="goal-mem-num-don" class="col-sm-4 control-label">Donor #:</label>
                        <div class="col-sm-8">
                            <input type="text" id="goal-mem-num-don" placeholder="000,000" class="form-control empty" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="goal-mem-dol" class="col-sm-2 control-label">Total Membership $:</label>
                <div class="col-sm-4">
                    <input type="text" id="goal-mem-dol" placeholder="$000,000" class="form-control empty" />
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-offset-2 col-sm-10">
                    <button type="submit" class="btn btn-default">Save</button>
                </div>
            </div>


    
            
            Family #: <input type="text" value="000,000" class="empty" />
            <br><br>
            Individual #: <input type="text" value="000,000" class="empty" />
            <br><br>
            Donor #: <input type="text" value="000,000" class="empty" />
    
            <br><br><br>
    
            
            Family $: <input type="text" value="$000,000" class="empty" />
            <br><br>
            Individual $: <input type="text" value="$000,000" class="empty" />
            <br><br>
            Donor $: <input type="text" value="$000,000" class="empty" />



        </form>
    </div>

@stop