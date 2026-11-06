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

            // Formater la liste des articles
            $itemsSummary = $order->items->map(function ($item) {
                $size = $item->size ? " (Taille : {$item->size})" : '';
                return "• {$item->quantity}x {$item->product_name}{$size}";
            })->implode("\n");

            $total = number_format($order->total_price, 3, '.', ' ');

            // Formater l'adresse et ville
            $addressParts = array_filter([$order->customer_city, $order->customer_address]);
            $location = implode(' — ', $addressParts) ?: 'Non spécifiée';

            // Message clair, épuré et bien aéré
            $lines = [
                "👤 Client : {$order->customer_name}",
                "📞 Tél : {$order->customer_phone}",
                "📍 Adresse : {$location}",
                "",
                "📦 Articles :",
                $itemsSummary ?: "• Aucun article",
                "",
                "💰 Total : {$total} TND",
            ];

            if (!empty($order->notes)) {
                $lines[] = "";
                $lines[] = "📝 Note : {$order->notes}";
            }

            $message = implode("\n", $lines);

            $adminOrderUrl = url("/admin/orders/{$order->id}/edit");
            $phoneClean = preg_replace('/[^0-9+]/', '', (string) $order->customer_phone);

            $payload = [
                'topic'    => $topic,
                'title'    => "🛍️ Commande #{$order->id} — {$total} TND",
                'message'  => $message,
                'priority' => 4, // Priorité haute (sonnerie & vibration)
                'tags'     => ['shopping_bags', 'moneybag'],
                'click'    => $adminOrderUrl, // Cliquer sur la notification ouvre la commande
                'actions'  => [
                    [
                        'action' => 'view',
                        'label'  => '📞 Appeler client',
                        'url'    => "tel:{$phoneClean}",
                    ],
                    [
                        'action' => 'view',
                        'label'  => '📋 Voir commande',
                        'url'    => $adminOrderUrl,
                    ],
                ],
            ];

            // ⚠️ Envoi vers https://ntfy.sh (racine) avec JSON_UNESCAPED_UNICODE pour l'Arabe et les émojis
            Http::timeout(5)
                ->withHeaders([
                    'Content-Type' => 'application/json; charset=utf-8',
                ])
                ->withBody(
                    json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                    'application/json'
                )
                ->post('https://ntfy.sh');

        } catch (\Throwable $e) {
            Log::error('Erreur ntfy notification: ' . $e->getMessage());
        }
    }
}