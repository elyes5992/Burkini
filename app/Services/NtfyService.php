<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NtfyService
{
    public static function notifyNewOrder(Order $order): void
    {
        $topic = config('services.ntfy.topic', env('NTFY_TOPIC'));

        if (!$topic) {
            return;
        }

        try {
            $order->loadMissing('items');

            // Format items list
            $itemsSummary = $order->items->map(function ($item) {
                $size = $item->size ? " ({$item->size})" : '';
                return "• {$item->quantity}x {$item->product_name}{$size}";
            })->implode("\n");

            $total = number_format($order->total_price, 3, '.', ' ');
            $city = $order->customer_city ? " ({$order->customer_city})" : '';

            $message = "👤 Client : {$order->customer_name}{$city}\n"
                     . "📞 Tél : {$order->customer_phone}\n"
                     . "📍 Adresse : {$order->customer_address}\n\n"
                     . "📦 Articles :\n{$itemsSummary}\n\n"
                     . "💰 Total : {$total} TND";

            $adminOrderUrl = url("/admin/orders/{$order->id}/edit");
            $phoneClean = preg_replace('/[^0-9+]/', '', $order->customer_phone);

            Http::timeout(5)->post("https://ntfy.sh/{$topic}", [
                'topic'    => $topic,
                'title'    => "🛍️ Nouvelle Commande #{$order->id} — {$total} TND",
                'message'  => $message,
                'priority' => 4, // High priority (audible ring & vibration)
                'tags'     => ['shopping_bags', 'moneybag', 'tada'],
                'click'    => $adminOrderUrl,
                'actions'  => [
                    [
                        'action' => 'view',
                        'label'  => 'Appeler client',
                        'url'    => "tel:{$phoneClean}",
                    ],
                    [
                        'action' => 'view',
                        'label'  => 'Voir commande',
                        'url'    => $adminOrderUrl,
                    ],
                ],
            ]);
        } catch (\Throwable $e) {
            // Silently log error so order creation never breaks if ntfy is down
            Log::error('Erreur ntfy notification: ' . $e->getMessage());
        }
    }
}