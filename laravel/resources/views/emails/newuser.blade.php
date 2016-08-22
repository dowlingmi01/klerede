Welcome {{ $user->name }}

Your user is: {{ $user->email }} 

	Click here to reset your password: {{ url('login?reset='.$token.'|'.$user->email) }}