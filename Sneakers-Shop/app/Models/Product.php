<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'size',
        'images_product',
        'description',
        'price',
        'discount',
        'imageUrl',
        'quantity',
        'category_id'
    ];

    protected $casts = [
        'size' => 'array',
        'images_product'=>'array',
        'price' => 'decimal:2',
        'discount' => 'integer',
        'quantity' => 'integer'
    ];


    protected $attributes = [
        'size' => '["37","38","39","40","41","42","43","44"]',
        'discount' => 0,
        'quantity' => 0
    ];


    public function setSizeAttribute($value)
    {

        if (empty($value)) {
            $value = [37, 38, 39, 40, 41, 42, 43, 44];
        }
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            $value = $decoded ?: $value;
        }
        if (!is_array($value)) {
            $value = [$value];
        }

        $this->attributes['size'] = json_encode($value);
    }


    public function getSizeAttribute($value)
    {
        if (empty($value)) {
            return [37, 38, 39, 40, 41, 42, 43, 44];
        }

        $decoded = json_decode($value, true);
        return $decoded ?: (array)$value;
    }

    public function category()
    {
        return $this->belongsTo(CategoryProduct::class, 'category_id');
    }

    public function comments()
    {
        return $this->hasMany(ProductComment::class, 'product_id');
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class, 'product_id');
    }

    public function carts()
    {
        return $this->hasMany(Cart::class, 'product_id');
    }

    public function Order()
    {
        return $this->hasMany(Order::class);
    }
}