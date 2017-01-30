<?php namespace App\Console\Commands;

use App\ImportQuery;
use App\ImportQueryClass;
use App\VenueVariable;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class ImportQueryInit extends Command {

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'kl:importinit';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Init import queries.';

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
	public function fire()
	{
		$venues = [
//			1588 => [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
//			1518 => [1100, 1200, 1300, 1400, 1500, 1600, 1700],
//			1518 => [1800],
//			1204 => [1100, 1200, 1300, 1400, 1500, 1600, 1700, 1900, 2000, 2100],
//			1518 => [2200],
//			1204 => [2200],
			1518 => [1100, 1200, 1300, 1400, 1500, 1600, 1700, 2200],
			1204 => [1100, 1200, 1300, 1400, 1500, 1600, 1700, 2200],
		];

		VenueVariable::setValue(1204, 'BOX_OFFICE_LAST_TRAN_ID', '0');
		VenueVariable::setValue(1204, 'BOX_OFFICE_LAST_TRAN_DETAIL_ID', '0');
		VenueVariable::setValue(1204, 'BOX_OFFICE_LAST_TRAN_MEMBER_INFO_ID', '0');
		VenueVariable::setValue(1204, 'LAST_PASS_USAGE_ID', '0');
		VenueVariable::setValue(1204, 'LAST_TICKET_USAGE_ID', '0');
		VenueVariable::setValue(1204, 'MEMBERSHIP_LAST_UPDATE', '0');
		VenueVariable::setValue(1518, 'BOX_OFFICE_LAST_TRAN_ID', '0');
		VenueVariable::setValue(1518, 'BOX_OFFICE_LAST_TRAN_DETAIL_ID', '0');
		VenueVariable::setValue(1518, 'BOX_OFFICE_LAST_TRAN_MEMBER_INFO_ID', '0');
		VenueVariable::setValue(1518, 'LAST_PASS_USAGE_ID', '0');
		VenueVariable::setValue(1518, 'LAST_TICKET_USAGE_ID', '0');
		VenueVariable::setValue(1518, 'MEMBERSHIP_LAST_UPDATE', '0');

		ImportQuery::where('status', 'pending')->update(['status'=>'executed']);

		foreach($venues as $venue_id=>$iqcIds)
			foreach ($iqcIds as $iqcId) {
				/** @var ImportQueryClass $iqc */
				$iqc = ImportQueryClass::find($iqcId);
				$q = new ImportQuery();
				$q->venue_id = $venue_id;
				$q->import_query_class()->associate($iqc);
				$h = $iqc->getHandler($q);
				$h->insertNextQuery(0);
			}
	}

	/**
	 * Get the console command arguments.
	 *
	 * @return array
	 */
	protected function getArguments()
	{
		return [
		];
	}

	/**
	 * Get the console command options.
	 *
	 * @return array
	 */
	protected function getOptions()
	{
		return [
		];
	}

}
