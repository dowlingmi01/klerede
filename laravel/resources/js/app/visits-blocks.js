/******** The top row of stat blocks for visits. ********/

var blockData = function() {
    var visitsTotal = $('#visits-total').find('.stat'),
        visitsGA = $("#visits-ga .stat"),
        visitsGroups = $("#visits-groups .stat"),
        visitsMembers = $("#visits-members .stat"),
        visitsNonmembers = $("#visits-nonmembers .stat"),
        salesGate = $("#sales-gate .stat");
    $.ajax({
            url: "/api/v1/stats/query",
            type: "POST",
            data: {
            venue_id: 1588,
            queries: {
                visits_total: { specs: { type: 'visits' }, periods: '2015-05-06' },
                visits_ga: { specs: { type: 'visits', kinds: ['ga'] }, periods: '2015-05-06' },
                visits_groups: { specs: { type: 'visits', kinds: ['group'] }, periods: '2015-05-06' },
                visits_members: { specs: { type: 'visits', kinds: ['membership'] }, periods: '2015-05-06' },
                visits_nonmembers: { specs: { type: 'visits', kinds: ['ga', 'group'] }, periods: '2015-05-06' },
                sales_gate: { specs: { type: 'sales', channel: 'gate' }, periods: '2015-05-06' }
            }
        },
        dataType: "json",
        success: function(result) {
            switch (result) {
                case true:
                    processResponse(result);
                    break;
                default:
                    visitsTotal.html(result.visits_total.units).formatNumber({format:"#,###", locale:"us"});
                    visitsGA.html(result.visits_ga.units).formatNumber({format:"#,###", locale:"us"});
                    visitsGroups.html(result.visits_groups.units).formatNumber({format:"#,###", locale:"us"});
                    visitsMembers.html(result.visits_members.units).formatNumber({format:"#,###", locale:"us"});
                    visitsNonmembers.html(result.visits_nonmembers.units).formatNumber({format:"#,###", locale:"us"});
                    salesGate.html(result.sales_gate.units).formatNumber({format:"$#,###", locale:"us"});
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }/*,
        complete: function (jqXHR[object], textStatus[string]) {
            // A function to be called when the request finishes (after success and error callbacks are executed)
            // textStatus can be "success", "notmodified", "nocontent", "error", "timeout", "abort", or "parsererror"
            // Can run an array of functions
        }
        */
    });
};

var VisitsBlock = React.createClass({
    render: function() {
        return (
            <div className="stat-block">
                <div className="label">{this.props.label}</div>
                <div className="stat">...</div>
                <div className="change">
                    <ChangeArrow width="62" height="69" color="#ffffff" className={this.props.changeDirection} />
                    {this.props.tempData}
                </div>
            </div>
        );
    }
});

var VisitsBlocksSet = React.createClass({
    render: function() {
        return (
            <div className="row">
                <div className="col-xs-6 col-sm-4 col-lg-2" id="visits-total">
                    <VisitsBlock label="Total Visitors" tempData="9,980" changeDirection="up" />
                </div>
                <div className="col-xs-6 col-sm-4 col-lg-2" id="visits-ga">
                    <VisitsBlock label="Gen Admission" tempData="9,456" changeDirection="up" />
                </div>
                <div className="col-xs-6 col-sm-4 col-lg-2" id="visits-groups">
                    <VisitsBlock label="Groups" tempData="4,640" changeDirection="down" />
                </div>
                <div className="col-xs-6 col-sm-4 col-lg-2" id="visits-members">
                    <VisitsBlock label="Members" tempData="5,220" changeDirection="up" />
                </div>
                <div className="col-xs-6 col-sm-4 col-lg-2" id="visits-nonmembers">
                    <VisitsBlock label="Non-members" tempData="4,340" changeDirection="down" />
                </div>
                <div className="col-xs-6 col-sm-4 col-lg-2" id="sales-gate">
                    <VisitsBlock label="Total Gate" tempData="$13,102" changeDirection="up" />
                </div>
            </div>
        );
    }
});

React.render(
    <VisitsBlocksSet />,
    document.getElementById('visits-blocks-set')
);
console.log('Visits blocks loaded...');

blockData();
