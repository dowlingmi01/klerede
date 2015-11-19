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
	public function error($message) {
		$this->status = 'error';
		$this->time_finish = Carbon::now();
		$this->save();
		$batch_message = new BatchMessage();
		$batch_message->type = 'error';
		$batch_message->message = $message;
		$this->messages()->save($batch_message);
	}
	public function info($message) {
		$batch_message = new BatchMessage();
		$batch_message->type = 'info';
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
