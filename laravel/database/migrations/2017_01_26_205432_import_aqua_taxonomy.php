<?php

use App\GoalSalesMonthly;
use App\ProductCategoryMap;
use App\VenueCategory;
use App\VenueVariable;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ImportAquaTaxonomy extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		VenueVariable::setValue(1518, 'BOP_COND', 'x.department NOT LIKE (\'*%\') AND (RTRIM(x.department) + \'|\' + RTRIM(x.category)) NOT IN (\'MISCREV|DR-ADM\', \'MISCREV|PAC-CONV\')');
		VenueVariable::setValue(1518, 'BOP_ACCT_CODE_EXP', 'RTRIM(x.department) + \'|\' + CASE WHEN x.department != \'ADM-ENTRY\' THEN RTRIM(x.category) + \'|\' + RTRIM(x.item) ELSE user_code + \'|\' END');
		VenueCategory::import(1518, 'venue_category_1518.csv');
		ProductCategoryMap::import(1518, 'pkm_1518.csv');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
		VenueCategory::where('venue_id', 1518)->delete();
		ProductCategoryMap::where('venue_id', 1518)->delete();
		GoalSalesMonthly::where('venue_id', 1518)->delete();
    }
}
