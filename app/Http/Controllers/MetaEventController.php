<?php

namespace App\Http\Controllers;

use App\Services\MetaPixelService;
use Illuminate\Http\Request;

class MetaEventController extends Controller
{
    protected MetaPixelService $meta;

    public function __construct(MetaPixelService $meta)
    {
        $this->meta = $meta;
    }

    private function getUserData(Request $request): array
    {
        $user = $request->user();
        return [
            'email' => $user?->email,
            'phone' => $user?->phone,
            'fbc'   => $request->cookie('_fbc'),
            'fbp'   => $request->cookie('_fbp'),
        ];
    }

    public function pageView(Request $request)
    {
        $this->meta->trackPageView($this->getUserData($request));
        return response()->json(['status' => 'ok']);
    }

    public function addToCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required',
            'quantity'   => 'required|integer|min:1',
            'price'      => 'required|numeric',
        ]);

        $this->meta->trackAddToCart($this->getUserData($request), [
            'id'       => $request->product_id,
            'quantity' => $request->quantity,
            'price'    => $request->price,
        ]);

        return response()->json(['status' => 'ok']);
    }

    public function purchase(Request $request)
    {
        $request->validate([
            'order_id' => 'required',
            'total'    => 'required|numeric',
            'items'    => 'required|array',
        ]);

        $this->meta->trackPurchase($this->getUserData($request), [
            'order_id' => $request->order_id,
            'total'    => $request->total,
            'items'    => $request->items,
        ]);

        return response()->json(['status' => 'ok']);
    }
}