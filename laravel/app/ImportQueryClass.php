<?php
namespace App;
use App\ImportQueryHandlers\ImportQueryHandler;
use Illuminate\Database\Eloquent\Model;

class ImportQueryClass extends Model {
	protected $table = 'import_query_class';
	/** @return ImportQueryHandler */
	public function getHandler(ImportQuery $query) {
		$className =  'App\\ImportQueryHandlers\\' . studly_case($this->name);
		return new $className($query);
	}
}
