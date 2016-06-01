/************************/
/******** HEADER ********/
/************************/

var User = React.createClass({
    getInitialState: function() {
        return {
        };
    },
    userAccordion: function(event){
        // Set index of user in list to use in jQuery addClass after component is updated
        this.setState({
            editUserIndex: $('.user').index($(event.target).closest('.user'))
        });
    },
    deleteUser: function(event){
        event.preventDefault();
        // TO DO: Delete user code
        console.log('DELETE USER', this.state);
        $(event.target).closest('.user').find('.confirm').show();
        event.target.blur();
    },
    deleteConfirmed: function(event){
        event.preventDefault();
        console.log('DELETE USER CONFIRMED', this.state);
        $(event.target).closest('.confirm').hide();
    },
    deleteAborted: function(event){
        event.preventDefault();
        console.log('DELETE USER ABORTED', this.state);
        $(event.target).closest('.confirm').hide();
    },
    passwordReset: function(event){
        event.preventDefault();
        // TO DO: Change password code
        this.setState({ message: 'An email has been sent to the user to reset their password.' });
        console.log('CHANGE PASSWORD', this.state);
        event.target.blur();
    },
    componentDidUpdate: function(){
        // jQuery can control classes after components update
        $('.user').eq(this.state.editUserIndex).toggleClass('active');
    },
    render: function() {
        return (
            <div className="user" onClick={this.userAccordion}>
                {this.props.name} <Caret className="utilities-caret" />
                <div className="quick-edit stop">
                    <div className="email">{this.props.email}</div>
                    <Roles />
                    <a className="stop" onClick={this.deleteUser}>Delete User</a>
                    <a className="stop" onClick={this.passwordReset}>Password Reset</a>
                    <div className="message">{this.state.message}</div>
                    <div className="confirm">
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
        return (
            <select className="form-control stop" id={this.props.id}>
                <option value="basic">Basic</option>
                <option value="power">Power</option>
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
            </select>
        );
    }
});

var Header = React.createClass({
    getInitialState: function() {
        return {
            clientName: 'Your Institution Here',
            fullName: 'Michael Dowling',
            userName: 'mdowling',
            email: 'michael@klerede.com',
            pwdCurrent: '',
            pwdNew: '',
            pwdMatch: '',
            accountType: 'Owner',
            planTitle: 'Professional',
            planDescription: 'Unlimited Accounts',
            cardFirstName: 'Dan',
            cardLastName: 'Tribec',
            cardNumber: '**** **** **** 1234',
            users: ['Michael Dowling', 'Matt Pelletier', 'Heather Finney', 'Sergio Daicz', 'Taylor Johnson', 'Elizabeth Johnson'],
            usersEmail: ['michael@klerede.com', 'matt@klerede.com', 'hfinney@klerede.com', 'sdaicz@klerede.com', 'webninjataylor@gmail.com', 'libbykjohsnon@gmail.com']
        };
    },
    toggleSettings: function() {
        // Hide or show the settings modal
        $('.user-name').toggleClass('active');
        $('#utilities').toggleClass('active');
        if($('#utilities.active').length === 0){
            $('.utilities-set').removeClass('active');
        }
    },
    toggleUtility: function(event) {
        var linkType = $(event.target).closest('.utility').data('type');
        var utility = $(event.target).closest('.utility').data('utility');
        if(linkType === 'page'){
            window.location.href = utility;
        } else if(linkType === 'modal'){
            $('div[id="'+utility+'"]').toggleClass('active');
        } else if($(event.target).attr('id') === 'close-utilities'){
            $('.user-name').removeClass('active');
            $('#utilities').removeClass('active');
        }
    },
    closeUtility: function(event) {
        // Close utility
        $(event.target).closest('.utilities-set').removeClass('active');
    },
    activateField: function(event){
        $(event.target).closest('.utilities-set').find('.active').removeClass('active');
        $(event.target).closest('.form-group').addClass('active');
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
    saveChanges: function(event){
        event.preventDefault();
        // TO DO: Send changed data to the API
        console.log('SAVE', this.state);
        event.target.blur();
    },
    addUser: function(event){
        event.preventDefault();
        // TO DO: Send changed data to the API
        this.setState({addUserRole: $('#addUserRole').val() });
        console.log('ADD USER', this.state);
        event.target.blur();
    },
    changePlan: function(event){
        event.preventDefault();
        // TO DO: Write plan change code
        console.log('CHANGE PLAN', this.state);
        $('#change-plan').addClass('active');
        event.target.blur();
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
    render: function() {
        // LOOP FOR USERS
        var users = [];
        for (var i = 0; i < this.state.users.length; i++) {
            users.push(<User name={this.state.users[i]} email={this.state.usersEmail[i]} />);
        }
        return (
            <header className="container-fluid">
                <div className="row">
                    <div className="col-xs-2 col-sm-2 klerede-logo"><a href="/dashboard"><img src="img/logo-klerede.svg" /></a></div>
                    <div className="col-xs-10 col-sm-10 user-info">
                        <div className="client-name">{this.state.clientName}</div>
                        <div className="user-wrapper" onClick={this.toggleSettings}>
                            <div className="user-image"></div>
                            <div className="utilities-wrapper">
                                <div className="greeting">Welcome</div>
                                <div className="user-name">
                                    {this.state.fullName}
                                    <Caret className="utilities-caret" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="utilities" onClick={this.toggleUtility}>
                    <h3>Settings <div className="glyphicon glyphicon-remove close" id="close-utilities" aria-hidden="true"></div></h3>
                    <div className="utility" data-utility="user-profile" data-type="modal">
                        User Profile
                        <Caret className="utilities-caret" />
                    </div>
                    <div className="utility" data-utility="manage-users" data-type="modal">
                        Manage Users
                        <Caret className="utilities-caret" />
                    </div>
                    <div className="utility last" data-utility="account-settings" data-type="modal">
                        Account Settings
                        <Caret className="utilities-caret" />
                    </div>
                    <h3>General</h3>
                    <div className="utility" data-utility="knowledge" data-type="tbd">
                        Knowledge Base
                        <ChangeArrow className="utility-arrow" />
                    </div>
                    <div className="utility" data-utility="help" data-type="page">
                        Help
                        <ChangeArrow className="utility-arrow" />
                    </div>
                    <div className="utility" data-utility="logout" data-type="tbd">Logout</div>
                </div>
                <div id="user-profile" className="utilities-set" onClick={this.activateField}>
                    <h3>User Profile <div className="glyphicon glyphicon-remove close" aria-hidden="true" onClick={this.closeUtility}></div></h3>
                    <form className="settings">
                        <div className="form-group">
                            <label htmlFor="up-name">Full Name:</label>
                            <input type="text" id="up-name" value={this.state.fullName} data-field="fullName" onChange={this.changeField} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="up-username">Username:</label>
                            <input type="text" id="up-username" value={this.state.userName} data-field="userName" onChange={this.changeField} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="up-email">Email:</label>
                            <input type="text" id="up-email" value={this.state.email} data-field="email" onChange={this.changeField} />
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
                            <input type="text" id="up-type" value={this.state.accountType} />
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Save" className="btn" onClick={this.saveChanges} />
                        </div>
                    </form>
                </div>
                <div id="manage-users" className="utilities-set" onClick={this.activateField}>
                    <h3>Manage Users <div className="glyphicon glyphicon-remove close" aria-hidden="true" onClick={this.closeUtility}></div></h3>
                    <div className="utility-group">
                        {users}
                    </div>
                    <form className="utility-group form-group">
                        <h4>Add a User</h4>
                        <input type="text" id="fName" className="form-control" placeholder="First Name" value={this.state.addUserFirstName} data-field="addUserFirstName" onChange={this.changeField} />
                        <input type="text" id="lName" className="form-control" placeholder="Last Name" value={this.state.addUserLastName} data-field="addUserLastName" onChange={this.changeField} />
                        <input type="text" id="email" className="form-control" placeholder="Email Address" value={this.state.addUserEmail} data-field="addUserEmail" onChange={this.changeField} />
                        <Roles id="addUserRole" />
                        <input type="submit" value="Save User" className="btn disabled" onClick={this.addUser} />
                    </form>
                    <div className="utility-group" onClick={this.toggleUtility}>
                        <div className="utility sub-item" data-utility="user-types" data-type="modal">
                            Learn about user types
                            <Caret className="utilities-caret" />
                        </div>
                    </div>
                </div>
                <div id="account-settings" className="utilities-set" onClick={this.activateField}>
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
                                <input type="text" id="card-firstname" value={this.state.cardFirstName} data-field="cardFirstName" onChange={this.changeField} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="card-lastname">Last Name</label>
                                <input type="text" id="card-lastname" value={this.state.cardLastName} data-field="cardLastName" onChange={this.changeField} />
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
                                <input type="text" id="card-number" value={this.state.cardNumber} data-field="cardNumber" onChange={this.changeField} />
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
                </div>
                <div id="user-types" className="utilities-set">
                    <h3>User Types <div className="glyphicon glyphicon-remove close" aria-hidden="true" onClick={this.closeUtility}></div></h3>
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
                <div id="change-plan" className="utilities-set">
                    <h3>Time for an upgrade! <div className="glyphicon glyphicon-remove close" aria-hidden="true" onClick={this.closeUtility}></div></h3>
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
            </header>
        );
    }
});

if(document.getElementById('header')){
    React.render(
        <Header />,
        document.getElementById('header')
    );
    console.log('Header loaded...');
}
