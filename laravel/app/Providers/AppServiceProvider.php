<?php namespace App\Providers;

use Validator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider {

	/**
	 * Bootstrap any application services.
	 *
	 * @return void
	 */
	public function boot()
	{
		Validator::extend('before_equal', function($attribute, $value, $parameters, $validator) {
   			  return strtotime($validator->getData()[$parameters[0]]) >= strtotime($value);
		});
	 
		Validator::extend('date_time_conditional', function($attribute, $value, $parameters, $validator) {
			  $without_time = filter_var($validator->getData()[$parameters[0]], FILTER_VALIDATE_BOOLEAN);
   			  $format = "Y-m-d H:i:s"; //$whitout_time ? "Y-m-d  00:00:00" : "Y-m-d H:i:s"   ;
   			  $d = \DateTime::createFromFormat($format, $value);
    		  $valid_format =  $d && $d->format($format) == $value;
    		  $zero_time = substr($value, -8)  === '00:00:00';
   			  return $valid_format && !($without_time xor $zero_time);
		});
	}

	/**
	 * Register any application services.
	 *
	 * This service provider is a great spot to register your various container
	 * bindings with the application. As you can see, we are registering our
	 * "Registrar" implementation here. You can add your own bindings too!
	 *
	 * @return void
	 */
	public function register()
	{
	 	
		$this->app->bind(
			'Illuminate\Contracts\Auth\Registrar',
			'App\Services\Registrar'
		);
	}

}
