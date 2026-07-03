<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Product extends Model implements HasMedia
{
    use InteractsWithMedia;
    protected $fillable = [
        'category_id', 'name', 'slug', 'description',
        'price', 'original_price', 'tag', 'is_active', 'front_page' ,'sort_order',
    ];

    protected $casts = [
        'price'          => 'float',
        'original_price' => 'float',
        'is_active'      => 'boolean',
        'front_page'      => 'boolean',
    ];

     /**
     * Define media conversions — WebP variants at different sizes
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(400)
            ->height(533) // 3:4 ratio
            ->format('webp')
            ->quality(80)
            ->nonQueued(); // remove this if you set up queues

        $this->addMediaConversion('full')
            ->width(800)
            ->height(1067) // 3:4 ratio
            ->format('webp')
            ->quality(85)
            ->nonQueued();
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function sizes()
    {
        return $this->belongsToMany(Size::class);
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