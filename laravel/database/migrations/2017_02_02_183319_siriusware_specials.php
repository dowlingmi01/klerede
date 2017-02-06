<?php

use App\VenueVariable;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SiriuswareSpecials extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		Schema::create('import_siriusware_transaction_line_special', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('query_id');
			$table->enum('status', ['pending', 'imported']);
			$table->integer('venue_id');
			$table->integer('source_id');
			$table->integer('sequence');
			$table->date('valid_date');
			$table->string('product_code');
			$table->timestamps();
			$table->index(['query_id', 'id'], 'is_botl_idx');
		});
		Schema::table('venue_variable', function (Blueprint $table) {
			$table->string('value', 512)->change();
		});
		DB::table('import_query_class')->insert([
			['id'=>2300, 'name'=>'siriusware_transaction_line_special', 'system_id'=>2],
		]);
		VenueVariable::setValue(1204, 'LAST_TRAN_DETAIL_SPECIAL_ID', '0');
		VenueVariable::setValue(1204, 'SPECIAL_EXP', 'CASE WHEN department = \'EX:GA\' AND (special like \'G:%\' or special like \'GS:%\' or special like \'GF:%\' or special like \'PP:%\') THEN \'3070\' WHEN department = \'EX:GA\' AND category NOT IN (\'EX:SGCOMBO\', \'EX:SGONLY\') AND special like \'SS:%\' THEN \'2957\' ELSE NULL END');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
		Schema::dropIfExists('import_siriusware_transaction_line_special');
		DB::table('import_query_class')->where('id', 2300)->delete();
    }
}
