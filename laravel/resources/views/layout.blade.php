<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <link rel="stylesheet" href="css/app.css">
        <link href="//fonts.googleapis.com/css?family=Raleway:300,400,500,600,700,800" rel="stylesheet" type="text/css">
    </head>
    <body>
        <div id="header"><!-- ReactJS component: Header --></div>
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
                    <footer>&copy; <span id="copyright-year">2015</span> <a href="//klerede.com/" target="_blank">Klerede</a>. All rights reserved.</footer>
                </div>
            </div>
        </section>
        <script src="js/libs.js"></script>
        <script src="js/app.js"></script>
		@yield('scripts')
    </body>
</html>