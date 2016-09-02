<?php namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel {

	/**
	 * The Artisan commands provided by your application.
	 *
	 * @var array
	 */
	protected $commands = [
		'App\Console\Commands\Inspire',
		'App\Console\Commands\PosLogConvert',
		'App\Console\Commands\PosLogDaily',
		'App\Console\Commands\PosLogImport',
		'App\Console\Commands\PosLogImportDir',
		'App\Console\Commands\WeatherImport',
		'App\Console\Commands\StatsCompute',
		'App\Console\Commands\ImportQueryInit',
		'App\Console\Commands\ImportQueryProcess',
	];

	/**
	 * Define the application's command schedule.
	 *
	 * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
	 * @return void
	 */
	protected function schedule(Schedule $schedule)
	{
		$schedule->command('kl:poslog_daily')->dailyAt('12:30')->environments('production');
		$schedule->command('kl:weatherimport')->dailyAt('13:30')->environments('production');
		$schedule->command('kl:stats_compute')->dailyAt('06:30')->environments('test');
	}
}
