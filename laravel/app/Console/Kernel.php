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
		'App\Console\Commands\StatsMembersCompute',
		'App\Console\Commands\ImportQueryInit',
		'App\Console\Commands\ImportQueryProcess',
		'App\Console\Commands\ImportFromProd',
		'App\Console\Commands\UserCreate',
	];

	/**
	 * Define the application's command schedule.
	 *
	 * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
	 * @return void
	 */
	protected function schedule(Schedule $schedule)
	{
		$schedule->command('kl:poslog_daily')->dailyAt('5:30')->timezone('America/Los_Angeles')->environments('production');
		$schedule->command('kl:weatherimport')->dailyAt('12:00')->environments('production');
		$schedule->command('kl:stats_compute')->dailyAt('06:30')->environments('test');
		$schedule->command('kl:stats_members_compute')->dailyAt('06:31')->environments('test');
	}
}
