/************************/
/******** HEADER ********/
/************************/

var React = require('react');

var $ = require('jquery');
var wnt = require ('./wnt.js');
var _l = require("./lang/lang.js");

var KAPI = {};
KAPI.auth = require("./kapi/auth.js");
KAPI.users = require("./kapi/users.js");
KAPI.roles = require("./kapi/roles.js");

var KForms = require("./kutils/form-validations.js");

var KleredeLogo = require('./svg-icons').KleredeLogo;

var Caret = require('./svg-icons').Caret;
var ChangeArrow = require('./svg-icons').ChangeArrow;
var LongArrow = require('./svg-icons').LongArrow;

var customerLogos = require("./customer-logo.js").logos;

var DarkenBackground = React.createClass({
    componentWillUnmount: function(){
        $('body').removeClass("darken-background-active");
    },
    componentWillReceiveProps: function(nextProps){
        if(nextProps.active == "active") {
            window.scrollTo(0,0);
            $('body').addClass("darken-background-active");
        } else {
            $('body').removeClass("darken-background-active");
        }
    },
	render:function () {
		return (
			<div id="darken-background" className={"modal-backdrop fade in "+this.props.active}> </div>
		);
	}
});
var User = React.createClass({
    getInitialState: function() {
        return {
        };
    },
    // userAccordion: function(event){
    //     // Set index of user in list to use in jQuery addClass after component is updated
    //     this.setState({
    //         editUserIndex: $('.user').index($(event.target).closest('.user'))
    //     });
    // },
    deleteUser: function(event){
        event.preventDefault();
        // TO DO: Delete user code
        this.setState({ message: '' });
        console.log('DELETE USER', this.state);
        $(event.target).closest('.user').find('.confirm').show();
        event.target.blur();
    },
    deleteConfirmed: function(event){
        event.preventDefault();
        console.log('DELETE USER CONFIRMED', this.state);
        $(event.target).closest('.confirm').hide();
		this.setState({ message: 'Deleting user...' });
		KAPI.users.delete(this.props.id, this.onDeleteSuccess, this.onDeleteError);
    },
	onDeleteSuccess:function (response) {
        this.setState({ message: 'User was deleted.'});
		this.props.onDeleteSuccess();
	},
	onDeleteError:function (error) {
		console.log(error);
        this.setState({ message: 'Could not delete user.' });
	},
    deleteAborted: function(event){
        event.preventDefault();
        console.log('DELETE USER ABORTED', this.state);
        $(event.target).closest('.confirm').hide();
    },
	onRoleChange:function (event) {
		console.log(event);
		// event.stopPropagation();
		// event.nativeEvent.stopImmediatePropagation();
		// console.log(this.refs.roleSelect);
        this.setState({ message: '' });
		
		var addUserRoleID = this.refs.roleSelect.getDOMNode().value;
		// console.log(addUserRoleID);
		// patch:function (userID, firstName, lastName, email, roleID, venueID, onSuccess, onError) {
		KAPI.users.patch(
			this.props.id,
			this.props.firstName, 
			this.props.lastName, 
			this.props.email, 
			addUserRoleID, 
			wnt.venueID, 
			this.onRoleChangeSuccess, 
			this.onRoleChangeError
		);
	},
	onRoleChangeSuccess:function (response) {
        this.setState({ message: 'User role updated.'});
		$(this.refs.confirm.getDOMNode()).hide();
	},
	onRoleChangeError:function (error) {
		console.log(error);
        this.setState({ message: 'Could not update user role.' });
		$(this.refs.confirm.getDOMNode()).hide();
	},
    passwordReset: function(event){
        event.preventDefault();
		
        this.setState({ message: '' });
        // TO DO: Change password code
		//recovery:function (email, onSuccess, onError)
		KAPI.auth.recovery(
			this.props.email,
			this.onResetPasswordSuccess, 
			this.onResetPasswordError
		);
		this.setState({ message: 'Sending email to user...' });
        console.log('CHANGE PASSWORD', this.state);
        event.target.blur();
    },
	onResetPasswordSuccess:function (response) {
		console.log(response);
		this.setState({ message: 'An email has been sent to the user to reset their password.' });
	},
	onResetPasswordError:function (error) {
		console.log(error);
        this.setState({ message: 'Could not reset password.' });
	},
    componentDidUpdate: function(){
        // jQuery can control classes after components update
        // $('.user').eq(this.state.editUserIndex).toggleClass('active');
    },
    render: function() {
        
        // Role selector removed:
        // <Roles ref="roleSelect" onChange={this.onRoleChange} roleList={this.props.roleList} roleID={this.props.roleID}/>
        var roleName = this.props.roleList[this.props.roleID];
        
        var deleteUser = "";
        if (this.props.roleLevel > 10 ) {
            deleteUser = <a className="stop" onClick={this.deleteUser}>Delete User</a>;
        }
        
        return (
            <div className={this.props.className} >
				<div className="name" onClick={this.props.onClose}>{this.props.name} <Caret className="utilities-caret" /></div>
                <div className="quick-edit stop">
                    <div className="email">{this.props.email}</div>
                        <div className="inline-block role">{roleName}</div>&nbsp; 
                        {deleteUser}&nbsp; 
                        <a className="stop" onClick={this.passwordReset}>Password Reset</a>
                    <div className="message">{this.state.message}</div>
                    <div className="confirm" ref='confirm'>
                        <span className="message">Are you sure you want to delete this user?</span>
                        <button className="btn" onClick={this.deleteConfirmed}>Yes</button>
                        <button className="btn btn-default" onClick={this.deleteAborted}>No</button>
                    </div>
                </div>
            </div>
        );
    }
});

var Roles = React.createClass({
    render: function() {
		// console.log(this.props);
		var roleList = this.props.roleList;
		var roleID = this.props.roleID;
		var roles = [];
		
		for(var k in roleList) {
			// var selected = (k == roleID);
			
			roles.push(<option key={k.toString()} value={k.toString()}>{roleList[k]}</option>);
			// roles.push(<option selected={selected} value={k.toString()}>{roleList[k]}</option>);
		}
		
        return (
            <select defaultValue={roleID} className="form-control stop" id={this.props.id} onChange={this.props.onChange}>
			{roles}
            </select>
        );
    }
});

var Header = React.createClass({
    getInitialState: function() {
		var user = KAPI.auth.getUser();
        var state = {
            clientName: wnt.venue.name,
            permissions: KAPI.auth.getUserPermissions(),
            userID: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            name: user.name,
            email: user.email,
            roleID: user.role_id,
            pwdCurrent: '',
            pwdNew: '',
            pwdMatch: '',
            accountType: '',
            planTitle: 'Professional',
            planDescription: 'Unlimited Accounts',
            cardFirstName: 'Dan',
            cardLastName: 'Tribec',
            cardNumber: '**** **** **** 1234',
            users: [],
            usersEmail: [],
			roleNames:{},
            roleLevels:{},
			currentUtilitiesSet:"",
			currentUser:-1,
			utilitiesClass:"",
			addUserMessage:"",
			darkenBackgroundActive:"",
        };
        
        return state;
    },
	componentDidMount:function () {
		KAPI.roles(this.onRolesGet);
		this.getUsers();
	},
	getUsers:function () {
        if (this.state.permissions["users-manage"] === true) {
		    KAPI.users.get(wnt.venueID, this.onUsersGet);
        }
	},
	onUsersGet:function (users) {
		// console.log(users);
		var newState = this.state;
		newState.users = users;

		newState.addUserMessage = _l("");
		
		this.setState(newState);
	},
	onRolesGet:function (roles) {
		// console.log(roles);

		var newState = this.state;
		newState.roleNames = {};
		newState.roleLevels = {};

		for (var i = 0; i < roles.length; i++) {
			var rol = roles[i];
			newState.roleNames[rol.id] = rol.name;
            newState.roleLevels[rol.id] = rol.level;
		};
		
		newState.accountType = newState.roleNames[newState.roleID];
		newState.addUserRoleID = 4;
		
		this.setState(newState);
	},
    toggleSettings: function() {
		var state = this.state;
		state.currentUtilitiesSet = "";
		if(state.utilitiesClass == "active") {
			this.closeUtilities();
			return;
			// state.darkenBackgroundActive = "";
			// state.utilitiesClass = "";
			// 	        $('.user-name').removeClass('active');
		} else {
			state.darkenBackgroundActive = "active";
			state.utilitiesClass = "active";
	        $('.user-name').addClass('active');
		};
		this.setState(state);
        // Hide or show the settings modal
        // $('.user-name').toggleClass('active');
        // $('#utilities').toggleClass('active');
        // if($('#utilities.active').length === 0){
        //     $('.utilities-set').removeClass('active');
        // }
    },
    toggleUtility: function(utility, linkType) {
		
        if(linkType === 'page'){
            window.location.href = utility;
			return;
        }
		if(linkType === 'modal'){
			this.openUtility(utility);
        }
		
		return;
		//
		//         var linkType = $(event.target).closest('.utility').data('type');
		//         var utility = $(event.target).closest('.utility').data('utility');
        if(linkType === 'page'){
            window.location.href = utility;
        } else if(linkType === 'modal'){
            $('div[id="'+utility+'"]').toggleClass('active');
        } else if($(event.target).attr('id') === 'close-utilities'){
            $('.user-name').removeClass('active');
            $('#utilities').removeClass('active');
        }
    },
    closeUtilities: function(event) {
		var state = this.state;
		state.darkenBackgroundActive = "";
		state.currentUtilitiesSet = "";
		state.utilitiesClass = "";
        $('.user-name').removeClass('active');
		this.setState(state);
		
        // Close utility
        //$(event.target).closest('.utilities-set').removeClass('active');
    },
    openUtility: function(utility) {
		var state = this.state;
		state.currentUtilitiesSet = utility;
		this.setState(state);
        // Close utility
        //$(event.target).closest('.utilities-set').removeClass('active');
    },
    closeUtility: function(event) {
		console.log(event);
		var state = this.state;
		state.currentUtilitiesSet = "";
		this.setState(state);
        // Close utility
        //$(event.target).closest('.utilities-set').removeClass('active');
    },
	onUserClose:function(i) {
		// console.log(event);
		// console.log(this.refs);
		var state = this.state;
		if(state.currentUser===i) {
			this.closeUser();
		} else {
			state.currentUser = i;
		}
		this.setState(state);
		// console.log(state);
	},
	closeUser:function () {
		// console.log(event);
		
		if (this.state.currentUser === -1) return; //already closed
		
		var state = this.state;
		state.currentUser = -1;
		this.setState(state);
	},
    activateField: function(event){
		// console.log(event);
		// var state = this.state;
		// state.currentUtilitiesSet = event.target;
		
        // $(event.target).closest('.utilities-set').find('.active').removeClass('active');
        // $(event.target).closest('.form-group').addClass('active');
    },
    changeField: function(event){
        // Change state attributes when user types changes
        var field = $(event.target).data('field');
        var stateObject = function() {
            var returnObj = {};
            returnObj[field] = event.target.value;
            return returnObj;
        }.bind(event)();   // Second set of parentheses is needed to call the function expression 
        this.setState(stateObject);
        // Check password
        if(field === 'pwdCurrent'){
            console.log('PWD VALID?!');
        }
        // Match new password
        if(field === 'pwdMatch'){
            console.log('PWD MATCH?!');
        }
        if(($('#fName').val() !== '') && ($('#lName').val() !== '') && ($('#email').val() !== '')){
            $('#manage-users').find('.disabled').removeClass('disabled');
        }
    },
    saveCurrentUserChanges: function(event){
        event.preventDefault();
        console.log('SAVE', this.state);
            // pwdCurrent: '',
            // pwdNew: '',
            // pwdMatch: '',
		if ( !KForms.isEmpty(this.state.pwdCurrent) ) {
			var isValidResult = KForms.isValidPassword(this.state.pwdNew, this.state.pwdMatch);
			if( isValidResult === true ) {
				
				KAPI.users.pass(this.state.userID, this.state.pwdCurrent, this.state.pwdNew, this.onPasswordSave, this.onPasswordSaveError);
				
			} else {
				alert("New Password: "+isValidResult);
				return;
			};
		} else if( !KForms.isEmpty(this.state.pwdNew) ) {
			alert("New Password: Please enter your current password.");
			return;
		}
		
		KAPI.users.patch(
			this.state.userID,
			this.state.firstName, 
			this.state.lastName, 
			this.state.email, 
			this.state.roleID, 
			wnt.venueID, 
			this.onCurrentUserSave, 
			this.onCurrentUserSaveError
		);
		
        event.target.blur();
    },
	onPasswordSave:function (response) {
		console.log(response);
		if (response.result == "ok") {
			alert(_l("User password changed."))
		} else {
			alert(_l("Could not change password:")+" "+_l(response.message));
		}
	},
	onPasswordSaveError:function (error) {
		console.log(error);
		alert(_l("Could not change password."));
	},
	onCurrentUserSave:function (response) {
		console.log(response);
		if (response.result == "ok") {
			alert(_l("User profile saved."))
		} else {
			alert(_l("Could not save user profile:")+" "+_l(response.message));
		}
	},
	onCurrentUserSaveError:function (error) {
		console.log(error);
		alert(_l("Could not save user profile."));
	},
	// onAddUserChange:function (event) {
	// 	var addUserRoleID = this.refs.addUserRole.getDOMNode().value;
	// 	var state = this.state;
	// 	state.addUserRoleID = addUserRoleID;
	// 	this.setState(state);
	// },
    addUser: function(event){
        event.preventDefault();

		var email = this.state.addUserEmail;
		var firstName = this.state.addUserFirstName;
		var lastName = this.state.addUserLastName;

		var errors = [];
		if (KForms.isEmpty(email)) {
			errors.push("Please enter your email.")
		} else if(!KForms.isEmail(email)) {
			errors.push("Your email is not valid.")
		}
		
		if (KForms.isEmpty(firstName)) {
			errors.push("Please enter first name.")
		}
		if (KForms.isEmpty(lastName)) {
			errors.push("Please enter last name.")
		}
		
		if(errors.length) {
			
			alert(errors.join("\n"));
			return;
		}
		
		this.setState({addUserMessage:"Adding new user..." });
        event.target.blur();
		//new:function (name, email, password, role_id, venue_id, onSuccess, onError)
		KAPI.users.new(
			this.state.addUserFirstName,
			this.state.addUserLastName,
			this.state.addUserEmail,
			this.state.addUserRoleID,
			wnt.venueID,
			this.onAddUser,
			this.onAddUserError
		);
		
    },
	onAddUser:function (response) {
		console.log(response);
		if (response.result == "ok") {
			this.setState({addUserMessage:"New user added." });
			// alert(_l("New user added."));
			this.refs.addUserForm.getDOMNode().reset();
			this.getUsers();
		} else {
			this.setState({addUserMessage:_l("Could not add new user.") });
			// alert(_l("Could not add new user:")+" "+_l(response.message));
		}
	},
	onAddUserError:function (error) {
		console.log(error);
		this.setState({addUserMessage:_l("Could not add new user.") });
		// alert(_l("Could not add new user."));
	},
    changePlan: function(event){
		this.openUtility('change-plan');
        // event.preventDefault();
        // TO DO: Write plan change code
        // console.log('CHANGE PLAN', this.state);
        // $('#change-plan').addClass('active');
        // event.target.blur();
    },
    choosePlan: function(event){
        event.preventDefault();
        // TO DO: Write plan change code
        console.log('CHOOSE PLAN', this.state);
        event.target.blur();
    },
    cancelPlan: function(event){
        event.preventDefault();
        // TO DO: Write plan cancel code
        console.log('CANCEL PLAN', this.state);
        event.target.blur();
    },
    changeCard: function(event){
        event.preventDefault();
        wnt.filter.usCardOpen = wnt.filter.usCardOpen === false ? true : false;
        var modal = $(event.target).closest('.utility-group');
        // TO DO: Card change code
        console.log('CHANGE CARD', this.state);
        $(modal).find('.credit-card').show();
        $(modal).find('.card-name').hide();
        $(modal).find('.card-number').hide();
        $(modal).find('.btn').addClass('disabled');
        $(modal).find('.card-cancel').show();
        event.target.blur();
    },
    cancelCardChange: function(event){
        event.preventDefault();
        wnt.filter.usCardOpen = wnt.filter.usCardOpen === false ? true : false;
        var modal = $(event.target).closest('.utility-group');
        $(modal).find('.credit-card').hide();
        $(modal).find('.card-name').show();
        $(modal).find('.card-number').show();
        $(modal).find('.btn').removeClass('disabled');
        $(modal).find('.card-cancel').hide();
        console.log('CHANGE CARD CANCELLED', this.state);
    },
    openInvoice: function(event){
        event.preventDefault();
        // TO DO: Open invoice code
        console.log('OPEN INVOICE', this.state);
        event.target.blur();
    },
	logout:function (event) {
		KAPI.auth.logout(this.onLogoutSuccess, this.onLogoutError);
	},
	onLogoutError:function (error) {
		alert(error);
	},
	onLogoutSuccess:function (success) {
		if (success) {
			window.location = 'login';
		}
	},
    render: function() {
		// console.log(this.state);
        // LOOP FOR USERS
        var manageUsers = "";
        var manageUsersMenu = "";
        
        if (this.state.users.length > 0) {
            
            var users = [];
    		var usersData = this.state.users;
    		for (var i = 0; i < usersData.length; i++) {
    			// console.log(usersData[i]);
    			var data = usersData[i];
                
			
    			if (data.id == this.state.userID) {
    				continue;
    			}
                
                var level = this.state.roleLevels[data.role_id];
                
    			users.push(<User 
    				onClose={this.onUserClose.bind(this,i)}
    				className={"user" + (this.state.currentUser===i?" active":"")}
    				onDeleteSuccess={this.getUsers} 
    				key={data.id} 
    				id={data.id} 
    				name={data.name} 
    				firstName={data.first_name} 
    				lastName={data.last_name} 
    				email={data.email} 
    				roleID={data.role_id} 
    				roleList={this.state.roleNames}
                    roleLevel={level}
    			/>);
    		}
            
            manageUsersMenu = <div className="utility last" onClick={this.toggleUtility.bind(this,"manage-users","modal")}>
                                    Manage Users
                                    <Caret className="utilities-caret" />
                              </div>;
                            
            manageUsers = <div id="manage-users" className={"utilities-set" + (this.state.currentUtilitiesSet=="manage-users"? " active" : "") } onClick={this.activateField}>
                            <h3>Manage Users <div className="glyphicon glyphicon-remove close" aria-hidden="true" onClick={this.closeUtility}></div></h3>
                            <div className="utility-group">
                                {users}
                            </div>
                            <form ref="addUserForm" className="utility-group form-group" onFocus={this.closeUser}>
                                <h4>Add a User</h4>
                                <input type="text" id="fName" className="form-control" placeholder="First Name" defaultValue={this.state.addUserFirstName} data-field="addUserFirstName" onChange={this.changeField} />
                                <input type="text" id="lName" className="form-control" placeholder="Last Name" defaultValue={this.state.addUserLastName} data-field="addUserLastName" onChange={this.changeField} />
                                <input type="text" id="email" className="form-control" placeholder="Email Address" defaultValue={this.state.addUserEmail} data-field="addUserEmail" onChange={this.changeField} />
                                <input type="submit" defaultValue="Save User" className="btn disabled" onClick={this.addUser} />
                                <div className="message">{this.state.addUserMessage}</div>
                            </form>
                        </div>;
        }
        
        if (! customerLogos[wnt.venue.id] ){
            var clientName = <div className="client-name">{this.state.clientName}</div>;
        } else {
            var clientName = <div></div>;
        }
		// console.log(this.state.currentUser);
		// console.log(users);
        // for (var i = 0; i < this.state.users.length; i++) {
        //     users.push(<User key={i} name={this.state.users[i]} email={this.state.usersEmail[i]} />);
        // }
        return (
			<div>
            <header className="container-fluid">
                <div className="row">
                    <div className="col-xs-2 col-sm-2 klerede-logo"><a href="/dashboard"><KleredeLogo /></a></div>
                    <div className="col-xs-10 col-sm-10 user-info">
                        {clientName}
                        <div className="user-wrapper" onClick={this.toggleSettings}>
                            <div className="user-image"></div>
                            <div className="utilities-wrapper">
                                <div className="greeting">Welcome</div>
                                <div className="user-name">
                                    {this.state.name}
                                    <Caret className="utilities-caret" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="utilities-background" className="a-mask-to-fix-height">
                    <div id="utilities" className={this.state.utilitiesClass}>
                        <h3>Settings <div className="glyphicon glyphicon-remove close" id="close-utilities" aria-hidden="true" onClick={this.closeUtilities}></div></h3>
                        <div className="utility" onClick={this.toggleUtility.bind(this,"user-profile","modal")}>
                            User Profile
                            <Caret className="utilities-caret" />
                        </div>
                        {manageUsersMenu}
                        <h3>General</h3>
                        <div className="utility" data-utility="faqs" data-type="page" onClick={this.toggleUtility.bind(this,"faqs","page")}>
                            FAQs
                            <ChangeArrow className="utility-arrow" />
                        </div>
                        <div className="utility" data-utility="logout" data-type="tbd" onClick={this.logout}>Logout</div>
                    </div>
                    <div id="user-profile" className={"utilities-set" + (this.state.currentUtilitiesSet=="user-profile"? " active" : "") } onClick={this.activateField}>
                        <h3>User Profile <div className="glyphicon glyphicon-remove close" aria-hidden="true" onClick={this.closeUtility}></div></h3>
                        <form className="settings">
                            <div className="form-group">
                                <label htmlFor="up-firstName">First Name:</label>
                                <input type="text" id="up-firstName" defaultValue={this.state.firstName} data-field="firstName" onChange={this.changeField} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="up-lastName">Last Name:</label>
                                <input type="text" id="up-lastName" defaultValue={this.state.lastName} data-field="lastName" onChange={this.changeField} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="up-email">Email:</label>
                                <input type="text" id="up-email" defaultValue={this.state.email} value={this.state.email} data-field="email" disabled />
                            </div>
                            <div className="form-group">
                                <label htmlFor="up-pwd-current">Current Password:</label>
                                <input type="password" id="up-pwd-current" data-field="pwdCurrent" onBlur={this.changeField} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="up-pwd-new">New Password:</label>
                                <input type="password" id="up-pwd-new" data-field="pwdNew" onBlur={this.changeField} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="up-pwd-confirm">Confirm Password:</label>
                                <input type="password" id="up-pwd-confirm" data-field="pwdMatch" onBlur={this.changeField} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="up-type">Account Type:</label>
                                <input type="text" id="up-type" defaultValue={this.state.accountType} value={this.state.accountType} disabled/>
                            </div>
                            <div className="form-group">
                                <input type="submit" defaultValue="Save" className="btn" onClick={this.saveCurrentUserChanges} />
                            </div>
                        </form>
                    </div>
                    {manageUsers}
                </div>
            </header>
            <div onClick={this.closeUtilities}>
    			<DarkenBackground active={this.state.darkenBackgroundActive}/>
            </div>
		    </div>
        );
    }
});

if(document.getElementById('header')){
    $.when(wnt.gettingVenueData).done(function(data) {
        React.render(
            <Header />,
            document.getElementById('header')
        );
    });
}


/******************************************/
/******** TEMPORARY COMMENTED CODE ********/
/******************************************/

/*
var UserTypesMenu = React.createClass({
	render:function () {
		return (
                    <div className="utility-group" onClick={this.toggleUtility.bind(this,"user-types","modal")}>
                        <div className="utility sub-item">
                            Learn about user types
                            <Caret className="utilities-caret" />
                        </div>
                    </div>
		);
	}
});
var UserTypes = React.createClass({
	render:function () {
		return (
                <div id="user-types" className={"utilities-set" + (this.state.currentUtilitiesSet=="user-types"? " active" : "") } >
                    <h3>User Types <div className="glyphicon glyphicon-remove close" aria-hidden="true" onClick={this.openUtility.bind(this,"manage-users")}></div></h3>
                    <div className="utility-group">
                        <div className="sub-item">
                            <h4>Owner</h4>
                            <p>The owner serves as the primary contact for the account. Owners have access to billing and plan information.</p>
                        </div>
                        <div className="sub-item">
                            <h4>Admin</h4>
                            <p>The admin can perform all actions in the account; including adding new users, closing accounts, and setting and editing goals.</p>
                        </div>
                        <div className="sub-item">
                            <h4>Power</h4>
                            <p>The power user can set and edit goals, view and export reports, but can&quot;t view billing information, add users, or close accounts.</p>
                        </div>
                        <div className="sub-item">
                            <h4>Basic</h4>
                            <p>The basic user can view the dashboard, and export reports.</p>
                        </div>
                    </div>
                </div>
		);
	}
});

var ChangePlan = React.createClass({
	render:function () {
		return (
                <div id="change-plan" className={"utilities-set" + (this.state.currentUtilitiesSet=="change-plan"? " active" : "") } >
                    <h3>Time for an upgrade! <div className="glyphicon glyphicon-remove close" aria-hidden="true" onClick={this.openUtility.bind(this,"account-settings")}></div></h3>
                    <div className="utility-group">
                        <div className="sub-item plan">
                            <h4>Professional</h4>
                            <div className="features">Unlimited Accounts</div>
                            <div className="pricing">
                                <div className="per-year">$540/yr</div>
                                <div className="per-month">$50/mo</div>
                            </div>
                            <div className="plan-action"><button className="btn disabled" onClick={this.choosePlan}>Current Plan</button></div>
                        </div>
                        <div className="sub-item plan recommended-plan">
                            <div className="recommended-tag">Recommended</div>
                            <h4>Individual</h4>
                            <div className="features">Advanced Features</div>
                            <div className="pricing">
                                <div className="per-year">$440/yr</div>
                                <div className="per-month">$40/mo</div>
                            </div>
                            <div className="plan-action"><button className="btn" onClick={this.choosePlan}>Choose Plan</button></div>
                        </div>
                        <div className="sub-item plan">
                            <h4>Enterprise</h4>
                            <div className="features">Advanced Features</div>
                            <div className="pricing">
                                <div className="per-year">$640/yr</div>
                                <div className="per-month">$60/mo</div>
                            </div>
                            <div className="plan-action"><button className="btn" onClick={this.choosePlan}>Choose Plan</button></div>
                        </div>
                    </div>
                </div>
		);
	}
});
var AccountSettings = React.createClass({
	render:function () {
		return (
                <div id="account-settings" className={"utilities-set" + (this.state.currentUtilitiesSet=="account-settings"? " active" : "") }  onClick={this.activateField}>
                    <h3>Account Settings <div className="glyphicon glyphicon-remove close" aria-hidden="true" onClick={this.closeUtility}></div></h3>
                    <div className="utility-group">
                        <h4>Your Plan</h4>
                        <div className="plan-title">{this.state.planTitle}</div>
                        <div className="plan-description">{this.state.planDescription}</div>
                        <button className="btn" onClick={this.changePlan}>Upgrade Plan</button>
                        <a className="plan-cancel" onClick={this.cancelPlan}>Cancel Plan</a>
                    </div>
                    <div className="utility-group">
                        <h4>Card Info</h4>
                        <div className="card-name">{this.state.cardFirstName} {this.state.cardLastName}</div>
                        <div className="card-number">{this.state.cardNumber}</div>
                        <form className="credit-card">
                            <div className="form-group">
                                <label htmlFor="card-firstname">First Name</label>
                                <input type="text" id="card-firstname" defaultValue={this.state.cardFirstName} data-field="cardFirstName" onChange={this.changeField} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="card-lastname">Last Name</label>
                                <input type="text" id="card-lastname" defaultValue={this.state.cardLastName} data-field="cardLastName" onChange={this.changeField} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="card-billingaddress1">Billing Address</label>
                                <input type="text" id="card-billingaddress1" data-field="cardBillingAddress1" onChange={this.changeField} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="card-billingaddress2">Address (cont.)</label>
                                <input type="text" id="card-billingaddress2" data-field="cardBillingAddress2" onChange={this.changeField} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="card-city">City</label>
                                <input type="text" id="card-city" data-field="cardCity" onChange={this.changeField} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="card-state">State</label>
                                <input type="text" id="card-state" data-field="cardState" onChange={this.changeField} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="card-zip">Zip</label>
                                <input type="text" id="card-zip" data-field="cardZip" onChange={this.changeField} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="card-company">Company</label>
                                <input type="text" id="card-company" data-field="cardCompany" onChange={this.changeField} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="card-number">Card Number</label>
                                <input type="text" id="card-number" defaultValue={this.state.cardNumber} data-field="cardNumber" onChange={this.changeField} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="card-cvv">CVV</label>
                                <input type="text" id="card-cvv" data-field="cardCVV" onChange={this.changeField} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="card-mm">MM</label>
                                <input type="text" id="card-mm" data-field="cardMM" onChange={this.changeField} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="card-yy">YY</label>
                                <input type="text" id="card-yy" data-field="cardYY" onChange={this.changeField} />
                            </div>
                        </form>
                        <button className="btn" onClick={this.changeCard}>Change Card</button>
                        <a className="card-cancel" onClick={this.cancelCardChange}>Cancel</a>
                    </div>
                    <div className="utility-group">
                        <h4>Invoice History</h4>
                        <div className="invoice-period">Monthly</div>
                        <a href="#" className="invoice" onClick={this.openInvoice}>April 3, 2016 <span className="amount">$540.00</span></a>
                        <a href="#" className="invoice" onClick={this.openInvoice}>March 3, 2016 <span className="amount">$540.00</span></a>
                        <a href="#" className="invoice" onClick={this.openInvoice}>February 3, 2016 <span className="amount">$540.00</span></a>
                    </div>
                </div>)
	}
});*/
