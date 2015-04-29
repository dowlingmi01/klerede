<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class StoreProductCategorySeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		$category_groups = [
			['code'=>'AC', 'description'=>'Accessories', 'codes'=>['ACA', 'ACY']],
			['code'=>'AP', 'description'=>'Clothes', 'codes'=>['APA', 'APT', 'APY']],
			['code'=>'BK', 'description'=>'Books', 'codes'=>['BKA', 'BKY']],
			['code'=>'CDY', 'description'=>'Candies', 'codes'=>['CDY']],
			['code'=>'CON', 'description'=>'Convenience', 'codes'=>['CON']],
			['code'=>'GEO', 'description'=>'Geology', 'codes'=>['GEO']],
			['code'=>'HOM', 'description'=>'Home', 'codes'=>['HOM']],
			['code'=>'JY', 'description'=>'Jewelry', 'codes'=>['JYA', 'JYY']],
			['code'=>'PLU', 'description'=>'Plush', 'codes'=>['PLU']],
			['code'=>'STA', 'description'=>'Other', 'codes'=>['STA', 'PST']],
			['code'=>'SOV', 'description'=>'Souvenirs', 'codes'=>['SOV']],
			['code'=>'TOY', 'description'=>'Toys', 'codes'=>['TOY']],
		];
		foreach($category_groups as $category_group) {
			$category_group_m = new \App\StoreProductCategoryGroup(array_intersect_key($category_group, array_flip(['code', 'description'])));
			$category_group_m->save();
			$codes = [];
			foreach($category_group['codes'] as $code)
				$codes[] = new \App\StoreProductCategory(['code'=>$code]);
			$category_group_m->categories()->saveMany($codes);
		}
	}
}
