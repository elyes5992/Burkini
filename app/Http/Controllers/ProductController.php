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
        $sizeFilter = $request->query('size'); // Nouveau paramètre

        $query = Product::with(['category', 'images'])
            ->orderBy('sort_order', 'asc')
            ->where('is_active', true);

        // Filtre par catégorie
        if ($categoryName !== 'tous') {
            $query->whereHas('category', function ($q) use ($categoryName) {
                $q->whereRaw('LOWER(name) = ?', [strtolower($categoryName)]);
            });
        }

        // NOUVEAU : Filtre par taille (avec vérification du stock)
        if ($sizeFilter) {
            $query->whereHas('sizes', function ($q) use ($sizeFilter) {
                $q->where('sizes.name', $sizeFilter)
                  ->where('product_size.stock_quantity', '>', 0);
            });
        }

        $products = $query->paginate(12)
            ->withQueryString() // Garde les paramètres category et size dans la pagination
            ->through(fn($p) => $this->formatProduct($p));

        // NOUVEAU : Récupérer toutes les tailles uniques pour le menu déroulant
        // On ne récupère que les tailles liées à des produits actifs
        $availableSizes = \App\Models\Size::whereHas('products', function($q) {
            $q->where('is_active', true);
        })->orderBy('name')->pluck('name');

        return Inertia::render('Products', [
            'products'        => $products,
            'currentCategory' => $categoryName,
            'currentSize'     => $sizeFilter,     // On passe la taille actuelle à React
            'availableSizes'  => $availableSizes, // On passe la liste des tailles
        ]);
    }

    public function about()
    {
        return Inertia::render('About');
    }

    public function show($id)
    {
        $product = Product::with(['category', 'images', 'sizes'])->findOrFail($id);

        // Build images array — prefer Spatie, fall back to legacy
        $spatieImages = $product->getMedia('images');

        if ($spatieImages->isNotEmpty()) {
            $images = $spatieImages->map(fn($m) => [
                'src'    => $m->getUrl('full'),
                'srcset' => $m->getUrl('thumb') . ' 400w, ' . $m->getUrl('full') . ' 800w',
            ])->toArray();
        } else {
            $images = $product->images
                ->map(fn($img) => [
                    'src'    => '/storage/' . $img->image_path,
                    'srcset' => null,
                ])->toArray();
        }

        $formattedProduct = [
            ...$this->formatProduct($product),
            'description' => $product->description,
            'images'      => $images,
            'sizes'       => $product->sizes->pluck('name')->toArray(),
        ];

        $recommendations = Product::with(['images', 'category'])
            ->where('category_id', $product->category_id)
            ->where('is_active', true)
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

    private function formatProduct(Product $product): array
    {
        // Try Spatie media first, fall back to legacy ProductImage
        $mediaItem = $product->getFirstMedia('images');

        if ($mediaItem) {
            $imageData = [
                'image'  => $mediaItem->getUrl('thumb'),   // WebP 400px — default src
                'srcset' => implode(', ', [
                    $mediaItem->getUrl('thumb')  . ' 400w',
                    $mediaItem->getUrl('full')   . ' 800w',
                ]),
            ];
        } else {
            // Legacy fallback while you migrate
            $legacyImage = $product->images->first();
            $imageUrl = $legacyImage
                ? '/storage/' . $legacyImage->image_path
                : '/assets/image/default.jpg';

            $imageData = [
                'image'  => $imageUrl,
                'srcset' => null,
            ];
        }

        return [
            'id'             => $product->id,
            'name'           => $product->name,
            'price'          => $product->price,
            'original_price' => $product->original_price,
            'tag'            => $product->tag,
            'discount_pct'   => $product->discountPercent(),
            'category'       => $product->category?->name ?? 'Sans catégorie',
            ...$imageData,
        ];
    }
}
