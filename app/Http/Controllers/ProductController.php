<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Services\VisitorTracker; // 🔥 AJOUTÉ
use App\Models\VisitorEvent; 

class ProductController extends Controller
{
    private VisitorTracker $tracker; 
    
    public function __construct(VisitorTracker $tracker) // 🔥 AJOUTÉ
    {
        $this->tracker = $tracker;
    }
    
    public function home()
    {
        // Récupère les produits qui ont "front_page" activé
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

        // Filtre par catégorie
        if ($categoryName !== 'tous') {
            $query->whereHas('category', function ($q) use ($categoryName) {
                $q->whereRaw('LOWER(name) = ?', [strtolower($categoryName)]);
            });
        } else {
            // SI "tous", on EXCLUT explicitement la catégorie "chemises" pour n'avoir que les maillots
            $query->whereHas('category', function ($q) {
                $q->whereRaw('LOWER(name) != ?', ['chemises']);
            });
        }

        // Filtre par taille
        if ($sizeFilter) {
            $query->whereHas('sizes', function ($q) use ($sizeFilter) {
                $q->whereRaw('LOWER(sizes.name) = ?', [strtolower($sizeFilter)]);
            });
        }

        $products = $query->paginate(12)
            ->withQueryString() 
            ->through(fn($p) => $this->formatProduct($p));

        // Récupérer toutes les tailles uniques (Sauf celles des chemises)
        $availableSizes = \App\Models\Size::whereHas('products', function ($q) {
            $q->where('is_active', true)
              ->whereHas('category', function ($c) {
                  $c->whereRaw('LOWER(name) != ?', ['chemises']);
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
        $sizeFilter = $request->query('size');

        $query = Product::with(['category', 'images'])
            ->orderBy('sort_order', 'asc')
            ->where('is_active', true)
            ->whereHas('category', function ($q) {
                // ICI ON FORCE LA RECHERCHE SUR LE MOT EXACT : chemises
                $q->whereRaw('LOWER(name) = ?', ['chemises']); 
            });

        // Filtre par taille
        if ($sizeFilter) {
            $query->whereHas('sizes', function ($q) use ($sizeFilter) {
                $q->whereRaw('LOWER(sizes.name) = ?', [strtolower($sizeFilter)]);
            });
        }

        $products = $query->paginate(12)
            ->withQueryString()
            ->through(fn($p) => $this->formatProduct($p));

        // Tailles disponibles uniquement pour les chemises
        $availableSizes = \App\Models\Size::whereHas('products', function($q) {
            $q->where('is_active', true)
              ->whereHas('category', function ($c) {
                  $c->whereRaw('LOWER(name) = ?', ['chemises']);
              });
        })->orderBy('name')->pluck('name');

        return Inertia::render('Chemises', [
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
        // On s'assure de ne charger le produit QUE s'il est actif
        $product = Product::with(['category', 'images', 'sizes'])
            ->where('is_active', true)
            ->findOrFail($id);

         // 🔥 TRACK PRODUCT VIEW
        $this->tracker->log(request(), VisitorEvent::TYPE_PRODUCT_VIEW, [
            'product_id'   => $product->id,
            'product_name' => $product->name,
            'product_type' => 'product',
            'category_name' => $product->category?->name, // 🔥 POUR LE TABLEAU
        ]);    

        // Build images array
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