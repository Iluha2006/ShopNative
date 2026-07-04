<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
        'selected_size',
        'total_amount',
        'status',

    ];

    protected $casts = [
        'quantity' => 'integer',
        'total_amount' => 'decimal:2',
        'paid_at' => 'datetime',
    ];
    public function markAsPaid(): void
    {
        $this->update([
            'status' => 'success',
        ]);
    }
    protected $attributes = [
        'status' => 'pending',
    ];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
    public function markAsCompleted(): void
    {
        $this->update(['status' => 'completed']);
    }

    public function markAsCancelled(): void
    {
        $this->update(['status' => 'cancelled']);
    }


    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

}