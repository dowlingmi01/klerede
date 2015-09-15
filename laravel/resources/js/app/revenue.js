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

var Revenue = React.createClass({
    getInitialState: function() {
        return {
            icon: '',
            temp: '',
            description: ''
        };
    },
    componentDidMount: function() {
        // TO DO: ADD POST TO API OR CREATE DIFFERENT COMPONENT???
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
                        <ul id="revenue-accordion">
                            <li className="notes">
                                <NoteIcon className="note" /> Notes <Caret className="accordion-caret" />
                            </li>
                            <li className="box-office">Box Office Total <Caret className="accordion-caret" />
                                <ul className="accordion">
                                    <li><ChangeArrow className="change down" /> <span className="accordion-stat">4.5% $14,878</span> <LongArrow className="long-arrow" /> <span className="accordion-compared-to">$15,400</span></li>
                                </ul>
                            </li>  
                            <li className="groups">Groups <Caret className="accordion-caret" />
                                <ul className="accordion">
                                    <li><ChangeArrow className="change up" /> <span className="accordion-stat">1.2% $9,765</span> <LongArrow className="long-arrow" /> <span className="accordion-compared-to">$8,765</span></li>
                                </ul>
                            </li>
                            <li className="cafe">Cafe Total <Caret className="accordion-caret" />
                                <ul className="accordion">
                                    <li><ChangeArrow className="change up" /> <span className="accordion-stat">1.2% $9,765</span> <LongArrow className="long-arrow" /> <span className="accordion-compared-to">$8,765</span></li>
                                </ul>
                            </li>
                            <li className="gift-store">Gift Store Total <Caret className="accordion-caret" />
                                <ul className="accordion">
                                    <li><ChangeArrow className="change up" /> <span className="accordion-stat">1.9% $6,256</span> <LongArrow className="long-arrow" /> <span className="accordion-compared-to">$4,234</span></li>
                                </ul>
                            </li>  
                            <li className="membership">Membership <Caret className="accordion-caret" />
                                <ul className="accordion">
                                    <li><ChangeArrow className="change up" /> <span className="accordion-stat">1.9% $6,256</span> <LongArrow className="long-arrow" /> <span className="accordion-compared-to">$4,234</span></li>
                                </ul>
                            </li>
                        </ul>
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
