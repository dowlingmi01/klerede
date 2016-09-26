<!doctype html>
<html>
	<head>
		<meta name="viewport" content="width=device-width" />
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<link href="https://fonts.googleapis.com/css?family=Raleway:300,400,500,600,700,800" rel="stylesheet" type="text/css">
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
				font-family: 'Raleway', Helvetica, sans-serif;
				-webkit-font-smoothing: antialiased;
				font-size: 14px;
				line-height: 1.4;
				margin: 0;
				padding: 0; 
				-ms-text-size-adjust: 100%;
				-webkit-text-size-adjust: 100%;
			}

			table {
				border-collapse: separate;
				mso-table-lspace: 0pt;
				mso-table-rspace: 0pt;
				width: 100%;
			}
			table td {
				font-family: "Raleway", "Helvetica Neue", Helvetica, sans-serif;
				font-size: 12px;
				vertical-align: middle;
				padding:0;
			}
			
			a {
				text-decoration: none;
				color:inherit;
			}
			strong {
				font-weight:600;
			}
			a strong {
				text-decoration: none;
				color:#1870b7;
				font-weight: 600;
			}
            
		</style>
		</head>
		<body>
<table style="padding:50px;" cellspacing="0" cellpadding="10" border="0">
	<tr>
		<td	style="border-bottom: 1px solid #333; padding-bottom:10px;">
			<a href="{{url('/login')}}"><img src="{{ url('img/logo-klerede-dark.jpg') }}" width="120" height="34" alt="Klerede" /></a>
		</td>
	</tr>
	<tr>
		<td style="padding-top:25px; padding-bottom:25px;">
			Dear {{$user->first_name}} {{$user->last_name}}
			<br />
			<br />
				Welcome to <strong>{{$venue->name}}'s Relay dashboard</strong>, powered by <strong>Klerede</strong>. Relay is super easy to use and provides you a daily view of all visitor and member transactions occurring at {{$venue->name}}.
			<br />
			<br />
				To get started, please follow this <a style="color:#1870b7; font-weight: 600;" href="{!! url('login?action=set&token='.$token.'&email='.urlencode($user->email) )!!}">link to set your password</a>.
			<br />
			<br />
				Have questions? Contact our friendly <a href="mailto:support@klerede.com"><strong>support team</strong></a> or check out our <a href="{!! url('faq') !!}">FAQs section</a> once you've logged in.
			<br />
			<br />

			Regards,
			<br />
			The Klerede Team
			<br />
			<a href="http://www.klerede.com">www.klerede.com</a>
		</td>
	</tr>
	<tr>
		<td style="border-bottom: 1px solid #333; border-top: 1px solid #333; padding-bottom:2px; padding-top:6px; font-size:14px;">
			<table>
				<tr>
				<td width="80">
					FOLLOW US 
					
				</td>
				<td width="40">
					<a href="https://www.facebook.com/klerede/"><img style="display:inline;" src="{{ url('img/fb-logo.jpg') }}" width="33" height="33" alt="Facebook" /></a>
				</td>
				<td width="40">
					<a href="https://www.instagram.com/kleredeparkcity/"><img style="display:inline;" src="{{ url('img/in-logo.jpg') }}" width="33" height="33" alt="Instagram" /></a>
				</td>
				<td width="40">
					<a href="https://twitter.com/klerede"><img style="display:inline;" src="{{ url('img/tw-logo.jpg') }}" width="33" height="33" alt="Twitter" /></a>
				</td>
				<td>
					&nbsp;
				</td>
			</tr>
			</table>
		</td>
	</tr>
	<tr>
		<td style="padding-bottom:10px; padding-top:10px; font-size:10px;">
			&copy;2016 Klerede &bull; All rights reserved
		</td>
	</tr>
</table>

		</body>
</html>