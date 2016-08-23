<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link href="//fonts.googleapis.com/css?family=Raleway:300,400,500,600,700,800" rel="stylesheet" type="text/css">
    <title>Klerede Password Recovery</title>
    <style>
      /* -------------------------------------
          GLOBAL RESETS
      ------------------------------------- */
      img {
        border: none;
        -ms-interpolation-mode: bicubic;
        max-width: 100%; 
		display:block;
		}

      body {
        background-color: white;
		font-family:'Raleway', 'Helvetica Neue', Helvetica, sans-serif;
        -webkit-font-smoothing: antialiased;
        font-size: 14px;
        line-height: 1.4;
        margin: 0;
        padding: 0; 
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%; }

      table {
        border-collapse: separate;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        width: 100%; }
        table td {
          font-family: 'Raleway', 'Helvetica Neue', Helvetica, sans-serif;
          font-size: 12px;
          vertical-align: middle; }

		  table td {
			  padding:0;
		  }
		  .container {
			  padding: 50px;
		  }
		  .td-logo {
			  border-bottom: 1px solid #333;
			  padding-bottom:10px;
		  }
		  .td-message {
			  padding-top:25px;
			  padding-bottom:25px;
		  }
		  a {
			  text-decoration: none;
			  color:#1870b7;
			  font-weight: 600;
		  }
		  a.web {
			  color:inherit;
			  font-weight:400;
		  }
		  .td-networks {
			  border-bottom: 1px solid #333;
			  border-top: 1px solid #333;
			  padding-bottom:2px;
			  padding-top:6px;
			  font-size:14px;
		  }
		  .td-networks img {
			  display:inline;
		  }
		  .td-footer {
			  padding-bottom:10px;
			  padding-top:10px;
			  font-size:10px;
		  }
    </style>
    </head>
    <body>
<table class='container' cellspacing="0" cellpadding="10" border="0">
	<tr >
		<td  class='td-logo'>
			<a href="{{url('/login')}}"><img src="{{ url('img/logo-klerede-dark.jpg') }}" width="120" height="34" alt="Klerede" /></a>
		</td>
	</tr>
	<tr>
		<td class="td-message">
			Dear {{$user->first_name}} {{$user->last_name}}
			<br />
			<br />
			A request to reset your password has been submitted to Klerede. Please click on the link below to go to the change password page. After logging in, you may change your password at any time from the Settings Panel in the upper right corner of the page.

			<br />
			<br />
			<a href="{!! url('login?action=reset&token='.$token.'&email='.urlencode($user->email) )!!}}">Reset My Password Now</a>
			<br />
			<br />

			If you did not submit this request, you may safely ignore this message. Your information has not been sent to anyone as a result of this request, nor has your password been updated/changed.
			<br />
			<br />

			Have questions? Contact our friendly <a href="mailto:support@klerede.com">support team</a>.
			<br />
			<br />

			Regards,
			<br />
			The Klerede Team
			<br />
			<a class="web" href="www.klerede.com">www.klerede.com</a>
		</td>
	</tr>
	<tr>
		<td class="td-networks">
			<table>
				<tr>
				<td width="80">
					FOLLOW US 
					
				</td>
				<td width="40">
					<a href="https://www.facebook.com/klerede/"><img src="{{ url('img/fb-logo.jpg') }}" width="33" height="33" alt="Facebook" /></a>
				</td>
				<td width="40">
					<a href="https://www.instagram.com/kleredeparkcity/"><img src="{{ url('img/in-logo.jpg') }}" width="33" height="33" alt="Instagram" /></a>
				</td>
				<td width="40">
					<a href="https://twitter.com/klerede"><img src="{{ url('img/tw-logo.jpg') }}" width="33" height="33" alt="Twitter" /></a>
				</td>
				<td>
					&nbsp;
				</td>
			</tr>
			</table>
		</td>
	</tr>
	<tr>
		<td class="td-footer">
			&copy;2016 Klerede &bull; All rights reserved
		</td>
	</tr>
</table>

    </body>
</html>