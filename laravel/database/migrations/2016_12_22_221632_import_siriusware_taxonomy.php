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
		Schema::rename('stat_status', 'old_stat_status');
		Schema::create('stat_status', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('venue_id');
			$table->date('date');
			$table->enum('status', ['new_data', 'computed']);
			$table->dateTime('time_new_data')->nullable();
			$table->dateTime('time_computed')->nullable();
			$table->timestamps();
			$table->unique(['venue_id', 'date']);
		});
		Schema::table('membership', function(Blueprint $table)
		{
			$table->dropColumn('box_office_product_id');
			$table->integer('product_id')->default(0)->after('sequence');
		});
		Schema::rename('visit', 'old_visit');
		Schema::create('visit', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('source_id');
			$table->integer('venue_id');
			$table->integer('workstation_id');
			$table->integer('facility_id');
			$table->integer('product_id');
			$table->string('ticket_code');
			$table->integer('membership_id')->nullable();
			$table->enum('kind', ['ticket', 'pass', 'other']);
			$table->integer('quantity');
			$table->integer('use_no');
			$table->dateTime('time');
			$table->timestamps();
			$table->index(['membership_id']);
			$table->index(['time']);
		});
		$sql = file_get_contents(database_path('migrations/sp/sp_compute_stats_members.sql'));
		DB::unprepared($sql);
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
		/*
		Schema::create('import_siriusware_product', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('query_id');
			$table->enum('status', ['pending', 'imported']);
			$table->integer('venue_id');
			$table->string('code');
			$table->string('description');
			$table->string('account_code');
			$table->enum('kind', ['ticket', 'pass', 'other']);
			$table->boolean('is_ga');
			$table->timestamps();
		});
		Schema::create('import_siriusware_transaction', function(Blueprint $table)
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
			$table->index(['query_id', 'id'], 'is_bot_idx');
		});
		Schema::create('import_siriusware_transaction_line', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('query_id');
			$table->enum('status', ['pending', 'imported']);
			$table->integer('venue_id');
			$table->integer('source_id');
			$table->integer('sequence');
			$table->date('valid_date');
			$table->string('product_code');
			$table->double('sale_price');
			$table->integer('quantity');
			$table->timestamps();
			$table->index(['query_id', 'id'], 'is_botl_idx');
		});
		Schema::create('import_siriusware_transaction_member_info', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('query_id');
			$table->enum('status', ['pending', 'imported']);
			$table->integer('venue_id');
			$table->integer('source_id');
			$table->integer('sequence');
			$table->string('member_code');
			$table->string('membership_code');
			$table->integer('info_id');
			$table->timestamps();
			$table->index(['query_id', 'id'], 'is_bot_mi_idx');
		});
		*/
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if( Schema::hasTable('old_stat_status')) {
			Schema::rename('old_stat_status', 'stat_status');
		}
		if( Schema::hasTable('old_visit')) {
			Schema::rename('old_visit', 'visit');
		}
    }
}
