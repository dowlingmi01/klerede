<html>
    <head>
        <link rel="stylesheet" href="css/bootstrap.css">
        <link rel="stylesheet" href="css/dashboard/app.css">
        <link href='//fonts.googleapis.com/css?family=Lato:100' rel='stylesheet' type='text/css'>
    </head>
    <body>
        <header class="container-fluid">
            <div class="row">
                <div class="col-xs-2 col-md-2"><img src="img/logo-klerede.png" class="logo-main" /></div>
                <div class="col-xs-10 col-md-10"><img src="img/logo-livingplanet.png" class="logo-client" /></div>
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
                <div class="col-xs-10 col-md-10">@yield('content')</div>
            </div>
        </section>
        <footer>&copy; 2015 Klerede. All rights reserved.</footer>
        <script src="js/libs.js"></script>
        <script src="js/app.js"></script>
    </body>
</html>