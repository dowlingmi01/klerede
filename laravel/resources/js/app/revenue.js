/*****************************/
/******** REVENUE ROW ********/
/*****************************/

var BarSet = React.createClass({
    render: function() {
        return (  // TO DO: MAKE POPOVER DATA INTO TABLES ... {"goalStatusText " + this.state.statusClass}
            <div className="bar-set" 
                data-toggle="popover" 
                data-html="true" 
                data-content={"<img src='/img/04n.svg' class='popover-weather-icon'><div class='popover-temp'>"+this.props.temp+"&deg; F</div><div class='popover-weather-text'>Scattered Showers</div><table class='popover-data'><tr><td><div class='legend-circle-bo'></div></td><td>Box Office</td><td>"+this.props.box+"</td></tr><tr><td><div class='legend-circle-c'></div></td><td>Cafe</td><td>"+this.props.cafe+"</td></tr><tr><td><div class='legend-circle-gs'></div></td><td>Gift Store</td><td>"+this.props.gift+"</td></tr><tr><td><div class='legend-circle-bo'></div></td><td>Members</td><td>"+this.props.mem+"</td></tr></table>"} 
                data-placement="auto"
                data-trigger="click hover">
                <div className="bar-section bar-section-boxoffice"></div>
                <div className="bar-section bar-section-cafe"></div>
                <div className="bar-section bar-section-giftstore"></div>
                <div className="bar-section bar-section-membership"></div>
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

var WeatherBar = React.createClass({   // Weather API
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
    },
    render: function() {
        return (
            <div className="weather-bar">
                <div className="weather-icon"><img src={this.state.icon} alt="Weather icon" /></div>
                <div className="temperature">{this.state.temp}&deg; F</div>
                <div className="weather-text">{this.state.description}</div>
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
        $.post(
            wnt.apiPath,
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


                // Set default for datepicker
                $('#revenue #datepicker').val(wnt.datePickerStart);

                wnt.gettingData = $.Deferred();
                wnt.getData('boxofficeTEST', 'sales', 'gate', '2015-08-01', '2015-8-3');
                $.when(wnt.gettingData).done(function(data) {
                    console.log(data);
                    console.log(data[0].amount);
                    /*self.setState({
                        graphCap: 100000,
                    });*/
                });

                /*
                var d1 = $.Deferred();
                var d2 = $.Deferred();
                 
                $.when( d1, d2 ).done(function ( v1, v2 ) {
                    console.log( v1 ); // "Fish"
                    console.log( v2 ); // "Pizza"
                });
                 
                d1.resolve( "Fish" );
                d2.resolve( "Pizza" );
                */



            }
        }.bind(this))   // .bind() gives context to 'this'
        .fail(function(result) {
            console.log('REVENUE DATA ERROR! ... ' + result.statusText);
            console.log(result);
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
        // NEW!!! ... 1
        this.formatNumbers();
        $('.bar-set').popover();
    },
    formatNumbers: function(){
        // NEW!!! ... 2
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
    weekChange: function(event) {
        var weekStart = new Date(event.target.value);
        var selectedMonth = weekStart.getMonth()+1;
        var selectedYear = weekStart.getFullYear();
        wnt.selectedMonthDays = wnt.daysInMonth(selectedMonth, selectedYear);
        var selectedMonthStart = selectedYear+'-'+selectedMonth+'-1';   // yyyy-m-d
        var selectedMonthEnd = selectedYear+'-'+selectedMonth+'-'+wnt.selectedMonthDays;   // yyyy-m-d
        var selectedDay = weekStart.getDate();

        $("#bar-graph-slider").slider('value', (selectedDay / wnt.selectedMonthDays) * 100);

        weekStart = wnt.formatDate(weekStart);
        var weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd = wnt.formatDate(weekEnd);
        var priorWeekRange = wnt.getDateRange(weekStart, 'last week');
        var priorWeekStart = priorWeekRange[0];
        var priorWeekEnd = priorWeekRange[1];
        // SET DATES FOR BAR TAGS
        var barDatesWeekEnd = new Date(weekStart);
        barDatesWeekEnd.setDate(barDatesWeekEnd.getDate() + 8);
        barDatesWeekEnd = wnt.formatDate(barDatesWeekEnd);
        // NEW: Set dates to all in selected month
        // $("#bar-graph-slider").slider('value',50);      //  This works ... 0-100 ... SET POSITION OF SLIDER BASED ON DATE
        // july 5 = 5/31 = 16.13% for slider value
        var barDates = wnt.getMonth(weekStart);
        $.post(
            wnt.apiPath,
            {
                venue_id: wnt.venueID,
                queries: {
                    box_bars: { specs: { type: 'sales', channel: 'gate' },
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },
                    box_sum: { specs: { type: 'sales', channel: 'gate' }, 
                        periods: { from: weekStart, to: weekEnd, kind: 'sum' } },
                    box_sum_prior: { specs: { type: 'sales', channel: 'gate' }, 
                        periods: { from: priorWeekStart, to: priorWeekEnd, kind: 'sum' } },
                    box_sum_online: { specs: { type: 'sales', channel: 'gate', online: true }, 
                        periods: { from: weekStart, to: weekEnd, kind: 'sum' } },
                    box_sum_online_prior: { specs: { type: 'sales', channel: 'gate', online: true }, 
                        periods: { from: priorWeekStart, to: priorWeekEnd, kind: 'sum' } },
                    box_sum_offline: { specs: { type: 'sales', channel: 'gate', online: false }, 
                        periods: { from: weekStart, to: weekEnd, kind: 'sum' } },
                    box_sum_offline_prior: { specs: { type: 'sales', channel: 'gate', online: false }, 
                        periods: { from: priorWeekStart, to: priorWeekEnd, kind: 'sum' } },

                    cafe_bars: { specs: { type: 'sales', channel: 'cafe' }, 
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },
                    cafe_sum: { specs: { type: 'sales', channel: 'cafe' }, 
                        periods: { from: weekStart, to: weekEnd, kind: 'sum' } },
                    cafe_sum_prior: { specs: { type: 'sales', channel: 'cafe' }, 
                        periods: { from: priorWeekStart, to: priorWeekEnd, kind: 'sum' } },
                    cafe_bars_members: { specs: { type: 'sales', channel: 'cafe', members: true }, 
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },
                    cafe_bars_nonmembers: { specs: { type: 'sales', channel: 'cafe', members: false }, 
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },
                    
                    gift_bars: { specs: { type: 'sales', channel: 'store' }, 
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },
                    gift_sum: { specs: { type: 'sales', channel: 'store' }, 
                        periods: { from: weekStart, to: weekEnd, kind: 'sum' } },
                    gift_sum_prior: { specs: { type: 'sales', channel: 'store' }, 
                        periods: { from: priorWeekStart, to: priorWeekEnd, kind: 'sum' } },
                    gift_bars_members: { specs: { type: 'sales', channel: 'store', members: true }, 
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },
                    gift_bars_nonmembers: { specs: { type: 'sales', channel: 'store', members: false },
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },
                    
                    mem_bars: { specs: { type: 'sales', channel: 'membership' },
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },
                    mem_sum: { specs: { type: 'sales', channel: 'membership' }, 
                        periods: { from: weekStart, to: weekEnd, kind: 'sum' } },
                    mem_sum_prior: { specs: { type: 'sales', channel: 'membership' }, 
                        periods: { from: priorWeekStart, to: priorWeekEnd, kind: 'sum' } },

                    groups_sum: { specs: { type: 'sales', kinds: ['group'] }, 
                        periods: { from: weekStart, to: weekEnd, kind: 'sum' } },
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
            if(this.isMounted()) {
                // LOOP THROUGH DATA TO CREATE ARRAYS
                var self = this;
                var boxoffice = this.dataArray(result.box_bars, 'amount', wnt.selectedMonthDays);
                $.each(boxoffice, function(index, item){
                        boxoffice[index] = self.calcBarHeight(item);
                });
                var cafe = this.dataArray(result.cafe_bars, 'amount', wnt.selectedMonthDays);
                $.each(cafe, function(index, item){
                        cafe[index] = self.calcBarHeight(item);
                });
                var giftstore = this.dataArray(result.gift_bars, 'amount', wnt.selectedMonthDays);
                $.each(giftstore, function(index, item){
                        giftstore[index] = self.calcBarHeight(item);
                });
                var membership = this.dataArray(result.mem_bars, 'amount', wnt.selectedMonthDays);
                $.each(membership, function(index, item){
                        membership[index] = self.calcBarHeight(item);
                });
                // SET STATE TO ARRAYS FOR RENDERING
                this.setState({
                    days: wnt.selectedMonthDays,
                    barDates: barDates,
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
            }
        }.bind(this))   // .bind() gives context to 'this'
        .fail(function(result) {
            console.log('REVENUE DATA ERROR! ... ' + result.statusText);
            console.log(result);
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
    getTemp: function(){
        return '35'
    },
    render: function(){
        // LOOP FOR BAR SETS
        var bars = [];
        for (var i = 0; i < this.state.days; i++) {
            var box = 0,
                cafe = 0,
                gift = 0,
                mem = 0;
            if(wnt.revenue !== undefined){
                if(wnt.revenue.box_bars[i] !== undefined){
                    box = wnt.revenue.box_bars[i].amount;
                };
                if(wnt.revenue.cafe_bars[i] !== undefined){
                    cafe = wnt.revenue.cafe_bars[i].amount;
                };
                if(wnt.revenue.gift_bars[i] !== undefined){
                    gift = wnt.revenue.gift_bars[i].amount;
                };
                if(wnt.revenue.mem_bars[i] !== undefined){
                    mem = wnt.revenue.mem_bars[i].amount;
                };
            };
            bars.push(<BarSet date={this.state.barDates[i]} key={i} temp={this.getTemp()} box={box} cafe={cafe} gift={gift} mem={mem} />);
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

React.render(
    <Revenue />,
    document.getElementById('revenue-row-widget')
);

console.log('Revenue row loaded...');
