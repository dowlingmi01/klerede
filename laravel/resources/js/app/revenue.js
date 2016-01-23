/*****************************/
/******** REVENUE ROW ********/
/*****************************/

var BarSet = React.createClass({
    convertDate: function(date) {
        date = date.split('/');
        date = date[1]+'.'+date[2];
        return date;
    },
    rolloverDate: function(date) {
        date = date.split('/');
        date = new Date(date[0], date[1]-1, date[2]);
        dow = Date.dayNames[date.getDay()];
        m = Date.monthNames[date.getMonth()];
        date = dow + ', ' + m + ' ' + date.getDate() + ', ' + date.getFullYear();
        return date;
    },
    render: function() {
        return (  // TO DO: MAKE POPOVER DATA INTO TABLES ... {"goalStatusText " + this.state.statusClass}
            <div className="bar-set" 
                data-toggle="popover" 
                data-html="true" 
                data-content={"<div class='popover-weather-bar'><div class='popover-date'>"+this.rolloverDate(this.props.date)+"</div><div class='popover-weather-10am'><img src='/img/"+this.props.icon1+".svg' class='popover-weather-icon'><div class='popover-time'>10 A.M.</div><div class='popover-weather-text'>"+this.props.summary1+"</div><div class='popover-temp'>"+this.props.temp1+"</div></div><div class='popover-weather-4pm'><img src='/img/"+this.props.icon2+".svg' class='popover-weather-icon'><div class='popover-time'>4 P.M.</div><div class='popover-weather-text'>"+this.props.summary2+"</div><div class='popover-temp'>"+this.props.temp2+"</div></div></div><table class='popover-data'><tr><td><div class='legend-circle-bo'></div></td><td>Box Office</td><td>"+this.props.box+"</td></tr><tr><td><div class='legend-circle-c'></div></td><td>Cafe</td><td>"+this.props.cafe+"</td></tr><tr><td><div class='legend-circle-gs'></div></td><td>Gift Store</td><td>"+this.props.gift+"</td></tr><tr><td><div class='legend-circle-m'></div></td><td>Members</td><td>"+this.props.mem+"</td></tr></table>"} 
                data-placement="auto"
                data-trigger="click hover">
                <div className="bar-section bar-section-boxoffice"></div>
                <div className="bar-section bar-section-cafe"></div>
                <div className="bar-section bar-section-giftstore"></div>
                <div className="bar-section bar-section-membership"></div>
                <div className="bar-set-date" data-date={this.props.date}>{this.convertDate(this.props.date)}</div>
            </div>
        );
    }
});

var AccordionItem = React.createClass({
    toggleAccordion: function(event){
        // Turn caret and hide/show content
        $(event.target).closest('.accordion-item').toggleClass('open').find('ul').eq(0).toggle();
    },
    render: function() {
        return (
            <li className={this.props.className+" accordion-item"} onClick={this.toggleAccordion}>{this.props.label} <Caret className="accordion-caret" />
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
    toggleAccordion: function(event){
        // Turn caret and hide/show content
        if($(event.target).closest('.accordion-sub-item').length === 0){
            $(event.target).closest('.accordion-item').toggleClass('open').find('ul').eq(0).toggle().find('ul').eq(0).toggle();
        }
    },
    render: function() {
        return (
            <li className={this.props.className+" accordion-item"} onClick={this.toggleAccordion}>{this.props.label} <Caret className="accordion-caret" />
                <ul className="accordion">
                    <li>
                        <ChangeArrow className={"change " + this.props.arrow} />
                        <span className="accordion-stat-change">{this.props.statChange}%</span>
                        <span className="accordion-stat">{this.props.stat}</span>
                        <LongArrow className="long-arrow" />
                        <span className="accordion-compared-to">{this.props.comparedTo}</span>
                        <ul>
                            <li className="breakdown accordion-sub-item">
                                Online <Caret className="accordion-caret" />
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
                            <li className="breakdown accordion-sub-item">
                                Offline <Caret className="accordion-caret" />
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

var WeatherBar = React.createClass({   // Weather API
    // TO DO: Combine into main component and remove old API call
    getInitialState: function() {
        return {
            icon: '',
            temp: '',
            description: ''
        };
    },
    componentDidMount: function() {
        $.get('http://api.openweathermap.org/data/2.5/weather', {
            APPID: '86376bb7c673c089067f51ae70a6e79e',
            units: 'imperial',
            zip: wnt.venueZip
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
        // Load weather data in revenue accordion
        wnt.gettingWeatherData = $.Deferred();
        wnt.weatherRange = wnt.getDateRange(wnt.datePickerStart, 'this week');
        wnt.getWeather(wnt.weatherRange[0], wnt.weatherRange[1]);
        $.when(wnt.gettingWeatherData).done(function(weather) {
            $('.weather-period-title').html('Week: '+wnt.longDate(weather[0].date)+' - '+wnt.longDate(weather[6].date));
            $.each($('.weather-period'), function(index, item){
                $(item).find('.weather-period-label').html(wnt.shortDate(weather[index].date));
                $(item).find('img').attr('src', '/img/'+weather[index].icon_1+'.svg').css('opacity','0').animate({
                        opacity: '1'
                    },
                    1500,
                    'easeInSine'
                );
                $(item).find('.temp-10am').html(Math.round(weather[index].temp_1)+'&deg;');
                $(item).find('.temp-4pm').html(Math.round(weather[index].temp_2)+'&deg;');
            });
        });
        $('.weather-period-set img').on('click', function () {
            $(this).parent().find('.weather-details').show();
        });
        $('.weather-details').on('click', function () {
            $(this).hide();
        });
    },
    render: function() {
        return (
            <div className="weather-bar">
                <div className="weather-period-title">Week:</div>
                <div className="weather-period-set">
                    <div className="weather-period active">
                        <div className="weather-period-label">05.24</div>
                        <img src={this.state.icon} alt="Weather icon" />
                        <div className="weather-details">
                            <div className="details-1">10AM <span className="temp-10am"></span></div>
                            <div className="details-2">4PM <span className="temp-4pm"></span></div>
                        </div>
                    </div>
                    <div className="weather-period">
                        <div className="weather-period-label">05.25</div>
                        <img src={this.state.icon} alt="Weather icon" />
                        <div className="weather-details">
                            <div className="details-1">10AM <span className="temp-10am"></span></div>
                            <div className="details-2">4PM <span className="temp-4pm"></span></div>
                        </div>
                    </div>
                    <div className="weather-period">
                        <div className="weather-period-label">05.26</div>
                        <img src={this.state.icon} alt="Weather icon" />
                        <div className="weather-details">
                            <div className="details-1">10AM <span className="temp-10am"></span></div>
                            <div className="details-2">4PM <span className="temp-4pm"></span></div>
                        </div>
                    </div>
                    <div className="weather-period">
                        <div className="weather-period-label">05.27</div>
                        <img src={this.state.icon} alt="Weather icon" />
                        <div className="weather-details">
                            <div className="details-1">10AM <span className="temp-10am"></span></div>
                            <div className="details-2">4PM <span className="temp-4pm"></span></div>
                        </div>
                    </div>
                    <div className="weather-period">
                        <div className="weather-period-label">05.28</div>
                        <img src={this.state.icon} alt="Weather icon" />
                        <div className="weather-details">
                            <div className="details-1">10AM <span className="temp-10am"></span></div>
                            <div className="details-2">4PM <span className="temp-4pm"></span></div>
                        </div>
                    </div>
                    <div className="weather-period">
                        <div className="weather-period-label">05.29</div>
                        <img src={this.state.icon} alt="Weather icon" />
                        <div className="weather-details">
                            <div className="details-1">10AM <span className="temp-10am"></span></div>
                            <div className="details-2">4PM <span className="temp-4pm"></span></div>
                        </div>
                    </div>
                    <div className="weather-period">
                        <div className="weather-period-label">05.30</div>
                        <img src={this.state.icon} alt="Weather icon" />
                        <div className="weather-details">
                            <div className="details-1">10AM <span className="temp-10am"></span></div>
                            <div className="details-2">4PM <span className="temp-4pm"></span></div>
                        </div>
                    </div>
                </div>
                <ActionMenu />
            </div>
        );
    }
});

var Revenue = React.createClass({      // Klerede API for bar graph (NEW & WORKS) AND accordion details (NEW)
    getInitialState: function() {
        wnt.graphCap = 80000;   // TEMPORARY
        return {
            graphCap: 80000,
            graphHeight: 300,

            value: 'TEST',
            month: wnt.thisMonthNum+1,
            monthStart: wnt.monthStart,
            monthEnd: wnt.thisYear+'-'+(wnt.thisMonthNum+1)+'-'+wnt.daysInMonth(wnt.thisMonthNum+1,wnt.thisYear),
            periodStart: wnt.thisYear+'-'+(wnt.thisMonthNum+1)+'-1',
            periodEnd: wnt.thisYear+'-'+(wnt.thisMonthNum+1)+'-7',
            priorPeriodStart: wnt.getDateRange(wnt.monthStart, 'last week')[0],   // default is last month's last week
            priorPeriodEnd: wnt.getDateRange(wnt.monthStart, 'last week')[1],   // default is last day of previous month

            barDates: wnt.getMonth(wnt.today),   // wnt.yesterday was returning 8/31 and therefore 8/1 - 8/31
            days: wnt.selectedMonthDays,
            weather: [],

            boxofficeHeight: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            cafeHeight: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            giftstoreHeight: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            membershipHeight: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

            // NEW!!! ... 4
            boxofficeChange: [0, 'up'],
            boxofficeChangeON: [0, 'up'],
            boxofficeChangeOFF: [0, 'up'],
            groupsChange: [0, 'up'],
            cafeChange: [0, 'up'],
            giftstoreChange: [0, 'up'],
            membershipChange: [0, 'up']
        };
    },
    componentDidMount: function() {
        // Members / Non-members ... Members buy memberships, but not admission
        // up/down, % change, $$$ (total current period), $$$ (total last period)
        var self = this;
        $.post(
            wnt.apiMain,
            {
                venue_id: wnt.venueID,
                queries: {
                    box_bars: { specs: { type: 'sales', channel: 'gate' },
                        periods: { from: this.state.monthStart, to: this.state.monthEnd } },
                    box_sum: { specs: { type: 'sales', channel: 'gate' }, 
                        periods: { from: this.state.periodStart, to: this.state.periodEnd, kind: 'sum' } },
                    box_sum_prior: { specs: { type: 'sales', channel: 'gate' }, 
                        periods: { from: this.state.priorPeriodStart, to: this.state.priorPeriodEnd, kind: 'sum' } },
                    box_sum_online: { specs: { type: 'sales', channel: 'gate', online: true }, 
                        periods: { from: this.state.periodStart, to: this.state.periodEnd, kind: 'sum' } },
                    box_sum_online_prior: { specs: { type: 'sales', channel: 'gate', online: true }, 
                        periods: { from: this.state.priorPeriodStart, to: this.state.priorPeriodEnd, kind: 'sum' } },
                    box_sum_offline: { specs: { type: 'sales', channel: 'gate', online: false }, 
                        periods: { from: this.state.periodStart, to: this.state.periodEnd, kind: 'sum' } },
                    box_sum_offline_prior: { specs: { type: 'sales', channel: 'gate', online: false }, 
                        periods: { from: this.state.priorPeriodStart, to: this.state.priorPeriodEnd, kind: 'sum' } },

                    cafe_bars: { specs: { type: 'sales', channel: 'cafe' }, 
                        periods: { from: this.state.monthStart, to: this.state.monthEnd } },
                    cafe_sum: { specs: { type: 'sales', channel: 'cafe' }, 
                        periods: { from: this.state.periodStart, to: this.state.periodEnd, kind: 'sum' } },
                    cafe_sum_prior: { specs: { type: 'sales', channel: 'cafe' }, 
                        periods: { from: this.state.priorPeriodStart, to: this.state.priorPeriodEnd, kind: 'sum' } },
                    cafe_bars_members: { specs: { type: 'sales', channel: 'cafe', members: true }, 
                        periods: { from: this.state.monthStart, to: this.state.monthEnd } },
                    cafe_bars_nonmembers: { specs: { type: 'sales', channel: 'cafe', members: false }, 
                        periods: { from: this.state.monthStart, to: this.state.monthEnd } },
                    
                    gift_bars: { specs: { type: 'sales', channel: 'store' }, 
                        periods: { from: this.state.monthStart, to: this.state.monthEnd } },
                    gift_sum: { specs: { type: 'sales', channel: 'store' }, 
                        periods: { from: this.state.periodStart, to: this.state.periodEnd, kind: 'sum' } },
                    gift_sum_prior: { specs: { type: 'sales', channel: 'store' }, 
                        periods: { from: this.state.priorPeriodStart, to: this.state.priorPeriodEnd, kind: 'sum' } },
                    gift_bars_members: { specs: { type: 'sales', channel: 'store', members: true }, 
                        periods: { from: this.state.monthStart, to: this.state.monthEnd } },
                    gift_bars_nonmembers: { specs: { type: 'sales', channel: 'store', members: false },
                        periods: { from: this.state.monthStart, to: this.state.monthEnd } },
                    
                    mem_bars: { specs: { type: 'sales', channel: 'membership' },
                        periods: { from: this.state.monthStart, to: this.state.monthEnd } },
                    mem_sum: { specs: { type: 'sales', channel: 'membership' }, 
                        periods: { from: this.state.periodStart, to: this.state.periodEnd, kind: 'sum' } },
                    mem_sum_prior: { specs: { type: 'sales', channel: 'membership' }, 
                        periods: { from: this.state.priorPeriodStart, to: this.state.priorPeriodEnd, kind: 'sum' } },

                    groups_sum: { specs: { type: 'sales', kinds: ['group'] }, 
                        periods: { from: this.state.periodStart, to: this.state.periodEnd, kind: 'sum' } },
                    groups_sum_prior: { specs: { type: 'sales', kinds: ['group'] }, 
                        periods: { from: this.state.priorPeriodStart, to: this.state.priorPeriodEnd, kind: 'sum' } },

                    visitors: { specs: { type: 'visits' },
                        periods: { from: this.state.monthStart, to: this.state.monthEnd } }
                }
            }
        )
        .done(function(result) {
            console.log('Revenue data loaded...');
            wnt.revenue = result;
            if(this.isMounted()) {
                // LOOP THROUGH DATA TO CREATE ARRAYS
                var self = this;
                var boxoffice = this.dataArray(result.box_bars, 'amount', this.state.days);
                $.each(boxoffice, function(index, item){
                        boxoffice[index] = self.calcBarHeight(item);
                });
                var cafe = this.dataArray(result.cafe_bars, 'amount', this.state.days);
                $.each(cafe, function(index, item){
                        cafe[index] = self.calcBarHeight(item);
                });
                var giftstore = this.dataArray(result.gift_bars, 'amount', this.state.days);
                $.each(giftstore, function(index, item){
                        giftstore[index] = self.calcBarHeight(item);
                });
                var membership = this.dataArray(result.mem_bars, 'amount', this.state.days);
                $.each(membership, function(index, item){
                        membership[index] = self.calcBarHeight(item);
                });
                // SET STATE TO ARRAYS FOR RENDERING
                this.setState({
                    boxofficeHeight: boxoffice,
                    cafeHeight: cafe,
                    giftstoreHeight: giftstore,
                    membershipHeight: membership,
                    // NEW FOR ACCORDION ...
                    boxofficeNow: result.box_sum.amount,
                    boxofficeThen: result.box_sum_prior.amount,
                    boxofficeChange: this.calcChange(result.box_sum.amount, result.box_sum_prior.amount),
                    boxofficeNowON: result.box_sum_online.amount,
                    boxofficeThenON: result.box_sum_online_prior.amount,
                    boxofficeChangeON: this.calcChange(result.box_sum_online.amount, result.box_sum_online_prior.amount),
                    boxofficeNowOFF: result.box_sum_offline.amount,
                    boxofficeThenOFF: result.box_sum_offline_prior.amount,
                    boxofficeChangeOFF: this.calcChange(result.box_sum_offline.amount, result.box_sum_offline_prior.amount),

                    groupsNow: result.groups_sum.amount,
                    groupsThen: result.groups_sum_prior.amount,
                    groupsChange: this.calcChange(result.groups_sum.amount, result.groups_sum_prior.amount),

                    cafeNow: result.cafe_sum.amount,
                    cafeThen: result.cafe_sum_prior.amount,
                    cafeChange: this.calcChange(result.cafe_sum.amount, result.cafe_sum_prior.amount),

                    giftstoreNow: result.gift_sum.amount,
                    giftstoreThen: result.gift_sum_prior.amount,
                    giftstoreChange: this.calcChange(result.gift_sum.amount, result.gift_sum_prior.amount),

                    membershipNow: result.mem_sum.amount,
                    membershipThen: result.mem_sum_prior.amount,
                    membershipChange: this.calcChange(result.mem_sum.amount, result.mem_sum_prior.amount)
                });
                // Set null data to '-'
                // var self = this;
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
                // Set default for datepicker
                $('#revenue #datepicker').val(wnt.datePickerStart);
                // Switch format for datePickerStart to be used in weather API
                wnt.datePickerStart = wnt.formatDate(new Date(wnt.datePickerStart));
                /*
                wnt.gettingData = $.Deferred();
                wnt.getData('boxofficeTEST', 'sales', 'gate', '2015-08-01', '2015-8-3');
                $.when(wnt.gettingData).done(function(data) {
                    console.log(data);
                    console.log(data[0].amount);
                });
                */
            }
        }.bind(this))   // .bind() gives context to 'this'
        .fail(function(result) {
            console.log('REVENUE DATA ERROR! ... ' + result.statusText);
            console.log(result);
        });
        $.get(
            wnt.apiWeather,
            {
                venue_id: wnt.venueID,
                from: this.state.barDates[0].replace(/\//g,'-'),
                to: this.state.barDates[this.state.barDates.length-1].replace(/\//g,'-')
            }
        )
        .done(function(result){
            console.log('Weather data loaded...');
            wnt.weatherPeriod = result;
            self.setState({
                weather: result,
            });
        })
        .fail(function(result){
            var noData = {
                icon_1: 'blank',
                temp_1: '...',
                summary_1: '...'
            };
            wnt.weatherPeriod = noData;
            console.log('WEATHER BARS DATA ERROR! ... ' + result.statusText);
        });
    },
    dataArray: function(stat, statUnits, days) {
        var data = [];
        for(i=0; i<days; i++) {
            if(stat[i] !== undefined){
                data.push(stat[i][statUnits]);
            } else {
                data.push(0);
            }
        }
        return data;
    },
    calcBarHeight: function(amount) {
        var barSectionHeight = (amount / wnt.graphCap) * this.state.graphHeight;
        return barSectionHeight+'px';
    },
    calcChange: function(newstat, oldstat) {
        // NEW!!! ... 3 ... AND OLD ... It's the same!
        var change = parseFloat(newstat) - parseFloat(oldstat);   // Calculate difference
        change = (change / newstat) * 100;   // Calculate percentage
        var direction = change < 0 ? "down" : "up";   // Test for negative or positive and set arrow direction
        change = Math.abs(change);   // Convert to positive number
        change = Math.round(100*change)/100;   // Round to hundredths
        change = [change, direction]
        return change;
    },
    componentDidUpdate: function(){
        var self = this;
        // BAR SET PLACEMENT
        var days = wnt.daysInMonth(wnt.thisMonthNum,wnt.thisYear);   // SET BASED ON MONTH IN FILTER
        var barSpacing = $('#bar-graph-scroll-pane').width() / 7;
        var barWidth = $('.bar-set').width();
        var barPlacement = (barSpacing - barWidth) / 2;
        var weekWidth = $('#bar-graph-scroll-pane').width();
        var monthWidth = (weekWidth / 7) * days;
        $('#bar-graph').css('width',monthWidth+'px');
        $.each($('.bar-set'), function(index, item){
            $(item).css('left',barPlacement+'px')
            barPlacement = barPlacement + barSpacing;
        });
        // ANIMATIONS
        $.each($('.bar-section-boxoffice'), function(index, item){
            $(this).css('height','0')
                .animate({
                    height: self.state.boxofficeHeight[index]
                },
                2000,
                'easeOutElastic'
            );
        });
        $.each($('.bar-section-cafe'), function(index, item){
            $(this).css('height','0')
                .animate({
                    height: self.state.cafeHeight[index]
                },
                2000,
                'easeOutElastic'
            );
        });
        $.each($('.bar-section-giftstore'), function(index, item){
            $(this).css('height','0')
                .animate({
                    height: self.state.giftstoreHeight[index]
                },
                2000,
                'easeOutElastic'
            );
        });
        $.each($('.bar-section-membership'), function(index, item){
            $(this).css('height','0')
                .animate({
                    height: self.state.membershipHeight[index]
                },
                2000,
                'easeOutElastic'
            );
        });
        this.formatNumbers();
        $('.bar-set').popover({ container: 'body' });
        /*$('.bar-set').on('shown.bs.popover', function () {
            var $popover = $('.popover');
            $popover.css({
                'position': 'fixed',
                'z-index': '2015'
            });
        });*/
        /*
        $( "div" ).mousemove(function( event ) {
            var pageCoords = "( " + event.pageX + ", " + event.pageY + " )";
            var clientCoords = "( " + event.clientX + ", " + event.clientY + " )";
            $( "span:first" ).text( "( event.pageX, event.pageY ) : " + pageCoords );
            $( "span:last" ).text( "( event.clientX, event.clientY ) : " + clientCoords );
        });
        */
        //wnt.gettingWeatherData = $.Deferred();
        //wnt.getWeather(this.state.barDates[0].replace(/\//g,'-'), this.state.barDates[this.state.barDates.length-1].replace(/\//g,'-'));
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
    formatSingleNumber: function(number){   // Used in bar set rollovers
        number = number.toString();
        number = $.parseNumber(number, {format:"$#,###", locale:"us"});
        number = $.formatNumber(number, {format:"$#,###", locale:"us"});
        return number;
    },
    weekChange: function(event) {
        // TO DO: Switch date formats to double-digits for any API calls
        var self = this;
        wnt.datePickerStart = new Date(event.target.value);
        var selectedMonth = wnt.datePickerStart.getMonth()+1;
        var selectedYear = wnt.datePickerStart.getFullYear();
        wnt.selectedMonthDays = wnt.daysInMonth(selectedMonth, selectedYear);
        var selectedMonthStart = selectedYear+'-'+selectedMonth+'-1';   // yyyy-m-d
        var selectedMonthEnd = selectedYear+'-'+selectedMonth+'-'+wnt.selectedMonthDays;   // yyyy-m-d
        var selectedDay = wnt.datePickerStart.getDate();

        $("#bar-graph-slider").slider('value', (selectedDay / wnt.selectedMonthDays) * 100);

        wnt.datePickerStart = wnt.formatDate(wnt.datePickerStart);
        var weekEnd = new Date(wnt.datePickerStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd = wnt.formatDate(weekEnd);
        var priorWeekRange = wnt.getDateRange(wnt.datePickerStart, 'last week');
        var priorWeekStart = priorWeekRange[0];
        var priorWeekEnd = priorWeekRange[1];
        // SET DATES FOR BAR TAGS
        var barDatesWeekEnd = new Date(wnt.datePickerStart);
        barDatesWeekEnd.setDate(barDatesWeekEnd.getDate() + 8);
        barDatesWeekEnd = wnt.formatDate(barDatesWeekEnd);
        // NEW: Set dates to all in selected month
        // $("#bar-graph-slider").slider('value',50);      //  This works ... 0-100 ... SET POSITION OF SLIDER BASED ON DATE
        // july 5 = 5/31 = 16.13% for slider value
        var barDates = wnt.getMonth(wnt.datePickerStart);
        $.post(
            wnt.apiMain,
            {
                venue_id: wnt.venueID,
                queries: {
                    box_bars: { specs: { type: 'sales', channel: 'gate' },
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },
                    box_sum: { specs: { type: 'sales', channel: 'gate' }, 
                        periods: { from: wnt.datePickerStart, to: weekEnd, kind: 'sum' } },
                    box_sum_prior: { specs: { type: 'sales', channel: 'gate' }, 
                        periods: { from: priorWeekStart, to: priorWeekEnd, kind: 'sum' } },
                    box_sum_online: { specs: { type: 'sales', channel: 'gate', online: true }, 
                        periods: { from: wnt.datePickerStart, to: weekEnd, kind: 'sum' } },
                    box_sum_online_prior: { specs: { type: 'sales', channel: 'gate', online: true }, 
                        periods: { from: priorWeekStart, to: priorWeekEnd, kind: 'sum' } },
                    box_sum_offline: { specs: { type: 'sales', channel: 'gate', online: false }, 
                        periods: { from: wnt.datePickerStart, to: weekEnd, kind: 'sum' } },
                    box_sum_offline_prior: { specs: { type: 'sales', channel: 'gate', online: false }, 
                        periods: { from: priorWeekStart, to: priorWeekEnd, kind: 'sum' } },

                    cafe_bars: { specs: { type: 'sales', channel: 'cafe' }, 
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },
                    cafe_sum: { specs: { type: 'sales', channel: 'cafe' }, 
                        periods: { from: wnt.datePickerStart, to: weekEnd, kind: 'sum' } },
                    cafe_sum_prior: { specs: { type: 'sales', channel: 'cafe' }, 
                        periods: { from: priorWeekStart, to: priorWeekEnd, kind: 'sum' } },
                    cafe_bars_members: { specs: { type: 'sales', channel: 'cafe', members: true }, 
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },
                    cafe_bars_nonmembers: { specs: { type: 'sales', channel: 'cafe', members: false }, 
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },
                    
                    gift_bars: { specs: { type: 'sales', channel: 'store' }, 
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },
                    gift_sum: { specs: { type: 'sales', channel: 'store' }, 
                        periods: { from: wnt.datePickerStart, to: weekEnd, kind: 'sum' } },
                    gift_sum_prior: { specs: { type: 'sales', channel: 'store' }, 
                        periods: { from: priorWeekStart, to: priorWeekEnd, kind: 'sum' } },
                    gift_bars_members: { specs: { type: 'sales', channel: 'store', members: true }, 
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },
                    gift_bars_nonmembers: { specs: { type: 'sales', channel: 'store', members: false },
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },
                    
                    mem_bars: { specs: { type: 'sales', channel: 'membership' },
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },
                    mem_sum: { specs: { type: 'sales', channel: 'membership' }, 
                        periods: { from: wnt.datePickerStart, to: weekEnd, kind: 'sum' } },
                    mem_sum_prior: { specs: { type: 'sales', channel: 'membership' }, 
                        periods: { from: priorWeekStart, to: priorWeekEnd, kind: 'sum' } },

                    groups_sum: { specs: { type: 'sales', kinds: ['group'] }, 
                        periods: { from: wnt.datePickerStart, to: weekEnd, kind: 'sum' } },
                    groups_sum_prior: { specs: { type: 'sales', kinds: ['group'] }, 
                        periods: { from: priorWeekStart, to: priorWeekEnd, kind: 'sum' } },

                    visitors: { specs: { type: 'visits' },
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } }
                }
            }
        )
        .done(function(result) {
            console.log('Revenue data loaded (again)...');
            wnt.revenue = result;
            // AFTER the bar graph data loads, grab the weather data BEFORE setting the state since the rendering happens after EVERY .setState() call
            $.get(
                wnt.apiWeather,
                {
                    venue_id: wnt.venueID,
                    from: barDates[0].replace(/\//g,'-'),
                    to: barDates[barDates.length-1].replace(/\//g,'-')
                }
            )
            .done(function(weather){
                console.log('Weather data loaded...');
                wnt.weatherPeriod = weather;
                if(self.isMounted()) {
                    // LOOP THROUGH DATA TO CREATE ARRAYS
                    var boxoffice = self.dataArray(result.box_bars, 'amount', wnt.selectedMonthDays);
                    $.each(boxoffice, function(index, item){
                            boxoffice[index] = self.calcBarHeight(item);
                    });
                    var cafe = self.dataArray(result.cafe_bars, 'amount', wnt.selectedMonthDays);
                    $.each(cafe, function(index, item){
                            cafe[index] = self.calcBarHeight(item);
                    });
                    var giftstore = self.dataArray(result.gift_bars, 'amount', wnt.selectedMonthDays);
                    $.each(giftstore, function(index, item){
                            giftstore[index] = self.calcBarHeight(item);
                    });
                    var membership = self.dataArray(result.mem_bars, 'amount', wnt.selectedMonthDays);
                    $.each(membership, function(index, item){
                            membership[index] = self.calcBarHeight(item);
                    });
                    // SET STATE TO ARRAYS FOR RENDERING
                    self.setState({
                        days: wnt.selectedMonthDays,
                        barDates: barDates,
                        boxofficeHeight: boxoffice,
                        cafeHeight: cafe,
                        giftstoreHeight: giftstore,
                        membershipHeight: membership,
                        // NEW FOR ACCORDION ...
                        boxofficeNow: result.box_sum.amount,
                        boxofficeThen: result.box_sum_prior.amount,
                        boxofficeChange: self.calcChange(result.box_sum.amount, result.box_sum_prior.amount),
                        boxofficeNowON: result.box_sum_online.amount,
                        boxofficeThenON: result.box_sum_online_prior.amount,
                        boxofficeChangeON: self.calcChange(result.box_sum_online.amount, result.box_sum_online_prior.amount),
                        boxofficeNowOFF: result.box_sum_offline.amount,
                        boxofficeThenOFF: result.box_sum_offline_prior.amount,
                        boxofficeChangeOFF: self.calcChange(result.box_sum_offline.amount, result.box_sum_offline_prior.amount),

                        groupsNow: result.groups_sum.amount,
                        groupsThen: result.groups_sum_prior.amount,
                        groupsChange: self.calcChange(result.groups_sum.amount, result.groups_sum_prior.amount),

                        cafeNow: result.cafe_sum.amount,
                        cafeThen: result.cafe_sum_prior.amount,
                        cafeChange: self.calcChange(result.cafe_sum.amount, result.cafe_sum_prior.amount),

                        giftstoreNow: result.gift_sum.amount,
                        giftstoreThen: result.gift_sum_prior.amount,
                        giftstoreChange: self.calcChange(result.gift_sum.amount, result.gift_sum_prior.amount),

                        membershipNow: result.mem_sum.amount,
                        membershipThen: result.mem_sum_prior.amount,
                        membershipChange: self.calcChange(result.mem_sum.amount, result.mem_sum_prior.amount),

                        weather: weather
                    });
                    // Set null data to '-'
                    $.each(self.state, function(stat, value){
                        if(value === null){
                            var stateObject = function() {
                                returnObj = {};
                                returnObj[stat] = '-';
                                return returnObj;
                            };
                            self.setState(stateObject);
                        }
                    });
                }
            }.bind(this))   // .bind() gives context to 'this'
            .fail(function(result) {
                console.log('REVENUE DATA ERROR! ... ' + result.statusText);
                console.log(result);
            });
        })
        .fail(function(result){
            var noData = {
                icon_1: 'blank',
                temp_1: '...',
                summary_1: '...'
            };
            wnt.weatherPeriod = noData;
            console.log('WEATHER BARS DATA ERROR! ... ' + result.statusText);
        });    
    },
    graphFilter: function(event) {
        var filter = event.target.value;
        var self = this;
        // Math.max(wnt.revenue.cafe[0].amount,wnt.revenue.cafe[1].amount,wnt.revenue.cafe[2].amount,wnt.revenue.cafe[3].amount,wnt.revenue.cafe[4].amount,wnt.revenue.cafe[5].amount,wnt.revenue.cafe[6].amount)
        /*
            $.each([ 52, 97 ], function( index, value ) {
                alert( index + ": " + value );
            });
        */
        var greatest = [];
        $.each(wnt.revenue.box_bars, function(index, value){
            greatest.push(value.amount);
        });
        greatest = Math.max.apply(null, greatest);

        if(filter === 'totals'){
            wnt.graphCap = 80000;
            $('.bar-graph-label-y').show();
            $('.y-marker').eq(0).attr('data-content','80');
            $('.y-marker').eq(1).attr('data-content','60');
            $('.y-marker').eq(2).attr('data-content','40');
            $('.y-marker').eq(3).attr('data-content','20');
            var boxoffice = this.dataArray(wnt.revenue.box_bars, 'amount', this.state.days);
            $.each(boxoffice, function(index, item){
                    boxoffice[index] = self.calcBarHeight(item);
            });
            var cafe = this.dataArray(wnt.revenue.cafe_bars, 'amount', this.state.days);
            $.each(cafe, function(index, item){
                    cafe[index] = self.calcBarHeight(item);
            });
            var giftstore = this.dataArray(wnt.revenue.gift_bars, 'amount', this.state.days);
            $.each(giftstore, function(index, item){
                    giftstore[index] = self.calcBarHeight(item);
            });
            var membership = this.dataArray(wnt.revenue.mem_bars, 'amount', this.state.days);
            $.each(membership, function(index, item){
                    membership[index] = self.calcBarHeight(item);
            });
            // SET STATE TO ARRAYS FOR RENDERING
            this.setState({
                boxofficeHeight: boxoffice,
                cafeHeight: cafe,
                giftstoreHeight: giftstore,
                membershipHeight: membership
            });
        } else if(filter === 'members'){
            // TEMPORARILY LOCALIZED since this is the largest area of $$$ for the graph cap
            var greatest = [];
            $.each(wnt.revenue.mem_bars, function(index, value){
                greatest.push(value.amount);
            });
            greatest = Math.max.apply(null, greatest);
            wnt.graphCap = Math.ceil(greatest / 1000) * 1000;
            $('.y-marker').eq(0).attr('data-content','8');
            $('.y-marker').eq(1).attr('data-content','6');
            $('.y-marker').eq(2).attr('data-content','4');
            $('.y-marker').eq(3).attr('data-content','2');
            var cafe = this.dataArray(wnt.revenue.cafe_bars_members, 'amount', this.state.days);
            $.each(cafe, function(index, item){
                    cafe[index] = self.calcBarHeight(item);
            });
            var giftstore = this.dataArray(wnt.revenue.gift_bars_members, 'amount', this.state.days);
            $.each(giftstore, function(index, item){
                    giftstore[index] = self.calcBarHeight(item);
            });
            var membership = this.dataArray(wnt.revenue.mem_bars, 'amount', this.state.days);
            $.each(membership, function(index, item){
                    membership[index] = self.calcBarHeight(item);
            });
            // SET STATE TO ARRAYS FOR RENDERING
            this.setState({
                boxofficeHeight: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                cafeHeight: cafe,
                giftstoreHeight: giftstore,
                membershipHeight: membership
            });
        } else if(filter === 'nonmembers'){
            wnt.graphCap = 80000;
            $('.bar-graph-label-y').show();
            $('.y-marker').eq(0).attr('data-content','80');
            $('.y-marker').eq(1).attr('data-content','60');
            $('.y-marker').eq(2).attr('data-content','40');
            $('.y-marker').eq(3).attr('data-content','20');

            var boxoffice = this.dataArray(wnt.revenue.box_bars, 'amount', this.state.days);
            $.each(boxoffice, function(index, item){
                    boxoffice[index] = self.calcBarHeight(item);
            });
            var cafe = this.dataArray(wnt.revenue.cafe_bars_nonmembers, 'amount', this.state.days);
            $.each(cafe, function(index, item){
                    cafe[index] = self.calcBarHeight(item);
            });
            var giftstore = this.dataArray(wnt.revenue.gift_bars_nonmembers, 'amount', this.state.days);
            $.each(giftstore, function(index, item){
                    giftstore[index] = self.calcBarHeight(item);
            });
            // SET STATE TO ARRAYS FOR RENDERING
            this.setState({
                boxofficeHeight: boxoffice,
                cafeHeight: cafe,
                giftstoreHeight: giftstore,
                membershipHeight: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            });
        } else {
            wnt.graphCap = 80000;
            $('.bar-graph-label-y').show();
            $('.y-marker').eq(0).attr('data-content','80');
            $('.y-marker').eq(1).attr('data-content','60');
            $('.y-marker').eq(2).attr('data-content','40');
            $('.y-marker').eq(3).attr('data-content','20');
            var boxoffice = this.dataArray(wnt.revenue.box_bars, 'amount', this.state.days);
            $.each(boxoffice, function(index, item){
                    boxoffice[index] = self.calcBarHeight(item);
            });
            var cafe = this.dataArray(wnt.revenue.cafe_bars, 'amount', this.state.days);
            $.each(cafe, function(index, item){
                    cafe[index] = self.calcBarHeight(item);
            });
            var giftstore = this.dataArray(wnt.revenue.gift_bars, 'amount', this.state.days);
            $.each(giftstore, function(index, item){
                    giftstore[index] = self.calcBarHeight(item);
            });
            var membership = this.dataArray(wnt.revenue.mem_bars, 'amount', this.state.days);
            $.each(membership, function(index, item){
                    membership[index] = self.calcBarHeight(item);
            });
            // SET STATE TO ARRAYS FOR RENDERING
            this.setState({
                boxofficeHeight: boxoffice,
                cafeHeight: cafe,
                giftstoreHeight: giftstore,
                membershipHeight: membership
            });
        }
        event.target.blur();
    },
    graphUnits: function(event) {
        // Per Cap = XYZ Sales / Total Visitors
        var filter = event.target.value;
        var self = this;
        if(filter === 'dollars'){
            wnt.graphCap = 80000;
            $('.bar-graph-label-y').show();
            $('.y-marker').eq(0).attr('data-content','80');
            $('.y-marker').eq(1).attr('data-content','60');
            $('.y-marker').eq(2).attr('data-content','40');
            $('.y-marker').eq(3).attr('data-content','20');
            var boxoffice = this.dataArray(wnt.revenue.box_bars, 'amount', this.state.days);
            $.each(boxoffice, function(index, item){
                    boxoffice[index] = self.calcBarHeight(item);
            });
            var cafe = this.dataArray(wnt.revenue.cafe_bars, 'amount', this.state.days);
            $.each(cafe, function(index, item){
                    cafe[index] = self.calcBarHeight(item);
            });
            var giftstore = this.dataArray(wnt.revenue.gift_bars, 'amount', this.state.days);
            $.each(giftstore, function(index, item){
                    giftstore[index] = self.calcBarHeight(item);
            });
            var membership = this.dataArray(wnt.revenue.mem_bars, 'amount', this.state.days);
            $.each(membership, function(index, item){
                    membership[index] = self.calcBarHeight(item);
            });
            // SET STATE TO ARRAYS FOR RENDERING
            this.setState({
                boxofficeHeight: boxoffice,
                cafeHeight: cafe,
                giftstoreHeight: giftstore,
                membershipHeight: membership
            });
        } else {
            wnt.graphCap = 20;
            $('.bar-graph-label-y').hide();
            $('.y-marker').eq(0).attr('data-content','20');
            $('.y-marker').eq(1).attr('data-content','15');
            $('.y-marker').eq(2).attr('data-content','10');
            $('.y-marker').eq(3).attr('data-content','5');
            var visitors = this.dataArray(wnt.revenue.visitors, 'units', this.state.days);
            var boxoffice = this.dataArray(wnt.revenue.box_bars, 'amount', this.state.days);
            $.each(boxoffice, function(index, item){
                    boxoffice[index] = self.calcBarHeight(item / visitors[index]);
            });
            var cafe = this.dataArray(wnt.revenue.cafe_bars, 'amount', this.state.days);
            $.each(cafe, function(index, item){
                    cafe[index] = self.calcBarHeight(item / visitors[index]);
            });
            var giftstore = this.dataArray(wnt.revenue.gift_bars, 'amount', this.state.days);
            $.each(giftstore, function(index, item){
                    giftstore[index] = self.calcBarHeight(item / visitors[index]);
            });
            var membership = this.dataArray(wnt.revenue.mem_bars, 'amount', this.state.days);
            $.each(membership, function(index, item){
                    membership[index] = self.calcBarHeight(item / visitors[index]);
            });
            // SET STATE TO ARRAYS FOR RENDERING
            this.setState({
                boxofficeHeight: boxoffice,
                cafeHeight: cafe,
                giftstoreHeight: giftstore,
                membershipHeight: membership
            });
        }
        event.target.blur();
    },
    channelFilter: function(event){
        // Toggle the legend/filter checkmark
        $(event.target).closest('.bar-graph-legend-item').find('.legend-check-circle').toggleClass('active');
        // Legend items each have a data attribute for matching to their respective bar segments to toggle
        var filter = $(event.target).closest('.bar-graph-legend-item').data('segment');
        $('.'+filter).toggle();
    },
    render: function(){
        // LOOP FOR BAR SETS
        var bars = [];
        for (var i = 0; i < this.state.days; i++) {
            var box = 0,
                cafe = 0,
                gift = 0,
                mem = 0,
                icon1 = 'blank',
                icon2 = 'blank',
                temp1 = '...',
                temp2 = '...',
                summary1 = '...',
                summary2 = '...';
            if(wnt.revenue !== undefined){
                if(wnt.revenue.box_bars[i] !== undefined){
                    box = this.formatSingleNumber(wnt.revenue.box_bars[i].amount);
                };
                if(wnt.revenue.cafe_bars[i] !== undefined){
                    cafe = this.formatSingleNumber(wnt.revenue.cafe_bars[i].amount);
                };
                if(wnt.revenue.gift_bars[i] !== undefined){
                    gift = this.formatSingleNumber(wnt.revenue.gift_bars[i].amount);
                };
                if(wnt.revenue.mem_bars[i] !== undefined){
                    mem = this.formatSingleNumber(wnt.revenue.mem_bars[i].amount);
                };
            };
            if(this.state.weather !== undefined){
                if(this.state.weather[i] !== undefined){
                    icon1 = this.state.weather[i].icon_1;
                    icon2 = this.state.weather[i].icon_2;
                    temp1 = Math.round(this.state.weather[i].temp_1)+'&deg; F';
                    temp2 = Math.round(this.state.weather[i].temp_2)+'&deg; F';
                    summary1 = this.state.weather[i].summary_1;
                    summary2 = this.state.weather[i].summary_2;
                };
            }
            bars.push(<BarSet date={this.state.barDates[i]} key={i} box={box} cafe={cafe} gift={gift} mem={mem} icon1={icon1} icon2={icon2} temp1={temp1} temp2={temp2} summary1={summary1} summary2={summary2} />);
        }
        // HAD TO USE ONFOCUS SINCE ONCHANGE WASN'T FIRING WITH DATEPICKER PLUGIN
        return (
            <div className="row">
                <div className="col-xs-8 col-md-8">
                    <div className="widget" id="revenue">
                        <h2>Revenue</h2>
                        <form id="filter-revenue-week">
                            <span className="week-picker-text">Week beginning</span>
                            <input type="text" id="datepicker" onFocus={this.weekChange} />
                        </form>

                        <form id="filter-revenue-section">
                            <select className="form-control" onChange={this.graphFilter}>
                                <option value="totals">Totals</option>
                                <option value="members">Members</option>
                                <option value="nonmembers">Non-members</option>
                                <option value="custom">Custom</option>
                            </select>
                            <Caret className="filter-caret" />
                        </form>

                        <form id="filter-revenue-units">
                            <select className="form-control" onChange={this.graphUnits}>
                                <option value="dollars">Dollars</option>
                                <option value="percap">Per Cap</option>
                            </select>
                            <Caret className="filter-caret" />
                        </form>

                        <div className="bar-graph-legend">
                            <div className="bar-graph-legend-item" data-segment="bar-section-boxoffice" onClick={this.channelFilter}>
                                <div className="legend-check-circle active">
                                    <CheckMark className="legend-check" />
                                </div>
                                Box Office
                            </div>
                            <div className="bar-graph-legend-item" data-segment="bar-section-cafe" onClick={this.channelFilter}>
                                <div className="legend-check-circle active">
                                    <CheckMark className="legend-check" />
                                </div>
                                Cafe
                            </div>
                            <div className="bar-graph-legend-item" data-segment="bar-section-giftstore" onClick={this.channelFilter}>
                                <div className="legend-check-circle active">
                                    <CheckMark className="legend-check" />
                                </div>
                                Gift Store
                            </div>
                            <div className="bar-graph-legend-item" data-segment="bar-section-membership" onClick={this.channelFilter}>
                                <div className="legend-check-circle active">
                                    <CheckMark className="legend-check" />
                                </div>
                                Membership
                            </div>
                        </div>

                        <div id="bar-graph-scroll-pane">
                            <div id="bar-graph-y">
                                <div className="y-marker" data-content="80"></div>
                                <div className="y-marker" data-content="60"></div>
                                <div className="y-marker" data-content="40"></div>
                                <div className="y-marker" data-content="20"></div>
                                <div className="bar-graph-label-y">Thousands</div>
                            </div>
                            <div id="bar-graph">
                                {bars}
                                <div className="bar-line"></div>
                                <div className="bar-line"></div>
                                <div className="bar-line"></div>
                                <div className="bar-line"></div>
                                <div className="bar-graph-Note"><NoteIcon /></div>
                                <div className="bar-graph-label-projected"><div className="legend-projected"></div> Projected</div>
                            </div>
                            <div className="scroll-bar-wrap ui-widget-content ui-corner-bottom">
                                <div className="bar-graph-slider scroll-bar" id="bar-graph-slider"></div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="col-xs-4 col-md-4 arrow-connector-left">
                    <div className="widget" id="earned-revenue">
                        <WeatherBar />
                        <h2>Earned Revenue</h2>
                        <ul id="revenue-accordion">
                            <AccordionItemPlus 
                                className="box-office"
                                label="Box Office Total"

                                stat={this.state.boxofficeNow}
                                statChange={this.state.boxofficeChange[0]}
                                arrow={this.state.boxofficeChange[1]}
                                comparedTo={this.state.boxofficeThen}

                                statON={this.state.boxofficeNowON}
                                statChangeON={this.state.boxofficeChangeON[0]}
                                arrowON={this.state.boxofficeChangeON[1]}
                                comparedToON={this.state.boxofficeThenON}

                                statOFF={this.state.boxofficeNowOFF}
                                statChangeOFF={this.state.boxofficeChangeOFF[0]}
                                arrowOFF={this.state.boxofficeChangeOFF[1]}
                                comparedToOFF={this.state.boxofficeThenOFF} />

                            <AccordionItem
                                className="groups"
                                label="Groups"
                                stat={this.state.groupsNow}
                                statChange={this.state.groupsChange[0]}
                                arrow={this.state.groupsChange[1]}
                                comparedTo={this.state.groupsThen} />
                            <AccordionItem
                                className="cafe"
                                label="Cafe Total"
                                stat={this.state.cafeNow}
                                statChange={this.state.cafeChange[0]}
                                arrow={this.state.cafeChange[1]}
                                comparedTo={this.state.cafeThen} />
                            <AccordionItem
                                className="gift-store"
                                label="Gift Store Total"
                                stat={this.state.giftstoreNow}
                                statChange={this.state.giftstoreChange[0]}
                                arrow={this.state.giftstoreChange[1]}
                                comparedTo={this.state.giftstoreThen} />
                            <AccordionItem
                                className="membership"
                                label="Membership"
                                stat={this.state.membershipNow}
                                statChange={this.state.membershipChange[0]}
                                arrow={this.state.membershipChange[1]}
                                comparedTo={this.state.membershipThen} />
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
});

if(document.getElementById('revenue-row-widget')){
    React.render(
        <Revenue />,
        document.getElementById('revenue-row-widget')
    );
    console.log('Revenue row loaded...');
}
