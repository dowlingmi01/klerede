/*****************************/
/******** REVENUE ROW ********/
/*****************************/

var BarSet = React.createClass({
    render: function() {
        return (
            <div className="bar-set">
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
            monthStart: wnt.thisYear+'-'+(wnt.thisMonthNum+1)+'-1',
            monthEnd: wnt.thisYear+'-'+(wnt.thisMonthNum+1)+'-'+wnt.daysInMonth(wnt.thisMonthNum+1,wnt.thisYear),

            barDates: wnt.getMonth(wnt.yesterday),   // This is why 9/1 is returning 8/31
            days: wnt.daysInMonth(wnt.thisMonthNum+1,wnt.thisYear),

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
                    boxoffice: { specs: { type: 'sales', channel: 'gate' }, 
                        periods: { from: this.state.monthStart, to: this.state.monthEnd } },
                    boxoffice_online: { specs: { type: 'sales', channel: 'gate', online: true }, 
                        periods: { from: this.state.monthStart, to: this.state.monthEnd } },
                    boxoffice_offline: { specs: { type: 'sales', channel: 'gate', online: false }, 
                        periods: { from: this.state.monthStart, to: this.state.monthEnd } },

                    groups: { specs: { type: 'sales', kinds: ['group'] }, 
                        periods: { from: this.state.monthStart, to: this.state.monthEnd } },

                    cafe: { specs: { type: 'sales', channel: 'cafe' }, 
                        periods: { from: this.state.monthStart, to: this.state.monthEnd } },
                    cafe_members: { specs: { type: 'sales', channel: 'cafe', members: true }, 
                        periods: { from: this.state.monthStart, to: this.state.monthEnd } },
                    cafe_nonmembers: { specs: { type: 'sales', channel: 'cafe', members: false }, 
                        periods: { from: this.state.monthStart, to: this.state.monthEnd } },

                    giftstore: { specs: { type: 'sales', channel: 'store' }, 
                        periods: { from: this.state.monthStart, to: this.state.monthEnd } },
                    giftstore_members: { specs: { type: 'sales', channel: 'store', members: true }, 
                        periods: { from: this.state.monthStart, to: this.state.monthEnd } },
                    giftstore_nonmembers: { specs: { type: 'sales', channel: 'store', members: false }, 
                        periods: { from: this.state.monthStart, to: this.state.monthEnd } },

                    membership: { specs: { type: 'sales', channel: 'membership' }, 
                        periods: { from: this.state.monthStart, to: this.state.monthEnd } },

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
                var boxoffice = this.dataArray(result.boxoffice, 'amount', this.state.days);
                $.each(boxoffice, function(index, item){
                        boxoffice[index] = self.calcBarHeight(item);
                });
                var cafe = this.dataArray(result.cafe, 'amount', this.state.days);
                $.each(cafe, function(index, item){
                        cafe[index] = self.calcBarHeight(item);
                });
                var giftstore = this.dataArray(result.giftstore, 'amount', this.state.days);
                $.each(giftstore, function(index, item){
                        giftstore[index] = self.calcBarHeight(item);
                });
                var membership = this.dataArray(result.membership, 'amount', this.state.days);
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
                    boxofficeNow: result.boxoffice[1].amount,
                    boxofficeThen: result.boxoffice[0].amount,
                    boxofficeChange: this.calcChange(result.boxoffice[1].amount, result.boxoffice[0].amount),
                    boxofficeNowON: result.boxoffice_online[1].amount,
                    boxofficeThenON: result.boxoffice_online[0].amount,
                    boxofficeChangeON: this.calcChange(result.boxoffice_online[1].amount, result.boxoffice_online[0].amount),
                    boxofficeNowOFF: result.boxoffice_offline[1].amount,
                    boxofficeThenOFF: result.boxoffice_offline[0].amount,
                    boxofficeChangeOFF: this.calcChange(result.boxoffice_offline[1].amount, result.boxoffice_offline[0].amount),

                    groupsNow: result.groups[1].amount,
                    groupsThen: result.groups[0].amount,
                    groupsChange: this.calcChange(result.groups[1].amount, result.groups[0].amount),

                    cafeNow: result.cafe[1].amount,
                    cafeThen: result.cafe[0].amount,
                    cafeChange: this.calcChange(result.cafe[1].amount, result.cafe[0].amount),

                    giftstoreNow: result.giftstore[1].amount,
                    giftstoreThen: result.giftstore[0].amount,
                    giftstoreChange: this.calcChange(result.giftstore[1].amount, result.giftstore[0].amount),

                    membershipNow: result.membership[1].amount,
                    membershipThen: result.membership[0].amount,
                    membershipChange: this.calcChange(result.membership[1].amount, result.membership[0].amount)
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
        var selectedMonthDays = wnt.daysInMonth(selectedMonth, selectedYear);
        var selectedMonthStart = selectedYear+'-'+selectedMonth+'-1';   // yyyy-m-d
        var selectedMonthEnd = selectedYear+'-'+selectedMonth+'-'+selectedMonthDays;   // yyyy-m-d
        var selectedDay = weekStart.getDate();

        $("#bar-graph-slider").slider('value', (selectedDay / selectedMonthDays) * 100);

        weekStart = wnt.formatDate(weekStart);
        var weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        weekEnd = wnt.formatDate(weekEnd);
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
                    boxoffice: { specs: { type: 'sales', channel: 'gate' }, 
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },
                    boxoffice_online: { specs: { type: 'sales', channel: 'gate', online: true }, 
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },
                    boxoffice_offline: { specs: { type: 'sales', channel: 'gate', online: false }, 
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },

                    groups: { specs: { type: 'sales', kinds: ['group'] }, 
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },

                    cafe: { specs: { type: 'sales', channel: 'cafe' }, 
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },
                    cafe_members: { specs: { type: 'sales', channel: 'cafe', members: true }, 
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },
                    cafe_nonmembers: { specs: { type: 'sales', channel: 'cafe', members: false }, 
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },

                    giftstore: { specs: { type: 'sales', channel: 'store' }, 
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },
                    giftstore_members: { specs: { type: 'sales', channel: 'store', members: true }, 
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },
                    giftstore_nonmembers: { specs: { type: 'sales', channel: 'store', members: false }, 
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },

                    membership: { specs: { type: 'sales', channel: 'membership' }, 
                        periods: { from: selectedMonthStart, to: selectedMonthEnd } },

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
                var boxoffice = this.dataArray(result.boxoffice, 'amount', selectedMonthDays);
                $.each(boxoffice, function(index, item){
                        boxoffice[index] = self.calcBarHeight(item);
                });
                var cafe = this.dataArray(result.cafe, 'amount', selectedMonthDays);
                $.each(cafe, function(index, item){
                        cafe[index] = self.calcBarHeight(item);
                });
                var giftstore = this.dataArray(result.giftstore, 'amount', selectedMonthDays);
                $.each(giftstore, function(index, item){
                        giftstore[index] = self.calcBarHeight(item);
                });
                var membership = this.dataArray(result.membership, 'amount', selectedMonthDays);
                $.each(membership, function(index, item){
                        membership[index] = self.calcBarHeight(item);
                });
                // SET STATE TO ARRAYS FOR RENDERING
                this.setState({
                    barDates: barDates,
                    boxofficeHeight: boxoffice,
                    cafeHeight: cafe,
                    giftstoreHeight: giftstore,
                    membershipHeight: membership,
                    // CURRENT DEV FOCUS 10/21/2015
                    // NEW TEST FOR SLIDER CHANGE...
                    // Position in array is zero-based, so use date-1
                    // "Day Before" is now 7 days prior, but -8 doesn't work when it's < 8 into month, so selecting "0" for now ...
                    // NEED TO RUN A CHECK AGAINST PERIOD (yyyy-mm-dd)!!!  sometimes days are skipped
                    boxofficeNow: result.boxoffice[selectedDay-1].amount,
                    boxofficeThen: result.boxoffice[0].amount,
                    boxofficeChange: this.calcChange(result.boxoffice[selectedDay-1].amount, result.boxoffice[0].amount),
                    boxofficeNowON: result.boxoffice_online[selectedDay-1].amount,
                    boxofficeThenON: result.boxoffice_online[0].amount,
                    boxofficeChangeON: this.calcChange(result.boxoffice_online[selectedDay-1].amount, result.boxoffice_online[0].amount),
                    boxofficeNowOFF: result.boxoffice_offline[selectedDay-1].amount,
                    boxofficeThenOFF: result.boxoffice_offline[0].amount,
                    boxofficeChangeOFF: this.calcChange(result.boxoffice_offline[selectedDay-1].amount, result.boxoffice_offline[0].amount),

                    groupsNow: result.groups[selectedDay-1].amount,
                    groupsThen: result.groups[0].amount,
                    groupsChange: this.calcChange(result.groups[selectedDay-1].amount, result.groups[0].amount),

                    cafeNow: result.cafe[selectedDay-1].amount,
                    cafeThen: result.cafe[0].amount,
                    cafeChange: this.calcChange(result.cafe[selectedDay-1].amount, result.cafe[0].amount),

                    giftstoreNow: result.giftstore[selectedDay-1].amount,
                    giftstoreThen: result.giftstore[0].amount,
                    giftstoreChange: this.calcChange(result.giftstore[selectedDay-1].amount, result.giftstore[0].amount),

                    membershipNow: result.membership[selectedDay-1].amount,
                    membershipThen: result.membership[0].amount,
                    membershipChange: this.calcChange(result.membership[selectedDay-1].amount, result.membership[0].amount)
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
        $.each(wnt.revenue.boxoffice, function(index, value){
            greatest.push(value.amount);
        });
        greatest = Math.max.apply(null, greatest);
        console.log(greatest);

        console.log(filter);
        if(filter === 'totals'){
            wnt.graphCap = 80000;
            $('.bar-graph-label-y').show();
            $('.y-marker').eq(0).attr('data-content','80');
            $('.y-marker').eq(1).attr('data-content','60');
            $('.y-marker').eq(2).attr('data-content','40');
            $('.y-marker').eq(3).attr('data-content','20');
            var boxoffice = this.dataArray(wnt.revenue.boxoffice, 'amount', this.state.days);
            $.each(boxoffice, function(index, item){
                    boxoffice[index] = self.calcBarHeight(item);
            });
            var cafe = this.dataArray(wnt.revenue.cafe, 'amount', this.state.days);
            $.each(cafe, function(index, item){
                    cafe[index] = self.calcBarHeight(item);
            });
            var giftstore = this.dataArray(wnt.revenue.giftstore, 'amount', this.state.days);
            $.each(giftstore, function(index, item){
                    giftstore[index] = self.calcBarHeight(item);
            });
            var membership = this.dataArray(wnt.revenue.membership, 'amount', this.state.days);
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
            $.each(wnt.revenue.membership, function(index, value){
                greatest.push(value.amount);
            });
            greatest = Math.max.apply(null, greatest);
            console.log(greatest);
            wnt.graphCap = Math.ceil(greatest / 1000) * 1000;
            $('.y-marker').eq(0).attr('data-content','8');
            $('.y-marker').eq(1).attr('data-content','6');
            $('.y-marker').eq(2).attr('data-content','4');
            $('.y-marker').eq(3).attr('data-content','2');
            var cafe = this.dataArray(wnt.revenue.cafe_members, 'amount', this.state.days);
            $.each(cafe, function(index, item){
                    cafe[index] = self.calcBarHeight(item);
            });
            var giftstore = this.dataArray(wnt.revenue.giftstore_members, 'amount', this.state.days);
            $.each(giftstore, function(index, item){
                    giftstore[index] = self.calcBarHeight(item);
            });
            var membership = this.dataArray(wnt.revenue.membership, 'amount', this.state.days);
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

            var boxoffice = this.dataArray(wnt.revenue.boxoffice, 'amount', this.state.days);
            $.each(boxoffice, function(index, item){
                    boxoffice[index] = self.calcBarHeight(item);
            });
            var cafe = this.dataArray(wnt.revenue.cafe_nonmembers, 'amount', this.state.days);
            $.each(cafe, function(index, item){
                    cafe[index] = self.calcBarHeight(item);
            });
            var giftstore = this.dataArray(wnt.revenue.giftstore_nonmembers, 'amount', this.state.days);
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
            var boxoffice = this.dataArray(wnt.revenue.boxoffice, 'amount', this.state.days);
            $.each(boxoffice, function(index, item){
                    boxoffice[index] = self.calcBarHeight(item);
            });
            var cafe = this.dataArray(wnt.revenue.cafe, 'amount', this.state.days);
            $.each(cafe, function(index, item){
                    cafe[index] = self.calcBarHeight(item);
            });
            var giftstore = this.dataArray(wnt.revenue.giftstore, 'amount', this.state.days);
            $.each(giftstore, function(index, item){
                    giftstore[index] = self.calcBarHeight(item);
            });
            var membership = this.dataArray(wnt.revenue.membership, 'amount', this.state.days);
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
        console.log(filter);
        if(filter === 'dollars'){
            wnt.graphCap = 80000;
            $('.bar-graph-label-y').show();
            $('.y-marker').eq(0).attr('data-content','80');
            $('.y-marker').eq(1).attr('data-content','60');
            $('.y-marker').eq(2).attr('data-content','40');
            $('.y-marker').eq(3).attr('data-content','20');
            var boxoffice = this.dataArray(wnt.revenue.boxoffice, 'amount', this.state.days);
            $.each(boxoffice, function(index, item){
                    boxoffice[index] = self.calcBarHeight(item);
            });
            var cafe = this.dataArray(wnt.revenue.cafe, 'amount', this.state.days);
            $.each(cafe, function(index, item){
                    cafe[index] = self.calcBarHeight(item);
            });
            var giftstore = this.dataArray(wnt.revenue.giftstore, 'amount', this.state.days);
            $.each(giftstore, function(index, item){
                    giftstore[index] = self.calcBarHeight(item);
            });
            var membership = this.dataArray(wnt.revenue.membership, 'amount', this.state.days);
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
            var boxoffice = this.dataArray(wnt.revenue.boxoffice, 'amount', this.state.days);
            $.each(boxoffice, function(index, item){
                    boxoffice[index] = self.calcBarHeight(item / visitors[index]);
            });
            var cafe = this.dataArray(wnt.revenue.cafe, 'amount', this.state.days);
            $.each(cafe, function(index, item){
                    cafe[index] = self.calcBarHeight(item / visitors[index]);
            });
            var giftstore = this.dataArray(wnt.revenue.giftstore, 'amount', this.state.days);
            $.each(giftstore, function(index, item){
                    giftstore[index] = self.calcBarHeight(item / visitors[index]);
            });
            var membership = this.dataArray(wnt.revenue.membership, 'amount', this.state.days);
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
    render: function(){
        // LOOP FOR BAR SETS
        var bars = [];
        for (var i = 0; i < this.state.days; i++) {
            bars.push(<BarSet date={this.state.barDates[i]} key={i} />);
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
                        <h2>Earned Revenue <div className="add-note"><NoteIcon className="note" /> Add Note</div></h2>
                        <ul id="revenue-accordion">
                            <li className="notes">
                                <NoteIcon className="note" /> Notes <Caret className="accordion-caret" />
                            </li>
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
