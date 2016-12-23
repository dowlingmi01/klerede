<?php

use App\VenueVariable;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ImportSiriuswareTaxonomy extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		Schema::table('stat_status', function(Blueprint $table)
		{
			$table->dropColumn('channel_id');
		});
		Schema::table('import_query_class', function(Blueprint $table)
		{
			$table->integer('system_id')->default(0);
		});
		DB::table('import_query_class')->whereBetween('id', [100, 1000])->update(['system_id'=>3]);
		DB::table('import_query_class')->whereBetween('id', [1100, 2200])->update(['system_id'=>2]);
		VenueVariable::setValue(1204, 'BOP_ACCT_CODE_EXP', 'RTRIM(x.department) + \'|\' + RTRIM(x.category) + \'|\' + RTRIM(x.item)');
		VenueVariable::setValue(1204, 'BOP_COND', 'x.department NOT LIKE (\'*%\') AND x.department NOT IN (\'SLOUGH\', \'MS:OFF\', \'MS:ON\')');
		Schema::table('import_siriusware_box_office_product', function(Blueprint $table)
		{
			$table->dropColumn('kind');
			$table->dropColumn('is_ga');
		});
		DB::unprepared('ALTER TABLE import_siriusware_box_office_product CHANGE account_code mapping_code varchar(255) NOT NULL');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
