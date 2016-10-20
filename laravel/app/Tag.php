<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    //

    protected $table = 'tag';

    protected $hidden = ['id', 'last_editor_id', 'created_at', 'updated_at'];

    public function notes()
    {
        return $this->belongsToMany('App\Note');
    }
}
