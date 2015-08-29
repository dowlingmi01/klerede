/*****************************/
/******** REVENUE ROW ********/
/*****************************/

var Revenue = React.createClass({
    getInitialState: function() {
        return {
            iconDomain: 'http://openweathermap.org/img/w/',
            iconFilename: '',   // e.g. 01d (add domain, path, and .png)
            iconExtension: '.png',
            temp: '',   // round to a whole number and add symbol and 'F' ... Math.round(78.4); // 78
            description: ''
        };
    },
    componentDidMount: function() {
        $.get('http://api.openweathermap.org/data/2.5/weather', {
            APPID: '86376bb7c673c089067f51ae70a6e79e',
            units: 'imperial',
            zip: '20132,us'   // TO DO: Pull from venue address
        })
        .done(function(result) {
            wnt.weather = result;
            if(this.isMounted()) {
                this.setState({
                    iconFilename: result.weather[0].icon,
                    temp: Math.round(result.main.temp),
                    description: result.weather[0].description
                });
            }
            console.log('Weather data loaded...');
            console.log(this.state.iconFilename);
            console.log(this.state.temp);
            console.log(this.state.description);
        }.bind(this))   // .bind() gives context to 'this'
        .fail(function(result) {
            console.log('WEATHER DATA ERROR!');
            console.log(result);
        });
    },
    render: function() {
        return (
            <div>
                TEMP REVENUE ROW
            </div>
        );
    }
});

React.render(
    <Revenue source="/api/v1/stats/query" venueID="1588" />,   // TEMP STATIC VENUE ID
    document.getElementById('revenue-row-widget')
);

console.log('Revenue row loaded...');
