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
		VenueVariable::setValue(1518, 'BOP_ACCT_CODE_EXP', 'CASE WHEN user_code != \'\' THEN user_code ELSE FORMAT(pr_ctr_1, \'000\') END');
		VenueVariable::setValue(1518, 'BOP_KIND_EXP', 'CASE WHEN t.department IS NULL THEN \'other\' WHEN x.validate2 > 0 THEN \'ticket\' ELSE \'pass\' END');
		VenueVariable::setValue(1518, 'BOP_IS_GA_EXP', 'CASE WHEN cast(a_no_loc_l as varchar) NOT LIKE \'%|1|%\' THEN 1 ELSE 0 END');
		VenueVariable::setValue(1518, 'BOP_COND', '(RTRIM(x.department) + \'|\' + RTRIM(x.category)) NOT IN (\'**TRANS**|**TRANS**\', \'MISCREV|DR-ADM\', \'MISCREV|PAC-CONV\')');
		VenueVariable::setValue(1518, 'BOTL_VALID_DATE_EXP', 'CAST(CASE WHEN x.validate2 > 0 THEN d.start_date ELSE d.date_time END AS date)');
	}

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
    }
}
