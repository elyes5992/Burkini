<?php
// app/Models/VisitorEvent.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisitorEvent extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'visitor_id', 'user_id', 'session_id', 'event_type',
        'product_id', 'product_type', 'order_id',
        'url', 'referrer', 'utm_source', 'utm_medium', 'utm_campaign',
        'ip_address', 'city', 'user_agent', 'platform', 'meta', 'created_at',
    ];

    protected $casts = [
        'meta'       => 'array',
        'created_at' => 'datetime',
    ];

    public const TYPE_PAGE_VIEW      = 'page_view';
    public const TYPE_PRODUCT_VIEW   = 'product_view';
    public const TYPE_ADD_TO_CART    = 'add_to_cart';
    public const TYPE_CHECKOUT_START = 'checkout_start';
    public const TYPE_PURCHASE       = 'purchase';

    public const FUNNEL_STAGES = [
        self::TYPE_PAGE_VIEW      => 'Trafic',
        self::TYPE_PRODUCT_VIEW   => 'Intérêt',
        self::TYPE_ADD_TO_CART    => 'Désir',
        self::TYPE_CHECKOUT_START => 'Action',
        self::TYPE_PURCHASE       => 'Fidélité',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}