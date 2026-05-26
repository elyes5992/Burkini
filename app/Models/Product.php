<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'category_id', 'name', 'slug', 'description',
        'price', 'original_price', 'tag', 'is_active', 'front_page'
    ];

    protected $casts = [
        'price'          => 'float',
        'original_price' => 'float',
        'is_active'      => 'boolean',
        'front_page'      => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function sizes()
    {
        return $this->belongsToMany(Size::class)->withPivot('stock_quantity');
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order', 'asc');
    }

    /** True only when a promo tag is set AND original_price is filled */
    public function hasPromo(): bool
    {
        return $this->tag === 'promo' && $this->original_price !== null;
    }

    /** Discount percentage, e.g. 25 (for 25%) */
    public function discountPercent(): ?int
    {
        if (! $this->hasPromo() || $this->original_price <= 0) {
            return null;
        }
        return (int) round((1 - $this->price / $this->original_price) * 100);
    }
}