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
            
            membersConversion: '...',
            membersConversionCompareTo: '...',

            membersFrequency: '...',
            membersFrequencyCompareTo: '...',

            membersRecency: '...',
            membersRecencyCompareTo: '...',

            membersTotal: '...',
            membersTotalCompareTo: '...',

            membersCaptured: '...',
            membersCapturedCompareTo: '...',

            membersPercap: '...',
            membersPercapCompareTo: '...'
        };
    },
    componentDidMount: function() {
        $.post(
            this.props.source,
            {
                venue_id: this.props.venueID,
                queries: {

                    // Member Conversion = (Memberships Sold / Total Visitors) * 100
                    membership_sales: { specs: { type: 'sales', channel: 'membership' }, periods: this.state.membersDate},
                    membership_sales_compareto_daybefore: { specs: { type: 'sales', channel: 'membership' }, periods: this.state.membersDayBefore},
                    membership_sales_compareto_lastyear: { specs: { type: 'sales', channel: 'membership' }, periods: this.state.membersDayLastYear},
                    membership_sales_compareto_rolling: { specs: { type: 'sales', channel: 'membership' },
                        periods: {
                            from: this.state.membersDayLastYear,
                            to: this.state.membersDate,
                            kind: 'average'
                        }
                    },

                    // Capture Rate = (Transactions / Total Visitors) * 100
                    // Per Cap = Store Sales / Total Visitors
                    transactions: { specs: { type: 'sales', channel: 'store' }, periods: this.state.membersDate},
                    transactions_compareto_daybefore: { specs: { type: 'sales', channel: 'store' }, periods: this.state.membersDayBefore},
                    transactions_compareto_lastyear: { specs: { type: 'sales', channel: 'store' }, periods: this.state.membersDayLastYear},
                    transactions_compareto_rolling: { specs: { type: 'sales', channel: 'store' },
                        periods: {
                            from: this.state.membersDayLastYear,
                            to: this.state.membersDate,
                            kind: 'average'
                        }
                    },

                    total_admissions: { specs: { type: 'visits' }, periods: this.state.membersDate },
                    total_admissions_compareto_daybefore: { specs: { type: 'visits' }, periods: this.state.membersDayBefore },
                    total_admissions_compareto_lastyear: { specs: { type: 'visits' }, periods: this.state.membersDayLastYear },
                    total_admissions_compareto_rolling: { specs: { type: 'visits' },
                        periods: {
                            from: this.state.membersDayLastYear,
                            to: this.state.membersDate,
                            kind: 'average'
                        }
                    },

                    members_total_frequency_recency: { specs: { type: 'members' }, periods: this.state.membersDate },
                    members_total_frequency_recency_compareto_daybefore: { specs: { type: 'members' }, periods: this.state.membersDayBefore },
                    members_total_frequency_recency_compareto_lastyear: { specs: { type: 'members' }, periods: this.state.membersDayLastYear },
                    members_total_frequency_recency_compareto_rolling: { specs: { type: 'members'},
                        periods: {
                            from: this.state.membersDayLastYear,
                            to: this.state.membersDate,
                            kind: 'average'
                        }
                    }
                }
            }
        )
        .done(function(result) {
            console.log('Members data loaded...');
            // Abbreviate numbers for total members block
            result.members_total_frequency_recency.current_members = this.abbrNumber(result.members_total_frequency_recency.current_members);
            result.members_total_frequency_recency_compareto_daybefore.current_members = this.abbrNumber(result.members_total_frequency_recency_compareto_daybefore.current_members);
            result.members_total_frequency_recency_compareto_lastyear.current_members = this.abbrNumber(result.members_total_frequency_recency_compareto_lastyear.current_members);
            result.members_total_frequency_recency_compareto_rolling.current_members = this.abbrNumber(result.members_total_frequency_recency_compareto_rolling.current_members);

            wnt.members = result;

            // Calculate Member Conversion
            wnt.members.members_conversion = (result.membership_sales.units / result.total_admissions.units) * 100;
            wnt.members.members_conversion_compareto_daybefore = (result.membership_sales_compareto_daybefore.units / result.total_admissions_compareto_daybefore.units) * 100;
            wnt.members.members_conversion_compareto_lastyear = (result.membership_sales_compareto_lastyear.units / result.total_admissions_compareto_lastyear.units) * 100;
            wnt.members.members_conversion_compareto_rolling = (result.membership_sales_compareto_rolling.units / result.total_admissions_compareto_rolling.units) * 100;
            // Calculate Capture Rate
            wnt.members.capture_rate = (result.transactions.units / result.total_admissions.units) * 100;
            wnt.members.capture_rate_compareto_daybefore = (result.transactions_compareto_daybefore.units / result.total_admissions_compareto_daybefore.units) * 100;
            wnt.members.capture_rate_compareto_lastyear = (result.transactions_compareto_lastyear.units / result.total_admissions_compareto_lastyear.units) * 100;
            wnt.members.capture_rate_compareto_rolling = (result.transactions_compareto_rolling.units / result.total_admissions_compareto_rolling.units) * 100;
            // Calculate Per Cap
            wnt.members.per_cap = result.transactions.amount / result.total_admissions.units;
            wnt.members.per_cap_compareto_daybefore = result.transactions_compareto_daybefore.amount / result.total_admissions_compareto_daybefore.units;
            wnt.members.per_cap_compareto_lastyear = result.transactions_compareto_lastyear.amount / result.total_admissions_compareto_lastyear.units;
            wnt.members.per_cap_compareto_rolling = result.transactions_compareto_rolling.amount / result.total_admissions_compareto_rolling.units;

            if(this.isMounted()) {
                this.setState({

                    membersConversion: wnt.members.members_conversion,
                    membersConversionCompareTo: wnt.members.members_conversion_compareto_daybefore,

                    membersFrequency: result.members_total_frequency_recency.frequency,
                    membersFrequencyCompareTo: result.members_total_frequency_recency_compareto_daybefore.frequency,

                    membersRecency: result.members_total_frequency_recency.recency,
                    membersRecencyCompareTo: result.members_total_frequency_recency_compareto_daybefore.recency,

                    membersTotal: result.members_total_frequency_recency.current_members,
                    membersTotalCompareTo: result.members_total_frequency_recency_compareto_daybefore.current_members,

                    membersCaptured: wnt.members.capture_rate,
                    membersCapturedCompareTo: wnt.members.capture_rate_compareto_daybefore,

                    membersPercap: wnt.members.per_cap,
                    membersPercapCompareTo: wnt.members.per_cap_compareto_daybefore

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
                membersConversionCompareTo: wnt.members.members_conversion_compareto_lastyear,
                membersFrequencyCompareTo: wnt.members.members_total_frequency_recency_compareto_lastyear.frequency,
                membersRecencyCompareTo: wnt.members.members_total_frequency_recency_compareto_lastyear.recency,
                membersTotalCompareTo: wnt.members.members_total_frequency_recency_compareto_lastyear.current_members,
                membersCapturedCompareTo: wnt.members.capture_rate_compareto_lastyear,
                membersPercapCompareTo: wnt.members.per_cap_compareto_lastyear
            });
        } else if(filter === 'lastYearAverage'){
            this.setState({
                membersConversionCompareTo: wnt.members.members_conversion_compareto_rolling,
                membersFrequencyCompareTo: wnt.members.members_total_frequency_recency_compareto_rolling.frequency,
                membersRecencyCompareTo: wnt.members.members_total_frequency_recency_compareto_rolling.recency,
                membersTotalCompareTo: wnt.members.members_total_frequency_recency_compareto_rolling.current_members,
                membersCapturedCompareTo: wnt.members.capture_rate_compareto_rolling,
                membersPercapCompareTo: wnt.members.per_cap_compareto_rolling
            });
        } else {
            this.setState({
                membersConversionCompareTo: wnt.members.members_conversion_compareto_daybefore,
                membersFrequencyCompareTo: wnt.members.members_total_frequency_recency_compareto_daybefore.frequency,
                membersRecencyCompareTo: wnt.members.members_total_frequency_recency_compareto_daybefore.recency,
                membersTotalCompareTo: wnt.members.members_total_frequency_recency_compareto_daybefore.current_members,
                membersCapturedCompareTo: wnt.members.capture_rate_compareto_daybefore,
                membersPercapCompareTo: wnt.members.per_cap_compareto_daybefore
            });
        }
        event.target.blur();
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
                    <div className="col-xs-6 col-sm-4 col-lg-2" id="members-captured">
                        <MembersBlock 
                            label="Capture Rate" 
                            stat={this.state.membersCaptured} 
                            comparedTo={this.state.membersCapturedCompareTo} />
                    </div>
                    <div className="col-xs-6 col-sm-4 col-lg-2" id="members-percap">
                        <MembersBlock
                            label="Per Cap"
                            stat={this.state.membersPercap}
                            comparedTo={this.state.membersPercapCompareTo} />
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
