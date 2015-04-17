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
		for( var i = 0; i < newState.source_data.length; i++) {
			if(newState.field === 'average')
				newState.source_data[i].average = newState.source_data[i].amount / newState.source_data[i].number;
			gdata.labels.push(newState.source_data[i].business_day);
			gdata.datasets[0].data.push(newState.source_data[i][newState.field]);
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

