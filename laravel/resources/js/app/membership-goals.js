/**************************************/
/******** MEMBERSHIP GOALS ROW ********/
/**************************************/

var MembershipGoals = React.createClass({
    getInitialState: function() {
        return {
            day: '2015-05-06',   // TEMP STATIC DATE: Should be wnt.yesterday
            yearStart: '2015-01-01',
            quarterStart: '2015-04-01',
            monthStart: '2015-05-01',
            yearGoal: '52,000',
            status: 'On Track',
            statusClass: 'on-track',
            barSegments: wnt.period(0,12,true)
        };
    },
    componentDidMount: function() {
        $.post(
            this.props.source,
            {
                venue_id: this.props.venueID,
                queries: {
                    memberships: { specs: { type: 'members' }, periods: this.state.day }
                }
            }
        )
        .done(function(result) {
            console.log('Membership Goals data loaded...');
            wnt.membersGoals = result;
            if(this.isMounted()) {
                this.setState({
                    membershipsYear: result.memberships.current_members
                });
                this.formatNumbers();
            }
        }.bind(this))   // .bind() gives context to 'this'
        .fail(function(result) {
            console.log('MEMBERSHIP GOALS DATA ERROR! ... ' + result.statusText);
        });
    },
    handleChange: function(event) {
        var filter = event.target.value;
        if(filter === 'year'){
            this.setState({
                barSegments: wnt.period(0, 12, true)
            });
        } else if(filter === 'quarter'){
            this.setState({
                barSegments: wnt.period(wnt.thisQuarterNum[0], wnt.thisQuarterNum[1], true)
            });
        }  else if(filter === 'month'){
            this.setState({
                barSegments: wnt.period(wnt.thisMonthNum, wnt.thisMonthNum+1, true)
            });
        } else {
            this.setState({
                barSegments: wnt.period(0, 12, true)
            });
        }
        event.target.blur();
    },
    formatNumbers: function(){
        $('#total-membership-goals .bar-meter-marker').parseNumber({format:"#,###", locale:"us"});
        $('#total-membership-goals .bar-meter-marker').formatNumber({format:"#,###", locale:"us"});
    },
    componentDidUpdate: function(){
        this.formatNumbers();
        $('#total-membership-goals .bar-meter-marker')
            .animate({
                left: '50%',
                transform: 'translateX(-50%)'
            },
            2000,
            'easeOutElastic'
        );
    },
    render: function() {
        return (
            <div className="row">
                <div className="col-xs-6 col-md-6 arrow-connector-right">
                    <div className="widget" id="total-membership-goals">
                        <h2>Total Membership Goals</h2>
                        <ActionMenu />
                        <form>
                            <select className="form-control" onChange={this.handleChange}>
                                <option value="year">Current Year ({wnt.thisYear})</option>
                                <option value="quarter">Current Quarter ({wnt.thisQuarterText})</option>
                                <option value="month">Current Month ({wnt.thisMonthText.substring(0,3)})</option>
                                <option value="custom">Custom</option>
                            </select>
                            <Caret className="filter-caret" />
                        </form>
                        <div className="clear goal">Membership Goal: <span className="goalAmount">{this.state.yearGoal}</span></div>
                        <div className="goalStatus">Status: <span className={"goalStatusText " + this.state.statusClass}>{this.state.status}</span></div>
                        <div className="bar-meter clear">
                            <div className="bar-meter-marker">{this.state.membershipsYear}</div>
                            <table className="bar-meter-segments">
                                <tr>
                                    { this.state.barSegments.map(function(segment) {
                                        return <Segment key={segment} label={segment} />;
                                    }) }
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-xs-6 col-md-6">
                    <div className="widget" id="membership">
                        <h2>Membership / Donors</h2>
                        <ActionMenu />
                        <form>
                            <select className="form-control">
                                <option value="dollars">Dollars</option>
                                <option value="percap">Per Cap</option>
                            </select>
                            <Caret className="filter-caret" />
                        </form>
                        <div className="dial-wrapper">
                            <div id="div5" className="clear dial">
                                <div className="channel-info">
                                    <div className="channel-name">Individual</div>
                                    <div className="channel-amount">$75,566</div>
                                    <div className="channel-goal">Goal: $125,000</div>
                                    <div className="channel-status ahead">Ahead</div>
                                </div>
                            </div>
                            <div id="div6" className="dial">
                                <div className="channel-info">
                                    <div className="channel-name">Family</div>
                                    <div className="channel-amount">$18,123</div>
                                    <div className="channel-goal">Goal: $90,000</div>
                                    <div className="channel-status on-track">On Track</div>
                                </div>
                            </div>
                            <div id="div7" className="dial">
                                <div className="channel-info">
                                    <div className="channel-name">Donor</div>
                                    <div className="channel-amount">$25,123</div>
                                    <div className="channel-goal">Goal: $180,000</div>
                                    <div className="channel-status on-track">On Track</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

React.render(
    <MembershipGoals source="/api/v1/stats/query" venueID="1588" />,   // TEMP STATIC VENUE ID
    document.getElementById('membership-goals-widget')
);

console.log('Membership Goals row loaded...');
