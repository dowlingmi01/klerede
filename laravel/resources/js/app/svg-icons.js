/***************************/
/******** SVG ICONS ********/
/***************************/

var ChangeArrow = React.createClass({
    render: function() {
        return (
            /* width is 83% of height */
            <svg width="20px" height="17px" viewBox="0 0 28.322 33.986" preserveAspectRatio="xMidYMid meet" className={this.props.className}>
                <path fill={this.props.color} d="M16.382 31.766V8.503l8.147 8.15c0.867 0.9 2.3 0.9 3.1 0c0.867-0.868 0.867-2.275-0.001-3.142L16.382 2.2 L14.161 0l-2.222 2.223L0.65 13.512C0.217 13.9 0 14.5 0 15.082s0.217 1.1 0.7 1.571c0.868 0.9 2.3 0.9 3.1 0 l8.148-8.15v23.263c0 1.2 1 2.2 2.2 2.221C15.387 34 16.4 33 16.4 31.8"/>
            </svg>
        );
    }
});

var LongArrow = React.createClass({
    render: function() {
        return (
            /* width is 233% of height */
            <svg width="51.9px" height="22.322px" viewBox="0 0 51.9 22.322" preserveAspectRatio="xMidYMid meet" className={this.props.className}>
                <path fill={this.props.color} d="M2.221 13.382h41.176l-5.148 5.147c-0.867 0.867-0.867 2.3 0 3.143c0.867 0.9 2.3 0.9 3.141-0.001l8.289-8.289 l2.222-2.221l-2.222-2.222L41.389 0.65C40.957 0.2 40.4 0 39.8 0c-0.566 0-1.137 0.217-1.569 0.7 c-0.867 0.868-0.867 2.3 0 3.141l5.148 5.148H2.221C0.994 8.9 0 9.9 0 11.161C0 12.4 1 13.4 2.2 13.4"/>
            </svg>
        );
    }
});

var Caret = React.createClass({
    render: function() {
        return (
            /* width is 164% of height */
            <svg width="25.048px" height="15.298px" viewBox="0 0 25.048 15.298" preserveAspectRatio="xMidYMid meet" className={this.props.className}>
                <path fill={this.props.color} d="M21.854 0.439l-7.366 7.365L12.523 9.77L10.56 7.804L3.196 0.441C2.425-0.185 1.293-0.147 0.6 0.6 c-0.768 0.768-0.768 2 0 2.778l9.983 9.983l1.964 1.966l1.965-1.966l9.984-9.983c0.383-0.383 0.575-0.886 0.575-1.389 c0-0.502-0.192-1.006-0.575-1.389C23.755-0.146 22.626-0.185 21.9 0.4"/>
            </svg>
        );
    }
});

var PlusSign = React.createClass({
    render: function() {
        return (
            /* width is 100% of height */
            <svg width="24.598px" height="24.598px" viewBox="0 0 24.598 24.598" preserveAspectRatio="xMidYMid meet" className={this.props.className}>
                <path fill={this.props.color} d="M22.376 10.076h-2.528h-5.327V4.75V2.221C14.521 1 13.5 0 12.3 0c-1.228 0-2.223 0.993-2.223 2.22v2.53v5.326H4.75 H2.221C0.994 10.1 0 11.1 0 12.299s0.994 2.2 2.2 2.221H4.75h5.327v5.328v2.529c0 1.2 1 2.2 2.2 2.2 s2.221-0.995 2.221-2.221v-2.529V14.52h5.328h2.528c1.228 0 2.222-0.995 2.222-2.222S23.604 10.1 22.4 10.1"/>
            </svg>
        );
    }
});

var CheckMark = React.createClass({
    render: function() {
        return (
            /* width is 137% of height */
            <svg width="21.294px" height="15.555px" viewBox="0 0 21.294 15.555" preserveAspectRatio="xMidYMid meet" className={this.props.className}>
                <path fill={this.props.color} d="M20.641 0.653c-0.871-0.871-2.283-0.871-3.154 0.001l-9.489 9.528L3.793 5.98c-0.868-0.868-2.275-0.868-3.143 0 c-0.867 0.868-0.867 2.3 0 3.142l5.905 5.904c0.873 0.7 2.2 0.7 2.999-0.118L20.641 3.8 C21.512 2.9 21.5 1.5 20.6 0.7"/>
            </svg>
        );
    }
});

var Calendar = React.createClass({
    render: function() {
        return (
            /* width is 93% of height */
            <svg width="25.584px" height="27.51px" viewBox="0 0 25.584 27.51" preserveAspectRatio="xMidYMid meet" className={this.props.className}>
                <path fill={this.props.color} d="M19.275 0.953v0.602v1.89v1.537c0 0.5 0.4 1 1 0.953s0.952-0.427 0.952-0.953V3.444v-1.89V0.953 C21.181 0.4 20.8 0 20.2 0C19.702 0 19.3 0.4 19.3 1"/>
                <path fill={this.props.color} d="M11.816 0.953v0.602v1.89v1.537c0 0.5 0.4 1 1 0.953c0.527 0 0.953-0.427 0.953-0.953V3.444v-1.89V0.953 C13.723 0.4 13.3 0 12.8 0C12.244 0 11.8 0.4 11.8 1"/>
                <path fill={this.props.color} d="M4.483 0.953v0.602v1.89v1.537c0 0.5 0.4 1 1 0.953c0.527 0 0.953-0.427 0.953-0.953V3.444v-1.89V0.953 C6.39 0.4 6 0 5.4 0S4.483 0.4 4.5 1"/>
                <path fill={this.props.color} d="M23.034 2.546h-0.978v0.143v2.664c0 0.912-0.828 1.651-1.85 1.651c-1.023 0-1.853-0.739-1.853-1.651V2.688V2.546h-3.712 v0.143v2.664c0 0.912-0.828 1.651-1.851 1.651S10.94 6.3 10.9 5.353V2.688V2.546H7.274v0.143v2.664 c0 0.912-0.829 1.651-1.851 1.651S3.571 6.3 3.6 5.353V2.688V2.546H2.55C1.142 2.5 0 3.7 0 5.096v19.865 c0 1.4 1.1 2.5 2.5 2.549h20.484c1.407 0 2.55-1.141 2.55-2.549V5.096C25.584 3.7 24.4 2.5 23 2.5 M23.71 15.1 v3.424v5.961c0 0.439-0.357 0.796-0.797 0.796h-9.974c-0.051 0-0.1-0.006-0.147-0.016c-0.048 0.01-0.097 0.016-0.147 0.016H2.671 c-0.44 0-0.797-0.356-0.797-0.796v-5.961v-3.424V9.141c0-0.439 0.357-0.796 0.797-0.796h9.974c0.051 0 0.1 0 0.1 0 c0.048-0.01 0.097-0.016 0.147-0.016h9.974c0.439 0 0.8 0.4 0.8 0.796V15.102z"/>
            </svg>
        );
    }
});

console.log('SVG icons loaded...');
