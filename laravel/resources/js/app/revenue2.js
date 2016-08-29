var Dropdown = React.createClass({
    render:function () {
        var optionList = this.props.optionList;
        var options = [];
        for (v in optionList) {
            options.push(<option key={v} value={v}>{optionList[v]}</option>);
        }
        return (
            <form className="inline-block">
                <select className="form-control" onChange={this.props.onChange}>
                    {options}
                </select>
            </form>
        );
    }
});

var Channel = React.createClass({
    render:function () {
        return(
            <div className="channel multicolor-wrapper">
                <div className={"circle-checkbox multicolorbg "+this.props.active} onClick={this.props.onClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="21.294px" height="15.555px" viewBox="0 0 21.294 15.555" preserveAspectRatio="xMidYMid meet" className="legend-check" >
                        <path d="M20.641 0.653c-0.871-0.871-2.283-0.871-3.154 0.001l-9.489 9.528L3.793 5.98c-0.868-0.868-2.275-0.868-3.143 0 c-0.867 0.868-0.867 2.3 0 3.142l5.905 5.904c0.873 0.7 2.2 0.7 2.999-0.118L20.641 3.8 C21.512 2.9 21.5 1.5 20.6 0.7"/>
                    </svg>
                </div> &nbsp;
                <span>{this.props.name}</span>
                &nbsp;
            </div>
        );
    }
});

var DatePicker = React.createClass({
    componentDidMount: function() {
        $('#'+this.props.id).datePicker({
            selectWeek: true,
            closeOnSelect: true,
            startDate: '01/01/1996',
            endDate: wnt.doubleDigits(wnt.thisMonthNum+1)+'/'+wnt.doubleDigits(wnt.thisDate)+'/'+wnt.thisYear
        });
    },
    render:function () {
        return(
            <input className="form-control" id={this.props.id} type="text" value="06/01/2016"></input>
        );
    }
});

var Revenue2 = React.createClass({
    getInitialState:function () {
        return {
            channelNames:{box:"Box Office", cafe: "Cafe", gift: "Gift Store", mem: "Membership"},
            channelActive:{box:"active", cafe: "active", gift: "active", mem: "active"}
        };
    },
    onChannelClick:function (channel) {
        var state = this.state;
        state.channelActive[channel] = (state.channelActive[channel] == "active") ? "" : "active" ;
        this.setState(state);
    },
    onMembersChange:function (event) {
        console.log(event);
    },
    onPeriodTypeChange:function (event) {
        console.log(event);
    },
    render:function () {
        
        var channelTypes = this.state.channelNames;
        var channelActive = this.state.channelActive;
        var channels = [];
        for (k in channelTypes) {
            channels.push(
                <Channel key={k} name={channelTypes[k]} active={channelActive[k]} onClick={this.onChannelClick.bind(this,k)} />
            );
        }
        
        return (
            <div className="row">
                <div className="col-xs-12 col-md-12">
                    <div className="widget" id="revenue2">
                        <h2>
                            Earned Revenue
                        </h2>
                        <div className="row filters">
                            <div className="col-xs-12 col-md-6">
                                <Dropdown
                                    ref="periodType"
                                    optionList={{week:"Week containing", month:"Month containing", quarter:"Quarter containing"}}
                                    onChange={this.onPeriodTypeChange}
                                />
                                <DatePicker id="datePicker2" />
                            </div>
                            <div className="col-xs-12 col-md-6 text-right">
                                <Dropdown
                                    ref="members"
                                    optionList={{totals:"Totals", members:"Members", nonmembers:"Non-members"}}
                                    onChange={this.onMembersChange}
                                />
                            </div>
                        </div>
                        <div className="row filters">
                            <div id="channel-filters">
                                <div className="col-xs-12 col-md-6">
                                    <div className="unit-filter selected" id="dollars">
                                        Dollars
                                        <div className="filter-highlight"></div>
                                    </div>
                                    <div className="unit-filter" id="percap">
                                        Per Cap
                                        <div className="filter-highlight"></div>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-md-6 text-right">
                                    {channels}
                                </div>
                            </div>
                        </div>
                        <div className="row graphic">
                            <div id="y-axis" className="inline-block">
                                <div className="grow">
                                    <div className="glabel">
                                        80K
                                    </div>
                                </div><div className="grow">
                                    <div className="glabel">
                                        60K
                                    </div>
                                </div><div className="grow">
                                    <div className="glabel">
                                        40K
                                    </div>
                                </div><div className="grow">
                                    <div className="glabel">
                                       20K
                                    </div>
                                </div><div className="grow">
                                    <div className="glabel">
                                        0
                                    </div>
                                </div>
                            </div><div id="gbody"  className="inline-block">
                                <div id="gbackground">
                                    <div className="grow">
                                    </div>
                                    <div className="grow">
                                    </div>
                                    <div className="grow">
                                    </div>
                                    <div className="grow">
                                    </div>
                                </div>
                                <div id="gbars">
                                    <div className="gbar">
                                        <div className="gbar-sections">
                                            <div className="gbar-section multicolorbg">
                                
                                            </div>
                                            <div className="gbar-section multicolorbg">
                                
                                            </div>
                                            <div className="gbar-section multicolorbg">
                                
                                            </div>
                                        </div>
                                        <div className="glabel">
                                           05.29
                                        </div>
                                        <div id="popup">
                                            <div id="weather" className="row">
                                                <div id="popup-date">
                                                    Friday, June 3, 2016
                                                </div>
                                                <div className="col-xs-6 col-md-6">
                                                    <div id="icon" className="inline-block">
                                                        <img src="/img/cloudy.svg" className="popover-weather-icon" />
                                                    </div>
                                                    <div id="description" className="inline-block">
                                                        <div id="time">
                                                            10 A.M.
                                                        </div>
                                                        <div id="text">
                                                            Overcast
                                                        </div>
                                                        <div className="temp">
                                                            70° F
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xs-6 col-md-6">
                                                    <div id="icon" className="inline-block">
                                                        <img src="/img/cloudy.svg" className="popover-weather-icon" />
                                                    </div>
                                                    <div id="description" className="inline-block">
                                                        <div id="time">
                                                            10 A.M.
                                                        </div>
                                                        <div id="text">
                                                            Overcast
                                                        </div>
                                                        <div className="temp">
                                                            70° F
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="details" className="row">
                                                <div id="gift" className="details-row multicolor-wrapper">
                                                    <div className="col-xs-1">
                                                        <div className="circle multicolorbg"></div>
                                                    </div>
                                                    <div id="channel" className="col-xs-6">
                                                        Gift Store
                                                    </div>
                                                    <div id="quantity" className="col-xs-5">
                                                        $17,284
                                                    </div>
                                                </div>
                                                <div id="gift" className="details-row multicolor-wrapper">
                                                    <div className="col-xs-1">
                                                        <div className="circle multicolorbg"></div>
                                                    </div>
                                                    <div id="channel" className="col-xs-6">
                                                        Gift Store
                                                    </div>
                                                    <div id="quantity" className="col-xs-5">
                                                        $17,284
                                                    </div>
                                                </div>
                                                <div id="gift" className="details-row multicolor-wrapper">
                                                    <div className="col-xs-1">
                                                        <div className="circle multicolorbg"></div>
                                                    </div>
                                                    <div id="channel" className="col-xs-6">
                                                        Gift Store
                                                    </div>
                                                    <div id="quantity" className="col-xs-5">
                                                        $17,284
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="arrow">
                                    
                                            </div>
                                        </div>
                                    </div>
                                    <div className="gbar">
                                        <div className="gbar-sections">
                                            <div className="gbar-section multicolorbg">
                                
                                            </div>
                                            <div className="gbar-section multicolorbg">
                                
                                            </div>
                                            <div className="gbar-section multicolorbg">
                                
                                            </div>
                                        </div>
                                        <div className="glabel">
                                           05.30
                                        </div>
                                    </div>
                                    <div className="gbar">
                                        <div className="gbar-sections">
                                            <div className="gbar-section multicolorbg">
                                
                                            </div>
                                            <div className="gbar-section multicolorbg">
                                
                                            </div>
                                            <div className="gbar-section multicolorbg">
                                
                                            </div>
                                        </div>
                                        <div className="glabel">
                                           06.01
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row details">
                            <div className="col-xs-12 col-md-12">
                                <div className="col-xs-12 col-md-6" id="header">
                                    May 29 - Jun 4, 2016
                                </div>
                                <div className="col-xs-12 col-md-6 text-right">
                                    <form>
                                        <select className="form-control" id="members">
                                            <option value="last-week">Last Week</option>
                                            <option value="average13-week">13 Week Average</option>
                                        </select>
                                    </form>
                                </div>
                            </div>
                            <div className="col-xs-12 col-md-12" id="table">
                                <div className="col-xs-12 col-md-6 table-item-wrapper  multicolor-wrapper">
                                    <div className="table-item">
                                        <div className="col-xs-4">
                                            BOX OFFICE
                                        </div>
                                        <div className="col-xs-8">
                                            <div className="col-xs-4">
                                                <svg  xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 28.322 33.986" preserveAspectRatio="xMidYMid meet" className="change down multicolorfl"><path d="M16.382 31.766V8.503l8.147 8.15c0.867 0.9 2.3 0.9 3.1 0c0.867-0.868 0.867-2.275-0.001-3.142L16.382 2.2 L14.161 0l-2.222 2.223L0.65 13.512C0.217 13.9 0 14.5 0 15.082s0.217 1.1 0.7 1.571c0.868 0.9 2.3 0.9 3.1 0 l8.148-8.15v23.263c0 1.2 1 2.2 2.2 2.221C15.387 34 16.4 33 16.4 31.8"></path></svg>
                                                <span className="multicolor" id="change">24.59%</span>
                                            </div>
                                            <div className="col-xs-8" id="from-val">
                                                <span id="from-val">$704,974</span>
                                                <svg  xmlns="http://www.w3.org/2000/svg" width="20px" height="22.322px" viewBox="0 0 51.9 22.322" preserveAspectRatio="xMidYMid meet" className="long-arrow" data-reactid=".5.0.0.6.1.2.0.3.0"><path d="M2.221 13.382h41.176l-5.148 5.147c-0.867 0.867-0.867 2.3 0 3.143c0.867 0.9 2.3 0.9 3.141-0.001l8.289-8.289 l2.222-2.221l-2.222-2.222L41.389 0.65C40.957 0.2 40.4 0 39.8 0c-0.566 0-1.137 0.217-1.569 0.7 c-0.867 0.868-0.867 2.3 0 3.141l5.148 5.148H2.221C0.994 8.9 0 9.9 0 11.161C0 12.4 1 13.4 2.2 13.4" data-reactid=".5.0.0.6.1.2.0.3.0.0"></path></svg>
                                                <span className="multicolor" id="to-val" >$934,835</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-md-6 table-item-wrapper  multicolor-wrapper">
                                    <div className="table-item">
                                        <div className="col-xs-4">
                                            BOX OFFICE
                                        </div>
                                        <div className="col-xs-8">
                                            <div className="col-xs-4">
                                                <svg  xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 28.322 33.986" preserveAspectRatio="xMidYMid meet" className="change down multicolorfl"><path d="M16.382 31.766V8.503l8.147 8.15c0.867 0.9 2.3 0.9 3.1 0c0.867-0.868 0.867-2.275-0.001-3.142L16.382 2.2 L14.161 0l-2.222 2.223L0.65 13.512C0.217 13.9 0 14.5 0 15.082s0.217 1.1 0.7 1.571c0.868 0.9 2.3 0.9 3.1 0 l8.148-8.15v23.263c0 1.2 1 2.2 2.2 2.221C15.387 34 16.4 33 16.4 31.8"></path></svg>
                                                <span className="multicolor" id="change">24.59%</span>
                                            </div>
                                            <div className="col-xs-8" id="from-val">
                                                <span id="from-val">$704,974</span>
                                                <svg  xmlns="http://www.w3.org/2000/svg" width="20px" height="22.322px" viewBox="0 0 51.9 22.322" preserveAspectRatio="xMidYMid meet" className="long-arrow" data-reactid=".5.0.0.6.1.2.0.3.0"><path d="M2.221 13.382h41.176l-5.148 5.147c-0.867 0.867-0.867 2.3 0 3.143c0.867 0.9 2.3 0.9 3.141-0.001l8.289-8.289 l2.222-2.221l-2.222-2.222L41.389 0.65C40.957 0.2 40.4 0 39.8 0c-0.566 0-1.137 0.217-1.569 0.7 c-0.867 0.868-0.867 2.3 0 3.141l5.148 5.148H2.221C0.994 8.9 0 9.9 0 11.161C0 12.4 1 13.4 2.2 13.4" data-reactid=".5.0.0.6.1.2.0.3.0.0"></path></svg>
                                                <span className="multicolor" id="to-val" >$934,835</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-md-6 table-item-wrapper  multicolor-wrapper">
                                    <div className="table-item">
                                        <div className="col-xs-4">
                                            BOX OFFICE
                                        </div>
                                        <div className="col-xs-8">
                                            <div className="col-xs-4">
                                                <svg  xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 28.322 33.986" preserveAspectRatio="xMidYMid meet" className="change down multicolorfl"><path d="M16.382 31.766V8.503l8.147 8.15c0.867 0.9 2.3 0.9 3.1 0c0.867-0.868 0.867-2.275-0.001-3.142L16.382 2.2 L14.161 0l-2.222 2.223L0.65 13.512C0.217 13.9 0 14.5 0 15.082s0.217 1.1 0.7 1.571c0.868 0.9 2.3 0.9 3.1 0 l8.148-8.15v23.263c0 1.2 1 2.2 2.2 2.221C15.387 34 16.4 33 16.4 31.8"></path></svg>
                                                <span className="multicolor" id="change">24.59%</span>
                                            </div>
                                            <div className="col-xs-8" id="from-val">
                                                <span id="from-val">$704,974</span>
                                                <svg  xmlns="http://www.w3.org/2000/svg" width="20px" height="22.322px" viewBox="0 0 51.9 22.322" preserveAspectRatio="xMidYMid meet" className="long-arrow" data-reactid=".5.0.0.6.1.2.0.3.0"><path d="M2.221 13.382h41.176l-5.148 5.147c-0.867 0.867-0.867 2.3 0 3.143c0.867 0.9 2.3 0.9 3.141-0.001l8.289-8.289 l2.222-2.221l-2.222-2.222L41.389 0.65C40.957 0.2 40.4 0 39.8 0c-0.566 0-1.137 0.217-1.569 0.7 c-0.867 0.868-0.867 2.3 0 3.141l5.148 5.148H2.221C0.994 8.9 0 9.9 0 11.161C0 12.4 1 13.4 2.2 13.4" data-reactid=".5.0.0.6.1.2.0.3.0.0"></path></svg>
                                                <span className="multicolor" id="to-val" >$934,835</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center" id="details-handle">
                            Show Details
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

if(document.getElementById('revenue-row-widget2')){
    $.when(wnt.gettingVenueData).done(function(data) {
        React.render(
            <Revenue2 />,
            document.getElementById('revenue-row-widget2')
        );
        console.log('0!) Revenue 2 row loaded...');
    });
}
