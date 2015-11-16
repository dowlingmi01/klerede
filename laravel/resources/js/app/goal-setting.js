/**************************************/
/******** REUSABLE PARTS ICONS ********/
/**************************************/

var GoalsMonths = React.createClass({
    render: function() {
        return (
            <div className="collapse" id={this.props.id}>
                <div className="form-group">
                    <div className="col-sm-8 collapse-title">
                        By Month:
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-jan" className="col-sm-2 control-label">Jan:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-jan" placeholder={this.props.placeholder} className="form-control" />
                    </div>
                    <label htmlFor="goal-jul" className="col-sm-2 control-label">Jul:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-jul" placeholder={this.props.placeholder} className="form-control" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-feb" className="col-sm-2 control-label">Feb:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-feb" placeholder={this.props.placeholder} className="form-control" />
                    </div>
                    <label htmlFor="goal-aug" className="col-sm-2 control-label">Aug:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-aug" placeholder={this.props.placeholder} className="form-control" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-mar" className="col-sm-2 control-label">Mar:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-mar" placeholder={this.props.placeholder} className="form-control" />
                    </div>
                    <label htmlFor="goal-sep" className="col-sm-2 control-label">Sep:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-sep" placeholder={this.props.placeholder} className="form-control" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-apr" className="col-sm-2 control-label">Apr:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-apr" placeholder={this.props.placeholder} className="form-control" />
                    </div>
                    <label htmlFor="goal-oct" className="col-sm-2 control-label">Oct:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-oct" placeholder={this.props.placeholder} className="form-control" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-may" className="col-sm-2 control-label">May:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-may" placeholder={this.props.placeholder} className="form-control" />
                    </div>
                    <label htmlFor="goal-nov" className="col-sm-2 control-label">Nov:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-nov" placeholder={this.props.placeholder} className="form-control" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-jun" className="col-sm-2 control-label">Jun:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-jun" placeholder={this.props.placeholder} className="form-control" />
                    </div>
                    <label htmlFor="goal-dec" className="col-sm-2 control-label">Dec:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-dec" placeholder={this.props.placeholder} className="form-control" />
                    </div>
                </div>
            </div>
        );
    }
});

var GoalSetting = React.createClass({
    componentDidMount: function(){
        // Track Enter Key
        $('form').keypress(function(e) {
            if(e.which == 13) {
                console.log('BLAM!!!');
            }
        });
        $('#button-save').on('click', function() {
            console.log('BLAM!!!');
        });
        $('input').on('blur', function() {
            console.log('BLAM!!!');
        });
    },
    render: function() {
        return (
            <form className="form-horizontal">
                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-4">
                        Goal in Dollars
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-boxoffice" className="col-sm-2 control-label">Box Office:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-boxoffice" placeholder="$000,000" className="form-control" /><ButtonExpand target="#months-boxoffice" />
                        <GoalsMonths id="months-boxoffice" placeholder="$0" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-cafe" className="col-sm-2 control-label">Cafe:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-cafe" placeholder="$000,000" className="form-control" /><ButtonExpand target="#months-cafe" />
                        <GoalsMonths id="months-cafe" placeholder="$0" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-mem-num" className="col-sm-2 control-label">Total Membership #:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-mem-num" placeholder="000,000" className="form-control" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-mem-num-fam" className="col-sm-3 control-label">Family #:</label>
                    <div className="col-sm-3">
                        <input type="text" id="goal-mem-num-fam" placeholder="000,000" className="form-control" /><ButtonExpand target="#months-mem-num-fam" />
                        <GoalsMonths id="months-mem-num-fam" placeholder="0" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-mem-num-ind" className="col-sm-3 control-label">Individual #:</label>
                    <div className="col-sm-3">
                        <input type="text" id="goal-mem-num-ind" placeholder="000,000" className="form-control" /><ButtonExpand target="#months-mem-num-ind" />
                        <GoalsMonths id="months-mem-num-ind" placeholder="0" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-mem-num-don" className="col-sm-3 control-label">Donor #:</label>
                    <div className="col-sm-3">
                        <input type="text" id="goal-mem-num-don" placeholder="000,000" className="form-control" /><ButtonExpand target="#months-mem-num-don" />
                        <GoalsMonths id="months-mem-num-don" placeholder="0" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-mem-dol" className="col-sm-2 control-label">Total Membership $:</label>
                    <div className="col-sm-4">
                        <input type="text" id="goal-mem-dol" placeholder="$000,000" className="form-control" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-mem-dol-fam" className="col-sm-3 control-label">Family $:</label>
                    <div className="col-sm-3">
                        <input type="text" id="goal-mem-dol-fam" placeholder="000,000" className="form-control" /><ButtonExpand target="#months-mem-dol-fam" />
                        <GoalsMonths id="months-mem-dol-fam" placeholder="$0" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-mem-dol-ind" className="col-sm-3 control-label">Individual $:</label>
                    <div className="col-sm-3">
                        <input type="text" id="goal-mem-dol-ind" placeholder="000,000" className="form-control" /><ButtonExpand target="#months-mem-dol-ind" />
                        <GoalsMonths id="months-mem-dol-ind" placeholder="$0" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="goal-mem-dol-don" className="col-sm-3 control-label">Donor $:</label>
                    <div className="col-sm-3">
                        <input type="text" id="goal-mem-dol-don" placeholder="000,000" className="form-control" /><ButtonExpand target="#months-mem-dol-don" />
                        <GoalsMonths id="months-mem-dol-don" placeholder="$0" />
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-4 save-goals">
                        <button type="button" className="btn btn-default" id="button-save">Save</button>
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
