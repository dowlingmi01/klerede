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
	getInitialState:function () {
		var state = {
			login:'active',
			reset:'inactive',
			resetSent:'inactive',
			newPassword:'inactive',
			passwordSent:'inactive',
			welcomeMessage:_l('Welcome Back to Klerede!'),
			resetTitle:_l('Reset Password'),
			passwordSetMessage: _l('Your password has been reset')
		};
		if (this.props.action != "") {
			state.login = 'inactive';
			state.newPassword = 'active';
			if(action=="set") {
				state.resetTitle = _l('Set Your Password');
				state.welcomeMessage= _l('Welcome to Klerede!');
				state.passwordSetMessage = _l('Your password has been set');
			}
		};
		return state;
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
		if (KUtils.isEmpty(email)) {
			errors.push("Please enter your email.")
		} else if(!KUtils.isEmail(email)) {
			errors.push("Your email is not valid.")
		}
		
		if (KUtils.isEmpty(password)) {
			errors.push("Please enter your password.")
		}
		
		if(errors.length) {
			
			alert(errors.join("\n"));

		} else {
			
			if (this.refs["remember-checkmark"].isActive()) {
				KUtils.storeLocal("user", {email:email, password:password, remember:true});
			} else {
				KUtils.storeLocal("user", {email:"", password:"", remember:false});
			}
			
			KAPI.auth.login(email, password,this.onSuccess, this.onError);
			
		}
	},
	onError:function (errors) {
		
		var output = "";
		
		for (var i in errors) {
			var e = errors[i];
			
			output += _l(e)+"\n";

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
			} else if(state[k]==='active'){
				state[k] = 'inactive';
			}
		}
		
		this.setState(state);
	},
	reset:function (event) {
		event.preventDefault();
		this.showSection('reset');
	},
	resetKeyPress:function (event) {
		this.callIfEnter(event, this.resetSubmit);
	},
	resetSubmit:function () {
		console.log('resetSubmit');

		var email = this.refs.emailReset.getDOMNode().value;

		if (KUtils.isEmpty(email)) {
			alert("Please enter your email.");
			return;
		} else if(!KUtils.isEmail(email)) {
			alert("Your email is not valid.");
			return;
		}
		KAPI.auth.recovery(email, this.onResetSuccess, this.onResetError);
	},
	onResetSuccess:function (response) {
		console.log(response);
		this.showSection('resetSent');
	},
	onResetError:function (response) {
		console.log(response);
		alert("Error recovering your password, please check your email address.");
	},
	gotoLogin:function (event) {
		if (event) {
			event.preventDefault();
		}
		
		this.showSection('login');
	},
	dotMail:function (mail) {
		var a = mail.split("@");
		return a[0].substring(0,2)+"...@"+a[1];
	},
	gotoNewPassword:function (event) {
		event.preventDefault();
		this.showSection("newPassword");
	},
	newPasswordKeyPress:function (event) {
		this.callIfEnter(event, this.newPassword);
	},
	newPassword:function () {
		
		var new1 = this.refs.newPassword1.getDOMNode().value;
		var new2 = this.refs.newPassword2.getDOMNode().value;
		
		var isValidResponse = KUtils.isValidPassword(new1, new2);
		if(isValidResponse === true) {
			KAPI.auth.reset(this.props.token, this.props.email, new1, this.onNewPasswordSet, this.onNewPasswordError);
			return;
		}
		
		alert(isValidResponse);

	},
	onNewPasswordSet:function (response) {
		console.log(response);
		if(response.result == 'ok') {
			this.gotoLogin();
			var state = this.state;
			state.passwordSent = 'active';
			this.setState(state);
		} else {
			alert(_l(response.message));
			this.gotoLogin();
		}
		if(window.history.pushState) {
			window.history.pushState({},'klerede/login','login');
		}
		
	},
	onNewPasswordError:function (response) {
		console.log(response);
		alert("Error setting your password, please check your email address: \n"+this.props.email);
	},
	render:function () {
		var user = KUtils.getLocal("user");
		
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
							{this.state.welcomeMessage}
						</div>
					</header>
					<section className={this.state.login}>
						<div id="password-sent" className={this.state.passwordSent}>Congratulations!<br/>{this.state.passwordSetMessage}</div>
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
						<div id="title">{this.state.resetTitle}</div>
						<div id="reset-form" className="form-group col-xs-10 col-xs-offset-1 klerede-form" onKeyPress={this.resetKeyPress} >
							
							<input type="text" name="email" ref="emailReset" id="email" placeholder="Enter Email" defaultValue="" />
							<div id="options" className="row">
								<div className="col-xs-6 col-xs-offset-6 text-align-right">
									<a href='#cancelReset' onClick={this.gotoLogin}>Cancel</a>
								</div>
							</div>
							<button className="btn form-group col-xs-4 col-xs-offset-4" onClick={this.resetSubmit}>Reset</button>
						</div>
					</section>
					<section className={this.state.resetSent}>
						<div id="title">{this.state.resetTitle}</div>
						<div id="reset-sent-form" className="form-group col-xs-10 col-xs-offset-1 klerede-form" >
							<p>An email has been sent to {this.dotMail(user.email)}</p>
							<button className="btn form-group col-xs-4 col-xs-offset-4" onClick={this.gotoLogin}>Continue</button>
						</div>
					</section>
					<section className={this.state.newPassword}>
						<div id="title">{this.state.resetTitle}</div>
						<div className="col-xs-10 col-xs-offset-1 subtitle"> 
							<p>Your password must be between <br />8 and 16 characters in length.</p>
						</div>
						<div id="new-password-form" className="form-group col-xs-10 col-xs-offset-1 klerede-form" onKeyPress={this.newPasswordKeyPress} >
							<input type="password" name="newPassword1" ref="newPassword1" id="newPassword1" placeholder="Create New Password" defaultValue="" />
							<input type="password" name="newPassword2" ref="newPassword2" id="newPassword2" placeholder="Confirm New Password" defaultValue="" />
							<button className="btn form-group col-xs-4 col-xs-offset-4" onClick={this.newPassword}>Submit</button>
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
		<LoginComponent token={token} email={email} action={action} />,
        document.getElementById('login-component')
    );
}

