/*****************************/
/******** REVENUE ROW ********/
/*****************************/

var BarSet = React.createClass({
    convertDate: function(date) {
        if(date !== undefined){
            var delimeter = date.indexOf('/') !== -1 ? '/' : '-';
            date = date.split(delimeter);
            date = wnt.filter.bgPeriod === 'month' ? date[2] : date[1]+'.'+date[2];
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
            if(wnt.filter.bgPeriod === 'quarter'){
                date = m.substring(0,3)+' '+d+' - '+m2.substring(0,3)+' '+d2+', '+y;
            } else {
                date = dow+', '+m+' '+d+', '+y;
            }
            return date;
        }
    },
    processLineItem: function(value, classExt, label) {
        var html = value !== 0 ? "<tr><td><div class='legend-circle-"+classExt+"'></div></td><td>"+label+"</td><td class='data "+classExt+"'>"+value+"</td></tr>" : '';
        return html;
    },
    renderWeather: function(){
        if(wnt.filter.bgPeriod !== 'quarter'){
            var weather = "<div class='popover-weather-10am'><img src='/img/"+this.props.icon1+".svg' class='popover-weather-icon'><div class='popover-time'>10 A.M.</div><div class='popover-weather-text'>"+this.props.summary1+"</div><div class='popover-temp'>"+this.props.temp1+"</div></div><div class='popover-weather-4pm'><img src='/img/"+this.props.icon2+".svg' class='popover-weather-icon'><div class='popover-time'>4 P.M.</div><div class='popover-weather-text'>"+this.props.summary2+"</div><div class='popover-temp'>"+this.props.temp2+"</div></div>";
            return weather;
        } else {
            return '';
        }
    },
    formatNumbers: function(){
        var format = wnt.filter.bgUnits === 'percap' ? '$#,##0.00' : '$#,###';
        $.each($('.popover-data .data'), function(index, item){
            if($(this).html() !== '-'){
                $(this).parseNumber({format:format, locale:"us"});
                $(this).formatNumber({format:format, locale:"us"});
            }
        });
        $.each($('#revenue-accordion .accordion-stat'), function(index, item){
            if($(this).html() !== '-'){
                $(this).parseNumber({format:format, locale:"us"});
                $(this).formatNumber({format:format, locale:"us"});
            }
        });
        $.each($('#revenue-accordion .accordion-compared-to'), function(index, item){
            if($(this).html() !== '-'){
                $(this).parseNumber({format:format, locale:"us"});
                $(this).formatNumber({format:format, locale:"us"});
            }
        });
    },
    updateDetails: function(){
        // Updates accordion details when bar set is clicked
        // week, month = day (date)   ...   quarter = week
        // TO DO: Logic for dates based on filters
        // TO DO: Visitors to calculate percap
        var self = this;
        if($('.popover-date').text() !== ''){   // Fix for popover glitch when clicking doesn't open one, but this would wipe out the data.
            var type;
            var date = $('.popover-date').data('date');
            date = date.split('-');
            date = new Date(date[0], date[1]-1, date[2]);
            var dates; 
            if(wnt.filter.bgPeriod === 'quarter'){
                type = 'week';
                date = date.add({ weeks: -13 });   // Match to 13 weeks ago
                date = date.getFullYear() + '-' + wnt.doubleDigits(date.getMonth()+1) + '-' + wnt.doubleDigits(date.getDate());
                dates = wnt.getDateRange(date, 'this week');
            } else {
                type = 'date';
                date = wnt.filter.bgPeriod === 'month' ? date.last().month() : date.last().week();
                date = date.getFullYear() + '-' + wnt.doubleDigits(date.getMonth()+1) + '-' + wnt.doubleDigits(date.getDate());
                dates = [date, date];
            }
            wnt.gettingComparisonData = $.Deferred();
            wnt.getComparison(type, dates, wnt.gettingComparisonData);
            $.when(wnt.gettingComparisonData).done(function(data) {
                var format = wnt.filter.bgUnits === 'percap' ? '$#,##0.00' : '$#,###';
                // if(wnt.filter.bgUnits === 'percap'){ ... CALC PER CAP ... }
                var currentBO = $('.popover .bo').parseNumber({format:format, locale:"us"});
                var currentC = $('.popover .c').parseNumber({format:format, locale:"us"});
                var currentGS = $('.popover .gs').parseNumber({format:format, locale:"us"});
                var currentM = $('.popover .m').parseNumber({format:format, locale:"us"});
                currentBO = parseInt($('.popover .bo').text());
                currentC = parseInt($('.popover .c').text());
                currentGS = parseInt($('.popover .gs').text());
                currentM = parseInt($('.popover .m').text());
                var bo = wnt.calcChange(currentBO, parseInt(data.bo.amount));
                var c = wnt.calcChange(currentC, parseInt(data.c.amount));
                var gs = wnt.calcChange(currentGS, parseInt(data.gs.amount));
                var m = wnt.calcChange(currentM, parseInt(data.m.amount));
                // 1) Set current values in accordion to match popover
                $('#earned-revenue .weather-period-title').text($('.popover-date').text());
                $('#earned-revenue .box .accordion-stat').text($('.popover td.bo').text());
                $('#earned-revenue .cafe .accordion-stat').text($('.popover td.c').text());
                $('#earned-revenue .gift .accordion-stat').text($('.popover td.gs').text());
                $('#earned-revenue .mem .accordion-stat').text($('.popover td.m').text());
                // 2) Set percentage values in accordion
                $('#earned-revenue .box .accordion-stat-change').text(bo[0]+'%');
                $('#earned-revenue .cafe .accordion-stat-change').text(c[0]+'%');
                $('#earned-revenue .gift .accordion-stat-change').text(gs[0]+'%');
                $('#earned-revenue .mem .accordion-stat-change').text(m[0]+'%');
                // 3) Set previous values in accordion
                $('#earned-revenue .box .accordion-compared-to').text(data.bo.amount);
                $('#earned-revenue .cafe .accordion-compared-to').text(data.c.amount);
                $('#earned-revenue .gift .accordion-compared-to').text(data.gs.amount);
                $('#earned-revenue .mem .accordion-compared-to').text(data.m.amount);
                // 4) Set change arrows in accordion
                // TO DO: Pull into own method (NOTE: Have to manipulate CSS since ReactJS won't let me change classes)
                if($('.box .accordion-change .change').attr('class').indexOf(bo[1]) === -1){
                    // Change arrow differs, so rotate it
                    if($('.box .accordion-change .change').attr('class').indexOf('down') > -1){
                        // Change arrow was down, so rotate it up
                        $('.box .accordion-change .change').css('transform','rotate(0deg)');
                    } else {
                        // Change arrow was up, so rotate it down
                        $('.box .accordion-change .change').css('transform','rotate(180deg)');
                    }
                }
                if($('.cafe .accordion-change .change').attr('class').indexOf(c[1]) === -1){
                    if($('.cafe .accordion-change .change').attr('class').indexOf('down') > -1){
                        $('.cafe .accordion-change .change').css('transform','rotate(0deg)');
                    } else {
                        $('.cafe .accordion-change .change').css('transform','rotate(180deg)');
                    }
                }
                if($('.gift .accordion-change .change').attr('class').indexOf(gs[1]) === -1){
                    if($('.gift .accordion-change .change').attr('class').indexOf('down') > -1){
                        $('.gift .accordion-change .change').css('transform','rotate(0deg)');
                    } else {
                        $('.gift .accordion-change .change').css('transform','rotate(180deg)');
                    }
                }
                if($('.mem .accordion-change .change').attr('class').indexOf(m[1]) === -1){
                    if($('.mem .accordion-change .change').attr('class').indexOf('down') > -1){
                        $('.mem .accordion-change .change').css('transform','rotate(0deg)');
                    } else {
                        $('.mem .accordion-change .change').css('transform','rotate(180deg)');
                    }
                }
                // Run number cleanup after processing...
                self.formatNumbers();
            });
        }
    },
    render: function() {
        return (
            <div className="bar-set" 
                data-toggle="popover" 
                data-html="true" 
                data-content={"<div class='popover-weather-bar'><div class='popover-date' data-date='"+this.props.date+"'>"+this.rolloverDate(this.props.date)+"</div>"+this.renderWeather()+"</div><table class='popover-data'>"+this.processLineItem(this.props.box, 'bo', 'Box Office')+this.processLineItem(this.props.cafe, 'c', 'Cafe')+this.processLineItem(this.props.gift, 'gs', 'Gift Store')+this.processLineItem(this.props.mem, 'm', 'Membership')+"</table>"} 
                data-placement="auto"
                data-trigger="click hover" onClick={this.updateDetails}>
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
    render: function() {
        return (
            <div className={this.props.className+" accordion-item col-md-6 active"}>
                <div className="row">
                    <div className="col-md-4 accordion-stat-label">
                        {this.props.label}
                    </div>
                    <div className="col-md-3 accordion-change">
                        <ChangeArrow className={"change " + this.props.arrow} />
                        <span className="accordion-stat-change">{this.props.statChange}%</span>
                    </div>
                    <div className="col-md-2 accordion-compare">
                        <span className="accordion-compared-to">{this.props.comparedTo}</span>
                    </div>
                    <div className="col-md-1 accordion-compare">
                        <LongArrow className="long-arrow" />
                    </div>
                    <div className="col-md-2 accordion-compare">
                        <span className="accordion-stat">{this.props.stat}</span>
                    </div>
                </div>
            </div>
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
        var currentPeriod = wnt.getDateRange(wnt.filter.bgDates, 'this '+wnt.filter.bgPeriod);
        var priorPeriod = wnt.getDateRange(wnt.filter.bgDates, wnt.filter.bgCompare+' '+wnt.filter.bgPeriod);
        wnt.barScope = 'date';
        // Get week numbers for quarter data retrieval
        if(wnt.filter.bgPeriod === 'quarter'){
            currentPeriod[0] = wnt.getWeekNumber(currentPeriod[0], 'format');
            currentPeriod[1] = wnt.getWeekNumber(currentPeriod[1], 'format');
            priorPeriod[0] = wnt.getWeekNumber(priorPeriod[0], 'format');
            priorPeriod[1] = wnt.getWeekNumber(priorPeriod[1], 'format');
            wnt.barScope = 'week';
        }
        var totalBars = { type: 'sales' };
        if(wnt.filter.bgVisitors === 'members'){
            totalBars = { type: 'sales', members: true };
        } else if(wnt.filter.bgVisitors === 'nonmembers'){
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

                    visitors_sum: { specs: { type: 'visits' },
                        periods: { type: wnt.barScope, from: currentPeriod[0], to: currentPeriod[1], kind: 'sum' } },

                    // Accordion data ...
                    box_sum: { specs: { type: 'sales', channel: 'gate' },
                        periods: { type: wnt.barScope, from: currentPeriod[0], to: currentPeriod[1], kind: 'sum' } },
                        
                        box_sum_prior: { specs: { type: 'sales', channel: 'gate' }, 
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
                        boxofficeChange: wnt.calcChange(wnt.revenue.box_sum.amount, wnt.revenue.box_sum_prior.amount),

                        cafeNow: result.cafe_sum.amount,
                        cafeThen: result.cafe_sum_prior.amount,
                        cafeChange: wnt.calcChange(wnt.revenue.cafe_sum.amount, wnt.revenue.cafe_sum_prior.amount),

                        giftstoreNow: result.gift_sum.amount,
                        giftstoreThen: result.gift_sum_prior.amount,
                        giftstoreChange: wnt.calcChange(wnt.revenue.gift_sum.amount, wnt.revenue.gift_sum_prior.amount),

                        membershipNow: result.mem_sum.amount,
                        membershipThen: result.mem_sum_prior.amount,
                        membershipChange: wnt.calcChange(wnt.revenue.mem_sum.amount, wnt.revenue.mem_sum_prior.amount),

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
        $('#revenue #datepicker').val(wnt.filter.bgDates);
        // Set filter defaults as globals
        // Switch format for filterDates to be used in weather API
        wnt.filter.bgDates = wnt.formatDate(new Date(wnt.filter.bgDates));
        wnt.filter.bgPeriod = $('#bg-period').val();
        wnt.filter.bgCompare = 'last';
        wnt.filter.bgVisitors = $('#bg-visitors').val();
        wnt.filter.bgUnits = $('#bg-units .selected').data('value');
        wnt.filter.bgChannels = { box: 1, cafe: 1, gift: 1, mem: 1 };
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
        if(wnt.filter.bgUnits === 'dollars'){ max = ((((d3.max(wnt.revenue.total_bars_amount)/4)/1000).toFixed(0))*4)*1000; }
        var barSectionHeight = (amount / max) * $('#bar-graph').height();
        return barSectionHeight+'px';
    },
    calcBarWidth: function() {
        // BAR SET PLACEMENT
        // wnt.barScope = ['date', 'week']
        // wnt.filter.bgPeriod = ['week', 'month', 'quarter']
        // Possible combos = date/week, date/month, week/quarter
        var self = this;
        var viewportWidth = $('#bar-graph-scroll-pane').width();
        var bars, dataSetWidth;
        if(wnt.filter.bgPeriod === 'quarter'){
            // Show 14 bar sets for quarter view
            bars = 14;
        } else if (wnt.filter.bgPeriod === 'month'){
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
        // Not sure this is needed since the removal fixes the issue when there's not a full set of data ... $('#bar-graph').css('width', dataSetWidth+'px');   // Set width of data holder under viewport
        $.each($('.bar-set'), function(index, item){
            $(item).css('left', barPlacement+'px')
            barPlacement = barPlacement + (barWidth * 2);
        });
    },
    calcBarTotals: function(){
        // box_bars for non-members and mem_bars for members
        if(wnt.filter.bgVisitors === 'members'){
            wnt.revenue.box_bars = [];
            wnt.revenue.gift_bars = wnt.revenue.gift_bars_members;
            wnt.revenue.cafe_bars = wnt.revenue.cafe_bars_members;
        } else if(wnt.filter.bgVisitors === 'nonmembers'){
            wnt.revenue.gift_bars = wnt.revenue.gift_bars_nonmembers;
            wnt.revenue.cafe_bars = wnt.revenue.cafe_bars_nonmembers;
            wnt.revenue.mem_bars = [];
        }
        // Create arrays of values for channels to be used in calculating total values based on channel filters
        wnt.revenue.total_bars_amount = wnt.revenue.total_bars.map(function(entry){
            return parseInt(entry.amount);
        });
        // Create array of dates
        wnt.revenue.box_bars_dates = wnt.revenue.box_bars.map(function(entry){
            return entry.period;
        });
        // Construct array of amounts, filling in zero for missing dates 
        wnt.revenue.box_bars_amount = wnt.barDates.map(function(barDate){
            var position = $.inArray(barDate, wnt.revenue.box_bars_dates);
            if(position > -1){
                return parseInt(wnt.revenue.box_bars[position].amount);
            } else {
                return 0;
            }
        });
        // Create array of dates
        wnt.revenue.cafe_bars_dates = wnt.revenue.cafe_bars.map(function(entry){
            return entry.period;
        });
        // Construct array of amounts, filling in zero for missing dates 
        wnt.revenue.cafe_bars_amount = wnt.barDates.map(function(barDate){
            var position = $.inArray(barDate, wnt.revenue.cafe_bars_dates);
            if(position > -1){
                return parseInt(wnt.revenue.cafe_bars[position].amount);
            } else {
                return 0;
            }
        });
        // Create array of dates
        wnt.revenue.gift_bars_dates = wnt.revenue.gift_bars.map(function(entry){
            return entry.period;
        });
        // Construct array of amounts, filling in zero for missing dates 
        wnt.revenue.gift_bars_amount = wnt.barDates.map(function(barDate){
            var position = $.inArray(barDate, wnt.revenue.gift_bars_dates);
            if(position > -1){
                return parseInt(wnt.revenue.gift_bars[position].amount);
            } else {
                return 0;
            }
        });
        // Create array of dates
        wnt.revenue.mem_bars_dates = wnt.revenue.mem_bars.map(function(entry){
            return entry.period;
        });
        // Construct array of amounts, filling in zero for missing dates 
        wnt.revenue.mem_bars_amount = wnt.barDates.map(function(barDate){
            var position = $.inArray(barDate, wnt.revenue.mem_bars_dates);
            if(position > -1){
                return parseInt(wnt.revenue.mem_bars[position].amount);
            } else {
                return 0;
            }
        });
        $.each(wnt.filter.bgChannels, function(channel, value){
            // If the channel is off, subtract it from the total_bars_amount...
            if(value === 0){
                wnt.revenue.total_bars_amount = wnt.revenue.total_bars_amount.map(function(entry, index){
                    return parseInt(entry - wnt.revenue[channel+'_bars_amount'][index]);
                });
                wnt.revenue[channel+'_bars'] = [];
            }
        });
    },
    calcPerCap: function(){
        if(wnt.filter.bgUnits === 'percap'){
            // Accordion
            if(wnt.revenue.visitors_sum !== undefined){
                wnt.revenue.box_sum.amount = parseInt(wnt.revenue.box_sum.amount) / parseInt(wnt.revenue.visitors_sum.units);
                wnt.revenue.box_sum_prior.amount = parseInt(wnt.revenue.box_sum_prior.amount) / parseInt(wnt.revenue.visitors_sum.units);
                wnt.revenue.cafe_sum.amount = parseInt(wnt.revenue.cafe_sum.amount) / parseInt(wnt.revenue.visitors_sum.units);
                wnt.revenue.cafe_sum_prior.amount = parseInt(wnt.revenue.cafe_sum_prior.amount) / parseInt(wnt.revenue.visitors_sum.units);
                wnt.revenue.gift_sum.amount = parseInt(wnt.revenue.gift_sum.amount) / parseInt(wnt.revenue.visitors_sum.units);
                wnt.revenue.gift_sum_prior.amount = parseInt(wnt.revenue.gift_sum_prior.amount) / parseInt(wnt.revenue.visitors_sum.units);
                wnt.revenue.mem_sum.amount = parseInt(wnt.revenue.mem_sum.amount) / parseInt(wnt.revenue.visitors_sum.units);
                wnt.revenue.mem_sum_prior.amount = parseInt(wnt.revenue.mem_sum_prior.amount) / parseInt(wnt.revenue.visitors_sum.units);
            }
            // Bars
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
        var segment = wnt.filter.bgUnits === 'percap' ? Math.round((max/4)*100)/100 : Math.ceil(max/4);
        // Minify numbers (e.g. 1000 = 1) and change Y-axis main label
        segment = segment > 999 ? (segment/1000).toFixed(0) : segment;
        $('.y-marker').eq(0).attr('data-content', (segment * 4).toFixed(0));
        $('.y-marker').eq(1).attr('data-content', (segment * 3).toFixed(0));
        $('.y-marker').eq(2).attr('data-content', (segment * 2).toFixed(0));
        $('.y-marker').eq(3).attr('data-content', (segment * 1).toFixed(0));
        if(wnt.filter.bgUnits === 'percap'){
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
        // $("#bar-graph-slider").slider('value', (selectedDay / wnt.selectedMonthDays) * 100);   // Set slider location
        // $("#bar-graph-slider").slider('value',50);
        // This works ... 0-100 ... SET POSITION OF SLIDER BASED ON DATE
        // july 5 = 5/31 = 16.13% for slider value
    },
    setDateHeader: function(){
        var delimeter = wnt.barDates[0].indexOf('/') !== -1 ? '/' : '-';
        var date1 = wnt.barDates[0].split(delimeter);
        var date2 = wnt.barDates[wnt.barDates.length-1].split(delimeter);
        date1 = new Date(date1[0], date1[1]-1, date1[2]);
        date2 = new Date(date2[0], date2[1]-1, date2[2]);
        d1 = date1.getDate();
        y1 = date1.getFullYear();
        m1 = Date.monthNames[date1.getMonth()];
        d2 = date2.getDate();
        y2 = date2.getFullYear();
        m2 = Date.monthNames[date2.getMonth()];
        var displayDate;
        if(y1 === y2){
            displayDate = m1.substring(0,3)+' '+d1+' - '+m2.substring(0,3)+' '+d2+', '+y2;
        } else {
            displayDate = m1.substring(0,3)+' '+d1+', '+y1+' - '+m2.substring(0,3)+' '+d2+', '+y2;
        }
        $('.weather-period-title').html(displayDate);
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
    toggleDetails: function(event){
        var handle = $(event.target).closest('.chart-handle');
        var label = $(handle).find('.handle-label');
        $('#earned-revenue').toggleClass('active');
        $(handle).toggleClass('active');
        $(handle).hasClass('active') ? $(label).text('Hide Details') : $(label).text('Show Details');
    },
    componentDidUpdate: function(){
        var self = this;
        this.calcBarWidth();
        this.animateBars();
        this.formatNumbers();
        this.setDateHeader();
        // Capture accordion state for resetting after popover manipulation
        wnt.filter.bgAccordionState = $('#earned-revenue').html();
        $('.bar-set').popover('destroy');  // Needed to fix issue with unreliable popovers
        $('.bar-set').popover({ container: 'body' });
        $('.bar-set').on('show.bs.popover', function (event) {
            if($('.popover').length > 0){
                // Hide popovers if an additional one is triggered
                $('.bar-set').popover('hide');
            }
        });
        $('.bar-set').on('hidden.bs.popover', function () {
            if($('.popover').length === 0){
                // Reset accordion data if popovers are hidden
                $('#earned-revenue').html(wnt.filter.bgAccordionState);   // This caused the data to not update, but working now
                // TO DO: Also need to reset the right filter
                $('.bg-compare').hide();
                $('#bg-compare-'+wnt.filter.bgPeriod).show();
            }
        });
        $('.bg-compare').hide();
        $('#bg-compare-'+wnt.filter.bgPeriod).show();   // TO DO: Can wnt.filter.bgPeriod ever be set to 'day'?  No... need localized conditional
    },
    formatNumbers: function(){
        var format = wnt.filter.bgUnits === 'percap' ? '$#,##0.00' : '$#,###';
        $.each($('#revenue-accordion .accordion-stat'), function(index, item){
            if($(this).html() !== '-'){
                $(this).parseNumber({format:format, locale:"us"});
                $(this).formatNumber({format:format, locale:"us"});
            }
        });
        $.each($('#revenue-accordion .accordion-compared-to'), function(index, item){
            if($(this).html() !== '-'){
                $(this).parseNumber({format:format, locale:"us"});
                $(this).formatNumber({format:format, locale:"us"});
            }
        });
    },
    formatSingleNumber: function(number){   // Used in bar set rollovers
        number = number.toString();
        if(wnt.filter.bgUnits === 'percap'){
            number = $.parseNumber(number, {format:"$#,##0.00", locale:"us"});
            number = $.formatNumber(number, {format:"$#,##0.00", locale:"us"});
        } else {
            number = $.parseNumber(number, {format:"$#,###", locale:"us"});
            number = $.formatNumber(number, {format:"$#,###", locale:"us"});
        }
        return number;
    },
    filterPeriod: function(event){
        $('.bar-set').popover('destroy');  // Needed to fix issue with unreliable popovers
        // TO DO: Change accordion filters when this one changes
        // day = same day last year, 13 week average
        // week = last week, 13 week average
        // month = last month, same month last year
        // quarter = last quarter, same quarter last year
        // week, month, quarter
        wnt.filter.bgPeriod = event.target.value;
        // Set comparison filter in details
        // Default to 'last' instead of 'lastyear'
        wnt.filter.bgCompare = 'last';
        //$('#bg-compare').val(wnt.filter.bgCompare+'-'+wnt.filter.bgPeriod);   // Does NOT trigger other event!  :D
        this.callAPI();
        event.target.blur();
    },
    filterDates: function(event) {
        $('.bar-set').popover('destroy');  // Needed to fix issue with unreliable popovers
        wnt.filter.bgDates = wnt.formatDate(new Date(event.target.value));
        this.callAPI();
    },
    filterVisitors: function(event) {
        $('.bar-set').popover('destroy');  // Needed to fix issue with unreliable popovers
        wnt.filter.bgVisitors = event.target.value;
        // Set the global channels variable for proper processng before callAPI, and ...
        // ...turn off the active class on the proper channel
        if(wnt.filter.bgVisitors === 'members'){
            wnt.filter.bgChannels = {box: 0, cafe: 1, gift: 1, mem: 1};
            $('.bar-graph-legend-item .legend-check-circle').addClass('active');
            $('.accordion-item').addClass('active');
            $('.bar-graph-legend-item[data-channel="box"]').find('.legend-check-circle').removeClass('active');
            $('.accordion-item.box').removeClass('active');
        } else if(wnt.filter.bgVisitors === 'nonmembers'){
            wnt.filter.bgChannels = {box: 1, cafe: 1, gift: 1, mem: 0};
            $('.bar-graph-legend-item .legend-check-circle').addClass('active');
            $('.accordion-item').addClass('active');
            $('.bar-graph-legend-item[data-channel="mem"]').find('.legend-check-circle').removeClass('active');
            $('.accordion-item.mem').removeClass('active');
        } else {
            wnt.filter.bgChannels = {box: 1, cafe: 1, gift: 1, mem: 1};
            $('.bar-graph-legend-item .legend-check-circle').addClass('active');
            $('.accordion-item').addClass('active');
        }
        this.callAPI();
        event.target.blur();
    },
    filterUnits: function(event) {
        $('.bar-set').popover('destroy');  // Needed to fix issue with unreliable popovers
        wnt.filter.bgUnits = $(event.target).closest('.filter-units').data('value');
        $.each($('#bg-units .filter-units'), function(index, item){
            $(item).toggleClass('selected');
        });
        $.each($('#revenue .y-marker'), function(index, item){
            $(item).toggleClass('percap');
        });
        this.callAPI();
        event.target.blur();
    },
    filterChannels: function(event){
        $('.bar-set').popover('destroy');  // Needed to fix issue with unreliable popovers
        // Change bars first...
        // Toggle the legend/filter checkmark
        $(event.target).closest('.bar-graph-legend-item').find('.legend-check-circle').toggleClass('active');
        // Legend items each have a data attribute for matching to their respective bar segments to toggle
        var filter = $(event.target).closest('.bar-graph-legend-item').data('segment');
        $('.'+filter).toggle();
        // Use channel data to hide or show matching accordion details
        var channel = $(event.target).closest('.bar-graph-legend-item').data('channel');
        $('.accordion-item.'+channel).toggleClass('active');
        // Set the global filter for processing in the API call
        wnt.filter.bgChannels = {};
        $('.bar-graph-legend-item').each(function(i, item){
            wnt.filter.bgChannels[$(item).data('channel')] = $(item).find('.active').length;
        });
        wnt.filter.bgAccordionState = $('#earned-revenue').html();   // Needed to fix bug related to popovers
        this.callAPI();   // Needed to get rollovers updated properly
    },
    filterCompare: function(event){
        // LEFT OFF HERE: Need to handle new filters
        $('.bar-set').popover('destroy');  // Needed to fix issue with unreliable popovers
        console.log('Temporarily disabling comparsion filter.');   // TO DO: Set global filter when comparison is changed, to use with details clicks
        /*wnt.filter.bgCompare = event.target.value;
        wnt.filter.bgPeriod = wnt.filter.bgCompare.split('-')[1];
        wnt.filter.bgCompare = wnt.filter.bgCompare.split('-')[0];
        $('#bg-period').val(wnt.filter.bgPeriod);
        this.callAPI();
        event.target.blur();*/
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
                <div className="col-xs-12 col-md-12">
                    <div className="widget" id="revenue">
                        <h2>Earned Revenue</h2>
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

                        <div id="bg-units" onClick={this.filterUnits}>
                            <div data-value="dollars" className="filter-units selected">
                                Dollars
                                <div className="filter-highlight"></div>
                            </div>
                            <div data-value="percap" className="filter-units">
                                Per Cap
                                <div className="filter-highlight"></div>
                            </div>
                        </div>

                        <div className="bar-graph-legend">
                            <div className="bar-graph-legend-item" data-segment="bar-section-boxoffice" data-channel="box" onClick={this.filterChannels}>
                                <div className="legend-check-circle active">
                                    <CheckMark className="legend-check" />
                                </div>
                                Box Office
                            </div>
                            <div className="bar-graph-legend-item" data-segment="bar-section-cafe" data-channel="cafe" onClick={this.filterChannels}>
                                <div className="legend-check-circle active">
                                    <CheckMark className="legend-check" />
                                </div>
                                Cafe
                            </div>
                            <div className="bar-graph-legend-item" data-segment="bar-section-giftstore" data-channel="gift" onClick={this.filterChannels}>
                                <div className="legend-check-circle active">
                                    <CheckMark className="legend-check" />
                                </div>
                                Gift Store
                            </div>
                            <div className="bar-graph-legend-item" data-segment="bar-section-membership" data-channel="mem" onClick={this.filterChannels}>
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

                        <div id="earned-revenue">
                            <div className="weather-bar">
                                <div className="weather-period-title"></div>
                                <form id="filter-comparison">
                                    <select id="bg-compare-day" className="form-control bg-compare" onChange={this.filterCompare}>
                                        <option value="lastyear-day">Same Day Last Year</option>
                                        <option value="average13-day">13 Week Average</option>
                                    </select>
                                    <select id="bg-compare-week" className="form-control bg-compare" onChange={this.filterCompare}>
                                        <option value="last-week">Last Week</option>
                                        <option value="average13-week">13 Week Average</option>
                                    </select>
                                    <select id="bg-compare-month" className="form-control bg-compare" onChange={this.filterCompare}>
                                        <option value="last-month">Last Month</option>
                                        <option value="lastyear-month">Same Month Last Year</option>
                                    </select>
                                    <select id="bg-compare-quarter" className="form-control bg-compare" onChange={this.filterCompare}>
                                        <option value="last-quarter">Last Quarter</option>
                                        <option value="lastyear-quarter">Same Quarter Last Year</option>
                                    </select>
                                    <Caret className="filter-caret" />
                                </form>
                            </div>
                            <div id="revenue-accordion" className="row">
                                <AccordionItem 
                                    className="box"
                                    label="Box Office"
                                    stat={this.state.boxofficeNow}
                                    statChange={this.state.boxofficeChange[0]}
                                    arrow={this.state.boxofficeChange[1]}
                                    comparedTo={this.state.boxofficeThen} />
                                <AccordionItem
                                    className="cafe"
                                    label="Cafe"
                                    stat={this.state.cafeNow}
                                    statChange={this.state.cafeChange[0]}
                                    arrow={this.state.cafeChange[1]}
                                    comparedTo={this.state.cafeThen} />
                                <AccordionItem
                                    className="gift"
                                    label="Gift Store"
                                    stat={this.state.giftstoreNow}
                                    statChange={this.state.giftstoreChange[0]}
                                    arrow={this.state.giftstoreChange[1]}
                                    comparedTo={this.state.giftstoreThen} />
                                <AccordionItem
                                    className="mem"
                                    label="Membership"
                                    stat={this.state.membershipNow}
                                    statChange={this.state.membershipChange[0]}
                                    arrow={this.state.membershipChange[1]}
                                    comparedTo={this.state.membershipThen} />
                            </div>
                        </div>
                    </div>
                    <div onClick={this.toggleDetails} className="chart-handle">
                        <Caret className="handle-caret" /> <span className="handle-label">Show Details</span>
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
