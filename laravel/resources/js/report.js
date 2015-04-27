var $ = require('jquery');
var React = require('react/addons');
var Chart = require('chart.js');
var LineChart = require('react-chartjs').Line;
Chart.defaults.global.responsive = true;
var DatePicker = require('react-datepicker');
var moment = require('moment');
var Button = require('react-bootstrap').Button;
var ButtonGroup = require('react-bootstrap').ButtonGroup;
var ReportBox = React.createClass({
	getInitialState: function() {
		var gdata = {
			labels:[],
			datasets: [{
				data: []
			}]
		};
		return {
			selected: 'tot',
			field: 'amount',
			data: gdata,
			indexes: false,
			categories: false,
			source_data: [],
			date_from: moment('2015-03-01'),
			date_to: moment('2015-03-31')
		};
	},
	componentDidMount: function() {
		this.getData({});
	},
	handleClick: function(event) {
		this.getData({selected: event.target.id});
	},
	handleField: function(event) {
		this.prepareData({field: event.target.id});
	},
	handleIndexes: function(event) {
		this.prepareData({indexes: (event.target.id==='ind')});
	},
	handleCat: function(event) {
		this.getData({categories: !this.state.categories});
	},
	handleDateFromChange: function(date) {
		this.getData({date_from: date});
	},
	handleDateToChange: function(date) {
		this.getData({date_to: date});
	},
	getData: function(update) {
		var that = this;
		var newState = $.extend(this.state, update);
		var data = {
			date_from: newState.date_from.format('YYYY-MM-DD'),
			date_to: newState.date_to.format('YYYY-MM-DD')
		}
		if( newState.selected == 'mem' )
			data['member'] = true;
		else if( newState.selected == 'non' )
			data['member'] = false;

		if( newState.categories )
			data['by_category'] = true;

		$.ajax({
			url: '/api/v1/query/store_transactions',
			data: data
		}).then( function(data) {
			update.source_data = data;
			that.prepareData(update);
		});
	},
	prepareData: function(update) {
		var newState = $.extend(this.state, update);
		var gdata = {
			labels:[],
			datasets: []
		};
		for( var m = moment(newState.date_from); m <= newState.date_to; m.add(1, 'd') )
			gdata.labels.push(m.format('YYYY-MM-DD'));
		if(newState.categories) {
			for(var i = 0; i < newState.source_data.length; i++)
				this.prepareDataSeries(newState, gdata.labels, newState.source_data[i].sales, gdata.datasets, newState.source_data[i].category);
		} else
			this.prepareDataSeries(newState, gdata.labels, newState.source_data, gdata.datasets);
		update.data = gdata;
		this.setState(update);
	},
	prepareDataSeries: function(newState, dates, source_data, target, label) {
		var datai = {};
		for( var i = 0; i < source_data.length; i++) {
			if(newState.field === 'average')
				source_data[i].average = source_data[i].amount / source_data[i].number;
			datai[source_data[i].business_day] = source_data[i][newState.field];
		}
		var data = [];
		for( var i = 0; i < dates.length; i++)
			data.push(datai[dates[i]]||0);

		if(newState.indexes) {
			var days = {};
			for( var i = 0; i < 7; i++ )
				days[i] = {count:0, total:0};
			for( var i = 0; i < data.length; i++) {
				var day = moment(dates[i]).day();
				days[day].total += data[i];
				days[day].count++;
				days[day].avg = days[day].total / days[day].count;
			}
			for( var i = 0; i < data.length; i++)
				data[i] = 100 * data[i] / days[moment(dates[i]).day()].avg || 0;
		}
		target.push({data: data, label: label});
	},
	render: function() {
		return(<div>
			<div>
			<label>Date From:
				<DatePicker key="from" selected={this.state.date_from} onChange={this.handleDateFromChange}/>
			</label>
			<label>Date To:
				<DatePicker key="to" selected={this.state.date_to} onChange={this.handleDateToChange} />
			</label>
			<ButtonGroup>
				<Button id="tot" onClick={this.handleClick} active={this.state.selected=="tot"}>Total</Button>
				<Button id="mem" onClick={this.handleClick} active={this.state.selected=="mem"}>Members</Button>
				<Button id="non" onClick={this.handleClick} active={this.state.selected=="non"}>Non-Members</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button id="amount" onClick={this.handleField} active={this.state.field=="amount"}>$ Spent</Button>
				<Button id="number" onClick={this.handleField} active={this.state.field=="number"}>Units</Button>
				<Button id="average" onClick={this.handleField} active={this.state.field=="average"}>Avg. $/Tran</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button id="abs" onClick={this.handleIndexes} active={!this.state.indexes}>Absolute</Button>
				<Button id="ind" onClick={this.handleIndexes} active={this.state.indexes}>Indexes</Button>
			</ButtonGroup>
			<label><input type="checkbox" onChange={this.handleCat} checked={this.state.categories}/> Categories</label>
			</div>
			<LineChart data={this.state.data} options={{datasetFill: false}} redraw />
		</div>
			);
	}
});
React.render(
	<ReportBox />,
	document.getElementById('report')
);

