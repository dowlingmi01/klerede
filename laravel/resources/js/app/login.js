/*******************************************************************/
/************************* LOGIN COMPONENT *************************/
/*******************************************************************/

var lang = {};
lang['user_not_found'] = "Error: user not found.";
lang['invalid_credentials'] = "Invalid credentials.";

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
	getInitialState:function () {
		return {
			login:'active',
			reset:'inactive'
		}
	},
	handleKeyPress:function (event) {
		this.callIfEnter(event, this.submitForm);
	},
	callIfEnter:function (event, func) {
		if (event.charCode == 13) {
			func();
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
			
			KAPI.auth.login(email, password,this.onSuccess, this.onError);
			
		}
	},
	onError:function (errors) {
		
		var output = "";
		
		for (var i in errors) {
			var e = errors[i];
			
			if (lang[e]) {
				output += lang[e]+"\n";
			} else {
				output += e+"\n";
			}
		}
		
		alert(output);
		
	},
	onSuccess:function (success) {
		if (success) {
			window.location = 'dashboard';
		} else {
			//alert("error imprevisto: " + success);
		}
	},
	showSection:function (section) {
		var state = this.state;
		for (var k in state) {
			if (k == section) {
				state[k] = 'active';
			} else {
				state[k] = 'inactive';
			}
		}
		
		this.setState(state);
	},
	reset:function (event) {
		event.preventDefault();
		this.showSection('reset');
	},
	handleResetKeyPress:function (event) {
		this.callIfEnter(event, this.resetSubmit);
	},
	resetSubmit:function () {
		console.log('resetSubmit');
		//
	},
	resetCancel:function () {
		this.showSection('login');
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
					<section className={this.state.login}>
						<div id="title">Sign into your account</div>
						<div id="login-form" className="form-group col-xs-10 col-xs-offset-1 klerede-form" onKeyPress={this.handleKeyPress} >
							
							<input type="text" name="email" ref="email" id="email" placeholder="Email" defaultValue={user.email} />
							<input type="password" name="password" ref="password" id="password" placeholder="Password" defaultValue={user.password} />
							<div id="options" className="row">
								<div className="col-xs-6">
									<span id="remember-checkmark"><RememberCheckMark ref='remember-checkmark' active={user.remember} /></span>&nbsp;Remember Me
								</div>
								<div className="col-xs-6 text-align-right">
									Forgot <a href='#forgotPassword' onClick={this.reset}>Password</a>
								</div>
							</div>
							<button className="btn form-group col-xs-4 col-xs-offset-4" onClick={this.submitForm}>Sign In</button>
						</div>
					</section>
					<section className={this.state.reset}>
						<div id="title">Reset Password</div>
						<div id="reset-form" className="form-group col-xs-10 col-xs-offset-1 klerede-form" onKeyPress={this.handleResetKeyPress} >
							
							<input type="text" name="email" ref="email" id="email" placeholder="Email" defaultValue={user.email} />
							<div id="options" className="row">
								<div className="col-xs-6 col-xs-offset-6 text-align-right">
									<a href='#cancelReset' onClick={this.resetCancel}>Cancel</a>
								</div>
							</div>
							<button className="btn form-group col-xs-4 col-xs-offset-4" onClick={this.resetSubmit}>Reset</button>
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

