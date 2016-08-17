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
			var reset = "<?php echo isSet($_GET['reset']) ? $_GET['reset'] : "";?>";
			var resetToken = "",
				resetEmail = "",
				vars = reset.split("|");
			if (vars.length) {
				resetToken = vars[0];
				resetEmail = vars[1];
			}
		</script>
        <script src="js/app.js"></script>
    </body>
</html>