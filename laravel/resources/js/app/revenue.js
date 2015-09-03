/*****************************/
/******** REVENUE ROW ********/
/*****************************/

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
    render: function() {
        return (
            <div className="row">
                <div className="col-xs-8 col-md-8">
                    <div className="widget" id="revenue">
                        <h2>Revenue</h2>
                        <form>
                            <select className="form-control">
                                <option value="year">Current Year ({wnt.thisYear})</option>
                                <option value="quarter">Current Quarter ({wnt.thisQuarter})</option>
                                <option value="month">Current Month ({wnt.thisMonth})</option>
                                <option value="custom">Custom</option>
                            </select>
                            <Caret className="filter-caret" />
                        </form>
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
                        <h2>Earned Revenue</h2>
                        <ul className="accordion">
                            <li className="notes">Notes</li>
                            <li className="box-office">Box Office Total
                                <ul className="accordion">
                                    <li>down 4.5% $14,878 --&gt; $15,400
                                        <ul className="accordion">
                                            <li>Offline</li>
                                            <li>Online</li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>  
                            <li className="groups">Groups
                                <ul className="accordion">
                                    <li>up 1.2% $9,765 --&gt; $8,765</li>
                                </ul>
                            </li>
                            <li className="cafe">Cafe Total
                                <ul className="accordion">
                                    <li>up 1.2% $9,765 --&gt; $8,765</li>
                                </ul>
                            </li>
                            <li className="gift-store">Gift Store Total
                                <ul className="accordion">
                                    <li>up 1.9% $6,256 --&gt; $4,234</li>
                                </ul>
                            </li>  
                            <li className="membership">Membership
                                <ul className="accordion">
                                    <li>up 1.9% $6,256 --&gt; $4,234</li>
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
