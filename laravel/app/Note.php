<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    //
    protected $table = 'note';

    public function tags()
    {
        return $this->belongsToMany('App\Tag');
    }

    public function channels()
    {
        return $this->belongsToMany('App\Channel');
    }
}
