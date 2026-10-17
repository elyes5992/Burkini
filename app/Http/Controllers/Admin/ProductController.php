<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Size;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $categoryId = $request->query('category_id');
        $tag = $request->query('tag');
        $isActive = $request->query('is_active');

        $query = Product::with(['category', 'sizes'])
            ->orderBy('sort_order', 'asc');

        if (method_exists(Product::class, 'media')) {
            $query->with('media');
        }
        if (method_exists(Product::class, 'images')) {
            $query->with('images');
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if ($categoryId && $categoryId !== 'all') {
            $query->where('category_id', $categoryId);
        }

        if ($tag && $tag !== 'all') {
            $query->where('tag', $tag);
        }

        if ($isActive !== null && $isActive !== 'all') {
            $query->where('is_active', $isActive === '1');
        }

        $products = $query->paginate(15)
            ->withQueryString()
            ->through(function ($p) {
                $imgUrl = null;
                if (method_exists($p, 'getFirstMediaUrl')) {
                    $imgUrl = $p->getFirstMediaUrl('images', 'thumb') ?: $p->getFirstMediaUrl('images');
                }
                if (!$imgUrl && isset($p->images) && $p->images->first()) {
                    $first = $p->images->first();
                    $path = $first->image_path ?? $first->path ?? null;
                    if ($path) {
                        $imgUrl = Str::startsWith($path, ['http://', 'https://', '/storage/'])
                            ? $path
                            : '/storage/' . ltrim($path, '/');
                    }
                }
                if (!$imgUrl && !empty($p->image)) {
                    $imgUrl = Str::startsWith($p->image, ['http://', 'https://', '/storage/'])
                        ? $p->image
                        : '/storage/' . ltrim($p->image, '/');
                }

                return [
                    'id'             => $p->id,
                    'name'           => $p->name,
                    'category'       => $p->category?->name ?? '—',
                    'category_id'    => $p->category_id,
                    'price'          => (float) $p->price,
                    'original_price' => $p->original_price ? (float) $p->original_price : null,
                    'tag'            => $p->tag,
                    'is_active'      => (bool) $p->is_active,
                    'front_page'     => (bool) $p->front_page,
                    'sort_order'     => $p->sort_order,
                    'image'          => $imgUrl,
                    'sizes'          => $p->sizes->pluck('name')->toArray(),
                ];
            });

        return Inertia::render('Admin/Products/Index', [
            'products'   => $products,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'filters'    => [
                'search'      => $search,
                'category_id' => $categoryId ?? 'all',
                'tag'         => $tag ?? 'all',
                'is_active'   => $isActive ?? 'all',
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Products/Form', [
            'categories'     => Category::orderBy('name')->get(['id', 'name']),
            'availableSizes' => Size::orderBy('name')->get(['id', 'name']),
            'product'        => null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id'    => 'required|exists:categories,id',
            'name'           => 'required|string|max:255',
            'slug'           => 'required|string|max:255|unique:products,slug',
            'description'    => 'required|string',
            'price'          => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'tag'            => 'nullable|string|in:promo,bestseller,nouveaute',
            'is_active'      => 'boolean',
            'front_page'     => 'boolean',
            'sizes'          => 'array',
            'sizes.*'        => 'exists:sizes,id',
            'primary_image'  => 'nullable|image|max:10240',
            'images'         => 'nullable|array',
            'images.*'       => 'nullable|image|max:10240',
        ]);

        if (($validated['tag'] ?? null) !== 'promo') {
            $validated['original_price'] = null;
        }

        $product = Product::create($validated);

        if (!empty($validated['sizes'])) {
            $product->sizes()->sync($validated['sizes']);
        }

        // Save Primary Image
        if ($request->hasFile('primary_image')) {
            $product->addMedia($request->file('primary_image'))
                ->withCustomProperties(['is_primary' => true])
                ->toMediaCollection('images');
        }

        // Save Gallery Images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $product->addMedia($file)
                    ->withCustomProperties(['is_primary' => false])
                    ->toMediaCollection('images');
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Produit créé avec succès.');
    }

    public function edit(Product $product)
    {
        $product->load(['category', 'sizes']);
        if (method_exists($product, 'media')) {
            $product->load('media');
        }
        if (method_exists($product, 'images')) {
            $product->load('images');
        }

        $primaryImage = null;
        $existingImages = [];

        // 1. Spatie Media Library items
        if (method_exists($product, 'getMedia')) {
            foreach ($product->getMedia('images') as $m) {
                try {
                    $url = $m->getUrl('thumb') ?: $m->getUrl();
                } catch (\Throwable $e) {
                    $url = $m->getUrl();
                }

                $isPrimary = (bool) $m->getCustomProperty('is_primary', false);
                $item = [
                    'id'         => $m->id,
                    'source'     => 'media',
                    'url'        => $url,
                    'name'       => $m->file_name,
                    'is_primary' => $isPrimary,
                ];

                if ($isPrimary && !$primaryImage) {
                    $primaryImage = $item;
                } else {
                    $existingImages[] = $item;
                }
            }
        }

        // 2. Old Filament product_images relationship ($product->images)
        if (isset($product->images) && is_iterable($product->images)) {
            foreach ($product->images as $img) {
                $path = is_string($img) ? $img : ($img->image_path ?? $img->path ?? null);
                if (!$path) continue;

                $url = Str::startsWith($path, ['http://', 'https://', '/storage/'])
                    ? $path
                    : '/storage/' . ltrim($path, '/');

                $isPrimary = is_object($img) && (!empty($img->is_primary) || !empty($img->is_main));
                $item = [
                    'id'         => is_object($img) ? $img->id : $path,
                    'source'     => 'relation',
                    'url'        => $url,
                    'name'       => basename($path),
                    'is_primary' => $isPrimary,
                ];

                if ($isPrimary && !$primaryImage) {
                    $primaryImage = $item;
                } else {
                    $existingImages[] = $item;
                }
            }
        }

        // 3. Fallback: single column on products table ($product->image)
        if (!$primaryImage && !empty($product->image)) {
            $url = Str::startsWith($product->image, ['http://', 'https://', '/storage/'])
                ? $product->image
                : '/storage/' . ltrim($product->image, '/');

            $primaryImage = [
                'id'         => 'column_image',
                'source'     => 'column',
                'url'        => $url,
                'name'       => basename($product->image),
                'is_primary' => true,
            ];
        }

        // If no primary image was explicitly tagged, promote the first image
        if (!$primaryImage && count($existingImages) > 0) {
            $primaryImage = array_shift($existingImages);
            $primaryImage['is_primary'] = true;
        }

        return Inertia::render('Admin/Products/Form', [
            'categories'     => Category::orderBy('name')->get(['id', 'name']),
            'availableSizes' => Size::orderBy('name')->get(['id', 'name']),
            'product'        => [
                'id'              => $product->id,
                'category_id'     => $product->category_id,
                'name'            => $product->name,
                'slug'            => $product->slug,
                'description'     => $product->description,
                'price'           => $product->price,
                'original_price'  => $product->original_price,
                'tag'             => $product->tag,
                'is_active'       => (bool) $product->is_active,
                'front_page'      => (bool) $product->front_page,
                'selected_sizes'  => $product->sizes->pluck('id')->toArray(),
                'primary_image'   => $primaryImage,
                'existing_images' => $existingImages,
            ],
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id'    => 'required|exists:categories,id',
            'name'           => 'required|string|max:255',
            'slug'           => 'required|string|max:255|unique:products,slug,' . $product->id,
            'description'    => 'required|string',
            'price'          => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'tag'            => 'nullable|string|in:promo,bestseller,nouveaute',
            'is_active'      => 'boolean',
            'front_page'     => 'boolean',
            'sizes'          => 'array',
            'sizes.*'        => 'exists:sizes,id',
            'primary_image'  => 'nullable|image|max:10240',
            'images'         => 'nullable|array',
            'images.*'       => 'nullable|image|max:10240',
        ]);

        if (($validated['tag'] ?? null) !== 'promo') {
            $validated['original_price'] = null;
        }

        $product->update($validated);

        if (isset($validated['sizes'])) {
            $product->sizes()->sync($validated['sizes']);
        }

        // Replace or set Primary Image
        if ($request->hasFile('primary_image')) {
            if (method_exists($product, 'getMedia')) {
                foreach ($product->getMedia('images') as $m) {
                    if ($m->getCustomProperty('is_primary')) {
                        $m->setCustomProperty('is_primary', false);
                        $m->save();
                    }
                }
            }

            $product->addMedia($request->file('primary_image'))
                ->withCustomProperties(['is_primary' => true])
                ->toMediaCollection('images');
        }

        // Append Gallery Images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $product->addMedia($file)
                    ->withCustomProperties(['is_primary' => false])
                    ->toMediaCollection('images');
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Produit mis à jour avec succès.');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->back()->with('success', 'Produit supprimé.');
    }

    public function toggleActive(Product $product)
    {
        $product->update(['is_active' => !$product->is_active]);
        return redirect()->back();
    }

    public function toggleFrontPage(Product $product)
    {
        $product->update(['front_page' => !$product->front_page]);
        return redirect()->back();
    }

    public function deleteImage(Product $product, Request $request, $mediaId)
    {
        $source = $request->query('source', 'media');

        if ($source === 'media' && method_exists($product, 'media')) {
            $media = $product->media()->find($mediaId);
            if ($media) {
                $media->delete();
            }
        } elseif ($source === 'relation' && method_exists($product, 'images')) {
            $img = $product->images()->find($mediaId);
            if ($img) {
                $img->delete();
            }
        } elseif ($source === 'column') {
            if ($product->image) {
                $product->update(['image' => null]);
            }
        }

        return redirect()->back()->with('success', 'Image supprimée.');
    }
}