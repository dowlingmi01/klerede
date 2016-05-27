<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeImportQueryTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('import_query', function(Blueprint $table)
		{
			$table->dateTime('time_requested')->nullable()->after('time_created');
			$table->integer('num_records_imported')->nullable()->after('num_records');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('import_query', function(Blueprint $table)
		{
			$table->dropColumn('time_requested');
			$table->dropColumn('num_records_imported');
		});
	}

}
