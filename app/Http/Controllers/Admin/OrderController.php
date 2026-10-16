<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $query = Order::with('items')->orderBy('created_at', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_phone', 'like', "%{$search}%")
                  ->orWhere('customer_city', 'like', "%{$search}%")
                  ->orWhere('customer_address', 'like', "%{$search}%");
            });
        }

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $orders = $query->paginate(15)->withQueryString()->through(function ($order) {
            return [
                'id'               => $order->id,
                'customer_name'    => $order->customer_name,
                'customer_phone'   => $order->customer_phone,
                'customer_city'    => $order->customer_city ?? '—',
                'customer_address' => $order->customer_address,
                'total_price'      => (float) $order->total_price,
                'delivery_fee'     => (float) ($order->delivery_fee ?? 0),
                'status'           => $order->status,
                'notes'            => $order->notes,
                'created_at'       => $order->created_at->format('d/m/Y H:i'),
                'created_since'    => $order->created_at->diffForHumans(),
                'items'            => $order->items->map(fn($item) => [
                    'id'            => $item->id,
                    'product_name'  => $item->product_name,
                    'product_image' => $item->product_image,
                    'size'          => $item->size,
                    'quantity'      => (int) $item->quantity,
                    'product_price' => (float) $item->product_price,
                ]),
            ];
        });

        // Quick KPI Stats
        $allOrders = Order::all();
        $counts = [
            'total'     => $allOrders->count(),
            'pending'   => $allOrders->where('status', 'pending')->count(),
            'confirmed' => $allOrders->where('status', 'confirmed')->count(),
            'delivered' => $allOrders->where('status', 'delivered')->count(),
            'cancelled' => $allOrders->where('status', 'cancelled')->count(),
        ];

        return Inertia::render('Admin/Orders/Index', [
            'orders'  => $orders,
            'filters' => [
                'search' => $search,
                'status' => $status ?? 'all',
            ],
            'counts'  => $counts,
        ]);
    }

    public function edit(Order $order)
    {
        $order->load('items');

        return Inertia::render('Admin/Orders/Edit', [
            'order' => [
                'id'               => $order->id,
                'customer_name'    => $order->customer_name,
                'customer_phone'   => $order->customer_phone,
                'customer_city'    => $order->customer_city,
                'customer_address' => $order->customer_address,
                'total_price'      => (float) $order->total_price,
                'delivery_fee'     => (float) ($order->delivery_fee ?? 0),
                'status'           => $order->status,
                'notes'            => $order->notes,
                'created_at'       => $order->created_at->format('d/m/Y H:i'),
                'items'            => $order->items->map(fn($item) => [
                    'id'            => $item->id,
                    'product_name'  => $item->product_name,
                    'product_image' => $item->product_image,
                    'size'          => $item->size,
                    'quantity'      => (int) $item->quantity,
                    'product_price' => (float) $item->product_price,
                ]),
            ],
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'customer_name'    => 'required|string|max:255',
            'customer_phone'   => 'required|string|max:50',
            'customer_city'    => 'nullable|string|max:255',
            'customer_address' => 'required|string',
            'status'           => 'required|in:pending,confirmed,shipped,delivered,cancelled',
            'notes'            => 'nullable|string',
        ]);

        $order->update($validated);

        return redirect()->route('admin.orders.index')->with('success', 'Commande mise à jour.');
    }

    // Quick inline status change directly from table
    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,shipped,delivered,cancelled',
        ]);

        $order->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', 'Statut mis à jour.');
    }

    public function destroy(Order $order)
    {
        $order->delete();
        return redirect()->back()->with('success', 'Commande supprimée.');
    }
}