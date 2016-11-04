/***************************/
/******** SVG ICONS ********/
/***************************/

var React = require('react');
var ReactDOM = require('react-dom');


var KleredeLogo = React.createClass({
    render:function () {
        return(
            <svg version="1.1" id="Layer_1" x="0px" y="0px"
            	 width="111px" height="31.524px" viewBox="318.035 90.321 111 31.524" enableBackground="new 318.035 90.321 111 31.524">
            <g>
            	<path fill="#FFFFFF" d="M322.034,113.437v8.408h-3.999V95.319h3.999v9.456l4.886-9.456h4.263l-5.472,10.82l6.417,15.707h-4.7
            		l-4.198-10.77L322.034,113.437z"/>
            	<path fill="#FFFFFF" d="M347.277,121.845h-10.894V95.34h3.998v22.529h6.896V121.845z"/>
            	<path fill="#FFFFFF" d="M351.814,121.845V95.319h11.381v4.019h-7.383v7.234h5.395v4.019h-5.395v7.234h7.383v4.02H351.814
            		L351.814,121.845z"/>
            	<path fill="#FFFFFF" d="M374.035,95.34c2.229,0,3.864,0.613,4.908,1.84c0.916,1.072,1.374,2.567,1.374,4.485v3.85
            		c0,1.876-0.712,3.462-2.136,4.76l2.961,11.57h-4.323l-2.425-9.984c-0.112,0-0.232,0-0.359,0h-2.305v9.984h-3.999V95.34H374.035
            		L374.035,95.34z M376.426,101.728c0-1.537-0.762-2.306-2.285-2.306h-2.411v8.483h2.411c0.635,0,1.174-0.227,1.619-0.678
            		c0.444-0.45,0.666-0.994,0.666-1.629V101.728z"/>
            	<path fill="#FFFFFF" d="M384.829,121.845v-4.02h7.383v-7.234h-5.394v-4.019h5.394v-7.234h-7.383v-4.019h11.381v26.526H384.829
            		L384.829,121.845z"/>
            	<path fill="#FFFFFF" d="M413.503,115.5c0,1.749-0.614,3.244-1.841,4.484c-1.227,1.241-2.707,1.861-4.442,1.861h-6.282V95.319h6.282
            		c1.749,0,3.233,0.621,4.453,1.861c1.22,1.241,1.83,2.729,1.83,4.463V115.5z M404.936,117.889h2.411
            		c0.635,0,1.171-0.229,1.608-0.688c0.437-0.458,0.655-0.997,0.655-1.618v-13.876c0-0.635-0.222-1.178-0.666-1.629
            		c-0.444-0.451-0.977-0.677-1.598-0.677h-2.411V117.889z"/>
            	<path fill="#FFFFFF" d="M417.654,121.845V95.319h11.381v4.019h-7.383v7.234h5.395v4.019h-5.395v7.234h7.383v4.02H417.654
            		L417.654,121.845z"/>
            	<rect x="417.42" y="90.321" fill="#FFFFFF" width="11.583" height="2.442"/>
            </g>
            </svg>
        );
    }
});

var ChangeArrow = React.createClass({
    render: function() {
        return (
            /* width is 83% of height */
            <svg width="20px" height="17px" viewBox="0 0 28.322 33.986" preserveAspectRatio="xMidYMid meet" className={this.props.className}>
                <path d="M16.382 31.766V8.503l8.147 8.15c0.867 0.9 2.3 0.9 3.1 0c0.867-0.868 0.867-2.275-0.001-3.142L16.382 2.2 L14.161 0l-2.222 2.223L0.65 13.512C0.217 13.9 0 14.5 0 15.082s0.217 1.1 0.7 1.571c0.868 0.9 2.3 0.9 3.1 0 l8.148-8.15v23.263c0 1.2 1 2.2 2.2 2.221C15.387 34 16.4 33 16.4 31.8"/>
            </svg>
        );
    }
});

var LongArrow = React.createClass({
    render: function() {
        var width = "51.9px";
        if (this.props.width) {
            width = this.props.width;
        }
        
        return (
            /* width is 233% of height */
            <svg width={width} height="22.322px" viewBox="0 0 51.9 22.322" preserveAspectRatio="xMidYMid meet" className={this.props.className}>
                <path d="M2.221 13.382h41.176l-5.148 5.147c-0.867 0.867-0.867 2.3 0 3.143c0.867 0.9 2.3 0.9 3.141-0.001l8.289-8.289 l2.222-2.221l-2.222-2.222L41.389 0.65C40.957 0.2 40.4 0 39.8 0c-0.566 0-1.137 0.217-1.569 0.7 c-0.867 0.868-0.867 2.3 0 3.141l5.148 5.148H2.221C0.994 8.9 0 9.9 0 11.161C0 12.4 1 13.4 2.2 13.4"/>
            </svg>
        );
    }
});

var Caret = React.createClass({
    render: function() {
        return (
            /* width is 164% of height */
            <svg width="25.048px" height="15.298px" viewBox="0 0 25.048 15.298" preserveAspectRatio="xMidYMid meet" className={this.props.className}>
                <path d="M21.854 0.439l-7.366 7.365L12.523 9.77L10.56 7.804L3.196 0.441C2.425-0.185 1.293-0.147 0.6 0.6 c-0.768 0.768-0.768 2 0 2.778l9.983 9.983l1.964 1.966l1.965-1.966l9.984-9.983c0.383-0.383 0.575-0.886 0.575-1.389 c0-0.502-0.192-1.006-0.575-1.389C23.755-0.146 22.626-0.185 21.9 0.4"/>
            </svg>
        );
    }
});

var PlusSign = React.createClass({
    render: function() {
        var onClick = this.props.onClick;
        if (!onClick) {
            onClick = "";
        }
        return (
            /* width is 100% of height */
            <svg onClick={onClick} width="24.598px" height="24.598px" viewBox="0 0 24.598 24.598" preserveAspectRatio="xMidYMid meet" className={this.props.className}>
                <path d="M22.376 10.076h-2.528h-5.327V4.75V2.221C14.521 1 13.5 0 12.3 0c-1.228 0-2.223 0.993-2.223 2.22v2.53v5.326H4.75 H2.221C0.994 10.1 0 11.1 0 12.299s0.994 2.2 2.2 2.221H4.75h5.327v5.328v2.529c0 1.2 1 2.2 2.2 2.2 s2.221-0.995 2.221-2.221v-2.529V14.52h5.328h2.528c1.228 0 2.222-0.995 2.222-2.222S23.604 10.1 22.4 10.1"/>
            </svg>
        );
    }
});

var SlimPlusSign = React.createClass({
    render: function() {
        var onClick = this.props.onClick;
        if (!onClick) {
            onClick = "";
        }
        return (
            <svg  onClick={onClick} x="0px" y="0px"
                 width="15.202px" height="15.217px" viewBox="0 0 15.202 15.217" enableBackground="new 0 0 15.202 15.217" className={this.props.className}>
            <path d="M8.488,6.728l0-5.844c0-0.243-0.099-0.464-0.259-0.625C8.07,0.099,7.848,0,7.604,0C7.131-0.001,6.76,0.346,6.715,0.762
                L6.712,0.79l0,5.938L0.776,6.727C0.332,6.774-0.017,7.146,0,7.604c0,0.489,0.392,0.881,0.884,0.884l5.829,0.001v5.845
                c0,0.243,0.099,0.465,0.259,0.625c0.16,0.159,0.381,0.258,0.625,0.259c0.473,0,0.845-0.346,0.89-0.763l0.002-0.027V8.489h5.937
                c0.443-0.046,0.792-0.418,0.775-0.876c0-0.489-0.393-0.881-0.884-0.884L8.488,6.728z"/>
            </svg>
        );
    }
});

var SlimMinusSign = React.createClass({
    render: function() {
        var onClick = this.props.onClick;
        if (!onClick) {
            onClick = "";
        }
        return (
            <svg  onClick={onClick} x="0px" y="0px"
                 width="15.202px" height="15.217px" viewBox="0 0 15.202 15.217" enableBackground="new 0 0 15.202 15.217" className={this.props.className}>
<path d="M14.426,8.489c0.443-0.046,0.792-0.418,0.775-0.876c0-0.489-0.393-0.881-0.884-0.884L0.776,6.727
	C0.332,6.774-0.017,7.146,0,7.604c0,0.489,0.392,0.881,0.884,0.884L14.426,8.489z"/>
            </svg>
        );
    }
});


var CheckMark = React.createClass({
    render: function() {
        return (
            /* width is 137% of height */
            <svg  x="0px" y="0px"
            	 width="15.2px" height="15.2px" viewBox="3.042 0.168 15.2 15.2" enableBackground="new 3.042 0.168 15.2 15.2">
            <path d="M17.784,2.687c-0.622-0.622-1.631-0.622-2.253,0L8.753,9.493L5.75,6.491c-0.62-0.62-1.625-0.62-2.245,0
            	c-0.619,0.62-0.619,1.643,0,2.244l4.218,4.217c0.624,0.499,1.571,0.499,2.142-0.084l7.919-7.934
            	c0.622-0.643,0.613-1.643-0.029-2.214"/>
            </svg>
        );
    }
});

var CalendarIcon = React.createClass({
    render: function() {
        return (
            /* width is 93% of height */
            <svg width="25.584px" height="27.51px" viewBox="0 0 25.584 27.51" preserveAspectRatio="xMidYMid meet" className={this.props.className}>
                <path d="M19.275 0.953v0.602v1.89v1.537c0 0.5 0.4 1 1 0.953s0.952-0.427 0.952-0.953V3.444v-1.89V0.953 C21.181 0.4 20.8 0 20.2 0C19.702 0 19.3 0.4 19.3 1"/>
                <path d="M11.816 0.953v0.602v1.89v1.537c0 0.5 0.4 1 1 0.953c0.527 0 0.953-0.427 0.953-0.953V3.444v-1.89V0.953 C13.723 0.4 13.3 0 12.8 0C12.244 0 11.8 0.4 11.8 1"/>
                <path d="M4.483 0.953v0.602v1.89v1.537c0 0.5 0.4 1 1 0.953c0.527 0 0.953-0.427 0.953-0.953V3.444v-1.89V0.953 C6.39 0.4 6 0 5.4 0S4.483 0.4 4.5 1"/>
                <path d="M23.034 2.546h-0.978v0.143v2.664c0 0.912-0.828 1.651-1.85 1.651c-1.023 0-1.853-0.739-1.853-1.651V2.688V2.546h-3.712 v0.143v2.664c0 0.912-0.828 1.651-1.851 1.651S10.94 6.3 10.9 5.353V2.688V2.546H7.274v0.143v2.664 c0 0.912-0.829 1.651-1.851 1.651S3.571 6.3 3.6 5.353V2.688V2.546H2.55C1.142 2.5 0 3.7 0 5.096v19.865 c0 1.4 1.1 2.5 2.5 2.549h20.484c1.407 0 2.55-1.141 2.55-2.549V5.096C25.584 3.7 24.4 2.5 23 2.5 M23.71 15.1 v3.424v5.961c0 0.439-0.357 0.796-0.797 0.796h-9.974c-0.051 0-0.1-0.006-0.147-0.016c-0.048 0.01-0.097 0.016-0.147 0.016H2.671 c-0.44 0-0.797-0.356-0.797-0.796v-5.961v-3.424V9.141c0-0.439 0.357-0.796 0.797-0.796h9.974c0.051 0 0.1 0 0.1 0 c0.048-0.01 0.097-0.016 0.147-0.016h9.974c0.439 0 0.8 0.4 0.8 0.796V15.102z"/>
            </svg>
        );
    }
});

var EditIcon = React.createClass({
    render: function() {
        return (
            <svg onClick={this.props.onClick} className={this.props.className} x="0px" y="0px" width="25.584px" height="27.51px" viewBox="0 0 25.584 27.51" enableBackground="new 0 0 25.584 27.51" >
            <g>
            	<path fill="#231F20" d="M20.957,1.42h0.438c0.192,0.102,0.352,0.242,0.504,0.397c0.213,0.22,0.438,0.428,0.657,0.641
            		c0.015,0.043,0.043,0.071,0.086,0.087c0.118,0.147,0.252,0.28,0.399,0.398c0.016,0.043,0.045,0.072,0.088,0.087
            		c0.117,0.148,0.251,0.281,0.398,0.399c0.016,0.043,0.045,0.072,0.088,0.087c0.117,0.148,0.25,0.281,0.399,0.399
            		c0.015,0.043,0.044,0.071,0.087,0.087c0.118,0.147,0.251,0.28,0.398,0.397c0.016,0.043,0.046,0.073,0.089,0.088
            		c0.128,0.135,0.253,0.271,0.385,0.402c0.247,0.245,0.274,0.533,0.177,0.849c-0.06,0.193-0.193,0.332-0.332,0.471
            		C21.3,9.729,17.781,13.25,14.261,16.767c-0.062,0.061-0.104,0.15-0.206,0.158c-0.032-0.033-0.064-0.066-0.098-0.098
            		c-0.098-0.127-0.209-0.238-0.336-0.338c-0.035-0.062-0.086-0.111-0.149-0.148c-0.099-0.127-0.21-0.238-0.337-0.336
            		c-0.035-0.064-0.085-0.115-0.148-0.15c-0.099-0.127-0.21-0.238-0.337-0.338c-0.036-0.062-0.085-0.113-0.149-0.148
            		c-0.098-0.127-0.21-0.238-0.337-0.338c-0.036-0.062-0.085-0.113-0.149-0.148c-0.098-0.127-0.211-0.238-0.337-0.336
            		c-0.036-0.064-0.086-0.115-0.149-0.15c-0.098-0.127-0.211-0.239-0.337-0.336c-0.036-0.063-0.086-0.114-0.149-0.15
            		c-0.099-0.126-0.211-0.237-0.337-0.337c-0.036-0.062-0.086-0.112-0.15-0.148c-0.098-0.127-0.21-0.239-0.336-0.337
            		c-0.036-0.064-0.086-0.113-0.15-0.15c-0.065-0.071-0.12-0.156-0.197-0.21c-0.202-0.142-0.153-0.242,0.005-0.399
            		c1.891-1.879,3.774-3.766,5.659-5.65c1.697-1.695,3.394-3.388,5.09-5.082C20.736,1.536,20.847,1.478,20.957,1.42"/>
            	<path fill="#231F20" d="M12.883,17.903c0.035,0.064,0.083,0.113,0.147,0.148c0.009,0.051,0.138,0.113-0.021,0.146
            		c-0.108,0.023-0.212,0.064-0.318,0.098c-0.121-0.004-0.232,0.033-0.34,0.082c-0.33,0.061-0.657,0.137-0.974,0.248
            		c-0.123-0.006-0.234,0.041-0.348,0.072c-0.305,0.078-0.61,0.156-0.915,0.234c-0.116,0.02-0.235,0.031-0.341,0.09
            		c-0.329,0.061-0.655,0.137-0.972,0.246c-0.121-0.002-0.232,0.033-0.34,0.082c-0.33,0.061-0.657,0.135-0.974,0.248
            		c-0.117-0.01-0.222,0.041-0.332,0.068c-0.26,0.059-0.259,0.059-0.2-0.195c0.016-0.068,0.028-0.139,0.042-0.207
            		c0.043-0.092,0.064-0.188,0.067-0.287c0.084-0.326,0.168-0.652,0.253-0.98c0.035-0.109,0.082-0.217,0.073-0.338
            		c0.111-0.316,0.188-0.641,0.246-0.971c0.059-0.107,0.075-0.225,0.089-0.342c0.081-0.324,0.163-0.648,0.244-0.973
            		c0.044-0.09,0.065-0.186,0.067-0.287c0.085-0.324,0.169-0.652,0.253-0.979c0.035-0.11,0.083-0.218,0.074-0.338
            		c0.019-0.059,0.041-0.116,0.058-0.175c0.023-0.084,0.069-0.068,0.121-0.031c0.136,0.164,0.286,0.314,0.451,0.45
            		c0.035,0.062,0.084,0.112,0.147,0.146c0.099,0.127,0.212,0.241,0.339,0.338c0.035,0.064,0.084,0.113,0.148,0.148
            		c0.098,0.127,0.211,0.24,0.339,0.34c0.034,0.062,0.083,0.111,0.147,0.146c0.098,0.127,0.211,0.24,0.339,0.34
            		c0.034,0.062,0.084,0.111,0.147,0.146c0.098,0.127,0.211,0.24,0.339,0.338c0.035,0.064,0.084,0.113,0.147,0.148
            		c0.099,0.127,0.212,0.24,0.339,0.338c0.035,0.064,0.084,0.113,0.148,0.148c0.098,0.127,0.211,0.24,0.338,0.338
            		c0.035,0.064,0.084,0.113,0.148,0.148c0.098,0.127,0.211,0.24,0.339,0.338c0.034,0.064,0.084,0.113,0.147,0.148
            		C12.643,17.692,12.755,17.806,12.883,17.903"/>
            	<path fill="#231F20" d="M22.26,12.663c0,2.922,0,5.844-0.002,8.766c-0.001,0.945-0.48,1.613-1.333,1.838
            		c-0.194,0.051-13.332,0.066-15.88,0.066c-0.435,0-0.845-0.086-1.2-0.357c-0.515-0.395-0.709-0.93-0.709-1.559
            		c0.002-3.203,0.001-6.406,0.001-9.609c0-1.895,0-3.79,0.001-5.685c0-0.436,0.084-0.846,0.355-1.201
            		c0.37-0.485,0.872-0.708,1.47-0.708c3.014-0.003,6.029-0.002,9.043,0l2.736-2.737c-0.016-0.007-0.034-0.014-0.051-0.021H3.797
            		c-3.379,0-3.395,2.901-3.395,2.901S0.381,16.739,0.381,22.673c0.13,0.611,0.13,0.611,0.24,0.896
            		c0.533,1.398,1.547,2.217,3.02,2.471c0.053,0.008,0.104,0.031,0.156,0.049h17.012c0.702,0,1.399-0.129,1.688-0.24
            		c1.396-0.533,2.518-2.084,2.518-3.176V9.909L22.26,12.663z"/>
            </g>
            </svg>
        );
    }
});
        

var NoteIcon = React.createClass({
    render: function() {
        return (
            <svg  onClick={this.props.onClick}  className={this.props.className} x="0px" y="0px" width="26.405px" height="26.523px" viewBox="-0.411 0.493 26.405 26.523" enableBackground="new -0.411 0.493 26.405 26.523" >
            <g>
            	<path fill="#231F20" d="M22.268,19.017c-0.469,0.03-2.645,0.032-3.262,0.035c-0.65,0.004-0.971,0.325-0.978,0.978
            		c-0.009,1.079-0.013,2.191-0.028,3.271c-0.002,0.165,0.113,0.963-0.807,0.963c-3.724-0.001-7.448-0.001-11.172-0.003
            		c-0.945,0-1.614-0.48-1.837-1.333C4.134,22.733,4.118,9.596,4.118,7.048c0.001-0.435,0.086-0.845,0.358-1.2
            		C4.87,5.333,5.406,5.139,6.035,5.14c3.203,0.001,6.405,0,9.608,0c1.895,0,3.79,0,5.686,0.001c0.435,0,0.844,0.084,1.199,0.355
            		c0.486,0.37,0.708,0.872,0.709,1.47c0.004,3.702,0.004,7.404,0,11.106C23.236,18.682,22.939,18.974,22.268,19.017 M23.093,2.405
            		c0,0-12.381-0.021-18.315-0.021c-0.61,0.13-0.61,0.13-0.897,0.24c-1.397,0.533-2.216,1.547-2.469,3.02
            		C1.402,5.697,1.378,5.748,1.361,5.8v17.011c0,0.703,0.13,1.4,0.24,1.688c0.533,1.396,2.085,2.518,3.176,2.518h12.895
            		c1.059-0.36,1.83-1.125,2.598-1.883c1.425-1.408,2.837-2.829,4.239-4.26c0.544-0.554,1.061-1.138,1.362-1.874
            		c0.041-0.103,0.082-0.204,0.123-0.306V5.8C25.994,2.421,23.093,2.405,23.093,2.405"/>
            	<path fill="#231F20" d="M13.689,9.976c1.843,0,3.687,0.003,5.529-0.002c0.426-0.001,0.778,0.124,0.971,0.526
            		c0.31,0.647-0.109,1.299-0.858,1.353c-0.048,0.003-0.097,0.001-0.146,0.001c-3.678,0-7.356,0.001-11.035,0
            		c-0.523,0-0.856-0.2-1.018-0.607c-0.211-0.531,0.108-1.131,0.668-1.239c0.14-0.027,0.286-0.03,0.43-0.03
            		C10.051,9.975,11.87,9.976,13.689,9.976"/>
            	<path fill="#231F20" d="M12.691,16.582c-1.531,0-3.062,0.002-4.594-0.001c-0.583-0.001-0.98-0.332-1.022-0.835
            		c-0.047-0.578,0.333-0.995,0.944-1.038c0.04-0.002,0.08-0.001,0.12-0.001c3.063,0,6.126-0.001,9.188,0
            		c0.518,0,0.845,0.204,1.009,0.621c0.194,0.495-0.104,1.086-0.623,1.209c-0.146,0.035-0.302,0.043-0.452,0.043
            		C15.738,16.583,14.215,16.582,12.691,16.582"/>
            	<path fill="#231F20" d="M7.425,2.03C6.603,1.096,5.412,0.493,4.073,0.493c-2.473,0-4.484,2.012-4.484,4.484
            		c0,1.334,0.598,2.521,1.526,3.343c0.791,0.701,1.82,1.141,2.958,1.141c0.61,0,1.192-0.124,1.723-0.347
            		c1.173-0.49,2.078-1.473,2.497-2.682c0.159-0.459,0.263-0.943,0.263-1.455C8.556,3.845,8.12,2.82,7.425,2.03"/>
            	<path fill="#FFFFFF" d="M3.626,2.919v0.525v1.106H2.521H1.995c-0.255,0-0.461,0.207-0.462,0.462c0,0.254,0.207,0.461,0.462,0.461
            		h0.525h1.106v1.105v0.525c0,0.255,0.207,0.461,0.461,0.461c0.255,0,0.462-0.206,0.462-0.461V6.579V5.474h1.106H6.18
            		c0.255,0,0.461-0.207,0.461-0.461c0-0.255-0.206-0.462-0.461-0.462H5.655H4.549V3.444V2.919c0-0.255-0.207-0.461-0.462-0.461
            		C3.833,2.458,3.626,2.664,3.626,2.919"/>
            </g>
            </svg>
        );
    }
});

var CloseIcon = React.createClass({
    render: function() {
        return (
            <svg className={this.props.className} x="0px" y="0px" width="15.203px" height="15.217px" viewBox="0 0 15.203 15.217" enableBackground="new 0 0 15.203 15.217" >
            <path stroke="#000000" strokeMiterlimit="10" d="M7.605,6.358L3.473,2.226C3.301,2.054,3.075,1.968,2.848,1.967c-0.226,0-0.453,0.086-0.625,0.259
            	C1.887,2.56,1.871,3.068,2.133,3.394L2.15,3.416l4.199,4.199l-4.198,4.196c-0.281,0.348-0.265,0.857,0.071,1.169
            	c0.346,0.346,0.9,0.346,1.25,0l4.123-4.121l4.133,4.134c0.172,0.172,0.398,0.258,0.625,0.258c0.226,0,0.452-0.087,0.625-0.259
            	c0.335-0.334,0.354-0.842,0.09-1.168l-0.018-0.021l-4.199-4.2l4.197-4.198c0.281-0.347,0.266-0.856-0.071-1.168
            	c-0.346-0.346-0.9-0.345-1.25,0L7.605,6.358z"/>
            </svg>
        );
    }
});


module.exports.CalendarIcon = CalendarIcon;
module.exports.Caret = Caret;
module.exports.ChangeArrow = ChangeArrow;
module.exports.CheckMark = CheckMark;
module.exports.CloseIcon = CloseIcon;
module.exports.EditIcon = EditIcon;
module.exports.KleredeLogo = KleredeLogo;
module.exports.LongArrow = LongArrow;
module.exports.NoteIcon = NoteIcon;
module.exports.PlusSign = PlusSign;
module.exports.SlimPlusSign = SlimPlusSign;
module.exports.SlimMinusSign = SlimMinusSign;

console.log('SVG icons loaded...');
