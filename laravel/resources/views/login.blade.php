<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <link rel="stylesheet" href="css/app.css">
        <link href="//fonts.googleapis.com/css?family=Raleway:300,400,500,600,700,800" rel="stylesheet" type="text/css">
    </head>
    <body>

	    <div id="login-component"><!-- ReactJS component: LoginComponent --></div>
        <script src="js/libs.js"></script>
		<script type="text/javascript">
			var action = "<?php echo isSet($_GET['action']) ? $_GET['action'] : "";?>";
			var token = "<?php echo isSet($_GET['token']) ? $_GET['token'] : "";?>";
			var email = "<?php echo isSet($_GET['email']) ? $_GET['email'] : "";?>";
		</script>

        <script>var global_ga_id ='{{$ga_id}}'</script>
        <script src="js/app.js"></script>
        <script>ga('send', 'pageview');</script>

    </body>
</html>