<?php

use App\VenueVariable;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SiriuswareTempQuery extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		Schema::create('import_siriusware_box_office_transaction_line_temp', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('query_id');
			$table->enum('status', ['pending', 'imported']);
			$table->integer('venue_id');
			$table->integer('source_id');
			$table->integer('sequence');
			$table->date('valid_date');
			$table->timestamps();
			$table->index(['query_id', 'id'], 'is_botlt_idx');
		});
		DB::table('import_query_class')->insert([
			['id'=>1800, 'name'=>'siriusware_box_office_transaction_line_temp'],
		]);
		VenueVariable::setValue(1518, 'BOX_OFFICE_LAST_TRAN_TEMP_ID', '0');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
		Schema::dropIfExists('import_siriusware_box_office_transaction_line_temp');
		DB::table('import_query_class')->where('id', 1800)->delete();
    }
}
