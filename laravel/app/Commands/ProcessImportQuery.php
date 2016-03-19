<?php namespace App\Commands;

use App\Commands\Command;

use App\ImportQuery;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Bus\SelfHandling;
use Illuminate\Contracts\Queue\ShouldBeQueued;

class ProcessImportQuery extends Command implements SelfHandling, ShouldBeQueued {

	use InteractsWithQueue, SerializesModels;
	protected $query;

	/**
	 * Create a new command instance.
	 *
	 * @return void
	 */
	public function __construct(ImportQuery $query)
	{
		$this->query = $query;
	}

	/**
	 * Execute the command.
	 *
	 * @return void
	 */
	public function handle()
	{
		$this->query->process();
	}

}
