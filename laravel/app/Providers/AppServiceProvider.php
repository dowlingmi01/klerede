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
    		if(!array_key_exists( $parameters[0], $validator->getData()) || $validator->getData()[$parameters[0]] == null) return false;
   		  	return strtotime($validator->getData()[$parameters[0]]) >= strtotime($value);
		});

		Validator::extend('long_date_format', function($attribute, $value, $parameters, $validator) {
	 		  $format = "Y-m-d H:i:s";
			  $d = \DateTime::createFromFormat($format, $value);
   			  return $d && $d->format($format) == $value;
		});
	 
	 	Validator::extend('conditional_time', function($attribute, $value, $parameters, $validator) {
	  		  $without_time = filter_var($value, FILTER_VALIDATE_BOOLEAN);
	 		  if(!array_key_exists( $parameters[0], $validator->getData()) || $validator->getData()[$parameters[0]] == null) return false;
			  if(!array_key_exists( $parameters[1], $validator->getData()) || $validator->getData()[$parameters[1]] == null) return false;
 				 
    		  $zero_time_1 = substr($validator->getData()[$parameters[0]], -8)  === '00:00:00';
    		  $zero_time_2 = substr($validator->getData()[$parameters[1]], -8)  === '00:00:00';
   			 
   			  return (!$without_time && !($zero_time_1 && $zero_time_2))  || ($without_time && $zero_time_1 && $zero_time_2);
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
		if ($this->app->environment() !== 'production') {
			$this->app->register(\Barryvdh\LaravelIdeHelper\IdeHelperServiceProvider::class);
		}
	 	
		$this->app->bind(
			'Illuminate\Contracts\Auth\Registrar',
			'App\Services\Registrar'
		);
	}

}
