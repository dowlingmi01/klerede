<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

class ImportFromProd extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'kl:importfromprod';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import store sales stats and daily weather from production DB';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
		DB::statement('call sp_importfromprod');
		$dates = DB::table('weather_daily as d')->leftJoin('weather_hourly as h', 'h.weather_daily_id', '=', 'd.id')
			->whereNull('h.id')->where('d.date', '>', '2015-01-01')->distinct()->pluck('date');
		foreach($dates as $date) {
			Artisan::call('kl:weatherimport', ['date' => $date, '--reprocess' => true]);
		}
	}
}
