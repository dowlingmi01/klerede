<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <link rel="stylesheet" href="css/app.css">
        <link href="//fonts.googleapis.com/css?family=Raleway:300,400,500,600,700,800" rel="stylesheet" type="text/css">
    </head>
    <body>
        <header class="container-fluid">
            <div class="row">
                <div class="col-xs-2 col-sm-2 klerede-logo"><a href="/dashboard"><img src="img/logo-klerede.svg" /></a></div>
                <div class="col-xs-10 col-sm-10 user-info">
                    <div class="client-name">Your Institution Here</div>
                    <div class="user-wrapper">
                        <div class="user-image"></div>
                        <div class="utilities-wrapper">
                            <div class="greeting">Welcome</div>
                            <div class="user-name">
                                Michael Dowling
                                <svg width="25.048px" height="15.298px" viewBox="0 0 25.048 15.298" preserveAspectRatio="xMidYMid meet" class="utilities-caret">
                                    <path d="M21.854 0.439l-7.366 7.365L12.523 9.77L10.56 7.804L3.196 0.441C2.425-0.185 1.293-0.147 0.6 0.6 c-0.768 0.768-0.768 2 0 2.778l9.983 9.983l1.964 1.966l1.965-1.966l9.984-9.983c0.383-0.383 0.575-0.886 0.575-1.389 c0-0.502-0.192-1.006-0.575-1.389C23.755-0.146 22.626-0.185 21.9 0.4"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <div id="utilities">
            <h3>Settings <div class="glyphicon glyphicon-remove close" id="close-utilities" aria-hidden="true"></div></h3>
            <div class="utility" data-utility="profile" data-type="tbd">
                User Profile
                <svg width="25.048px" height="15.298px" viewBox="0 0 25.048 15.298" preserveAspectRatio="xMidYMid meet" class="utilities-caret">
                    <path d="M21.854 0.439l-7.366 7.365L12.523 9.77L10.56 7.804L3.196 0.441C2.425-0.185 1.293-0.147 0.6 0.6 c-0.768 0.768-0.768 2 0 2.778l9.983 9.983l1.964 1.966l1.965-1.966l9.984-9.983c0.383-0.383 0.575-0.886 0.575-1.389 c0-0.502-0.192-1.006-0.575-1.389C23.755-0.146 22.626-0.185 21.9 0.4"/>
                </svg>
            </div>
            <div class="utility" data-utility="manage-users" data-type="modal">
                Manage Users
                <svg width="25.048px" height="15.298px" viewBox="0 0 25.048 15.298" preserveAspectRatio="xMidYMid meet" class="utilities-caret">
                    <path d="M21.854 0.439l-7.366 7.365L12.523 9.77L10.56 7.804L3.196 0.441C2.425-0.185 1.293-0.147 0.6 0.6 c-0.768 0.768-0.768 2 0 2.778l9.983 9.983l1.964 1.966l1.965-1.966l9.984-9.983c0.383-0.383 0.575-0.886 0.575-1.389 c0-0.502-0.192-1.006-0.575-1.389C23.755-0.146 22.626-0.185 21.9 0.4"/>
                </svg>
            </div>
            <div class="utility last" data-utility="account" data-type="tbd">
                Account Settings
                <svg width="25.048px" height="15.298px" viewBox="0 0 25.048 15.298" preserveAspectRatio="xMidYMid meet" class="utilities-caret">
                    <path d="M21.854 0.439l-7.366 7.365L12.523 9.77L10.56 7.804L3.196 0.441C2.425-0.185 1.293-0.147 0.6 0.6 c-0.768 0.768-0.768 2 0 2.778l9.983 9.983l1.964 1.966l1.965-1.966l9.984-9.983c0.383-0.383 0.575-0.886 0.575-1.389 c0-0.502-0.192-1.006-0.575-1.389C23.755-0.146 22.626-0.185 21.9 0.4"/>
                </svg>
            </div>
            <h3>General</h3>
            <div class="utility" data-utility="knowledge" data-type="tbd">Knowledge Base</div>
            <div class="utility" data-utility="help" data-type="page">Help</div>
            <div class="utility" data-utility="logout" data-type="tbd">Logout</div>
        </div>
        <div id="manage-users">
            <h3>Manage Users <div class="glyphicon glyphicon-remove close" id="close-users" aria-hidden="true"></div></h3>
        </div>
        <section class="container-fluid">
            <div class="row main-row">
                <div class="col-xs-12 col-sm-2 menu">
                    <ul>
                        <li class="active"><a href="/dashboard"><span class="ops">OPS</span>RELAY</a>
                            <!--<ul>
                                <li><a href="/toolbox">Tool Box</a></li>
                                <li><a href="/members">Members</a></li>
                                <li><a href="/campaigns">Campaigns</a></li>
                            </ul>-->
                        </li>
                        <!--
                        <li><a href="#"><span class="membership">MEMBERSHIP</span>RELAY</a></li>
                        <li><a href="#"><span class="marketing">MARKETING</span>RELAY</a></li>
                        <li><a href="#"><span class="retail">RETAIL</span>RELAY</a></li>
                        -->
                    </ul>
                </div>
                <div class="col-xs-12 col-sm-10 main-content">
                    @yield('content')
                    <footer>&copy; 2015 <a href="//klerede.com/" target="_blank">Klerede</a>. All rights reserved.</footer>
                </div>
            </div>
        </section>
        <script src="js/libs.js"></script>
        <script src="js/app.js"></script>
    </body>
</html>