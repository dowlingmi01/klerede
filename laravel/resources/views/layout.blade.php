<html>
    <head>
        <link rel="stylesheet" href="css/app.css">
        <link href="//fonts.googleapis.com/css?family=Raleway:400,500,600,700" rel="stylesheet" type="text/css">
    </head>
    <body>
        <header class="container-fluid">
            <div class="row">
                <div class="col-xs-2 col-md-2 klerede-logo"><a href="/dashboard"><img src="img/logo-klerede.png" /></a></div>
                <div class="col-xs-10 col-md-10 user-info">
                    <img src="img/logo-livingplanet.png" class="logo-client" />
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
        </header>
        <section class="container-fluid">
            <div class="row">
                <div class="col-xs-2 col-md-2 menu">
                    <ul>
                        <li>Dashboard</li>
                        <li>Tool Box</li>
                        <li>Members</li>
                        <li>Campaigns</li>
                    </ul>
                </div>
                <div class="col-xs-10 col-md-10">
                    @yield('content')
                    <footer>&copy; 2015 <a href="//klerede.com/" target="_blank">Klerede</a>. All rights reserved.</footer>
                </div>
            </div>
        </section>
        <script src="js/libs.js"></script>
        <script src="js/app.js"></script>
    </body>
</html>