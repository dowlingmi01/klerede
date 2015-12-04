<?php namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Batch extends Model {
	protected $table = 'batch';
	public function messages() {
		return $this->hasMany('App\BatchMessage');
	}
	public function finish() {
		$this->status = 'finished';
		$this->time_finish = Carbon::now();
		$this->save();
	}
	public function errorExc(\Exception $e) {
		$this->error(sprintf("[%s] %s", get_class($e),  $e->getMessage()));
	}
	public function error($message) {
		$this->status = 'error';
		$this->time_finish = Carbon::now();
		$this->save();
		$this->message($message, 'error');
	}
	public function info($message) {
		$this->message($message, 'info');
	}
	public function warningExc(\Exception $e) {
		$this->warning(sprintf("[%s] %s", get_class($e),  $e->getMessage()));
	}
	public function warning($message) {
		$this->message($message, 'warning');
	}
	public function message($message, $type) {
		$batch_message = new BatchMessage();
		$batch_message->type = $type;
		$batch_message->message = $message;
		$this->messages()->save($batch_message);
	}
	static public function start($command, $arguments) {
		$batch = new Batch();
		$batch->status = 'started';
		$batch->time_start = Carbon::now();
		$batch->command = $command;
		$batch->arguments = json_encode($arguments);
		$batch->save();
		return $batch;
	}
}
