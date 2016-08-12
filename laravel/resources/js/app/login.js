/*******************************************************************/
/************************* LOGIN COMPONENT *************************/
/*******************************************************************/


var RememberCheckMark = React.createClass({
	getInitialState:function() {
		return {
			active:this.props.active
		}
	},
	toggleActive:function (event) {
		this.setState({active:!this.state.active});
	},
	isActive:function() {
		return this.state.active;
	},
	render:function () {
		var theClass = "legend-check-circle" + (this.state.active ? " active":"");
		return (
			<div className={theClass} onClick={this.toggleActive}>
            	<CheckMark className="legend-check" />
			</div>
		);
	}
});

var LoginComponent = React.createClass({
	handleKeyPress:function (event) {
		if (event.charCode == 13) {
			this.submitForm();
		}
	},
	submitForm:function () {
		var email = this.refs.email.getDOMNode().value;
		var password = this.refs.password.getDOMNode().value;
		var errors = [];
		if (isEmpty(email)) {
			errors.push("Please enter your email.")
		} else if(!isEmail(email)) {
			errors.push("Your email is not valid.")
		}
		
		if (isEmpty(password)) {
			errors.push("Please enter your password.")
		}
		
		if(errors.length) {
			
			alert(errors.join("\n"));

		} else {
			
			if (this.refs["remember-checkmark"].isActive()) {
				storeLocal("user", {email:email, password:password, remember:true});
			} else {
				storeLocal("user", {email:"", password:"", remember:false});
			}
			
			KAPI.goals.sales(wnt.venueID,wnt.thisYear,this.onSuccess);
			
		}
	},
	onSuccess:function (data) {
		//if ();
		window.location = 'dashboard';
	},
	render:function () {
		var user = getLocal("user");
		
		if (!user) {
			user = {email:"", password:"", remember:true};
		};

		return (
        <div id="login-background" className="site-wrapper">
			<div className="site-wrapper-inner">
				<div id="login" className="">
					<header>
						<img id="logo" src="img/logo-klerede-dark.svg" />
						<div id="welcome">
							Welcome Back to Klerede!
						</div>
					</header>
					<section>
						<div id="title">Sign into your account</div>
						<div id="login-form" className="form-group col-xs-10 col-xs-offset-1" onKeyPress={this.handleKeyPress} >
							
							<input type="text" name="email" ref="email" id="email" placeholder="Email" defaultValue={user.email} />
							<input type="password" name="password" ref="password" id="password" placeholder="Password" defaultValue={user.password} />
							<div id="options" className="row">
								<div className="col-xs-6">
									<span id="remember-checkmark"><RememberCheckMark ref='remember-checkmark' active={user.remember} /></span>&nbsp;Remember Me
								</div>
								<div className="col-xs-6 text-align-right">
									Forgot <a href='#'>Password</a>
								</div>
							</div>
							<button className="btn form-group col-xs-4 col-xs-offset-4" onClick={this.submitForm}>Sign In</button>
						</div>
					</section>
					<div className="clearfix">
						
					</div>
				</div>
			</div>
        </div>
		);
	}
})

if(document.getElementById('login-component')){
    React.render(
		<LoginComponent />,
        document.getElementById('login-component')
    );
}
