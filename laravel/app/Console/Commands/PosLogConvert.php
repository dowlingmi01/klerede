<?php namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class PosLogConvert extends Command {

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'kl:poslogconvert';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Read PosLog xml file and convert to csv.';

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
		$fileName = $this->argument('file_name');
		$element = simplexml_load_file($fileName);
		$atts = ['RetailStoreID', 'WorkstationID', 'TillID', 'SequenceNumber', 'BeginDateTime', 'EndDateTime', 'OperatorID', 'CurrencyCode'];
		$moreatts = ['TransactionStatus', 'ItemsSold', 'ItemsReturned', 'Total', 'TenderType', 'TenderID', 'CustomerName', 'CustomerActiveFlag', 'CustomerXStoreID', 'CustomerXStoreCustID', 'VenueMemberNumber'];
		$lines = [];
		foreach($element->Transaction as $transaction) {
			$dtvAt = $transaction->attributes('dtv', true);
			if( $dtvAt->TransactionType == 'RETAIL_SALE') {
				$line = [];
				foreach($atts as $at)
					$line[$at] = $transaction->{$at};
				$line['TransactionStatus'] = $transaction->RetailTransaction['TransactionStatus'];
				$line['Total'] = $transaction->RetailTransaction->Total;
				if($transaction->RetailTransaction->Customer) {
					$line['CustomerName'] = $transaction->RetailTransaction->Customer->Name;
					$line['CustomerActiveFlag'] = $transaction->RetailTransaction->Customer->ActiveFlag;
					$line['CustomerXStoreID'] = $transaction->RetailTransaction->Customer->AlternateKey[0]->AlternateID;
					$line['CustomerXStoreCustID'] = $transaction->RetailTransaction->Customer->AlternateKey[1]->AlternateID;
					$dtvCh = $transaction->children('dtv', true);
					foreach( $dtvCh->PosTransactionProperties as $prop ) {
						$dtvPropAt = $prop->children('dtv', true);
						if($dtvPropAt->PosTransactionPropertyCode == 'VenueMemberNumber')
							$line['VenueMemberNumber'] = $dtvPropAt->PosTransactionPropertyValue;
					}
				}
				$quantitySold = 0;
				$quantityReturned = 0;
				foreach($transaction->RetailTransaction->LineItem as $lineItem)
					if($lineItem->Tender) {
						$line['TenderType'] = $lineItem->Tender['TenderType'];
						$line['TenderID'] = $lineItem->Tender->TenderID;
					} else if($lineItem->Sale) {
						$quantitySold += $lineItem->Sale->Quantity;
					} else if($lineItem->Return) {
						$quantityReturned += $lineItem->Return->Quantity;
					}
				$line['ItemsSold'] = $quantitySold;
				$line['ItemsReturned'] = $quantityReturned;
				$lines[] = $line;
			}
		}
		fputcsv(STDOUT, array_merge($atts, $moreatts));
		foreach($lines as $line) {
			$linec = [];
			foreach(array_merge($atts, $moreatts) as $at) {
				if(array_key_exists($at, $line))
					$linec[] = $line[$at];
				else
					$linec[] = '';
			}
			fputcsv(STDOUT, $linec);
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
			['file_name', InputArgument::REQUIRED, 'Input file.'],
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
