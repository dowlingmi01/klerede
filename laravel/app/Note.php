<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    //
    protected $table = 'note';

    protected $hidden = ['pivot'];

    protected $dates = ['time_start', 'time_end'];

    public function tags()
    {
        return $this->belongsToMany('App\Tag');
    }

    public function categories()
    {
        return $this->belongsToMany('App\Category');
    }


     
}
