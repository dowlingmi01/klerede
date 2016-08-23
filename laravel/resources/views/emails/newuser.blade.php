Welcome {{ $user->name }}

Your user is: {{ $user->email }} 

	Click here to set your password: {{ url('login?action=set') }}&token={{$token}}&email={{urlencode($user->email)}}