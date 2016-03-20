/*****************************/
/******** REVENUE ROW ********/
/*****************************/

var BarSet = React.createClass({
    convertDate: function(date) {
        if(date !== undefined){
            var delimeter = date.indexOf('/') !== -1 ? '/' : '-';
            date = date.split(delimeter);
            date = wnt.filterPeriod === 'month' ? date[2] : date[1]+'.'+date[2];
            return date;
        }
    },
    rolloverDate: function(date) {
        if(date !== undefined){
            var delimeter = date.indexOf('/') !== -1 ? '/' : '-';
            date = date.split(delimeter);
            date = new Date(date[0], date[1]-1, date[2]);
            dow = Date.dayNames[date.getDay()];
            d = date.getDate();
            y = date.getFullYear();
            m = Date.monthNames[date.getMonth()];
            date2 = date.next().saturday();
            d2 = date2.getDate();
            m2 = Date.monthNames[date2.getMonth()];
            if(wnt.filterPeriod === 'quarter'){
                date = m.substring(0,3)+' '+d+' - '+m2.substring(0,3)+' '+d2+', '+y;
            } else {
                date = dow+', '+m+' '+d+', '+y;
            }
            return date;
        }
    },
    processLineItem: function(value, classExt, label) {
        var html = value !== 0 ? "<tr><td><div class='legend-circle-"+classExt+"'></div></td><td>"+label+"</td><td>"+value+"</td></tr>" : '';
        return html;
    },
    renderWeather: function(){
        if(wnt.filterPeriod !== 'quarter'){
            var weather = "<div class='popover-weather-10am'><img src='/img/"+this.props.icon1+".svg' class='popover-weather-icon'><div class='popover-time'>10 A.M.</div><div class='popover-weather-text'>"+this.props.summary1+"</div><div class='popover-temp'>"+this.props.temp1+"</div></div><div class='popover-weather-4pm'><img src='/img/"+this.props.icon2+".svg' class='popover-weather-icon'><div class='popover-time'>4 P.M.</div><div class='popover-weather-text'>"+this.props.summary2+"</div><div class='popover-temp'>"+this.props.temp2+"</div></div>";
            return weather;
        } else {
            return '';
        }
    },
    render: function() {
        return (  // TO DO: MAKE POPOVER DATA INTO TABLES ... {"goalStatusText " + this.state.statusClass}
            <div className="bar-set" 
                data-toggle="popover" 
                data-html="true" 
                data-content={"<div class='popover-weather-bar'><div class='popover-date'>"+this.rolloverDate(this.props.date)+"</div>"+this.renderWeather()+"</div><table class='popover-data'>"+this.processLineItem(this.props.box, 'bo', 'Box Office')+this.processLineItem(this.props.cafe, 'c', 'Cafe')+this.processLineItem(this.props.gift, 'gs', 'Gift Store')+this.processLineItem(this.props.mem, 'm', 'Membership')+"</table>"} 
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

var Revenue = React.createClass({      // Klerede API for bar graph (NEW & WORKS) AND accordion details (NEW)
    getInitialState: function() {
        return {
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
    callAPI: function() {
        var self = this;
        var currentPeriod = wnt.getDateRange(wnt.filterDates, 'this '+wnt.filterPeriod);
        var priorPeriod = wnt.getDateRange(wnt.filterDates, 'last '+wnt.filterPeriod);
        wnt.barScope = 'date';
        // Get week numbers for quarter data retrieval
        if(wnt.filterPeriod === 'quarter'){
            currentPeriod[0] = wnt.getWeekNumber(currentPeriod[0], 'format');
            currentPeriod[1] = wnt.getWeekNumber(currentPeriod[1], 'format');
            priorPeriod[0] = wnt.getWeekNumber(priorPeriod[0], 'format');
            priorPeriod[1] = wnt.getWeekNumber(priorPeriod[1], 'format');
            wnt.barScope = 'week';
        }
        var totalBars = { type: 'sales' };
        if(wnt.filterVisitors === 'members'){
            totalBars = { type: 'sales', members: true };
        } else if(wnt.filterVisitors === 'nonmembers'){
            totalBars = { type: 'sales', members: false };
        }
        $.post(
            wnt.apiMain,
            {
                venue_id: wnt.venueID,
                queries: {
                    // Bar graph data ...
                    box_bars: { specs: { type: 'sales', channel: 'gate' }, 
                        periods: { type: wnt.barScope, from: currentPeriod[0], to: currentPeriod[1] } },

                    cafe_bars: { specs: { type: 'sales', channel: 'cafe' }, 
                        periods: { type: wnt.barScope, from: currentPeriod[0], to: currentPeriod[1] } },

                        cafe_bars_members: { specs: { type: 'sales', channel: 'cafe', members: true }, 
                            periods: { type: wnt.barScope, from: currentPeriod[0], to: currentPeriod[1] } },
                        cafe_bars_nonmembers: { specs: { type: 'sales', channel: 'cafe', members: false }, 
                            periods: { type: wnt.barScope, from: currentPeriod[0], to: currentPeriod[1] } },

                    gift_bars: { specs: { type: 'sales', channel: 'store' }, 
                        periods: { type: wnt.barScope, from: currentPeriod[0], to: currentPeriod[1] } },

                        gift_bars_members: { specs: { type: 'sales', channel: 'store', members: true }, 
                            periods: { type: wnt.barScope, from: currentPeriod[0], to: currentPeriod[1] } },
                        gift_bars_nonmembers: { specs: { type: 'sales', channel: 'store', members: false },
                            periods: { type: wnt.barScope, from: currentPeriod[0], to: currentPeriod[1] } },

                    mem_bars: { specs: { type: 'sales', channel: 'membership' },
                        periods: { type: wnt.barScope, from: currentPeriod[0], to: currentPeriod[1] } },

                    // Bar graph totals used to calculate max graph height ...
                    total_bars: { specs: totalBars, 
                        periods: { type: wnt.barScope, from: currentPeriod[0], to: currentPeriod[1] } },

                    // Bar graph visitors used to calculate Per Cap ...
                    visitors: { specs: { type: 'visits' },
                        periods: { type: wnt.barScope, from: currentPeriod[0], to: currentPeriod[1] } },

                    // Accordion data ...
                    box_sum: { specs: { type: 'sales', channel: 'gate' },
                        periods: { type: wnt.barScope, from: currentPeriod[0], to: currentPeriod[1], kind: 'sum' } },
                        
                        box_sum_prior: { specs: { type: 'sales', channel: 'gate' }, 
                            periods: { type: wnt.barScope, from: priorPeriod[0], to: priorPeriod[1], kind: 'sum' } },

                            box_sum_online: { specs: { type: 'sales', channel: 'gate', online: true }, 
                                periods: { type: wnt.barScope, from: currentPeriod[0], to: currentPeriod[1], kind: 'sum' } },

                                box_sum_online_prior: { specs: { type: 'sales', channel: 'gate', online: true }, 
                                    periods: { type: wnt.barScope, from: priorPeriod[0], to: priorPeriod[1], kind: 'sum' } },

                            box_sum_offline: { specs: { type: 'sales', channel: 'gate', online: false }, 
                                periods: { type: wnt.barScope, from: currentPeriod[0], to: currentPeriod[1], kind: 'sum' } },

                                box_sum_offline_prior: { specs: { type: 'sales', channel: 'gate', online: false }, 
                                    periods: { type: wnt.barScope, from: priorPeriod[0], to: priorPeriod[1], kind: 'sum' } },

                    groups_sum: { specs: { type: 'sales', kinds: ['group'] }, 
                        periods: { type: wnt.barScope, from: currentPeriod[0], to: currentPeriod[1], kind: 'sum' } },
                        
                        groups_sum_prior: { specs: { type: 'sales', kinds: ['group'] }, 
                            periods: { type: wnt.barScope, from: priorPeriod[0], to: priorPeriod[1], kind: 'sum' } },

                    cafe_sum: { specs: { type: 'sales', channel: 'cafe' }, 
                        periods: { type: wnt.barScope, from: currentPeriod[0], to: currentPeriod[1], kind: 'sum' } },
                        
                        cafe_sum_prior: { specs: { type: 'sales', channel: 'cafe' }, 
                            periods: { type: wnt.barScope, from: priorPeriod[0], to: priorPeriod[1], kind: 'sum' } },                    
                    
                    gift_sum: { specs: { type: 'sales', channel: 'store' }, 
                        periods: { type: wnt.barScope, from: currentPeriod[0], to: currentPeriod[1], kind: 'sum' } },
                    
                        gift_sum_prior: { specs: { type: 'sales', channel: 'store' }, 
                            periods: { type: wnt.barScope, from: priorPeriod[0], to: priorPeriod[1], kind: 'sum' } },
                    
                    mem_sum: { specs: { type: 'sales', channel: 'membership' }, 
                        periods: { type: wnt.barScope, from: currentPeriod[0], to: currentPeriod[1], kind: 'sum' } },
                        
                        mem_sum_prior: { specs: { type: 'sales', channel: 'membership' }, 
                            periods: { type: wnt.barScope, from: priorPeriod[0], to: priorPeriod[1], kind: 'sum' } }
                }
            }
        )
        .done(function(result) {
            console.log('Revenue data loaded...');
            wnt.revenue = result;
            // Set max values for y-axis by grabbing amounts into new array and finding the max in that array
            self.calcBarTotals();
            // Calc per cap before getting max for y-axis
            self.calcPerCap();
            // Set Y-axis based on max value
            self.changeYMarkers(d3.max(wnt.revenue.total_bars_amount));
            // Set barDates (relies on length of totals array, so must be set after data is received)
            wnt.barDates = [];
            wnt.revenue.total_bars.forEach(function(entry){
                var dateObj, dateStr;
                if(wnt.barScope === 'week'){
                    dateObj = wnt.getWeekNumberDates(entry.period)[0];
                    dateStr = dateObj.getFullYear() + '-' + wnt.doubleDigits(dateObj.getMonth()+1) + '-' + wnt.doubleDigits(dateObj.getDate());
                } else {
                    dateStr = entry.period;
                }
                wnt.barDates.push(dateStr);
            });
            $.get(
                wnt.apiWeather,
                {
                    venue_id: wnt.venueID,
                    from: wnt.barDates[0].replace(/\//g,'-'),
                    to: wnt.barDates[wnt.barDates.length-1].replace(/\//g,'-')
                }
            )
            .done(function(weather){
                console.log('Weather data loaded...');
                wnt.weatherPeriod = weather;
                if(self.isMounted()) {
                    // LOOP THROUGH DATA TO CREATE ARRAYS
                    var boxoffice = self.dataArray(wnt.revenue.box_bars, 'amount', self.state.days);
                    $.each(boxoffice, function(index, item){
                        boxoffice[index] = self.calcBarHeight(item);
                    });
                    var cafe = self.dataArray(wnt.revenue.cafe_bars, 'amount', self.state.days);
                    $.each(cafe, function(index, item){
                        cafe[index] = self.calcBarHeight(item);
                    });
                    var giftstore = self.dataArray(wnt.revenue.gift_bars, 'amount', self.state.days);
                    $.each(giftstore, function(index, item){
                        giftstore[index] = self.calcBarHeight(item);
                    });
                    var membership = self.dataArray(wnt.revenue.mem_bars, 'amount', self.state.days);
                    $.each(membership, function(index, item){
                        membership[index] = self.calcBarHeight(item);
                    });
                    // SET STATE TO ARRAYS FOR RENDERING
                    self.setState({
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
                    // var self = this;
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
                    self.formatNumbers;
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
    componentDidMount: function() {
        // Set default for datepicker
        $('#revenue #datepicker').val(wnt.filterDates);
        // Set filter defaults as globals
        // Switch format for filterDates to be used in weather API
        wnt.filterDates = wnt.formatDate(new Date(wnt.filterDates));
        wnt.filterPeriod = $('#bg-period').val();
        wnt.filterVisitors = $('#bg-visitors').val();
        wnt.filterUnits = $('#bg-units').val();
        // Call method to load revenue and weather data
        this.callAPI();
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
        var max = d3.max(wnt.revenue.total_bars_amount);
        if(wnt.filterUnits === 'dollars'){ max = ((((d3.max(wnt.revenue.total_bars_amount)/4)/1000).toFixed(0))*4)*1000; }
        var barSectionHeight = (amount / max) * $('#bar-graph').height();
        return barSectionHeight+'px';
    },
    calcBarWidth: function() {
        // BAR SET PLACEMENT
        // wnt.barScope = ['date', 'week']
        // wnt.filterPeriod = ['week', 'month', 'quarter']
        // Possible combos = date/week, date/month, week/quarter
        var self = this;
        var viewportWidth = $('#bar-graph-scroll-pane').width();
        var bars, dataSetWidth;
        if(wnt.filterPeriod === 'quarter'){
            // Show 14 bar sets for quarter view
            bars = 14;
        } else if (wnt.filterPeriod === 'month'){
            // Show all days for the given month view
            bars = wnt.barDates[0].split('-');
            bars = wnt.daysInMonth(bars[1], bars[0]);
        } else {
            // Show 7 days for the default week view
            bars = 7;
        }
        var slices = (bars * 2) + 1;   // Width of bars and spaces between; the increments for placement and width
        var barWidth = viewportWidth / slices;
        dataSetWidth = ((wnt.revenue.total_bars.length * 2) + 1) * barWidth;
        $('.bar-set').css('width', barWidth+'px');   // Set width of bars
        var barPlacement = barWidth;   // Initialize increment for first placement from the left
        $('#bar-graph').css('width', dataSetWidth+'px');   // Set width of data holder under viewport
        $.each($('.bar-set'), function(index, item){
            $(item).css('left', barPlacement+'px')
            barPlacement = barPlacement + (barWidth * 2);
        });
    },
    calcBarTotals: function(){
        // box_bars for non-members and mem_bars for members
        if(wnt.filterVisitors === 'members'){
            wnt.revenue.box_bars = [];
            wnt.revenue.gift_bars = wnt.revenue.gift_bars_members;
            wnt.revenue.cafe_bars = wnt.revenue.cafe_bars_members;
        } else if(wnt.filterVisitors === 'nonmembers'){
            wnt.revenue.gift_bars = wnt.revenue.gift_bars_nonmembers;
            wnt.revenue.cafe_bars = wnt.revenue.cafe_bars_nonmembers;
            wnt.revenue.mem_bars = [];
        }
        wnt.revenue.total_bars_amount = wnt.revenue.total_bars.map(function(entry){
            return parseInt(entry.amount);
        });
    },
    calcPerCap: function(){
        if(wnt.filterUnits === 'percap'){
            $.each(wnt.revenue.box_bars, function(index, item){
                if(wnt.revenue.visitors[index] !== undefined){
                    wnt.revenue.box_bars[index].amount = wnt.revenue.box_bars[index].amount / parseInt(wnt.revenue.visitors[index].units);
                } else {
                    wnt.revenue.box_bars[index].amount = 0;   // Set to 0 if there are no visitors
                }
            });
            $.each(wnt.revenue.cafe_bars, function(index, item){
                if(wnt.revenue.visitors[index] !== undefined){
                    wnt.revenue.cafe_bars[index].amount = wnt.revenue.cafe_bars[index].amount / parseInt(wnt.revenue.visitors[index].units);
                } else {
                    wnt.revenue.cafe_bars[index].amount = 0;   // Set to 0 if there are no visitors
                }
            });
            $.each(wnt.revenue.gift_bars, function(index, item){
                if(wnt.revenue.visitors[index] !== undefined){
                    wnt.revenue.gift_bars[index].amount = wnt.revenue.gift_bars[index].amount / parseInt(wnt.revenue.visitors[index].units);
                } else {
                    wnt.revenue.gift_bars[index].amount = 0;   // Set to 0 if there are no visitors
                }
            });
            $.each(wnt.revenue.mem_bars, function(index, item){
                if(wnt.revenue.visitors[index] !== undefined){
                    wnt.revenue.mem_bars[index].amount = wnt.revenue.mem_bars[index].amount / parseInt(wnt.revenue.visitors[index].units);
                } else {
                    wnt.revenue.mem_bars[index].amount = 0;   // Set to 0 if there are no visitors
                }
            });
            // Set total_bars_amount array to per cap calculations
            $.each(wnt.revenue.total_bars_amount, function(index, item){
                if(wnt.revenue.visitors[index] !== undefined){
                    wnt.revenue.total_bars_amount[index] = wnt.revenue.total_bars_amount[index] / parseInt(wnt.revenue.visitors[index].units);
                } else {
                    wnt.revenue.total_bars_amount[index] = 0;   // Set to 0 if there are no visitors
                }
            });
        }
    },
    changeYMarkers: function(max) {
        var segment = wnt.filterUnits === 'percap' ? Math.round((max/4)*100)/100 : Math.ceil(max/4);
        // Minify numbers (e.g. 1000 = 1) and change Y-axis main label
        segment = segment > 999 ? (segment/1000).toFixed(0) : segment;
        $('.y-marker').eq(0).attr('data-content', (segment * 4).toFixed(0));
        $('.y-marker').eq(1).attr('data-content', (segment * 3).toFixed(0));
        $('.y-marker').eq(2).attr('data-content', (segment * 2).toFixed(0));
        $('.y-marker').eq(3).attr('data-content', (segment * 1).toFixed(0));
        if(wnt.filterUnits === 'percap'){
            var fourth = Math.round((segment*4)*100)/100;
            var third = Math.round((segment*3)*100)/100;
            var second = Math.round((segment*2)*100)/100;
            $('.y-marker').eq(0).attr('data-content', fourth.toFixed(2));
            $('.y-marker').eq(1).attr('data-content', third.toFixed(2));
            $('.y-marker').eq(2).attr('data-content', second.toFixed(2));
            $('.y-marker').eq(3).attr('data-content', segment.toFixed(2));
            $('.bar-graph-label-y').text(' ');
        } else if(max < 1000){
            $('.bar-graph-label-y').text('Hundreds');
        } else {
            $('.bar-graph-label-y').text('Thousands');
        }
    },
    setSliderPosition: function(){
        // TO DO: Set slider position?
        // $("#bar-graph-slider").slider('value', (selectedDay / wnt.selectedMonthDays) * 100);   // Set slider location
        // $("#bar-graph-slider").slider('value',50);
        // This works ... 0-100 ... SET POSITION OF SLIDER BASED ON DATE
        // july 5 = 5/31 = 16.13% for slider value
    },
    setDateHeader: function(){
        $('.weather-period-title').html(wnt.barDates[0]+' - '+wnt.barDates[wnt.barDates.length-1]);
        console.log('SET DATE HEADER', wnt.filterPeriod, wnt.barScope);
        var date = wnt.barDates[0];
        if(date !== undefined){
            var delimeter = date.indexOf('/') !== -1 ? '/' : '-';
            date = date.split(delimeter);
            date = new Date(date[0], date[1]-1, date[2]);
            dow = Date.dayNames[date.getDay()];
            d = date.getDate();
            y = date.getFullYear();
            m = Date.monthNames[date.getMonth()];
            date2 = date.next().saturday();
            d2 = date2.getDate();
            m2 = Date.monthNames[date2.getMonth()];
            if(wnt.filterPeriod === 'quarter'){
                date = m.substring(0,3)+' '+d+' - '+m2.substring(0,3)+' '+d2+', '+y;
            } else {
                date = dow+', '+m+' '+d+', '+y;
            }
            console.log('DAAAAYYYYYYTTTEEE', date);   // LEFT OFF HERE: Getting dates formatted in accordion header
        }
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
    animateBars: function(){
        var self = this;
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
    },
    componentDidUpdate: function(){
        this.calcBarWidth();
        this.animateBars();
        this.formatNumbers();
        this.setDateHeader();
        $('.bar-set').popover({ container: 'body' });
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
        if(wnt.filterUnits === 'percap'){
            number = $.parseNumber(number, {format:"$#,##0.00", locale:"us"});
            number = $.formatNumber(number, {format:"$#,##0.00", locale:"us"});
        } else {
            number = $.parseNumber(number, {format:"$#,###", locale:"us"});
            number = $.formatNumber(number, {format:"$#,###", locale:"us"});
        }
        return number;
    },
    filterPeriod: function(event){
        wnt.filterPeriod = event.target.value;
        this.callAPI();
    },
    filterDates: function(event) {
        wnt.filterDates = wnt.formatDate(new Date(event.target.value));
        this.callAPI();
    },
    filterVisitors: function(event) {
        wnt.filterVisitors = event.target.value;
        this.callAPI();
        event.target.blur();
    },
    filterUnits: function(event) {
        wnt.filterUnits = event.target.value;
        this.callAPI();
        event.target.blur();
    },
    filterChannels: function(event){
        // LEFT OFF HERE ...
        // TO DO: Call API and move actions???
        // TO DO: Switch filter to set heights to '0'?, re-calc y-axis, only show 'non-zero' info in rollover unless the data really is zero.

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
            bars.push(<BarSet date={wnt.barDates[i]} key={i} box={box} cafe={cafe} gift={gift} mem={mem} icon1={icon1} icon2={icon2} temp1={temp1} temp2={temp2} summary1={summary1} summary2={summary2} />);
        }
        // HAD TO USE ONFOCUS SINCE ONCHANGE WASN'T FIRING WITH datepicker PLUGIN
        return (
            <div className="row">
                <div className="col-xs-8 col-md-8">
                    <div className="widget" id="revenue">
                        <h2>Revenue</h2>
                        <form id="filter-revenue-week">
                            <select id="bg-period" className="form-control" onChange={this.filterPeriod}>
                                <option value="week">Week containing</option>
                                <option value="month">Month containing</option>
                                <option value="quarter">Quarter containing</option>
                            </select>
                            <Caret className="filter-caret" />
                            <input type="text" id="datepicker" onFocus={this.filterDates} />
                        </form>

                        <form id="filter-revenue-section">
                            <select id="bg-visitors" className="form-control" onChange={this.filterVisitors}>
                                <option value="totals">Totals</option>
                                <option value="members">Members</option>
                                <option value="nonmembers">Non-members</option>
                            </select>
                            <Caret className="filter-caret" />
                        </form>

                        <form id="filter-revenue-units">
                            <select id="bg-units" className="form-control" onChange={this.filterUnits}>
                                <option value="dollars">Dollars</option>
                                <option value="percap">Per Cap</option>
                            </select>
                            <Caret className="filter-caret" />
                        </form>

                        <div className="bar-graph-legend">
                            <div className="bar-graph-legend-item" data-segment="bar-section-boxoffice" onClick={this.filterChannels}>
                                <div className="legend-check-circle active">
                                    <CheckMark className="legend-check" />
                                </div>
                                Box Office
                            </div>
                            <div className="bar-graph-legend-item" data-segment="bar-section-cafe" onClick={this.filterChannels}>
                                <div className="legend-check-circle active">
                                    <CheckMark className="legend-check" />
                                </div>
                                Cafe
                            </div>
                            <div className="bar-graph-legend-item" data-segment="bar-section-giftstore" onClick={this.filterChannels}>
                                <div className="legend-check-circle active">
                                    <CheckMark className="legend-check" />
                                </div>
                                Gift Store
                            </div>
                            <div className="bar-graph-legend-item" data-segment="bar-section-membership" onClick={this.filterChannels}>
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
                        <div className="weather-bar">
                            <div className="weather-period-title"></div>
                            <ActionMenu />
                        </div>
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
