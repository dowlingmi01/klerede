<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterVisitTables extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('visit', function(Blueprint $table)
		{
			$table->dropColumn('operation_id');
			$table->integer('facility_id')->after('acp_id');
		});
		Schema::table('visit_galaxy', function(Blueprint $table)
		{
			$table->dropColumn('operation_id');
			$table->integer('facility_id')->after('acp_id');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('visit', function(Blueprint $table)
		{
			$table->dropColumn('facility_id');
			$table->integer('operation_id')->after('kind');
		});
		Schema::table('visit_galaxy', function(Blueprint $table)
		{
			$table->dropColumn('facility_id');
			$table->integer('operation_id')->after('kind');
		});
	}

}
