<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;

class ProductController extends Controller
{
    public function home()
    {
        // Récupère les produits qui ont "front_page" activé (limité à 4 pour le design)
        $trendingProducts = Product::with(['images', 'category'])
            ->where('is_active', true)
            ->where('front_page', true)
            ->orderBy('sort_order', 'asc')
            ->take(4)
            ->get()
            ->map(fn($p) => $this->formatProduct($p));

        return Inertia::render('Home', [
            'trendingProducts' => $trendingProducts
        ]);
    }

    public function products(Request $request)
    {
        $categoryName = $request->query('category', 'tous');

        $query = Product::with(['category', 'images'])
            ->orderBy('sort_order', 'asc');

        if ($categoryName !== 'tous') {
            $query->whereHas('category', function ($q) use ($categoryName) {
                $q->whereRaw('LOWER(name) = ?', [strtolower($categoryName)]);
            });
        }

        $products = $query->get()->map(fn($p) => $this->formatProduct($p));

        return Inertia::render('Products', [
            'products'        => $products,
            'currentCategory' => $categoryName,
        ]);
    }

    public function about()
    {
        return Inertia::render('About');
    }

    public function show($id)
    {
        $product = Product::with(['category', 'images', 'sizes'])->findOrFail($id);

        $formattedProduct = [
            ...$this->formatProduct($product),
            'description' => $product->description,
            'images'      => $product->images->map(fn($img) => '/storage/' . $img->image_path)->toArray(),
            'sizes'       => $product->sizes->pluck('name')->toArray(),
        ];

        $recommendations = Product::with(['images', 'category'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $id)
            ->inRandomOrder()
            ->take(4)
            ->get()
            ->map(fn($rec) => $this->formatProduct($rec));

        return Inertia::render('ProductShow', [
            'product'         => $formattedProduct,
            'recommendations' => $recommendations,
        ]);
    }

    /** Shared formatting helper — always includes tag + pricing */
    private function formatProduct(Product $product): array
    {
        return [
            'id'             => $product->id,
            'name'           => $product->name,
            'price'          => $product->price,
            'original_price' => $product->original_price,  // null if no promo
            'tag'            => $product->tag,              // null | 'promo' | 'bestseller' | 'nouveaute'
            'discount_pct'   => $product->discountPercent(), // null or int like 25
            'category'       => $product->category ? $product->category->name : 'Sans catégorie',
            'image'          => $product->images->first()
                ? '/storage/' . $product->images->first()->image_path
                : '/assets/image/default.jpg',
        ];
    }
}
