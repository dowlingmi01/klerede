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

        <form class="form-horizontal">
            <div class="form-group">
                <div class="col-sm-offset-2 col-sm-4">
                    Goal in Dollars
                </div>
            </div>
            <div class="form-group">
                <label for="goal-boxoffice" class="col-sm-2 control-label">Box Office:</label>
                <div class="col-sm-4">
                    <input type="text" id="goal-boxoffice" placeholder="$000,000" class="form-control" />
                    <div class="collapse" id="months-boxoffice">
                        <div class="form-group">
                            <div class="col-sm-8 collapse-title">
                                By Month:
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="goal-boxoffice-jan" class="col-sm-1 control-label">Jan:</label>
                            <div class="col-sm-3">
                                <input type="text" id="goal-boxoffice-jan" placeholder="$0" class="form-control" />
                            </div>
                            <label for="goal-boxoffice-jul" class="col-sm-1 control-label">Jul:</label>
                            <div class="col-sm-3">
                                <input type="text" id="goal-boxoffice-jul" placeholder="$0" class="form-control" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="goal-boxoffice-feb" class="col-sm-1 control-label">Feb:</label>
                            <div class="col-sm-3">
                                <input type="text" id="goal-boxoffice-feb" placeholder="$0" class="form-control" />
                            </div>
                            <label for="goal-boxoffice-aug" class="col-sm-1 control-label">Aug:</label>
                            <div class="col-sm-3">
                                <input type="text" id="goal-boxoffice-aug" placeholder="$0" class="form-control" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="goal-boxoffice-mar" class="col-sm-1 control-label">Mar:</label>
                            <div class="col-sm-3">
                                <input type="text" id="goal-boxoffice-mar" placeholder="$0" class="form-control" />
                            </div>
                            <label for="goal-boxoffice-sep" class="col-sm-1 control-label">Sep:</label>
                            <div class="col-sm-3">
                                <input type="text" id="goal-boxoffice-sep" placeholder="$0" class="form-control" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="goal-boxoffice-apr" class="col-sm-1 control-label">Apr:</label>
                            <div class="col-sm-3">
                                <input type="text" id="goal-boxoffice-apr" placeholder="$0" class="form-control" />
                            </div>
                            <label for="goal-boxoffice-oct" class="col-sm-1 control-label">Oct:</label>
                            <div class="col-sm-3">
                                <input type="text" id="goal-boxoffice-oct" placeholder="$0" class="form-control" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="goal-boxoffice-may" class="col-sm-1 control-label">May:</label>
                            <div class="col-sm-3">
                                <input type="text" id="goal-boxoffice-may" placeholder="$0" class="form-control" />
                            </div>
                            <label for="goal-boxoffice-nov" class="col-sm-1 control-label">Nov:</label>
                            <div class="col-sm-3">
                                <input type="text" id="goal-boxoffice-nov" placeholder="$0" class="form-control" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="goal-boxoffice-jun" class="col-sm-1 control-label">Jun:</label>
                            <div class="col-sm-3">
                                <input type="text" id="goal-boxoffice-jun" placeholder="$0" class="form-control" />
                            </div>
                            <label for="goal-boxoffice-dec" class="col-sm-1 control-label">Dec:</label>
                            <div class="col-sm-3">
                                <input type="text" id="goal-boxoffice-dec" placeholder="$0" class="form-control" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="goal-cafe" class="col-sm-2 control-label">Cafe:</label>
                <div class="col-sm-4">
                    <input type="text" id="goal-cafe" placeholder="$000,000" class="form-control" />
                    <div class="collapse">
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
                    <input type="text" id="goal-mem-num" placeholder="000,000" class="form-control" />
                </div>
            </div>
            <div class="form-group">
                <label for="goal-mem-num-fam" class="col-sm-3 control-label">Family #:</label>
                <div class="col-sm-3">
                    <input type="text" id="goal-mem-num-fam" placeholder="000,000" class="form-control" />
                </div>
            </div>
            <div class="form-group">
                <label for="goal-mem-num-ind" class="col-sm-3 control-label">Individual #:</label>
                <div class="col-sm-3">
                    <input type="text" id="goal-mem-num-ind" placeholder="000,000" class="form-control" />
                </div>
            </div>
            <div class="form-group">
                <label for="goal-mem-num-don" class="col-sm-3 control-label">Donor #:</label>
                <div class="col-sm-3">
                    <input type="text" id="goal-mem-num-don" placeholder="000,000" class="form-control" />
                </div>
            </div>
            <div class="form-group">
                <label for="goal-mem-dol" class="col-sm-2 control-label">Total Membership $:</label>
                <div class="col-sm-4">
                    <input type="text" id="goal-mem-dol" placeholder="$000,000" class="form-control" />
                </div>
            </div>
            <div class="form-group">
                <label for="goal-mem-dol-fam" class="col-sm-3 control-label">Family $:</label>
                <div class="col-sm-3">
                    <input type="text" id="goal-mem-dol-fam" placeholder="000,000" class="form-control" />
                </div>
            </div>
            <div class="form-group">
                <label for="goal-mem-dol-ind" class="col-sm-3 control-label">Individual $:</label>
                <div class="col-sm-3">
                    <input type="text" id="goal-mem-dol-ind" placeholder="000,000" class="form-control" />
                </div>
            </div>
            <div class="form-group">
                <label for="goal-mem-dol-don" class="col-sm-3 control-label">Donor $:</label>
                <div class="col-sm-3">
                    <input type="text" id="goal-mem-dol-don" placeholder="000,000" class="form-control" />
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-offset-2 col-sm-4 save-goals">
                    <button type="submit" class="btn btn-default">Save</button>
                </div>
            </div>
        </form>
    </div>

@stop