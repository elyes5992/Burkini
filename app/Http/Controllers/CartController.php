<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Services\VisitorTracker;
use App\Models\VisitorEvent;

class CartController extends Controller
{
    
    public function __construct(private VisitorTracker $tracker)
    {
    }
    // Get cart from session
    private function getCart(): array
    {
        return session()->get('cart', []);
    }

    // Save cart to session
    private function saveCart(array $cart): void
    {
        session()->put('cart', $cart);
    }

    public function index()
    {
        return Inertia::render('Cart', [
            'cart' => $this->getCart(),
        ]);
    }

    public function add(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'size'       => 'required|string',
            'quantity'   => 'integer|min:1|max:10',
        ]);

        $product  = Product::with(['images', 'media'])->findOrFail($validated['product_id']);
        $size     = $validated['size'];
        $quantity = $validated['quantity'] ?? 1;
        $cart     = $this->getCart();

        $key = $product->id . '_' . $size;

        if (isset($cart[$key])) {
            $cart[$key]['quantity'] += $quantity;
        } else {
            $cart[$key] = [
                'key'        => $key,
                'product_id' => $product->id,
                'name'       => $product->name,
                'price'      => (float) $product->price,
                'size'       => $size,
                'quantity'   => $quantity,
                'image'      => $product->getFirstMediaUrl('images', 'thumb')
                    ?: ($product->images->first()
                        ? '/storage/' . $product->images->first()->image_path
                        : '/assets/image/default.jpg'),
            ];
        }

        $this->saveCart($cart);

        // 🔥 TRACK ADD TO CART
        $this->tracker->log($request, VisitorEvent::TYPE_ADD_TO_CART, [
            'product_id'   => $product->id,
            'product_type' => 'product',
            'product_name' => $product->name,
            'quantity'     => $quantity,
            'price'        => $product->price,
            'size'         => $size,
        ]);

        return back()->with('success', 'Produit ajouté au panier !');
    }

    public function update(Request $request, string $key)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1|max:10',
        ]);

        $cart = $this->getCart();

        if (isset($cart[$key])) {
            $cart[$key]['quantity'] = $validated['quantity'];
            $this->saveCart($cart);
        }

        return back();
    }

    public function remove(string $key)
    {
        $cart = $this->getCart();
        unset($cart[$key]);
        $this->saveCart($cart);

        return back()->with('success', 'Produit retiré du panier.');
    }

    public function clear()
    {
        session()->forget('cart');
        return back();
    }
    public function json()
    {
        return response()->json(session()->get('cart', []));
    }
}
