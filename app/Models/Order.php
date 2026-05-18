<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'customer_name', 'customer_phone', 'customer_address',
        'customer_city', 'total_price', 'delivery_fee', 'status', 'notes',
    ];

    protected $casts = [
        'total_price'  => 'float',
        'delivery_fee' => 'float',
        'status'       => 'string',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}