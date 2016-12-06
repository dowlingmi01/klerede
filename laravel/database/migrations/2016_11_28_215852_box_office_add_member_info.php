<?php

use App\VenueVariable;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class BoxOfficeAddMemberInfo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		Schema::create('import_siriusware_box_office_transaction_member_info', function(Blueprint $table)
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
		Schema::table('box_office_transaction_line', function(Blueprint $table)
		{
			$table->integer('member_id')->nullable()->after('quantity');
			$table->integer('membership_id')->nullable()->after('member_id');
		});
		VenueVariable::setValue(1204, 'BOX_OFFICE_LAST_TRAN_MEMBER_INFO_ID', 0);
		VenueVariable::setValue(1518, 'BOX_OFFICE_LAST_TRAN_MEMBER_INFO_ID', 0);
		DB::table('import_query_class')->insert([
			['id'=>2200, 'name'=>'siriusware_box_office_transaction_member_info'],
		]);
		$sps = ['sp_compute_stats_visits', 'sp_compute_stats_box_office'];
		foreach($sps as $sp) {
			$sql = file_get_contents(database_path(sprintf('migrations/sp/%s.sql', $sp)));
			DB::unprepared($sql);
		}
	}

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
		Schema::dropIfExists('import_siriusware_box_office_transaction_member_info');
		DB::table('import_query_class')->where('id', 2200)->delete();
    }
}
