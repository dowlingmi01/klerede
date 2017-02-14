<?php

use App\VenueVariable;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RevenueDateChanges extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		Schema::table('box_office_transaction_line', function (Blueprint $table) {
			$table->date('valid_date')->after('sequence')->default('1900-01-01');
			$table->index('valid_date');
		});
		Schema::table('import_siriusware_box_office_transaction_line', function (Blueprint $table) {
			$table->date('valid_date')->after('sequence')->default('1900-01-01');
		});
		VenueVariable::setValue(1518, 'REVENUE_DATE', 'valid_date');
		VenueVariable::setValue(1518, 'VISITS_SOURCE', 'sales');
		VenueVariable::setValue(1588, 'REVENUE_DATE', 'transaction');
		VenueVariable::setValue(1588, 'VISITS_SOURCE', 'visits');
		$sps = ['sp_compute_stats_box_office', 'sp_compute_stats_visits'];
		foreach($sps as $sp) {
			$sql = file_get_contents(database_path(sprintf('migrations/sp/%s.sql', $sp)));
			DB::unprepared($sql);
		}
		DB::table('box_office_product_kind_map')->where('venue_id', 1518)->delete();
		$bopkm_data = App\Helpers\Helper::readCSV(database_path('migrations/data/bopkm_1518.csv'));
		DB::table('box_office_product_kind_map')->insert($bopkm_data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
		Schema::table('box_office_transaction_line', function (Blueprint $table) {
			$table->dropColumn('valid_date');
		});
		Schema::table('import_siriusware_box_office_transaction_line', function (Blueprint $table) {
			$table->dropColumn('valid_date');
		});
    }
}
