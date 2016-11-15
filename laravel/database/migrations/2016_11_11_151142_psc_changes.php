<?php

use App\VenueVariable;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class PscChanges extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		Schema::create('import_siriusware_cafe_product', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('query_id');
			$table->enum('status', ['pending', 'imported']);
			$table->integer('venue_id');
			$table->string('code');
			$table->string('description');
			$table->timestamps();
		});
		Schema::create('import_siriusware_cafe_transaction', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('query_id');
			$table->enum('status', ['pending', 'imported']);
			$table->integer('venue_id');
			$table->integer('source_id');
			$table->integer('register_id');
			$table->integer('sequence');
			$table->dateTime('time');
			$table->string('operator_code');
			$table->timestamps();
			$table->index(['query_id', 'id'], 'is_ct_idx');
		});
		Schema::create('import_siriusware_cafe_transaction_line', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('query_id');
			$table->enum('status', ['pending', 'imported']);
			$table->integer('venue_id');
			$table->integer('source_id');
			$table->integer('sequence');
			$table->string('cafe_product_code');
			$table->double('sale_price');
			$table->integer('quantity');
			$table->timestamps();
			$table->index(['query_id', 'id'], 'is_ctl_idx');
		});
		DB::table('import_query_class')->insert([
			['id'=>1900, 'name'=>'siriusware_cafe_product'],
			['id'=>2000, 'name'=>'siriusware_cafe_transaction'],
			['id'=>2100, 'name'=>'siriusware_cafe_transaction_line'],
		]);

		VenueVariable::setValue(1518, 'BOP_ACCT_CODE_EXP', 'CASE WHEN user_code != \'\' THEN user_code ELSE FORMAT(pr_ctr_1, \'000\') END');
		VenueVariable::setValue(1518, 'BOP_KIND_EXP', 'CASE WHEN t.department IS NULL THEN \'other\' WHEN x.validate2 > 0 THEN \'ticket\' ELSE \'pass\' END');
		VenueVariable::setValue(1518, 'BOP_IS_GA_EXP', 'CASE WHEN cast(a_no_loc_l as varchar) NOT LIKE \'%|1|%\' THEN 1 ELSE 0 END');
		VenueVariable::setValue(1518, 'BOP_COND', '(RTRIM(x.department) + \'|\' + RTRIM(x.category)) NOT IN (\'**TRANS**|**TRANS**\', \'MISCREV|DR-ADM\', \'MISCREV|PAC-CONV\')');
		VenueVariable::setValue(1518, 'BOTL_VALID_DATE_EXP', 'CAST(CASE WHEN x.validate2 > 0 THEN d.start_date ELSE d.date_time END AS date)');
		VenueVariable::setValue(1204, 'BOP_ACCT_CODE_EXP', 'RTRIM(x.department) + \'|\' + RTRIM(x.category)');
		VenueVariable::setValue(1204, 'BOP_KIND_EXP', 'CASE WHEN t.department IS NULL THEN \'other\' WHEN x.item_type = 3 THEN \'pass\' ELSE \'ticket\' END');
		VenueVariable::setValue(1204, 'BOP_IS_GA_EXP', 'CASE WHEN x.admissions > 0 AND x.admprconly = 0 THEN 1 ELSE 0 END');
		VenueVariable::setValue(1204, 'BOP_COND', 'x.department NOT LIKE (\'*%\') AND x.department NOT IN (\'SLOUGH\', \'FB:CAFE\', \'MS:OFF\', \'MS:ON\')');
		VenueVariable::setValue(1204, 'BOTL_VALID_DATE_EXP', 'CAST(CASE WHEN d.time_span > 1 AND d.span_type = 1 THEN d.date_time ELSE d.start_date END AS date)');
		VenueVariable::setValue(1204, 'CAFE_COND', 'x.department IN (\'FB:CAFE\')');
		VenueVariable::setValue(1204, 'BOX_OFFICE_LAST_TRAN_ID', 0);
		VenueVariable::setValue(1204, 'BOX_OFFICE_LAST_TRAN_DETAIL_ID', 0);
		VenueVariable::setValue(1204, 'MEMBER_LAST_UPDATE', 0);
		VenueVariable::setValue(1204, 'MEMBERSHIP_LAST_UPDATE', 0);
		VenueVariable::setValue(1204, 'LAST_PASS_USAGE_ID', 0);
		VenueVariable::setValue(1204, 'LAST_TICKET_USAGE_ID', 0);
		VenueVariable::setValue(1204, 'REVENUE_DATE', 'valid_date');
		VenueVariable::setValue(1204, 'VISITS_SOURCE', 'sales');
		VenueVariable::setValue(1204, 'CAFE_LAST_TRAN_ID', 0);
		VenueVariable::setValue(1204, 'CAFE_LAST_TRAN_DETAIL_ID', 0);

		$bopkm_data = App\Helpers\Helper::readCSV(database_path('migrations/data/bopkm_psc.csv'));
		DB::table('box_office_product_kind_map')->insert($bopkm_data);
		DB::table('facility')->insert([
			['venue_id'=>1204, 'code'=>'0/GATE10', 'is_ga'=> true ],
		]);
		DB::table('operator')->insert([
			['venue_id'=>1204, 'code'=>'WEBOP', 'is_online'=> true ],
		]);
	}

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
		DB::table('box_office_product_kind_map')->where('venue_id', 1204)->delete();
		DB::table('facility')->where('venue_id', 1204)->delete();
		DB::table('operator')->where('venue_id', 1204)->delete();
		Schema::dropIfExists('import_siriusware_cafe_product');
		Schema::dropIfExists('import_siriusware_cafe_transaction');
		Schema::dropIfExists('import_siriusware_cafe_transaction_line');
		DB::table('import_query_class')->whereBetween('id', [1900, 2100])->delete();
    }
}
