var WelcomeText = React.createClass({
  getInitialState: function() {
    return {
      firstName: 'Joe'
    };
  },
  render: function() {
    return (
        <div>
            Hi&#160;
            <span className='user-name'>{this.state.firstName}!</span>&#160;
            Things are looking good.
        </div>
    );
  }
});

React.render(
  <WelcomeText />,
  document.getElementById('welcome-text')
);
console.log('Welcome text loaded...');