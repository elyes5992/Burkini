<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;

class OrderController extends Controller
{
    const DELIVERY_FEE      = 8.00;
    const FREE_DELIVERY_MIN = 200.00;

    /** Calculates delivery fee based on subtotal */
    private function deliveryFee(float $subtotal): float
    {
        return $subtotal >= self::FREE_DELIVERY_MIN ? 0.0 : self::DELIVERY_FEE;
    }

    public function checkout()
    {
        $cart = session()->get('cart', []);

        if (empty($cart)) {
            return redirect()->route('cart')->with('error', 'Votre panier est vide.');
        }

        $subtotal = collect($cart)->sum(fn ($item) => $item['price'] * $item['quantity']);
        $delivery = $this->deliveryFee($subtotal);
        $total    = $subtotal + $delivery;

        return Inertia::render('Checkout', [
            'cart'         => array_values($cart),
            'subtotal'     => $subtotal,
            'deliveryFee'  => $delivery,
            'freeDeliveryMin' => self::FREE_DELIVERY_MIN,
            'total'        => $total,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name'    => 'required|string|max:255',
            'customer_phone'   => 'required|string|max:20',
            'customer_address' => 'required|string|max:500',
            'customer_city'    => 'nullable|string|max:100',
            'notes'            => 'nullable|string|max:1000',
        ]);

        $cart = session()->get('cart', []);

        if (empty($cart)) {
            return redirect()->route('cart')->with('error', 'Votre panier est vide.');
        }

        $subtotal = collect($cart)->sum(fn ($item) => $item['price'] * $item['quantity']);
        $delivery = $this->deliveryFee($subtotal);
        $total    = $subtotal + $delivery;

        $order = Order::create([
            ...$validated,
            'total_price'  => $total,
            'delivery_fee' => $delivery,
            'status'       => 'pending',
        ]);

        foreach ($cart as $item) {
            $order->items()->create([
                'product_id'    => $item['product_id'],
                'product_name'  => $item['name'],
                'product_price' => $item['price'],
                'product_image' => $item['image'],
                'size'          => $item['size'],
                'quantity'      => $item['quantity'],
                'subtotal'      => $item['price'] * $item['quantity'],
            ]);
        }

        session()->forget('cart');

        return Inertia::render('OrderConfirmation', [
    'order' => [
        'id'            => $order->id,
        'customer_name' => $order->customer_name,
        'subtotal'      => $subtotal,
        'deliveryFee'   => $delivery,
        'total_price'   => $order->total_price,
        'status'        => $order->status,
        'items'         => $order->items->map(fn($item) => [
            'product_id' => $item->product_id,
            'quantity'   => $item->quantity,
            'price'      => $item->product_price,
        ])->values(),
    ],
]);
    }
}