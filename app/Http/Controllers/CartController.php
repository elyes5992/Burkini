<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;

class CartController extends Controller
{
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

        // Unique key per product+size combo
        $key = $product->id . '_' . $size;

        if (isset($cart[$key])) {
            $cart[$key]['quantity'] += $quantity;
        } else {
            $cart[$key] = [
                'key'      => $key,
                'product_id' => $product->id,
                'name'     => $product->name,
                'price'    => (float) $product->price,
                'size'     => $size,
                'quantity' => $quantity,
                'image'    => $product->getFirstMediaUrl('images', 'thumb')
                    ?: ($product->images->first()
                        ? '/storage/' . $product->images->first()->image_path
                        : '/assets/image/default.jpg'),
            ];
        }

        $this->saveCart($cart);

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
