<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFiscalYearStartMonthToVenueTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('venue', function(Blueprint $table)
        {
            $table->integer('fiscal_year_start_month')->nullable()->after('long');

        });
        DB::table('venue')->update(['fiscal_year_start_month' => 1]);
        DB::table('venue')->where('id', 1204)->update(['fiscal_year_start_month' => 7]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('venue', function(Blueprint $table)
        {
            $table->dropColumn('fiscal_year_start_month');
        });
    }
}
