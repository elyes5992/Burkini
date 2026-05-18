<x-filament::page>

    {{-- Stats Grid --}}
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;margin-bottom:32px;">

        {{-- Total commandes --}}
        <div style="background:#1f2937;border-radius:12px;padding:20px;border:1px solid #374151;">
            <div style="font-size:12px;color:#9ca3af;margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em;">Total Commandes</div>
            <div style="font-size:32px;font-weight:700;color:#f9fafb;">{{ $totalOrders }}</div>
            <div style="margin-top:8px;font-size:12px;color:#6b7280;">Toutes périodes</div>
        </div>

        {{-- Revenu --}}
        <div style="background:#1f2937;border-radius:12px;padding:20px;border:1px solid #374151;">
            <div style="font-size:12px;color:#9ca3af;margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em;">Chiffre d'Affaires</div>
            <div style="font-size:28px;font-weight:700;color:#34d399;">{{ number_format($totalRevenue, 2) }} DT</div>
            <div style="margin-top:8px;font-size:12px;color:#6b7280;">Expédiées + Terminées</div>
        </div>

        {{-- En attente --}}
        <div style="background:#1f2937;border-radius:12px;padding:20px;border-left:4px solid #f59e0b;">
            <div style="font-size:12px;color:#9ca3af;margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em;">En Attente</div>
            <div style="font-size:32px;font-weight:700;color:#fbbf24;">{{ $pendingOrders }}</div>
            <div style="margin-top:8px;font-size:12px;color:#6b7280;">À traiter</div>
        </div>

        {{-- En cours --}}
        <div style="background:#1f2937;border-radius:12px;padding:20px;border-left:4px solid #38bdf8;">
            <div style="font-size:12px;color:#9ca3af;margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em;">En Cours</div>
            <div style="font-size:32px;font-weight:700;color:#38bdf8;">{{ $confirmedOrders }}</div>
            <div style="margin-top:8px;font-size:12px;color:#6b7280;">Confirmées</div>
        </div>

        {{-- Expédié --}}
        <div style="background:#1f2937;border-radius:12px;padding:20px;border-left:4px solid #818cf8;">
            <div style="font-size:12px;color:#9ca3af;margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em;">Expédiées</div>
            <div style="font-size:32px;font-weight:700;color:#818cf8;">{{ $shippedOrders }}</div>
            <div style="margin-top:8px;font-size:12px;color:#6b7280;">En livraison</div>
        </div>

        {{-- Terminé --}}
        <div style="background:#1f2937;border-radius:12px;padding:20px;border-left:4px solid #34d399;">
            <div style="font-size:12px;color:#9ca3af;margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em;">Terminées</div>
            <div style="font-size:32px;font-weight:700;color:#34d399;">{{ $deliveredOrders }}</div>
            <div style="margin-top:8px;font-size:12px;color:#6b7280;">Livrées</div>
        </div>

        {{-- Annulé --}}
        <div style="background:#1f2937;border-radius:12px;padding:20px;border-left:4px solid #f87171;">
            <div style="font-size:12px;color:#9ca3af;margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em;">Annulées</div>
            <div style="font-size:32px;font-weight:700;color:#f87171;">{{ $cancelledOrders }}</div>
            <div style="margin-top:8px;font-size:12px;color:#6b7280;">Commandes annulées</div>
        </div>

        {{-- Produits --}}
        <div style="background:#1f2937;border-radius:12px;padding:20px;border:1px solid #374151;">
            <div style="font-size:12px;color:#9ca3af;margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em;">Produits</div>
            <div style="font-size:32px;font-weight:700;color:#f9fafb;">{{ $totalProducts }}</div>
            <div style="margin-top:8px;font-size:12px;color:#6b7280;">Dans le catalogue</div>
        </div>

    </div>

    {{-- Recent Orders --}}
    <div style="background:#1f2937;border-radius:12px;border:1px solid #374151;overflow:hidden;">
        <div style="padding:16px 20px;border-bottom:1px solid #374151;display:flex;justify-content:space-between;align-items:center;">
            <h2 style="font-size:15px;font-weight:600;color:#f9fafb;margin:0;">Dernières commandes</h2>
            <a href="{{ route('filament.admin.resources.orders.index') }}"
                style="font-size:12px;color:#38bdf8;text-decoration:none;">Voir tout →</a>
        </div>
        <table style="width:100%;border-collapse:collapse;">
            <thead>
                <tr style="border-bottom:1px solid #374151;">
                    <th style="padding:10px 20px;text-align:left;font-size:11px;color:#6b7280;font-weight:500;text-transform:uppercase;">#</th>
                    <th style="padding:10px 20px;text-align:left;font-size:11px;color:#6b7280;font-weight:500;text-transform:uppercase;">Client</th>
                    <th style="padding:10px 20px;text-align:left;font-size:11px;color:#6b7280;font-weight:500;text-transform:uppercase;">Produits</th>
                    <th style="padding:10px 20px;text-align:left;font-size:11px;color:#6b7280;font-weight:500;text-transform:uppercase;">Total</th>
                    <th style="padding:10px 20px;text-align:left;font-size:11px;color:#6b7280;font-weight:500;text-transform:uppercase;">Statut</th>
                    <th style="padding:10px 20px;text-align:left;font-size:11px;color:#6b7280;font-weight:500;text-transform:uppercase;">Date</th>
                </tr>
            </thead>
            <tbody>
                @forelse($recentOrders as $order)
                @php
                $statusMap = [
                'pending' => ['label' => 'En attente', 'color' => '#f59e0b', 'bg' => '#451a03'],
                'confirmed' => ['label' => 'En cours', 'color' => '#38bdf8', 'bg' => '#0c2537'],
                'shipped' => ['label' => 'Expédié', 'color' => '#818cf8', 'bg' => '#1e1b4b'],
                'delivered' => ['label' => 'Terminé', 'color' => '#34d399', 'bg' => '#022c22'],
                'cancelled' => ['label' => 'Annulé', 'color' => '#f87171', 'bg' => '#450a0a'],
                ];
                $s = $statusMap[$order->status] ?? ['label' => $order->status, 'color' => '#9ca3af', 'bg' => '#374151'];
                @endphp
                <tr style="border-bottom:1px solid #374151;">
                    <td style="padding:12px 20px;font-size:13px;color:#9ca3af;">#{{ $order->id }}</td>
                    <td style="padding:12px 20px;">
                        <div style="font-size:13px;font-weight:500;color:#f9fafb;">{{ $order->customer_name }}</div>
                        <div style="font-size:11px;color:#6b7280;">{{ $order->customer_city }}</div>
                    </td>
                    <td style="padding:12px 20px;">
                        <div style="display:flex;gap:4px;">
                            @foreach($order->items->take(3) as $item)
                            @if($item->product_image)
                            <img src="{{ $item->product_image }}" style="width:32px;height:42px;object-fit:cover;border-radius:4px;">
                            @endif
                            @endforeach
                            @if($order->items->count() > 3)
                            <div style="width:32px;height:42px;background:#374151;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:11px;color:#9ca3af;">+{{ $order->items->count() - 3 }}</div>
                            @endif
                        </div>
                    </td>
                    <td style="padding:12px 20px;font-size:13px;font-weight:600;color:#34d399;">{{ number_format($order->total_price, 2) }} DT</td>
                    <td style="padding:12px 20px;">
                        {{-- blade-formatter-disable --}}
                        @php
                        $s = $statusMap[$order->status] ?? ['label' => $order->status, 'color' => '#9ca3af', 'bg' => '#374151'];
                        $badgeStyle = "padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background-color:{$s['bg']};color:{$s['color']};";
                        @endphp
                        <span style="{{ $badgeStyle }}">{{ $s['label'] }}</span>
                    </td>
                    <td style="padding:12px 20px;font-size:12px;color:#6b7280;">{{ $order->created_at->format('d/m/Y H:i') }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="6" style="padding:32px;text-align:center;color:#6b7280;font-size:13px;">Aucune commande pour le moment</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>

</x-filament::page>