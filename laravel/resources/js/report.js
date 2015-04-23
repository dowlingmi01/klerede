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
			datasets: [{
				data: []
			}]
		};
		for( var i = 0; i < newState.source_data.length; i++)
			if(newState.field === 'average')
				newState.source_data[i].average = newState.source_data[i].amount / newState.source_data[i].number;
		if(newState.indexes) {
			var days = {};
			for( var i = 0; i < 7; i++ )
				days[i] = {count:0, total:0};
			for( var i = 0; i < newState.source_data.length; i++) {
				var day = moment(newState.source_data[i].business_day).day();
				days[day].total += newState.source_data[i][newState.field];
				days[day].count++;
				days[day].avg = days[day].total / days[day].count;
			}
		}
		for( var i = 0; i < newState.source_data.length; i++) {
			gdata.labels.push(newState.source_data[i].business_day);
			var value = newState.source_data[i][newState.field];
			if(newState.indexes)
				value = 100 * value / days[moment(newState.source_data[i].business_day).day()].avg;
			gdata.datasets[0].data.push(value);
		}
		update.data = gdata;
		this.setState(update);
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
			</div>
			<LineChart data={this.state.data} redraw />
		</div>
			);
	}
});
React.render(
	<ReportBox />,
	document.getElementById('report')
);

