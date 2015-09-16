<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <link rel="stylesheet" href="css/app.css">
        <link href="//fonts.googleapis.com/css?family=Raleway:300,400,500,600,700,800" rel="stylesheet" type="text/css">
    </head>
    <body>
        <header class="container-fluid">
            <div class="row">
                <div class="col-xs-2 col-sm-2 klerede-logo"><a href="/dashboard"><img src="img/logo-klerede.png" /></a></div>
                <div class="col-xs-10 col-sm-10 user-info">
                    <div class="client-name">The National Demo Museum</div>
                    <div class="user-wrapper">
                        <div class="user-image"></div>
                        <div class="utilities-wrapper">
                            <div class="user-name">Joe Bagadonuts</div>
                            <ul class="utilities">
                                <li><a href="/settings"><span class="glyphicon glyphicon-cog" aria-hidden="true"></span> Settings</a></li>
                                <li><a href="/help">Help</a></li>
                                <li><a href="/logout">Logout</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
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
                        <li><a href="#"><span class="membership">MEMBERSHIP</span>RELAY</a></li>
                        <li><a href="#"><span class="marketing">MARKETING</span>RELAY</a></li>
                        <li><a href="#"><span class="retail">RETAIL</span>RELAY</a></li>
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