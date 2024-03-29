'use strict';

exports.__esModule = true;

var PropTypes = require('./utils/propTypesPatch');

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _uncontrollable = require('uncontrollable');

var _uncontrollable2 = _interopRequireDefault(_uncontrollable);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = require('./utils/propTypes');

var _localizer = require('./localizer');

var _localizer2 = _interopRequireDefault(_localizer);

var _helpers = require('./utils/helpers');

var _constants = require('./utils/constants');

var _dates = require('./utils/dates');

var _dates2 = _interopRequireDefault(_dates);

var _formats = require('./formats');

var _formats2 = _interopRequireDefault(_formats);

var _viewLabel = require('./utils/viewLabel');

var _viewLabel2 = _interopRequireDefault(_viewLabel);

var _move = require('./utils/move');

var _move2 = _interopRequireDefault(_move);

var _Views = require('./Views');

var _Views2 = _interopRequireDefault(_Views);

var _Toolbar = require('./Toolbar');

var _Toolbar2 = _interopRequireDefault(_Toolbar);

var _omit = require('lodash/object/omit');

var _omit2 = _interopRequireDefault(_omit);

var _defaults = require('lodash/object/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _transform = require('lodash/object/transform');

var _transform2 = _interopRequireDefault(_transform);

var _mapValues = require('lodash/object/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function viewNames(_views) {
  return !Array.isArray(_views) ? Object.keys(_views) : _views;
}

function isValidView(view, _ref) {
  var _views = _ref.views;

  var names = viewNames(_views);
  return names.indexOf(view) !== -1;
}

var now = new Date();

/**
 * react-big-calendar is full featured Calendar component for managing events and dates. It uses
 * modern `flexbox` for layout making it super responsive and performant. Leaving most of the layout heavy lifting
 * to the browser. __note:__ The default styles use `height: 100%` which means your container must set an explicit
 * height (feel free to adjust the styles to suit your specific needs).
 *
 * Big Calendar is unopiniated about editing and moving events, prefering to let you implement it in a way that makes
 * the most sense to your app. It also tries not to be prescriptive about your event data structures, just tell it
 * how to find the start and end datetimes and you can pass it whatever you want.
 *
 * One thing to note is that, `react-big-calendar` treats event start/end dates as an _exclusive_ range.
 * which means that the event spans up to, but not including, the end date. In the case
 * of displaying events on whole days, end dates are rounded _up_ to the next day. So an
 * event ending on `Apr 8th 12:00:00 am` will not appear on the 8th, whereas one ending
 * on `Apr 8th 12:01:00 am` will. If you want _inclusive_ ranges consider providing a
 * function `endAccessor` that returns the end date + 1 day for those events that end at midnight.
 */
var Calendar = _react2.default.createClass({
  displayName: 'Calendar',


  propTypes: {

    /**
     * Props passed to main calendar `<div>`.
     */
    elementProps: PropTypes.object,

    /**
     * The current date value of the calendar. Determines the visible view range
     *
     * @controllable onNavigate
     */
    date: PropTypes.instanceOf(Date),

    /**
     * The current view of the calendar.
     *
     * @default 'month'
     * @controllable onView
     */
    view: PropTypes.string,

    /**
     * An array of event objects to display on the calendar
     */
    events: PropTypes.arrayOf(PropTypes.object),

    /**
     * Callback fired when the `date` value changes.
     *
     * @controllable date
     */
    onNavigate: PropTypes.func,

    /**
     * Callback fired when the `view` value changes.
     *
     * @controllable date
     */
    onView: PropTypes.func,

    /**
     * A callback fired when a date selection is made. Only fires when `selectable` is `true`.
     *
     * ```js
     * function(
     *   slotInfo: object {
     *     start: Date,
     *     end: Date,
     *     slots: array<Date>
     *   }
     * )
     * ```
     */
    onSelectSlot: PropTypes.func,

    /**
     * Callback fired when a calendar event is selected.
     *
     * ```js
     * function(event: object)
     * ```
     */
    onSelectEvent: PropTypes.func,

    /**
     * Callback fired when dragging a selection in the Time views.
     *
     * Returning `false` from the handler will prevent a selection.
     *
     * ```js
     * function ({ start: Date, end: Date }) : boolean
     * ```
     */
    onSelecting: PropTypes.func,

    /**
     * An array of built-in view names to allow the calendar to display.
     *
     * @type Calendar.views
     * @default ['month', 'week', 'day', 'agenda']
     */
    views: _propTypes.views,

    /**
     * Determines whether the toolbar is displayed
     */
    toolbar: PropTypes.bool,

    /**
     * Show truncated events in an overlay when you click the "+_x_ more" link.
     */
    popup: PropTypes.bool,

    /**
     * Show all events instead of "+_x_ more".
     */
    showAllEvents: PropTypes.bool,

    /**
     * Distance in pixels, from the edges of the viewport, the "show more" overlay should be positioned.
     *
     * ```js
     * <BigCalendar popupOffset={30}/>
     * <BigCalendar popupOffset={{x: 30, y: 20}}/>
     * ```
     */
    popupOffset: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({ x: PropTypes.number, y: PropTypes.number })]),
    /**
     * Allows mouse selection of ranges of dates/times.
     */
    selectable: PropTypes.bool,

    /**
     * Determines the selectable time increments in week and day views
     */
    step: PropTypes.number,

    /**
     * the number of slots per "section" in the Time grid views. Adjust with `step`
     * to change the default of Hour long sections, with 30 minute slots.
     */
    timeslots: PropTypes.number.isRequired,

    /**
     * switch the calendar to a `right-to-left` read direction.
     */
    rtl: PropTypes.bool,

    /**
     * Optionally provide a function that returns an object of className or style props
     * to be applied to the the event node.
     *
     * ```js
     * function(
     * 	event: object,
     * 	start: date,
     * 	end: date,
     * 	isSelected: bool
     * ) -> { className: string?, style: object? }
     * ```
     */
    eventPropGetter: PropTypes.func,

    /**
     * Accessor for the event title, used to display event information. Should
     * resolve to a `renderable` value.
     *
     * @type {(func|string)}
     */
    titleAccessor: _propTypes.accessor,

    /**
     * Determines whether the event should be considered an "all day" event and ignore time.
     * Must resolve to a `boolean` value.
     *
     * @type {(func|string)}
     */
    allDayAccessor: _propTypes.accessor,

    /**
     * The start date/time of the event. Must resolve to a JavaScript `Date` object.
     *
     * @type {(func|string)}
     */
    startAccessor: _propTypes.accessor,

    /**
     * The end date/time of the event. Must resolve to a JavaScript `Date` object.
     *
     * @type {(func|string)}
     */
    endAccessor: _propTypes.accessor,

    /**
     * Constrains the minimum _time_ of the Day and Week views.
     */
    min: PropTypes.instanceOf(Date),

    /**
     * Constrains the maximum _time_ of the Day and Week views.
     */
    max: PropTypes.instanceOf(Date),

    /**
     * Determines how far down the scroll pane is initially scrolled down.
     */
    scrollToTime: PropTypes.instanceOf(Date),

    /**
     * Localizer specific formats, tell the Calendar how to format and display dates.
     *
     * `format` types are dependent on the configured localizer; both Moment and Globalize
     * accept strings of tokens according to their own specification, such as: `'DD mm yyyy'`.
     *
     * ```jsx
     * let formats = {
     *   dateFormat: 'dd',
     *
     *   dayFormat: (date, culture, localizer) =>
     *     localizer.format(date, 'DDD', culture),
     *
     *   dayRangeHeaderFormat: ({ start, end }, culture, local) =>
     *     local.format(start, { date: 'short' }, culture) + ' — ' +
     *     local.format(end, { date: 'short' }, culture)
     * }
     *
     * <Calendar formats={formats} />
     * ```
     *
     * All localizers accept a function of
     * the form `(date: Date, culture: ?string, localizer: Localizer) -> string`
     */
    formats: PropTypes.shape({
      /**
       * Format for the day of the month heading in the Month view.
       * e.g. "01", "02", "03", etc
       */
      dateFormat: _propTypes.dateFormat,

      /**
       * A day of the week format for Week and Day headings,
       * e.g. "Wed 01/04"
       *
       */
      dayFormat: _propTypes.dateFormat,

      /**
       * Week day name format for the Month week day headings,
       * e.g: "Sun", "Mon", "Tue", etc
       *
       */
      weekdayFormat: _propTypes.dateFormat,

      /**
       * The timestamp cell formats in Week and Time views, e.g. "4:00 AM"
       */
      timeGutterFormat: _propTypes.dateFormat,

      /**
       * Toolbar header format for the Month view, e.g "2015 April"
       *
       */
      monthHeaderFormat: _propTypes.dateFormat,

      /**
       * Toolbar header format for the Week views, e.g. "Mar 29 - Apr 04"
       */
      dayRangeHeaderFormat: _propTypes.dateRangeFormat,

      /**
       * Toolbar header format for the Day view, e.g. "Wednesday Apr 01"
       */
      dayHeaderFormat: _propTypes.dateFormat,

      /**
       * Toolbar header format for the Agenda view, e.g. "4/1/2015 — 5/1/2015"
       */
      agendaHeaderFormat: _propTypes.dateFormat,

      /**
       * A time range format for selecting time slots, e.g "8:00am — 2:00pm"
       */
      selectRangeFormat: _propTypes.dateRangeFormat,

      agendaDateFormat: _propTypes.dateFormat,
      agendaTimeFormat: _propTypes.dateFormat,
      agendaTimeRangeFormat: _propTypes.dateRangeFormat
    }),

    /**
     * Customize how different sections of the calendar render by providing custom Components.
     * In particular the `Event` component can be specified for the entire calendar, or you can
     * provide an individual component for each view type.
     *
     * ```jsx
     * let components = {
     *   event: MyEvent, // used by each view (Month, Day, Week)
     *   toolbar: MyToolbar,
     *   agenda: {
     *   	 event: MyAgendaEvent // with the agenda view use a different component to render events
     *   }
     * }
     * <Calendar components={components} />
     * ```
     */
    components: PropTypes.shape({
      event: _propTypes.elementType,

      toolbar: _propTypes.elementType,

      agenda: PropTypes.shape({
        date: _propTypes.elementType,
        time: _propTypes.elementType,
        event: _propTypes.elementType
      }),

      day: PropTypes.shape({ event: _propTypes.elementType }),
      week: PropTypes.shape({ event: _propTypes.elementType }),
      month: PropTypes.shape({ event: _propTypes.elementType })
    }),

    /**
     * String messages used throughout the component, override to provide localizations
     */
    messages: PropTypes.shape({
      allDay: PropTypes.node,
      previous: PropTypes.node,
      next: PropTypes.node,
      today: PropTypes.node,
      month: PropTypes.node,
      week: PropTypes.node,
      day: PropTypes.node,
      agenda: PropTypes.node,
      showMore: PropTypes.func
    })
  },

  getDefaultProps: function getDefaultProps() {
    return {
      elementProps: {},
      popup: false,
      showAllEvents:false,
      toolbar: true,
      view: _constants.views.MONTH,
      views: [_constants.views.MONTH, _constants.views.WEEK, _constants.views.DAY, _constants.views.AGENDA],
      date: now,
      step: 30,

      titleAccessor: 'title',
      allDayAccessor: 'allDay',
      startAccessor: 'start',
      endAccessor: 'end'
    };
  },
  getViews: function getViews() {
    var views = this.props.views;

    if (Array.isArray(views)) {
      return (0, _transform2.default)(views, function (obj, name) {
        return obj[name] = _Views2.default[name];
      }, {});
    }

    if ((typeof views === 'undefined' ? 'undefined' : _typeof(views)) === 'object') {
      return (0, _mapValues2.default)(views, function (value, key) {
        if (value === true) {
          return _Views2.default[key];
        }

        return value;
      });
    }

    return _Views2.default;
  },
  getView: function getView() {
    var views = this.getViews();

    return views[this.props.view];
  },
  render: function render() {
    var _props = this.props;
    var view = _props.view;
    var toolbar = _props.toolbar;
    var events = _props.events;
    var culture = _props.culture;
    var _props$components = _props.components;
    var components = _props$components === undefined ? {} : _props$components;
    var _props$formats = _props.formats;
    var formats = _props$formats === undefined ? {} : _props$formats;
    var style = _props.style;
    var className = _props.className;
    var elementProps = _props.elementProps;
    var current = _props.date;

    var props = _objectWithoutProperties(_props, ['view', 'toolbar', 'events', 'culture', 'components', 'formats', 'style', 'className', 'elementProps', 'date']);

    formats = (0, _formats2.default)(formats);

    var View = this.getView();
    var names = viewNames(this.props.views);

    var viewComponents = (0, _defaults2.default)(components[view] || {}, (0, _omit2.default)(components, names));

    var ToolbarToRender = components.toolbar || _Toolbar2.default;

    return _react2.default.createElement(
      'div',
      _extends({}, elementProps, {
        className: (0, _classnames2.default)('rbc-calendar', className, {
          'rbc-rtl': props.rtl
        }),
        style: style
      }),
      toolbar && _react2.default.createElement(ToolbarToRender, {
        date: current,
        view: view,
        views: names,
        label: (0, _viewLabel2.default)(current, view, formats, culture),
        onViewChange: this.handleViewChange,
        onNavigate: this.handleNavigate,
        messages: this.props.messages
      }),
      _react2.default.createElement(View, _extends({
        ref: 'view'
      }, props, formats, {
        culture: culture,
        formats: undefined,
        events: events,
        date: current,
        components: viewComponents,
        onNavigate: this.handleNavigate,
        onHeaderClick: this.handleHeaderClick,
        onSelectEvent: this.handleSelectEvent,
        onSelectSlot: this.handleSelectSlot,
        onShowMore: this._showMore
      }))
    );
  },
  handleNavigate: function handleNavigate(action, newDate) {
    var _props2 = this.props;
    var view = _props2.view;
    var date = _props2.date;
    var onNavigate = _props2.onNavigate;


    date = (0, _move2.default)(action, newDate || date, view);

    onNavigate(date, view);

    if (action === _constants.navigate.DATE) this._viewNavigate(date);
  },
  _viewNavigate: function _viewNavigate(nextDate) {
    var _props3 = this.props;
    var view = _props3.view;
    var date = _props3.date;
    var culture = _props3.culture;


    if (_dates2.default.eq(date, nextDate, view, _localizer2.default.startOfWeek(culture))) {
      this.handleViewChange(_constants.views.DAY);
    }
  },
  handleViewChange: function handleViewChange(view) {
    if (view !== this.props.view && isValidView(view, this.props)) this.props.onView(view);
  },
  handleSelectEvent: function handleSelectEvent(event) {
    (0, _helpers.notify)(this.props.onSelectEvent, event);
  },
  handleSelectSlot: function handleSelectSlot(slotInfo) {
    (0, _helpers.notify)(this.props.onSelectSlot, slotInfo);
  },
  handleHeaderClick: function handleHeaderClick(date) {
    var view = this.props.view;


    if (view === _constants.views.MONTH || view === _constants.views.WEEK) this._view(_constants.views.day);

    this.handleNavigate(_constants.navigate.DATE, date);
  }
});

exports.default = (0, _uncontrollable2.default)(Calendar, {
  view: 'onView',
  date: 'onNavigate',
  selected: 'onSelectEvent'
});
module.exports = exports['default'];