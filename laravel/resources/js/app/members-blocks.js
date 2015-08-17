/***********************************************************/
/******** BOTTOM ROW OF STAT BLOCKS FOR MEMBERSHIPS ********/
/***********************************************************/
/*
membersConversion   members_conversion
membersExpired      members_expired
membersFrequency    members_frequency
membersRecency      members_recency
membersTotal        members_total
membersVelocity     members_velocity
*/
var MembersBlock = React.createClass({
    render: function() {
        return (
            <div className="stat-block stats-bottom">
                <div className="label">{this.props.label}</div>
                <div className="stat">{this.props.stat}</div>
                <div className="change">
                    <ChangeArrow width="62" height="69" color="#000000" className={this.props.changeDirection} />
                    <span className="compare-to">{this.props.comparedTo}</span>
                </div>
            </div>
        );
    }
});

var MembersBlocksSet = React.createClass({
    getInitialState: function() {
        return {
            membersDate: '2015-05-06',   // TEMP STATIC DATE: Should be wnt.yesterday
            membersDayBefore: '2015-05-05',   // TEMP STATIC DATE: Should be wnt.daybeforeyesterday
            membersDayLastYear: '2014-05-06',   // TEMP STATIC DATE: Need to calculate
            
            membersConversion: '...',
            membersConversionCompareTo: '...',
            membersConversionChange: 'none',
            
            membersExpired: '...',
            membersExpiredCompareTo: '...',
            membersExpiredChange: 'none',

            membersFrequency: '...',
            membersFrequencyCompareTo: '...',
            membersFrequencyChange: 'none',

            membersRecency: '...',
            membersRecencyCompareTo: '...',
            membersRecencyChange: 'none',

            membersTotal: '...',
            membersTotalCompareTo: '...',
            membersTotalChange: 'none',

            membersVelocity: '...',
            membersVelocityCompareTo: '...',
            membersVelocityChange: 'none'
        };
    },
    componentDidMount: function() {
        /*
        $.post(
            this.props.source,
            {
                venue_id: this.props.venueID,
                queries: {
                    members_conversion: { specs: { type: 'visits' }, periods: this.state.membersDate },
                    members_conversion_compareto_daybefore: { specs: { type: 'visits' }, periods: this.state.membersDayBefore },
                    members_conversion_compareto_lastyear: { specs: { type: 'visits' }, periods: this.state.membersDayLastYear },
                    members_conversion_compareto_rolling: { 
                        specs: { 
                            type: 'visits'
                        },
                        periods: {
                            period: {
                                from: '2014-05-06',
                                to: '2015-05-06'
                            },
                            kind: 'average'
                        }
                    },


                    members_expired: { specs: { type: 'visits', kinds: ['ga'] }, periods: this.state.membersDate },
                    members_expired_compareto_daybefore: { specs: { type: 'visits', kinds: ['ga'] }, periods: this.state.membersDayBefore },
                    members_expired_compareto_lastyear: { specs: { type: 'visits', kinds: ['ga'] }, periods: this.state.membersDayLastYear },


                    members_frequency: { specs: { type: 'visits', kinds: ['group'] }, periods: this.state.membersDate },
                    members_frequency_compareto_daybefore: { specs: { type: 'visits', kinds: ['group'] }, periods: this.state.membersDayBefore },
                    members_frequency_compareto_lastyear: { specs: { type: 'visits', kinds: ['group'] }, periods: this.state.membersDayLastYear },


                    members_recency: { specs: { type: 'visits', kinds: ['membership'] }, periods: this.state.membersDate },
                    members_recency_compareto_daybefore: { specs: { type: 'visits', kinds: ['membership'] }, periods: this.state.membersDayBefore },
                    members_recency_compareto_lastyear: { specs: { type: 'visits', kinds: ['membership'] }, periods: this.state.membersDayLastYear },


                    members_total: { specs: { type: 'visits', kinds: ['ga', 'group'] }, periods: this.state.membersDate },
                    members_total_compareto_daybefore: { specs: { type: 'visits', kinds: ['ga', 'group'] }, periods: this.state.membersDayBefore },
                    members_total_compareto_lastyear: { specs: { type: 'visits', kinds: ['ga', 'group'] }, periods: this.state.membersDayLastYear },


                    members_velocity: { specs: { type: 'sales', channel: 'gate' }, periods: this.state.membersDate },
                    members_velocity_compareto_daybefore: { specs: { type: 'sales', channel: 'gate' }, periods: this.state.membersDayBefore },
                    members_velocity_compareto_lastyear: { specs: { type: 'sales', channel: 'gate' }, periods: this.state.membersDayLastYear }

                }
            }
        )
        .done(function(result) {
            console.log('Members data loaded...');
            wnt.members = result;
            console.log(wnt.members);
            if(this.isMounted()) {
                this.setState({
                    membersConversion: result.members_conversion.units,
                    membersConversionCompareTo: result.members_conversion_compareto_daybefore.units,

                    membersExpired: result.members_expired.units,
                    membersExpiredCompareTo: result.members_expired_compareto_daybefore.units,

                    membersFrequency: result.members_frequency.units,
                    membersFrequencyCompareTo: result.members_frequency_compareto_daybefore.units,

                    membersRecency: result.members_recency.units,
                    membersRecencyCompareTo: result.members_recency_compareto_daybefore.units,

                    membersTotal: result.members_total.units,
                    membersTotalCompareTo: result.members_total_compareto_daybefore.units,

                    membersVelocity: result.members_velocity.amount,
                    membersVelocityCompareTo: result.members_velocity_compareto_daybefore.amount
                });
                // Set null data to '-'
                var self = this;
                $.each(this.state, function(stat, value){
                    if(value === null){
                        var stateObject = function() {
                            returnObj = {};
                            returnObj[stat] = '-';
                            return returnObj;
                        };
                        self.setState(stateObject);
                    }
                });
                // TO DO: STREAMLINE CHANGE DIRECTION
                if(parseInt(this.state.membersConversion) > parseInt(this.state.membersConversionCompareTo)){
                    this.setState({ membersConversionChange: 'up' });
                } else if(parseInt(this.state.membersConversion) < parseInt(this.state.membersConversionCompareTo)){
                    this.setState({ membersConversionChange: 'down' });                    
                }
                if(parseInt(this.state.membersExpired) > parseInt(this.state.membersExpiredCompareTo)){
                    this.setState({ membersExpiredChange: 'up' });
                } else if(parseInt(this.state.membersExpired) < parseInt(this.state.membersExpiredCompareTo)){
                    this.setState({ membersExpiredChange: 'down' });                    
                }
                if(parseInt(this.state.membersFrequency) > parseInt(this.state.membersFrequencyCompareTo)){
                    this.setState({ membersFrequencyChange: 'up' });
                } else if(parseInt(this.state.membersFrequency) < parseInt(this.state.membersFrequencyCompareTo)){
                    this.setState({ membersFrequencyChange: 'down' });                    
                }
                if(parseInt(this.state.membersRecency) > parseInt(this.state.membersRecencyCompareTo)){
                    this.setState({ membersRecencyChange: 'up' });
                } else if(parseInt(this.state.membersRecency) < parseInt(this.state.membersRecencyCompareTo)){
                    this.setState({ membersRecencyChange: 'down' });                    
                }
                if(parseInt(this.state.membersTotal) > parseInt(this.state.membersTotalCompareTo)){
                    this.setState({ membersTotalChange: 'up' });
                } else if(parseInt(this.state.membersTotal) < parseInt(this.state.membersTotalCompareTo)){
                    this.setState({ membersTotalChange: 'down' });                    
                }
                if(parseInt(this.state.membersVelocity) > parseInt(this.state.membersVelocityCompareTo)){
                    this.setState({ membersVelocityChange: 'up' });
                } else if(parseInt(this.state.membersVelocity) < parseInt(this.state.membersVelocityCompareTo)){
                    this.setState({ membersVelocityChange: 'down' });                    
                }
                // Format stats
                $.each($('#members-blocks-widget .stat'), function(index,stat){
                    if($(stat).html() !== '-'){
                        if(index === 5){
                            $(stat).formatNumber({format:"$#,###", locale:"us"});
                        } else {
                            $(stat).formatNumber({format:"#,###", locale:"us"});
                        }
                    }
                });
                this.formatNumbers;
            }
        }.bind(this))   // .bind() gives context to 'this' for this.isMounted to work since 'this' would have been the React component's 'this'
        .fail(function(result) {
            console.log('MEMBERS DATA ERROR!');
            console.log(result);
        });
        */
    },
    handleChange: function(event) {
        var filter = event.target.value;
        if(filter === 'lastYear'){
            this.setState({
                membersConversionCompareTo: wnt.members.members_conversion_compareto_lastyear.units,
                membersExpiredCompareTo: wnt.members.members_expired_compareto_lastyear.units,
                membersFrequencyCompareTo: wnt.members.members_frequency_compareto_lastyear.units,
                membersRecencyCompareTo: wnt.members.members_recency_compareto_lastyear.units,
                membersTotalCompareTo: wnt.members.members_total_compareto_lastyear.units,
                membersVelocityCompareTo: wnt.members.members_velocity_compareto_lastyear.amount
            });
        } else {
            this.setState({
                membersConversionCompareTo: wnt.members.members_conversion_compareto_daybefore.units,
                membersExpiredCompareTo: wnt.members.members_expired_compareto_daybefore.units,
                membersFrequencyCompareTo: wnt.members.members_frequency_compareto_daybefore.units,
                membersRecencyCompareTo: wnt.members.members_recency_compareto_daybefore.units,
                membersTotalCompareTo: wnt.members.members_total_compareto_daybefore.units,
                membersVelocityCompareTo: wnt.members.members_velocity_compareto_daybefore.amount
            });
        }
    },
    setChangeDirection: function(){
        console.log('SET CHANGE DIRECTION');
    },
    formatNumbers: function(){
        // Format comparison stats
        $.each($('#members-blocks-widget .compare-to'), function(index,stat){
            console.log($(stat).html());
            if($(stat).html() !== '-'){
                if(index === 5){
                    $(stat).parseNumber({format:"$#,###", locale:"us"});
                    $(stat).formatNumber({format:"$#,###", locale:"us"});   //.parseNumber({format:"#,###.00", locale:"us"});
                } else {
                    $(stat).parseNumber({format:"#,###", locale:"us"});
                    $(stat).formatNumber({format:"#,###", locale:"us"});
                }
            }
        });
    },
    componentDidUpdate: function(){
        this.setChangeDirection();
        this.formatNumbers();   //Not calling the formatting.  Adding () does, but then initial load doesn't work right, only subsequent loads
    },
    render: function() {
        return (
            <div>
                <div className="row">
                    <div className="col-xs-12 col-sm-8 col-lg-4">
                        <div className="filter">
                            <form>
                                <select className="form-control" onChange={this.handleChange}>
                                    <option value="twoDays">Trend over last two days</option>
                                    <option value="lastYear">Yesterday compared to same day last year</option>
                                </select>
                            </form>
                           
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6 col-sm-4 col-lg-2" id="members-conversion">
                        <MembersBlock 
                            label="Member Conversion" 
                            stat={this.state.membersConversion} 
                            comparedTo={this.state.membersConversionCompareTo}
                            changeDirection={this.state.membersConversionChange} />
                    </div>
                    <div className="col-xs-6 col-sm-4 col-lg-2" id="members-expired">
                        <MembersBlock 
                            label="Memberships Expired" 
                            stat={this.state.membersExpired} 
                            comparedTo={this.state.membersExpiredCompareTo} 
                            changeDirection={this.state.membersExpiredChange} />
                    </div>
                    <div className="col-xs-6 col-sm-4 col-lg-2" id="members-frequency">
                        <MembersBlock 
                            label="Member Frequency" 
                            stat={this.state.membersFrequency} 
                            comparedTo={this.state.membersFrequencyCompareTo} 
                            changeDirection={this.state.membersFrequencyChange} />
                    </div>
                    <div className="col-xs-6 col-sm-4 col-lg-2" id="members-recency">
                        <MembersBlock
                            label="Member Recency"
                            stat={this.state.membersRecency}
                            comparedTo={this.state.membersRecencyCompareTo}
                            changeDirection={this.state.membersRecencyChange} />
                    </div>
                    <div className="col-xs-6 col-sm-4 col-lg-2" id="members-total">
                        <MembersBlock
                            label="Total Members"
                            stat={this.state.membersTotal}
                            comparedTo={this.state.membersTotalCompareTo}
                            changeDirection={this.state.membersTotalChange} />
                    </div>
                    <div className="col-xs-6 col-sm-4 col-lg-2" id="members-velocity">
                        <MembersBlock
                            label="Renewal Velocity"
                            stat={this.state.membersVelocity}
                            comparedTo={this.state.membersVelocityCompareTo}
                            changeDirection={this.state.membersVelocityChange} />
                    </div>
                </div>
            </div>
        );
    }
});

React.render(
    <MembersBlocksSet source="/api/v1/stats/query" venueID="1588" />,   // TEMP STATIC VENUE ID
    document.getElementById('members-blocks-widget')
);

console.log('Members blocks loaded...');
