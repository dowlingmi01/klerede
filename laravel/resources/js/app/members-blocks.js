/***********************************************************/
/******** BOTTOM ROW OF STAT BLOCKS FOR MEMBERSHIPS ********/
/***********************************************************/

var MembersBlock = React.createClass({
    render: function() {
        return (
            <div className="stat-block stats-bottom">
                <div className="label">{this.props.label}</div>
                <div className="stat">{this.props.stat}</div>
                <div className="change">
                    <ChangeArrow width="62" height="69" color="#000000" className="up" />
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
            membersDayLastYear: '2014-05-06',   // TEMP STATIC DATE: Should be wnt.yesterdaylastyear
            
            // TO DO: REMOVE DUMMY DATA AND WIRE-UP API (COMMENTED-OUT BELOW)... AND SET FORMATS
            membersConversion: '4.0',
            membersConversionCompareTo: '4.8',
            
            membersExpired: '4.1',
            membersExpiredCompareTo: '3.8',

            membersFrequency: '3.6',
            membersFrequencyCompareTo: '3.1',

            membersRecency: '4.1',
            membersRecencyCompareTo: '4.8',

            membersTotal: '4.2',
            membersTotalCompareTo: '3.8',

            membersVelocity: '5.1',
            membersVelocityCompareTo: '4.8'
        };
    },
    componentDidMount: function() {
        $.post(
            this.props.source,
            {
                venue_id: this.props.venueID,
                queries: {

                    // TO DO: CONVERSION, CAPTURE, RENEWAL ... AND ... YEAR AVERAGE

                    // {"members_total_frequency_recency":{"period":"2015-05-06","current_members":17341,"frequency":6.764367816,"recency":45.597701149}}
                    members_total_frequency_recency: { specs: { type: 'members' }, periods: this.state.membersDate },
                    members_total_frequency_recency_compareto_daybefore: { specs: { type: 'members' }, periods: this.state.membersDayBefore },
                    members_total_frequency_recency_compareto_lastyear: { specs: { type: 'members' }, periods: this.state.membersDayLastYear }


                    /*
                        // MEMBERSHIP CONVERSION
                        // Membership sales for one day / total admissions
                        $.post('/api/v1/stats/query', { venue_id: '1588', queries: {
                            memberships_day: { 
                                specs: { 
                                    type: 'sales',
                                    kinds: ['membership']
                                },
                                periods: '2015-05-06'
                            }
                        }}).done(function(result){wnt.memberships_day = result.memberships_day.units;});
                        $.post('/api/v1/stats/query', { venue_id: '1588', queries: {
                            visits_day: { 
                                specs: { 
                                    type: 'visits'
                                },
                                periods: '2015-05-06'
                            }
                        }}).done(function(result){wnt.visits_day = result.visits_day.units;});
                        wnt.membership_conversion = parseInt(wnt.memberships_day) / parseInt(wnt.visits_day);
                        console.log(wnt.membership_conversion);

                    */

                }
            }
        )
        .done(function(result) {
            console.log('Members data loaded...');
            result.members_total_frequency_recency.current_members = this.abbrNumber(result.members_total_frequency_recency.current_members);
            result.members_total_frequency_recency_compareto_daybefore.current_members = this.abbrNumber(result.members_total_frequency_recency_compareto_daybefore.current_members);
            result.members_total_frequency_recency_compareto_lastyear.current_members = this.abbrNumber(result.members_total_frequency_recency_compareto_lastyear.current_members);
            wnt.members = result;
            if(this.isMounted()) {
                this.setState({
                    /*membersConversion: result.members_conversion.units,
                    membersConversionCompareTo: result.members_conversion_compareto_daybefore.units,*/

                    /*membersExpired: result.members_expired.units,
                    membersExpiredCompareTo: result.members_expired_compareto_daybefore.units,*/

                    membersFrequency: result.members_total_frequency_recency.frequency,
                    membersFrequencyCompareTo: result.members_total_frequency_recency_compareto_daybefore.frequency,

                    membersRecency: result.members_total_frequency_recency.recency,
                    membersRecencyCompareTo: result.members_total_frequency_recency_compareto_daybefore.recency,

                    membersTotal: result.members_total_frequency_recency.current_members,
                    membersTotalCompareTo: result.members_total_frequency_recency_compareto_daybefore.current_members/*,

                    membersVelocity: result.members_velocity.amount,
                    membersVelocityCompareTo: result.members_velocity_compareto_daybefore.amount*/
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
                this.formatNumbers;
            }
        }.bind(this))   // .bind() gives context to 'this' for this.isMounted to work since 'this' would have been the React component's 'this'
        .fail(function(result) {
            console.log('MEMBERS DATA ERROR! ... ' + result.statusText);
        });
    },
    handleChange: function(event) {
        var filter = event.target.value;
        if(filter === 'lastYear'){
            this.setState({
                /*membersConversionCompareTo: wnt.members.members_conversion_compareto_lastyear.units,
                membersExpiredCompareTo: wnt.members.members_expired_compareto_lastyear.units,*/
                membersFrequencyCompareTo: wnt.members.members_total_frequency_recency_compareto_lastyear.frequency,
                membersRecencyCompareTo: wnt.members.members_total_frequency_recency_compareto_lastyear.recency,
                membersTotalCompareTo: wnt.members.members_total_frequency_recency_compareto_lastyear.current_members/*,
                membersVelocityCompareTo: wnt.members.members_velocity_compareto_lastyear.amount*/
            });
        } else if(filter === 'lastYearAverage'){
            this.setState({
                /*membersConversionCompareTo: wnt.members.members_conversion_compareto_rolling.units,
                membersExpiredCompareTo: wnt.members.members_expired_compareto_rolling.units,*/
                membersFrequencyCompareTo: wnt.members.members_total_frequency_recency_compareto_rolling.frequency,
                membersRecencyCompareTo: wnt.members.members_total_frequency_recency_compareto_rolling.recency,
                membersTotalCompareTo: wnt.members.members_total_frequency_recency_compareto_rolling.current_members/*,
                membersVelocityCompareTo: wnt.members.members_velocity_compareto_rolling.amount*/
            });
        } else {
            this.setState({
                /*membersConversionCompareTo: wnt.members.members_conversion_compareto_daybefore.units,
                membersExpiredCompareTo: wnt.members.members_expired_compareto_daybefore.units,*/
                membersFrequencyCompareTo: wnt.members.members_total_frequency_recency_compareto_daybefore.frequency,
                membersRecencyCompareTo: wnt.members.members_total_frequency_recency_compareto_daybefore.recency,
                membersTotalCompareTo: wnt.members.members_total_frequency_recency_compareto_daybefore.current_members/*,
                membersVelocityCompareTo: wnt.members.members_velocity_compareto_daybefore.amount*/
            });
        }
    },
    abbrNumber: function(number) {
        number = Math.round((number / 1000) * 10) / 10;
        return number;
    },
    formatNumbers: function(){
        // Format numbers and set the direction of the change arrows
        $.each($('#members-blocks-widget .stat-block'), function(index, statblock){
            var newstat = $(statblock).find('.stat');
            var oldstat = $(statblock).find('.compare-to');
            var change = $(statblock).find('svg');
            if( ($(newstat).html() !== '-') && ($(oldstat).html() !== '-') ){
                if($(newstat).parseNumber({format:"#,###", locale:"us"}) > $(oldstat).parseNumber({format:"#,###", locale:"us"})){
                    $(change).attr('class','up');
                } else {
                    $(change).attr('class','down');
                }
                $(newstat).formatNumber({format:"#,###.#", locale:"us"});
                $(oldstat).formatNumber({format:"#,###.#", locale:"us"});
            }
        });
    },
    componentDidUpdate: function(){
        this.formatNumbers();
        $('#members-blocks-widget .up').css('top','35px')
            .animate({
                top: '0'
            },
            700,
            'easeOutBounce'
        );
        $('#members-blocks-widget .down').css('top','-35px')
            .animate({
                top: '0'
            },
            700,
            'easeOutBounce'
        );
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
                                    <option value="lastYearAverage">Yesterday compared to average for the past year</option>
                                </select>
                                <Caret className="filter-caret" />
                            </form>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6 col-sm-4 col-lg-2" id="members-conversion">
                        <MembersBlock 
                            label="Member Conversion" 
                            stat={this.state.membersConversion} 
                            comparedTo={this.state.membersConversionCompareTo} />
                    </div>
                    <div className="col-xs-6 col-sm-4 col-lg-2" id="members-expired">
                        <MembersBlock 
                            label="Capture Rate" 
                            stat={this.state.membersExpired} 
                            comparedTo={this.state.membersExpiredCompareTo} />
                    </div>
                    <div className="col-xs-6 col-sm-4 col-lg-2" id="members-frequency">
                        <MembersBlock 
                            label="Frequency" 
                            stat={this.state.membersFrequency} 
                            comparedTo={this.state.membersFrequencyCompareTo} />
                    </div>
                    <div className="col-xs-6 col-sm-4 col-lg-2" id="members-recency">
                        <MembersBlock
                            label="Recency"
                            stat={this.state.membersRecency}
                            comparedTo={this.state.membersRecencyCompareTo} />
                    </div>
                    <div className="col-xs-6 col-sm-4 col-lg-2" id="members-total">
                        <MembersBlock
                            label="Members"
                            stat={this.state.membersTotal}
                            comparedTo={this.state.membersTotalCompareTo} />
                    </div>
                    <div className="col-xs-6 col-sm-4 col-lg-2" id="members-velocity">
                        <MembersBlock
                            label="Renewal Velocity"
                            stat={this.state.membersVelocity}
                            comparedTo={this.state.membersVelocityCompareTo} />
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
