<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Size;
use App\Services\VisitorTracker;
use App\Models\VisitorEvent; 

class ProductController extends Controller
{
    private VisitorTracker $tracker; 
    
    // Non-swimwear categories to exclude from the main maillots page
    private const EXCLUDED_FROM_SWIMWEAR = [
        'chemises', 
        'pyjama', 
        'pyjamas', 
        'survetement', 
        'survetement sport',
        'survêtement sport'
    ];

    public function __construct(VisitorTracker $tracker)
    {
        $this->tracker = $tracker;
    }
    
    public function home()
    {
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
        $sizeFilter = $request->query('size'); 

        $query = Product::with(['category', 'images'])
            ->orderBy('sort_order', 'asc')
            ->where('is_active', true);

        if ($categoryName !== 'tous') {
            $query->whereHas('category', function ($q) use ($categoryName) {
                $q->whereRaw('LOWER(name) = ?', [strtolower($categoryName)]);
            });
        } else {
            // Exclude all other distinct collections to show only swimwear
            $query->whereHas('category', function ($q) {
                $q->whereNotIn(\DB::raw('LOWER(name)'), self::EXCLUDED_FROM_SWIMWEAR);
            });
        }

        if ($sizeFilter) {
            $query->whereHas('sizes', function ($q) use ($sizeFilter) {
                $q->whereRaw('LOWER(sizes.name) = ?', [strtolower($sizeFilter)]);
            });
        }

        $products = $query->paginate(12)
            ->withQueryString() 
            ->through(fn($p) => $this->formatProduct($p));

        $availableSizes = Size::whereHas('products', function ($q) {
            $q->where('is_active', true)
              ->whereHas('category', function ($c) {
                  $c->whereNotIn(\DB::raw('LOWER(name)'), self::EXCLUDED_FROM_SWIMWEAR);
              });
        })->orderBy('name')->pluck('name');

        return Inertia::render('Products', [
            'products'        => $products,
            'currentCategory' => $categoryName,
            'currentSize'     => $sizeFilter,     
            'availableSizes'  => $availableSizes, 
        ]);
    }

    public function chemises(Request $request)
    {
        return $this->renderCategoryPage($request, ['chemises'], 'Chemises');
    }

    public function pyjamas(Request $request)
    {
        return $this->renderCategoryPage($request, ['pyjama', 'pyjamas'], 'Pyjamas');
    }

    public function survetements(Request $request)
    {
        return $this->renderCategoryPage($request, ['survetement', 'survetement sport', 'survêtement sport'], 'Survetements');
    }

    /**
     * Helper to load products by category keywords and render Inertia view
     */
    private function renderCategoryPage(Request $request, array $categoryKeywords, string $inertiaView)
    {
        $sizeFilter = $request->query('size');

        $query = Product::with(['category', 'images'])
            ->orderBy('sort_order', 'asc')
            ->where('is_active', true)
            ->whereHas('category', function ($q) use ($categoryKeywords) {
                $q->whereIn(\DB::raw('LOWER(name)'), array_map('strtolower', $categoryKeywords));
            });

        if ($sizeFilter) {
            $query->whereHas('sizes', function ($q) use ($sizeFilter) {
                $q->whereRaw('LOWER(sizes.name) = ?', [strtolower($sizeFilter)]);
            });
        }

        $products = $query->paginate(12)
            ->withQueryString()
            ->through(fn($p) => $this->formatProduct($p));

        $availableSizes = Size::whereHas('products', function ($q) use ($categoryKeywords) {
            $q->where('is_active', true)
              ->whereHas('category', function ($c) use ($categoryKeywords) {
                  $c->whereIn(\DB::raw('LOWER(name)'), array_map('strtolower', $categoryKeywords));
              });
        })->orderBy('name')->pluck('name');

        return Inertia::render($inertiaView, [
            'products'       => $products,
            'currentSize'    => $sizeFilter,
            'availableSizes' => $availableSizes,
        ]);
    }

    public function about()
    {
        return Inertia::render('About');
    }

    public function show($id)
    {
        $product = Product::with(['category', 'images', 'sizes'])
            ->where('is_active', true)
            ->findOrFail($id);

        $this->tracker->log(request(), VisitorEvent::TYPE_PRODUCT_VIEW, [
            'product_id'    => $product->id,
            'product_name'  => $product->name,
            'product_type'  => 'product',
            'category_name' => $product->category?->name,
        ]);    

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
        $mediaItem = $product->getFirstMedia('images');

        if ($mediaItem) {
            $imageData = [
                'image'  => $mediaItem->getUrl('thumb'),
                'srcset' => implode(', ', [
                    $mediaItem->getUrl('thumb')  . ' 400w',
                    $mediaItem->getUrl('full')   . ' 800w',
                ]),
            ];
        } else {
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