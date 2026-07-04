<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductComment extends Model
{

    protected $fillable = ['products_id', 'user_id','comment'];


    public function user(){

        return $this->belongsTo(User::class);
    }
}
