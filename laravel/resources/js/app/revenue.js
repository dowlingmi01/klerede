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

var BarGraph = React.createClass({
    getInitialState: function() {
        wnt.graphCap = 80000;   // TEMPORARY
        return {
            graphCap: 80000,
            graphHeight: 300,

            value: 'TEST',

            barDates: wnt.getWeek(wnt.yesterday),
            days: wnt.daysInMonth(wnt.thisMonthNum,wnt.thisYear),

            boxofficeHeight: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            cafeHeight: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            giftstoreHeight: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            membershipHeight: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        };
    },
    componentDidMount: function() {
        // Members / Non-members ... Members buy memberships, but not admission
        $.post(
            this.props.source,
            {
                venue_id: this.props.venueID,
                queries: {
                    boxoffice: { specs: { type: 'sales', channel: 'gate' }, 
                        periods: { from: wnt.weekago, to: wnt.yesterday } },

                    cafe: { specs: { type: 'sales', channel: 'cafe' }, 
                        periods: { from: wnt.weekago, to: wnt.yesterday } },
                    cafe_members: { specs: { type: 'sales', channel: 'cafe', members: true }, 
                        periods: { from: wnt.weekago, to: wnt.yesterday } },
                    cafe_nonmembers: { specs: { type: 'sales', channel: 'cafe', members: false }, 
                        periods: { from: wnt.weekago, to: wnt.yesterday } },

                    giftstore: { specs: { type: 'sales', channel: 'store' }, 
                        periods: { from: wnt.weekago, to: wnt.yesterday } },
                    giftstore_members: { specs: { type: 'sales', channel: 'store', members: true }, 
                        periods: { from: wnt.weekago, to: wnt.yesterday } },
                    giftstore_nonmembers: { specs: { type: 'sales', channel: 'store', members: false }, 
                        periods: { from: wnt.weekago, to: wnt.yesterday } },

                    membership: { specs: { type: 'sales', channel: 'membership' }, 
                        periods: { from: wnt.weekago, to: wnt.yesterday } },

                    visitors: { specs: { type: 'visits' },
                        periods: { from: wnt.weekago, to: wnt.yesterday } }
                }
            }
        )
        .done(function(result) {
            console.log('Revenue data loaded...');
            wnt.revenue = result;
            if(this.isMounted()) {
                // TEST ARRAY FOR LOOPING WHOLE MONTH
                var TESTING = this.dataArray(result.boxoffice, 'amount', 31);
                console.log(TESTING);

                this.setState({
                    boxofficeHeight: [
                        this.calcBarHeight(result.boxoffice[0].amount),
                        this.calcBarHeight(result.boxoffice[1].amount),
                        this.calcBarHeight(result.boxoffice[2].amount),
                        this.calcBarHeight(result.boxoffice[3].amount),
                        this.calcBarHeight(result.boxoffice[4].amount),
                        this.calcBarHeight(result.boxoffice[5].amount),
                        this.calcBarHeight(result.boxoffice[6].amount)
                    ],
                    cafeHeight: [
                        this.calcBarHeight(result.cafe[0].amount),
                        this.calcBarHeight(result.cafe[1].amount),
                        this.calcBarHeight(result.cafe[2].amount),
                        this.calcBarHeight(result.cafe[3].amount),
                        this.calcBarHeight(result.cafe[4].amount),
                        this.calcBarHeight(result.cafe[5].amount),
                        this.calcBarHeight(result.cafe[6].amount)
                    ],
                    giftstoreHeight: [
                        this.calcBarHeight(result.giftstore[0].amount),
                        this.calcBarHeight(result.giftstore[1].amount),
                        this.calcBarHeight(result.giftstore[2].amount),
                        this.calcBarHeight(result.giftstore[3].amount),
                        this.calcBarHeight(result.giftstore[4].amount),
                        this.calcBarHeight(result.giftstore[5].amount),
                        this.calcBarHeight(result.giftstore[6].amount)
                    ],
                    membershipHeight: [
                        this.calcBarHeight(result.membership[0].amount),
                        this.calcBarHeight(result.membership[1].amount),
                        this.calcBarHeight(result.membership[2].amount),
                        this.calcBarHeight(result.membership[3].amount),
                        this.calcBarHeight(result.membership[4].amount),
                        this.calcBarHeight(result.membership[5].amount),
                        this.calcBarHeight(result.membership[6].amount)
                    ]
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
    weekChange: function(event) {
        var weekStart = new Date(event.target.value);
        weekStart = wnt.formatDate(weekStart);
        var weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        weekEnd = wnt.formatDate(weekEnd);
        // SET DATES FOR BAR TAGS
        var barDatesWeekEnd = new Date(weekStart);
        barDatesWeekEnd.setDate(barDatesWeekEnd.getDate() + 8);
        barDatesWeekEnd = wnt.formatDate(barDatesWeekEnd);
        var barDates = wnt.getWeek(barDatesWeekEnd);
        $.post(
            this.props.source,
            {
                venue_id: this.props.venueID,
                queries: {
                    boxoffice: { specs: { type: 'sales', channel: 'gate' }, 
                        periods: { from: weekStart, to: weekEnd } },

                    cafe: { specs: { type: 'sales', channel: 'cafe' }, 
                        periods: { from: weekStart, to: weekEnd } },
                    cafe_members: { specs: { type: 'sales', channel: 'cafe', members: true }, 
                        periods: { from: weekStart, to: weekEnd } },
                    cafe_nonmembers: { specs: { type: 'sales', channel: 'cafe', members: false }, 
                        periods: { from: weekStart, to: weekEnd } },

                    giftstore: { specs: { type: 'sales', channel: 'store' }, 
                        periods: { from: weekStart, to: weekEnd } },
                    giftstore_members: { specs: { type: 'sales', channel: 'store', members: true }, 
                        periods: { from: weekStart, to: weekEnd } },
                    giftstore_nonmembers: { specs: { type: 'sales', channel: 'store', members: false }, 
                        periods: { from: weekStart, to: weekEnd } },

                    membership: { specs: { type: 'sales', channel: 'membership' }, 
                        periods: { from: weekStart, to: weekEnd } },

                    visitors: { specs: { type: 'visits' },
                        periods: { from: weekStart, to: weekEnd } }
                }
            }
        )
        .done(function(result) {
            console.log('Revenue data loaded (again)...');
            wnt.revenue = result;
            if(this.isMounted()) {
                this.setState({
                    barDates: barDates,
                    boxofficeHeight: [
                        this.calcBarHeight(result.boxoffice[0].amount),
                        this.calcBarHeight(result.boxoffice[1].amount),
                        this.calcBarHeight(result.boxoffice[2].amount),
                        this.calcBarHeight(result.boxoffice[3].amount),
                        this.calcBarHeight(result.boxoffice[4].amount),
                        this.calcBarHeight(result.boxoffice[5].amount),
                        this.calcBarHeight(result.boxoffice[6].amount)
                    ],
                    cafeHeight: [
                        this.calcBarHeight(result.cafe[0].amount),
                        this.calcBarHeight(result.cafe[1].amount),
                        this.calcBarHeight(result.cafe[2].amount),
                        this.calcBarHeight(result.cafe[3].amount),
                        this.calcBarHeight(result.cafe[4].amount),
                        this.calcBarHeight(result.cafe[5].amount),
                        this.calcBarHeight(result.cafe[6].amount)
                    ],
                    giftstoreHeight: [
                        this.calcBarHeight(result.giftstore[0].amount),
                        this.calcBarHeight(result.giftstore[1].amount),
                        this.calcBarHeight(result.giftstore[2].amount),
                        this.calcBarHeight(result.giftstore[3].amount),
                        this.calcBarHeight(result.giftstore[4].amount),
                        this.calcBarHeight(result.giftstore[5].amount),
                        this.calcBarHeight(result.giftstore[6].amount)
                    ],
                    membershipHeight: [
                        this.calcBarHeight(result.membership[0].amount),
                        this.calcBarHeight(result.membership[1].amount),
                        this.calcBarHeight(result.membership[2].amount),
                        this.calcBarHeight(result.membership[3].amount),
                        this.calcBarHeight(result.membership[4].amount),
                        this.calcBarHeight(result.membership[5].amount),
                        this.calcBarHeight(result.membership[6].amount)
                    ]
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
            $('.bar-line-1').attr('data-content','20 --');
            $('.bar-line-2').attr('data-content','40 --');
            $('.bar-line-3').attr('data-content','60 --');
            $('.bar-line-4').attr('data-content','80 --');
            this.setState({
                boxofficeHeight: [
                    this.calcBarHeight(wnt.revenue.boxoffice[0].amount),
                    this.calcBarHeight(wnt.revenue.boxoffice[1].amount),
                    this.calcBarHeight(wnt.revenue.boxoffice[2].amount),
                    this.calcBarHeight(wnt.revenue.boxoffice[3].amount),
                    this.calcBarHeight(wnt.revenue.boxoffice[4].amount),
                    this.calcBarHeight(wnt.revenue.boxoffice[5].amount),
                    this.calcBarHeight(wnt.revenue.boxoffice[6].amount)
                ],
                cafeHeight: [
                    this.calcBarHeight(wnt.revenue.cafe[0].amount),
                    this.calcBarHeight(wnt.revenue.cafe[1].amount),
                    this.calcBarHeight(wnt.revenue.cafe[2].amount),
                    this.calcBarHeight(wnt.revenue.cafe[3].amount),
                    this.calcBarHeight(wnt.revenue.cafe[4].amount),
                    this.calcBarHeight(wnt.revenue.cafe[5].amount),
                    this.calcBarHeight(wnt.revenue.cafe[6].amount)
                ],
                giftstoreHeight: [
                    this.calcBarHeight(wnt.revenue.giftstore[0].amount),
                    this.calcBarHeight(wnt.revenue.giftstore[1].amount),
                    this.calcBarHeight(wnt.revenue.giftstore[2].amount),
                    this.calcBarHeight(wnt.revenue.giftstore[3].amount),
                    this.calcBarHeight(wnt.revenue.giftstore[4].amount),
                    this.calcBarHeight(wnt.revenue.giftstore[5].amount),
                    this.calcBarHeight(wnt.revenue.giftstore[6].amount)
                ],
                membershipHeight: [
                    this.calcBarHeight(wnt.revenue.membership[0].amount),
                    this.calcBarHeight(wnt.revenue.membership[1].amount),
                    this.calcBarHeight(wnt.revenue.membership[2].amount),
                    this.calcBarHeight(wnt.revenue.membership[3].amount),
                    this.calcBarHeight(wnt.revenue.membership[4].amount),
                    this.calcBarHeight(wnt.revenue.membership[5].amount),
                    this.calcBarHeight(wnt.revenue.membership[6].amount)
                ]
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
            $('.bar-line-1').attr('data-content','2 --');
            $('.bar-line-2').attr('data-content','4 --');
            $('.bar-line-3').attr('data-content','6 --');
            $('.bar-line-4').attr('data-content','8 --');
            this.setState({
                boxofficeHeight: [0, 0, 0, 0, 0, 0, 0],
                cafeHeight: [
                    this.calcBarHeight(wnt.revenue.cafe_members[0].amount),
                    this.calcBarHeight(wnt.revenue.cafe_members[1].amount),
                    this.calcBarHeight(wnt.revenue.cafe_members[2].amount),
                    this.calcBarHeight(wnt.revenue.cafe_members[3].amount),
                    this.calcBarHeight(wnt.revenue.cafe_members[4].amount),
                    this.calcBarHeight(wnt.revenue.cafe_members[5].amount),
                    this.calcBarHeight(wnt.revenue.cafe_members[6].amount)
                ],
                giftstoreHeight: [
                    this.calcBarHeight(wnt.revenue.giftstore_members[0].amount),
                    this.calcBarHeight(wnt.revenue.giftstore_members[1].amount),
                    this.calcBarHeight(wnt.revenue.giftstore_members[2].amount),
                    this.calcBarHeight(wnt.revenue.giftstore_members[3].amount),
                    this.calcBarHeight(wnt.revenue.giftstore_members[4].amount),
                    this.calcBarHeight(wnt.revenue.giftstore_members[5].amount),
                    this.calcBarHeight(wnt.revenue.giftstore_members[6].amount)
                ],
                membershipHeight: [
                    this.calcBarHeight(wnt.revenue.membership[0].amount),
                    this.calcBarHeight(wnt.revenue.membership[1].amount),
                    this.calcBarHeight(wnt.revenue.membership[2].amount),
                    this.calcBarHeight(wnt.revenue.membership[3].amount),
                    this.calcBarHeight(wnt.revenue.membership[4].amount),
                    this.calcBarHeight(wnt.revenue.membership[5].amount),
                    this.calcBarHeight(wnt.revenue.membership[6].amount)
                ]
            });
        } else if(filter === 'nonmembers'){
            wnt.graphCap = 80000;
            $('.bar-graph-label-y').show();
            $('.bar-line-1').attr('data-content','20 --');
            $('.bar-line-2').attr('data-content','40 --');
            $('.bar-line-3').attr('data-content','60 --');
            $('.bar-line-4').attr('data-content','80 --');
            this.setState({
                boxofficeHeight: [
                    this.calcBarHeight(wnt.revenue.boxoffice[0].amount),
                    this.calcBarHeight(wnt.revenue.boxoffice[1].amount),
                    this.calcBarHeight(wnt.revenue.boxoffice[2].amount),
                    this.calcBarHeight(wnt.revenue.boxoffice[3].amount),
                    this.calcBarHeight(wnt.revenue.boxoffice[4].amount),
                    this.calcBarHeight(wnt.revenue.boxoffice[5].amount),
                    this.calcBarHeight(wnt.revenue.boxoffice[6].amount)
                ],
                cafeHeight: [
                    this.calcBarHeight(wnt.revenue.cafe_nonmembers[0].amount),
                    this.calcBarHeight(wnt.revenue.cafe_nonmembers[1].amount),
                    this.calcBarHeight(wnt.revenue.cafe_nonmembers[2].amount),
                    this.calcBarHeight(wnt.revenue.cafe_nonmembers[3].amount),
                    this.calcBarHeight(wnt.revenue.cafe_nonmembers[4].amount),
                    this.calcBarHeight(wnt.revenue.cafe_nonmembers[5].amount),
                    this.calcBarHeight(wnt.revenue.cafe_nonmembers[6].amount)
                ],
                giftstoreHeight: [
                    this.calcBarHeight(wnt.revenue.giftstore_nonmembers[0].amount),
                    this.calcBarHeight(wnt.revenue.giftstore_nonmembers[1].amount),
                    this.calcBarHeight(wnt.revenue.giftstore_nonmembers[2].amount),
                    this.calcBarHeight(wnt.revenue.giftstore_nonmembers[3].amount),
                    this.calcBarHeight(wnt.revenue.giftstore_nonmembers[4].amount),
                    this.calcBarHeight(wnt.revenue.giftstore_nonmembers[5].amount),
                    this.calcBarHeight(wnt.revenue.giftstore_nonmembers[6].amount)
                ],
                membershipHeight: [0, 0, 0, 0, 0, 0, 0]
            });
        } else {
            wnt.graphCap = 80000;
            $('.bar-graph-label-y').show();
            $('.bar-line-1').attr('data-content','20 --');
            $('.bar-line-2').attr('data-content','40 --');
            $('.bar-line-3').attr('data-content','60 --');
            $('.bar-line-4').attr('data-content','80 --');
            this.setState({
                boxofficeHeight: [
                    this.calcBarHeight(wnt.revenue.boxoffice[0].amount),
                    this.calcBarHeight(wnt.revenue.boxoffice[1].amount),
                    this.calcBarHeight(wnt.revenue.boxoffice[2].amount),
                    this.calcBarHeight(wnt.revenue.boxoffice[3].amount),
                    this.calcBarHeight(wnt.revenue.boxoffice[4].amount),
                    this.calcBarHeight(wnt.revenue.boxoffice[5].amount),
                    this.calcBarHeight(wnt.revenue.boxoffice[6].amount)
                ],
                cafeHeight: [
                    this.calcBarHeight(wnt.revenue.cafe[0].amount),
                    this.calcBarHeight(wnt.revenue.cafe[1].amount),
                    this.calcBarHeight(wnt.revenue.cafe[2].amount),
                    this.calcBarHeight(wnt.revenue.cafe[3].amount),
                    this.calcBarHeight(wnt.revenue.cafe[4].amount),
                    this.calcBarHeight(wnt.revenue.cafe[5].amount),
                    this.calcBarHeight(wnt.revenue.cafe[6].amount)
                ],
                giftstoreHeight: [
                    this.calcBarHeight(wnt.revenue.giftstore[0].amount),
                    this.calcBarHeight(wnt.revenue.giftstore[1].amount),
                    this.calcBarHeight(wnt.revenue.giftstore[2].amount),
                    this.calcBarHeight(wnt.revenue.giftstore[3].amount),
                    this.calcBarHeight(wnt.revenue.giftstore[4].amount),
                    this.calcBarHeight(wnt.revenue.giftstore[5].amount),
                    this.calcBarHeight(wnt.revenue.giftstore[6].amount)
                ],
                membershipHeight: [
                    this.calcBarHeight(wnt.revenue.membership[0].amount),
                    this.calcBarHeight(wnt.revenue.membership[1].amount),
                    this.calcBarHeight(wnt.revenue.membership[2].amount),
                    this.calcBarHeight(wnt.revenue.membership[3].amount),
                    this.calcBarHeight(wnt.revenue.membership[4].amount),
                    this.calcBarHeight(wnt.revenue.membership[5].amount),
                    this.calcBarHeight(wnt.revenue.membership[6].amount)
                ]
            });
        }
        event.target.blur();
    },
    graphUnits: function(event) {
        // Per Cap = XYZ Sales / Total Visitors
        var filter = event.target.value;
        console.log(filter);
        if(filter === 'dollars'){
            wnt.graphCap = 80000;
            $('.bar-graph-label-y').show();
            $('.y-marker').eq(0).attr('data-content','80');
            $('.y-marker').eq(1).attr('data-content','60');
            $('.y-marker').eq(2).attr('data-content','40');
            $('.y-marker').eq(3).attr('data-content','20');
            this.setState({
                boxofficeHeight: [
                    this.calcBarHeight(wnt.revenue.boxoffice[0].amount),
                    this.calcBarHeight(wnt.revenue.boxoffice[1].amount),
                    this.calcBarHeight(wnt.revenue.boxoffice[2].amount),
                    this.calcBarHeight(wnt.revenue.boxoffice[3].amount),
                    this.calcBarHeight(wnt.revenue.boxoffice[4].amount),
                    this.calcBarHeight(wnt.revenue.boxoffice[5].amount),
                    this.calcBarHeight(wnt.revenue.boxoffice[6].amount)
                ],
                cafeHeight: [
                    this.calcBarHeight(wnt.revenue.cafe[0].amount),
                    this.calcBarHeight(wnt.revenue.cafe[1].amount),
                    this.calcBarHeight(wnt.revenue.cafe[2].amount),
                    this.calcBarHeight(wnt.revenue.cafe[3].amount),
                    this.calcBarHeight(wnt.revenue.cafe[4].amount),
                    this.calcBarHeight(wnt.revenue.cafe[5].amount),
                    this.calcBarHeight(wnt.revenue.cafe[6].amount)
                ],
                giftstoreHeight: [
                    this.calcBarHeight(wnt.revenue.giftstore[0].amount),
                    this.calcBarHeight(wnt.revenue.giftstore[1].amount),
                    this.calcBarHeight(wnt.revenue.giftstore[2].amount),
                    this.calcBarHeight(wnt.revenue.giftstore[3].amount),
                    this.calcBarHeight(wnt.revenue.giftstore[4].amount),
                    this.calcBarHeight(wnt.revenue.giftstore[5].amount),
                    this.calcBarHeight(wnt.revenue.giftstore[6].amount)
                ],
                membershipHeight: [
                    this.calcBarHeight(wnt.revenue.membership[0].amount),
                    this.calcBarHeight(wnt.revenue.membership[1].amount),
                    this.calcBarHeight(wnt.revenue.membership[2].amount),
                    this.calcBarHeight(wnt.revenue.membership[3].amount),
                    this.calcBarHeight(wnt.revenue.membership[4].amount),
                    this.calcBarHeight(wnt.revenue.membership[5].amount),
                    this.calcBarHeight(wnt.revenue.membership[6].amount)
                ]
            });
        } else {
            wnt.graphCap = 20;
            $('.bar-graph-label-y').hide();
            $('.y-marker').eq(0).attr('data-content','20');
            $('.y-marker').eq(1).attr('data-content','15');
            $('.y-marker').eq(2).attr('data-content','10');
            $('.y-marker').eq(3).attr('data-content','5');
            this.setState({
                boxofficeHeight: [
                    this.calcBarHeight(wnt.revenue.boxoffice[0].amount / wnt.revenue.visitors[0].units),
                    this.calcBarHeight(wnt.revenue.boxoffice[1].amount / wnt.revenue.visitors[1].units),
                    this.calcBarHeight(wnt.revenue.boxoffice[2].amount / wnt.revenue.visitors[2].units),
                    this.calcBarHeight(wnt.revenue.boxoffice[3].amount / wnt.revenue.visitors[3].units),
                    this.calcBarHeight(wnt.revenue.boxoffice[4].amount / wnt.revenue.visitors[4].units),
                    this.calcBarHeight(wnt.revenue.boxoffice[5].amount / wnt.revenue.visitors[5].units),
                    this.calcBarHeight(wnt.revenue.boxoffice[6].amount / wnt.revenue.visitors[6].units)
                ],
                cafeHeight: [
                    this.calcBarHeight(wnt.revenue.cafe[0].amount / wnt.revenue.visitors[0].units),
                    this.calcBarHeight(wnt.revenue.cafe[1].amount / wnt.revenue.visitors[1].units),
                    this.calcBarHeight(wnt.revenue.cafe[2].amount / wnt.revenue.visitors[2].units),
                    this.calcBarHeight(wnt.revenue.cafe[3].amount / wnt.revenue.visitors[3].units),
                    this.calcBarHeight(wnt.revenue.cafe[4].amount / wnt.revenue.visitors[4].units),
                    this.calcBarHeight(wnt.revenue.cafe[5].amount / wnt.revenue.visitors[5].units),
                    this.calcBarHeight(wnt.revenue.cafe[6].amount / wnt.revenue.visitors[6].units)
                ],
                giftstoreHeight: [
                    this.calcBarHeight(wnt.revenue.giftstore[0].amount / wnt.revenue.visitors[0].units),
                    this.calcBarHeight(wnt.revenue.giftstore[1].amount / wnt.revenue.visitors[1].units),
                    this.calcBarHeight(wnt.revenue.giftstore[2].amount / wnt.revenue.visitors[2].units),
                    this.calcBarHeight(wnt.revenue.giftstore[3].amount / wnt.revenue.visitors[3].units),
                    this.calcBarHeight(wnt.revenue.giftstore[4].amount / wnt.revenue.visitors[4].units),
                    this.calcBarHeight(wnt.revenue.giftstore[5].amount / wnt.revenue.visitors[5].units),
                    this.calcBarHeight(wnt.revenue.giftstore[6].amount / wnt.revenue.visitors[6].units)
                ],
                membershipHeight: [
                    this.calcBarHeight(wnt.revenue.membership[0].amount / wnt.revenue.visitors[0].units),
                    this.calcBarHeight(wnt.revenue.membership[1].amount / wnt.revenue.visitors[1].units),
                    this.calcBarHeight(wnt.revenue.membership[2].amount / wnt.revenue.visitors[2].units),
                    this.calcBarHeight(wnt.revenue.membership[3].amount / wnt.revenue.visitors[3].units),
                    this.calcBarHeight(wnt.revenue.membership[4].amount / wnt.revenue.visitors[4].units),
                    this.calcBarHeight(wnt.revenue.membership[5].amount / wnt.revenue.visitors[5].units),
                    this.calcBarHeight(wnt.revenue.membership[6].amount / wnt.revenue.visitors[6].units)
                ]
            });
        }
        event.target.blur();
    },
    render: function(){
        /*
            <select className="form-control">
                <option value="totals">This Week (05.24-05.30)</option>
            </select>
        */
        // HAD TO USE ONFOCUS SINCE ONCHANGE WASN'T FIRING WITH DATEPICKER PLUGIN
        return (
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
                    </div>
                    <div id="bar-graph">
                        <BarSet date={this.state.barDates[0]} />
                        <BarSet date={this.state.barDates[1]} />
                        <BarSet date={this.state.barDates[2]} />
                        <BarSet date={this.state.barDates[3]} />
                        <BarSet date={this.state.barDates[4]} />
                        <BarSet date={this.state.barDates[5]} />
                        <BarSet date={this.state.barDates[6]} />
                        <div className="bar-line"></div>
                        <div className="bar-line"></div>
                        <div className="bar-line"></div>
                        <div className="bar-line"></div>
                        <div className="bar-graph-Note"><NoteIcon /></div>
                        <div className="bar-graph-label-y">Thousands</div>
                        <div className="bar-graph-label-projected"><div className="legend-projected"></div> Projected</div>
                    </div>
                    <div className="scroll-bar-wrap ui-widget-content ui-corner-bottom">
                        <div className="bar-graph-slider scroll-bar" id="bar-graph-slider"></div>
                    </div>
                </div>

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
                        periods: { from: wnt.daybeforeyesterday, to: wnt.yesterday } },
                    boxoffice_online: { specs: { type: 'sales', channel: 'gate', online: true }, 
                        periods: { from: wnt.daybeforeyesterday, to: wnt.yesterday } },
                    boxoffice_offline: { specs: { type: 'sales', channel: 'gate', online: false }, 
                        periods: { from: wnt.daybeforeyesterday, to: wnt.yesterday } },
                    groups: { specs: { type: 'sales', kinds: ['group'] }, 
                        periods: { from: wnt.daybeforeyesterday, to: wnt.yesterday } },
                    cafe: { specs: { type: 'sales', channel: 'cafe' }, 
                        periods: { from: wnt.daybeforeyesterday, to: wnt.yesterday } },
                    giftstore: { specs: { type: 'sales', channel: 'store' }, 
                        periods: { from: wnt.daybeforeyesterday, to: wnt.yesterday } },
                    membership: { specs: { type: 'sales', channel: 'membership' }, 
                        periods: { from: wnt.daybeforeyesterday, to: wnt.yesterday } }
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
                    <BarGraph source={this.props.source} venueID={this.props.venueID} />
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
