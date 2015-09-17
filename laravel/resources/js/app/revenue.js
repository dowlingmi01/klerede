/*****************************/
/******** REVENUE ROW ********/
/*****************************/

var BarSet = React.createClass({
    render: function() {
        return (
            <div className="bar-set">
                <div className="bar-section bar-section-cafe"></div>
                <div className="bar-section bar-section-gift"></div>
                <div className="bar-section bar-section-member"></div>
                <div className="bar-section bar-section-other"></div>
                <div className="bar-set-date">{this.props.date}</div>
            </div>
        );
    }
});

var AccordionItem = React.createClass({
    render: function() {
        return (
            <li className={this.props.className}>{this.props.label} <Caret className="accordion-caret" />
                <ul className="accordion">
                    <li>
                        <ChangeArrow className={"change " + this.props.arrow} />
                        <span className="accordion-stat-change">{this.props.statChange}%</span>
                        <span className="accordion-stat">{this.props.stat}</span>
                        <LongArrow className="long-arrow" />
                        <span className="accordion-compared-to">{this.props.comparedTo}</span>
                    </li>
                </ul>
            </li>
        );
    }
});

var AccordionItemPlus = React.createClass({
    render: function() {
        return (
            <li className={this.props.className}>{this.props.label} <Caret className="accordion-caret" />
                <ul className="accordion">
                    <li>
                        <ChangeArrow className={"change " + this.props.arrow} />
                        <span className="accordion-stat-change">{this.props.statChange}%</span>
                        <span className="accordion-stat">{this.props.stat}</span>
                        <LongArrow className="long-arrow" />
                        <span className="accordion-compared-to">{this.props.comparedTo}</span>
                        <ul>
                            <li className="breakdown">
                                Online
                                <ul>
                                    <li>
                                        <ChangeArrow className={"change " + this.props.arrowON} />
                                        <span className="accordion-stat-change">{this.props.statChangeON}%</span>
                                        <span className="accordion-stat">{this.props.statON}</span>
                                        <LongArrow className="long-arrow" />
                                        <span className="accordion-compared-to">{this.props.comparedToON}</span>
                                    </li>
                                </ul>
                            </li>
                            <li className="breakdown">
                                Offline
                                <ul>
                                    <li>
                                        <ChangeArrow className={"change " + this.props.arrowOFF} />
                                        <span className="accordion-stat-change">{this.props.statChangeOFF}%</span>
                                        <span className="accordion-stat">{this.props.statOFF}</span>
                                        <LongArrow className="long-arrow" />
                                        <span className="accordion-compared-to">{this.props.comparedToOFF}</span>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        );
    }
});

var AccordionSet = React.createClass({
    getInitialState: function() {
        return {
            day: '2015-05-06',   // TEMP STATIC DATE: Should be wnt.yesterday
            dayBefore: '2015-05-05',   // TEMP STATIC DATE: Should be wnt.daybeforeyesterday

            boxofficeStatChange: [0, 'up'],
            boxofficeStatChangeON: [0, 'up'],
            boxofficeStatChangeOFF: [0, 'up'],
            groupsStatChange: [0, 'up'],
            cafeStatChange: [0, 'up'],
            giftstoreStatChange: [0, 'up'],
            membershipStatChange: [0, 'up']
        };
    },
    componentDidMount: function() {
        // up/down, % change, $$$ (now), $$$ (old)
        // TOTAL = 2,741 units and $17,723.01   ===   2276(bo), 287(c), 149(gs), 29(m)
        // box office total, groups, cafe total, gift store total, membership
        $.post(
            this.props.source,
            {
                venue_id: this.props.venueID,
                queries: {
                    boxoffice: { specs: { type: 'sales', channel: 'gate' }, 
                        periods: { from: this.state.dayBefore, to: this.state.day } },
                    boxoffice_online: { specs: { type: 'sales', channel: 'gate', online: true }, 
                        periods: { from: this.state.dayBefore, to: this.state.day } },
                    boxoffice_offline: { specs: { type: 'sales', channel: 'gate', online: false }, 
                        periods: { from: this.state.dayBefore, to: this.state.day } },
                    groups: { specs: { type: 'sales', kinds: ['group'] }, 
                        periods: { from: this.state.dayBefore, to: this.state.day } },
                    cafe: { specs: { type: 'sales', channel: 'cafe' }, 
                        periods: { from: this.state.dayBefore, to: this.state.day } },
                    giftstore: { specs: { type: 'sales', channel: 'store' }, 
                        periods: { from: this.state.dayBefore, to: this.state.day } },
                    membership: { specs: { type: 'sales', channel: 'membership' }, 
                        periods: { from: this.state.dayBefore, to: this.state.day } }
                }
            }
        )
        .done(function(result) {
            console.log('Earned Revenue data loaded...');
            wnt.earnedRevenue = result;
            if(this.isMounted()) {
                this.setState({
                    boxofficeStatDay: result.boxoffice[1].amount,
                    boxofficeStatDayBefore: result.boxoffice[0].amount,
                    boxofficeStatChange: this.calcChange(result.boxoffice[1].amount, result.boxoffice[0].amount),
                    boxofficeStatDayON: result.boxoffice_online[1].amount,
                    boxofficeStatDayBeforeON: result.boxoffice_online[0].amount,
                    boxofficeStatChangeON: this.calcChange(result.boxoffice_online[1].amount, result.boxoffice_online[0].amount),
                    boxofficeStatDayOFF: result.boxoffice_offline[1].amount,
                    boxofficeStatDayBeforeOFF: result.boxoffice_offline[0].amount,
                    boxofficeStatChangeOFF: this.calcChange(result.boxoffice_offline[1].amount, result.boxoffice_offline[0].amount),

                    groupsStatDay: result.groups[1].amount,
                    groupsStatDayBefore: result.groups[0].amount,
                    groupsStatChange: this.calcChange(result.groups[1].amount, result.groups[0].amount),

                    cafeStatDay: result.cafe[1].amount,
                    cafeStatDayBefore: result.cafe[0].amount,
                    cafeStatChange: this.calcChange(result.cafe[1].amount, result.cafe[0].amount),

                    giftstoreStatDay: result.giftstore[1].amount,
                    giftstoreStatDayBefore: result.giftstore[0].amount,
                    giftstoreStatChange: this.calcChange(result.giftstore[1].amount, result.giftstore[0].amount),

                    membershipStatDay: result.membership[1].amount,
                    membershipStatDayBefore: result.membership[0].amount,
                    membershipStatChange: this.calcChange(result.membership[1].amount, result.membership[0].amount)
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
        }.bind(this))   // .bind() gives context to 'this'
        .fail(function(result) {
            console.log('EARNED REVENUE DATA ERROR! ... ' + result.statusText);
            console.log(result);
        });
    },
    calcChange: function(newstat, oldstat) {
        var change = parseFloat(newstat) - parseFloat(oldstat);   // Calculate difference
        change = (change / newstat) * 100;   // Calculate percentage
        var direction = change < 0 ? "down" : "up";   // Test for negative or positive and set arrow direction
        change = Math.abs(change);   // Convert to positive number
        change = Math.round(100*change)/100;   // Round to hundredths
        change = [change, direction]
        return change;
    },
    formatNumbers: function(){
        $.each($('#revenue-accordion .accordion-stat'), function(index, item){
            if($(this).html() !== '-'){
                $(this).parseNumber({format:"$#,###", locale:"us"});
                $(this).formatNumber({format:"$#,###", locale:"us"});
            }
        });
        $.each($('#revenue-accordion .accordion-compared-to'), function(index, item){
            if($(this).html() !== '-'){
                $(this).parseNumber({format:"$#,###", locale:"us"});
                $(this).formatNumber({format:"$#,###", locale:"us"});
            }
        });
    },
    componentDidUpdate: function(){
        this.formatNumbers();
    },
    render: function() {
        return (
            <ul id="revenue-accordion">
                <li className="notes">
                    <NoteIcon className="note" /> Notes <Caret className="accordion-caret" />
                </li>
                <AccordionItemPlus 
                    className="box-office"
                    label="Box Office Total"

                    stat={this.state.boxofficeStatDay}
                    statChange={this.state.boxofficeStatChange[0]}
                    arrow={this.state.boxofficeStatChange[1]}
                    comparedTo={this.state.boxofficeStatDayBefore}

                    statON={this.state.boxofficeStatDayON}
                    statChangeON={this.state.boxofficeStatChangeON[0]}
                    arrowON={this.state.boxofficeStatChangeON[1]}
                    comparedToON={this.state.boxofficeStatDayBeforeON}

                    statOFF={this.state.boxofficeStatDayOFF}
                    statChangeOFF={this.state.boxofficeStatChangeOFF[0]}
                    arrowOFF={this.state.boxofficeStatChangeOFF[1]}
                    comparedToOFF={this.state.boxofficeStatDayBeforeOFF} />

                <AccordionItem
                    className="groups"
                    label="Groups"
                    stat={this.state.groupsStatDay}
                    statChange={this.state.groupsStatChange[0]}
                    arrow={this.state.groupsStatChange[1]}
                    comparedTo={this.state.groupsStatDayBefore} />
                <AccordionItem
                    className="cafe"
                    label="Cafe Total"
                    stat={this.state.cafeStatDay}
                    statChange={this.state.cafeStatChange[0]}
                    arrow={this.state.cafeStatChange[1]}
                    comparedTo={this.state.cafeStatDayBefore} />
                <AccordionItem
                    className="gift-store"
                    label="Gift Store Total"
                    stat={this.state.giftstoreStatDay}
                    statChange={this.state.giftstoreStatChange[0]}
                    arrow={this.state.giftstoreStatChange[1]}
                    comparedTo={this.state.giftstoreStatDayBefore} />
                <AccordionItem
                    className="membership"
                    label="Membership"
                    stat={this.state.membershipStatDay}
                    statChange={this.state.membershipStatChange[0]}
                    arrow={this.state.membershipStatChange[1]}
                    comparedTo={this.state.membershipStatDayBefore} />
            </ul>
        );
    }
});

var Revenue = React.createClass({
    getInitialState: function() {
        return {
            icon: '',
            temp: '',
            description: '',
            test: '0',
            test2: '0',
            test3: '0'
        };
    },
    componentDidMount: function() {
        $.get('http://api.openweathermap.org/data/2.5/weather', {
            APPID: '86376bb7c673c089067f51ae70a6e79e',
            units: 'imperial',
            zip: '84020,us'   // TO DO: PULL ZIP FROM VENDOR ADDRESS (hard-coded Living Planet zip)
        })
        .done(function(result) {
            wnt.weather = result;
            if(this.isMounted()) {
                this.setState({
                    icon: '/img/'+result.weather[0].icon+'.svg',
                    temp: Math.round(result.main.temp),
                    description: result.weather[0].description
                });
            }
            console.log('Weather data loaded...');
        }.bind(this))   // .bind() gives context to 'this'
        .fail(function(result) {
            console.log('WEATHER DATA ERROR! ... ' + result.statusText);
        });
    },
    componentDidUpdate: function(){
        $('.weather-icon img').css('opacity','0')
            .animate({
                opacity: '1'
            },
            1500,
            'easeInSine'
        );
    },
    render: function() {
        return (
            <div className="row">
                <div className="col-xs-8 col-md-8">
                    <div className="widget" id="revenue">
                        <h2>Revenue</h2>
                        <form id="filter-revenue-week">
                            <select className="form-control">
                                <option value="totals">This Week (05.24-05.30)</option>
                            </select>
                            <CalendarIcon className="filter-calendar" />
                        </form>

                        <form id="filter-revenue-section">
                            <select className="form-control">
                                <option value="totals">Totals</option>
                                <option value="members">Members</option>
                                <option value="nonmembers">Non-members</option>
                                <option value="custom">Custom</option>
                            </select>
                            <Caret className="filter-caret" />
                        </form>

                        <form id="filter-revenue-units">
                            <select className="form-control">
                                <option value="totals">Dollars</option>
                                <option value="members">Per Cap</option>
                            </select>
                            <Caret className="filter-caret" />
                        </form>

                        <div className="bar-graph-legend">
                            <div className="bar-graph-legend-item">
                                <div className="legend-check-circle">
                                    <CheckMark className="legend-check" />
                                </div>
                                Box Office
                            </div>
                            <div className="bar-graph-legend-item">
                                <div className="legend-check-circle">
                                    <CheckMark className="legend-check" />
                                </div>
                                Cafe
                            </div>
                            <div className="bar-graph-legend-item">
                                <div className="legend-check-circle">
                                    <CheckMark className="legend-check" />
                                </div>
                                Gift Store
                            </div>
                            <div className="bar-graph-legend-item">
                                <div className="legend-check-circle">
                                    <CheckMark className="legend-check" />
                                </div>
                                Membership
                            </div>
                        </div>

                        <div id="bar-graph">
                            <BarSet date="05.24" />
                            <BarSet date="05.25" />
                            <BarSet date="05.26" />
                            <BarSet date="05.27" />
                            <BarSet date="05.28" />
                            <BarSet date="05.29" />
                            <BarSet date="05.30" />
                            <div className="bar-line bar-line-4"></div>
                            <div className="bar-line bar-line-3"></div>
                            <div className="bar-line bar-line-2"></div>
                            <div className="bar-line bar-line-1"></div>
                            <div className="bar-graph-Note"><NoteIcon /></div>
                            <div className="bar-graph-label-y">Thousands</div>
                            <div className="bar-graph-label-projected"><div className="legend-projected"></div> Projected</div>
                            <div className="bar-graph-slider">
                                <div className="bar-graph-slider-control">|||</div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="col-xs-4 col-md-4 arrow-connector-left">
                    <div className="widget" id="earned-revenue">
                        <div className="weather-bar">
                            <div className="weather-icon"><img src={this.state.icon} alt="Weather icon" /></div>
                            <div className="temperature">{this.state.temp}&deg; F</div>
                            <div className="weather-text">{this.state.description}</div>
                            <ActionMenu />
                        </div>
                        <h2>Earned Revenue <div className="add-note"><NoteIcon className="note" /> Add Note</div></h2>
                        <AccordionSet source={this.props.source} venueID={this.props.venueID} />
                    </div>
                </div>
            </div>
        );
    }
});

React.render(
    <Revenue source="/api/v1/stats/query" venueID="1588" />,   // TEMP STATIC VENUE ID
    document.getElementById('revenue-row-widget')
);

console.log('Revenue row loaded...');
