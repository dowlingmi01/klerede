/*******************************************************************/
/******** WELCOME TEXT WITH USER'S NAME AND LOCAL TIME/DATE ********/
/*******************************************************************/

var Header = React.createClass({
    getInitialState: function() {
        return {
            clientName: 'Your Institution Here',
            fullName: 'Michael Dowling',
            userName: 'mdowling',
            email: 'michael@klerede.com',
            accountType: 'Owner',
            plan: 'Professional',
            pwdCurrent: '',
            pwdNew: '',
            pwdMatch: ''
        };
    },
    toggleSettings: function() {
        // Hide or show the settings modal
        $('.user-name').toggleClass('active');
        $('#utilities').toggleClass('active');
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
    },
    saveChanges: function(event){
        event.preventDefault();
        // TO DO: Send changed data to the API
        console.log('SAVE!!!', this.state);
    },
    render: function() {
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
                    <h3>User Profile <div className="glyphicon glyphicon-remove close" id="close-profile" aria-hidden="true" onClick={this.closeUtility}></div></h3>
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
                    <h3>Manage Users <div className="glyphicon glyphicon-remove close" id="close-users" aria-hidden="true" onClick={this.closeUtility}></div></h3>
                    <form className="settings">
                        <div className="form-group">
                            <label htmlFor="mu-add">Add a User:</label>
                            <input type="text" id="mu-add" />
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Save User" className="btn" />
                        </div>
                    </form>
                </div>
                <div id="account-settings" className="utilities-set" onClick={this.activateField}>
                    <h3>Account Settings <div className="glyphicon glyphicon-remove close" id="close-accountsettings" aria-hidden="true" onClick={this.closeUtility}></div></h3>
                    <form className="settings">
                        <div className="form-group">
                            <label htmlFor="as-plan">Your Plan:</label>
                            <input type="text" id="as-plan" value={this.state.plan} />
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Upgrade Plan" className="btn" />
                        </div>
                    </form>
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
