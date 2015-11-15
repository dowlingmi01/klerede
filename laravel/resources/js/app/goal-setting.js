/**************************************/
/******** REUSABLE PARTS ICONS ********/
/**************************************/

var GoalSetting = React.createClass({
    render: function() {
        return (
            <form className="form-horizontal">
                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-4">
                        Goal in Dollars
                    </div>
                </div>
                <div className="form-group">
                    <label for="goal-boxoffice" className="col-sm-2 control-label">Box Office:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-boxoffice" placeholder="$000,000" className="form-control" /><ButtonExpand target="#months-boxoffice" />
                        <div className="collapse" id="months-boxoffice">
                            <div className="form-group">
                                <div className="col-sm-8 collapse-title">
                                    By Month:
                                </div>
                            </div>
                            <div className="form-group">
                                <label for="goal-boxoffice-jan" className="col-sm-1 control-label">Jan:</label>
                                <div className="col-sm-3">
                                    <input type="text" id="goal-boxoffice-jan" placeholder="$0" className="form-control" />
                                </div>
                                <label for="goal-boxoffice-jul" className="col-sm-1 control-label">Jul:</label>
                                <div className="col-sm-3">
                                    <input type="text" id="goal-boxoffice-jul" placeholder="$0" className="form-control" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label for="goal-boxoffice-feb" className="col-sm-1 control-label">Feb:</label>
                                <div className="col-sm-3">
                                    <input type="text" id="goal-boxoffice-feb" placeholder="$0" className="form-control" />
                                </div>
                                <label for="goal-boxoffice-aug" className="col-sm-1 control-label">Aug:</label>
                                <div className="col-sm-3">
                                    <input type="text" id="goal-boxoffice-aug" placeholder="$0" className="form-control" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label for="goal-boxoffice-mar" className="col-sm-1 control-label">Mar:</label>
                                <div className="col-sm-3">
                                    <input type="text" id="goal-boxoffice-mar" placeholder="$0" className="form-control" />
                                </div>
                                <label for="goal-boxoffice-sep" className="col-sm-1 control-label">Sep:</label>
                                <div className="col-sm-3">
                                    <input type="text" id="goal-boxoffice-sep" placeholder="$0" className="form-control" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label for="goal-boxoffice-apr" className="col-sm-1 control-label">Apr:</label>
                                <div className="col-sm-3">
                                    <input type="text" id="goal-boxoffice-apr" placeholder="$0" className="form-control" />
                                </div>
                                <label for="goal-boxoffice-oct" className="col-sm-1 control-label">Oct:</label>
                                <div className="col-sm-3">
                                    <input type="text" id="goal-boxoffice-oct" placeholder="$0" className="form-control" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label for="goal-boxoffice-may" className="col-sm-1 control-label">May:</label>
                                <div className="col-sm-3">
                                    <input type="text" id="goal-boxoffice-may" placeholder="$0" className="form-control" />
                                </div>
                                <label for="goal-boxoffice-nov" className="col-sm-1 control-label">Nov:</label>
                                <div className="col-sm-3">
                                    <input type="text" id="goal-boxoffice-nov" placeholder="$0" className="form-control" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label for="goal-boxoffice-jun" className="col-sm-1 control-label">Jun:</label>
                                <div className="col-sm-3">
                                    <input type="text" id="goal-boxoffice-jun" placeholder="$0" className="form-control" />
                                </div>
                                <label for="goal-boxoffice-dec" className="col-sm-1 control-label">Dec:</label>
                                <div className="col-sm-3">
                                    <input type="text" id="goal-boxoffice-dec" placeholder="$0" className="form-control" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label for="goal-cafe" className="col-sm-2 control-label">Cafe:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-cafe" placeholder="$000,000" className="form-control" /><ButtonExpand target="#months-cafe" />
                        <div className="collapse" id="months-cafe">
                            <div className="form-group">
                                <div className="col-sm-8 collapse-title">
                                    By Month:
                                </div>
                            </div>
                            <div className="form-group">
                                <label for="goal-boxoffice-jan" className="col-sm-1 control-label">Jan:</label>
                                <div className="col-sm-3">
                                    <input type="text" id="goal-boxoffice-jan" placeholder="$0" className="form-control" />
                                </div>
                                <label for="goal-boxoffice-jul" className="col-sm-1 control-label">Jul:</label>
                                <div className="col-sm-3">
                                    <input type="text" id="goal-boxoffice-jul" placeholder="$0" className="form-control" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label for="goal-boxoffice-feb" className="col-sm-1 control-label">Feb:</label>
                                <div className="col-sm-3">
                                    <input type="text" id="goal-boxoffice-feb" placeholder="$0" className="form-control" />
                                </div>
                                <label for="goal-boxoffice-aug" className="col-sm-1 control-label">Aug:</label>
                                <div className="col-sm-3">
                                    <input type="text" id="goal-boxoffice-aug" placeholder="$0" className="form-control" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label for="goal-boxoffice-mar" className="col-sm-1 control-label">Mar:</label>
                                <div className="col-sm-3">
                                    <input type="text" id="goal-boxoffice-mar" placeholder="$0" className="form-control" />
                                </div>
                                <label for="goal-boxoffice-sep" className="col-sm-1 control-label">Sep:</label>
                                <div className="col-sm-3">
                                    <input type="text" id="goal-boxoffice-sep" placeholder="$0" className="form-control" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label for="goal-boxoffice-apr" className="col-sm-1 control-label">Apr:</label>
                                <div className="col-sm-3">
                                    <input type="text" id="goal-boxoffice-apr" placeholder="$0" className="form-control" />
                                </div>
                                <label for="goal-boxoffice-oct" className="col-sm-1 control-label">Oct:</label>
                                <div className="col-sm-3">
                                    <input type="text" id="goal-boxoffice-oct" placeholder="$0" className="form-control" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label for="goal-boxoffice-may" className="col-sm-1 control-label">May:</label>
                                <div className="col-sm-3">
                                    <input type="text" id="goal-boxoffice-may" placeholder="$0" className="form-control" />
                                </div>
                                <label for="goal-boxoffice-nov" className="col-sm-1 control-label">Nov:</label>
                                <div className="col-sm-3">
                                    <input type="text" id="goal-boxoffice-nov" placeholder="$0" className="form-control" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label for="goal-boxoffice-jun" className="col-sm-1 control-label">Jun:</label>
                                <div className="col-sm-3">
                                    <input type="text" id="goal-boxoffice-jun" placeholder="$0" className="form-control" />
                                </div>
                                <label for="goal-boxoffice-dec" className="col-sm-1 control-label">Dec:</label>
                                <div className="col-sm-3">
                                    <input type="text" id="goal-boxoffice-dec" placeholder="$0" className="form-control" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label for="goal-mem-num" className="col-sm-2 control-label">Total Membership #:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-mem-num" placeholder="000,000" className="form-control" />
                    </div>
                </div>
                <div className="form-group">
                    <label for="goal-mem-num-fam" className="col-sm-3 control-label">Family #:</label>
                    <div className="col-sm-3">
                        <input type="text" id="goal-mem-num-fam" placeholder="000,000" className="form-control" />
                    </div>
                </div>
                <div className="form-group">
                    <label for="goal-mem-num-ind" className="col-sm-3 control-label">Individual #:</label>
                    <div className="col-sm-3">
                        <input type="text" id="goal-mem-num-ind" placeholder="000,000" className="form-control" />
                    </div>
                </div>
                <div className="form-group">
                    <label for="goal-mem-num-don" className="col-sm-3 control-label">Donor #:</label>
                    <div className="col-sm-3">
                        <input type="text" id="goal-mem-num-don" placeholder="000,000" className="form-control" />
                    </div>
                </div>
                <div className="form-group">
                    <label for="goal-mem-dol" className="col-sm-2 control-label">Total Membership $:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-mem-dol" placeholder="$000,000" className="form-control" />
                    </div>
                </div>
                <div className="form-group">
                    <label for="goal-mem-dol-fam" className="col-sm-3 control-label">Family $:</label>
                    <div className="col-sm-3">
                        <input type="text" id="goal-mem-dol-fam" placeholder="000,000" className="form-control" />
                    </div>
                </div>
                <div className="form-group">
                    <label for="goal-mem-dol-ind" className="col-sm-3 control-label">Individual $:</label>
                    <div className="col-sm-3">
                        <input type="text" id="goal-mem-dol-ind" placeholder="000,000" className="form-control" />
                    </div>
                </div>
                <div className="form-group">
                    <label for="goal-mem-dol-don" className="col-sm-3 control-label">Donor $:</label>
                    <div className="col-sm-3">
                        <input type="text" id="goal-mem-dol-don" placeholder="000,000" className="form-control" />
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-4 save-goals">
                        <button type="submit" className="btn btn-default">Save</button>
                    </div>
                </div>
            </form>
        );
    }
});

if(document.getElementById('goal-setting')){
    React.render(
        <GoalSetting />,
        document.getElementById('goal-setting')
    );
    console.log('Goal setting loaded...');
}
