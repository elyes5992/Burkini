<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VisitorEvent;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class StatsController extends Controller
{
    public function index(Request $request): Response
    {
        if ($request->has('start') && $request->has('end')) {
            $start = Carbon::parse($request->get('start'))->startOfDay();
            $end = Carbon::parse($request->get('end'))->endOfDay();
            $range = 'custom';
        } else {
            $range = $request->get('range', '30d');
            [$start, $end] = $this->dateRange($range);
        }

        // ── Default hide_direct is TRUE (hide bots by default) ──
        $hideDirect = $request->has('hide_direct')
            ? $request->boolean('hide_direct')
            : true;

        $status = $request->get('status', 'all');

        // ── Subquery: Non-Direct visitors (bots) + Always keep real buyers ──
        $nonDirectVisitors = null;
        if ($hideDirect) {
            $nonDirectVisitors = DB::table('visitor_events as ve')
                ->whereBetween('ve.created_at', [$start, $end])
                ->groupBy('ve.visitor_id')
                ->havingRaw("MAX(CASE
                    WHEN ve.referrer ILIKE '%facebook%' THEN 'Facebook'
                    WHEN ve.referrer ILIKE '%instagram%' THEN 'Instagram'
                    WHEN ve.referrer ILIKE '%google%' THEN 'Google'
                    WHEN ve.referrer IS NULL OR ve.referrer = '' THEN 'Direct'
                    ELSE 'Autre'
                END) != 'Direct' OR MAX(CASE WHEN ve.event_type IN ('purchase', 'checkout_start', 'add_to_cart') THEN 1 ELSE 0 END) = 1")
                ->select('ve.visitor_id');
        }

        // ── 1. Funnel stats ──
        $funnelQuery = VisitorEvent::query()->whereBetween('created_at', [$start, $end]);
        if ($hideDirect) {
            $funnelQuery->whereIn('visitor_id', $nonDirectVisitors);
        }

        $counts = $funnelQuery
            ->selectRaw('event_type, COUNT(DISTINCT visitor_id) as visitors')
            ->groupBy('event_type')
            ->pluck('visitors', 'event_type');

        // Count every completed purchase transaction (matches the orders page)
        $totalPurchases = (clone $funnelQuery)
            ->where('event_type', VisitorEvent::TYPE_PURCHASE)
            ->count();

        $funnel = [
            'arrives'  => (int) ($counts[VisitorEvent::TYPE_PAGE_VIEW] ?? 0),
            'vus'      => (int) ($counts[VisitorEvent::TYPE_PRODUCT_VIEW] ?? 0),
            'panier'   => (int) ($counts[VisitorEvent::TYPE_ADD_TO_CART] ?? 0),
            'checkout' => (int) ($counts[VisitorEvent::TYPE_CHECKOUT_START] ?? 0),
            'achats'   => (int) $totalPurchases,
        ];

        // ── 2. Visitors paginés (Table) ──
        $perPage = (int) $request->get('per_page', 25);
        $perPage = min(max($perPage, 10), 100);

        // Subquery: Get lifetime purchases and latest purchase time per visitor
        $purchaseSubquery = DB::table('visitor_events')
            ->select('visitor_id')
            ->selectRaw('COUNT(*) as purchase_count')
            ->selectRaw('MAX(created_at) as last_purchase_at')
            ->where('event_type', VisitorEvent::TYPE_PURCHASE)
            ->groupBy('visitor_id');

        $visitorsQuery = DB::table('visitor_events as ve')
            ->leftJoinSub($purchaseSubquery, 'vp', 'vp.visitor_id', '=', 've.visitor_id')
            ->select('ve.visitor_id')
            ->selectRaw('MAX(ve.created_at) as last_seen')
            ->selectRaw('MAX(ve.platform) as platform')
            ->selectRaw('COALESCE(MAX(vp.purchase_count), 0) as total_purchases')
            ->selectRaw('MAX(vp.last_purchase_at) as last_purchase_at')
            // Standard flags
            ->selectRaw("MAX(CASE WHEN ve.event_type = ? THEN 1 ELSE 0 END) as has_page_view_raw", [VisitorEvent::TYPE_PAGE_VIEW])
            ->selectRaw("MAX(CASE WHEN ve.event_type = ? THEN 1 ELSE 0 END) as has_product_view_raw", [VisitorEvent::TYPE_PRODUCT_VIEW])
            ->selectRaw("MAX(CASE WHEN ve.event_type = ? THEN 1 ELSE 0 END) as has_cart_raw", [VisitorEvent::TYPE_ADD_TO_CART])
            ->selectRaw("MAX(CASE WHEN ve.event_type = ? THEN 1 ELSE 0 END) as has_checkout_raw", [VisitorEvent::TYPE_CHECKOUT_START])
            ->selectRaw("MAX(CASE WHEN ve.event_type = ? THEN 1 ELSE 0 END) as has_purchase_raw", [VisitorEvent::TYPE_PURCHASE])
            // Post-purchase activity flags (if customer returned after buying)
            ->selectRaw("MAX(CASE WHEN vp.last_purchase_at IS NOT NULL AND ve.created_at > vp.last_purchase_at THEN 1 ELSE 0 END) as has_post_activity")
            ->selectRaw("MAX(CASE WHEN vp.last_purchase_at IS NOT NULL AND ve.created_at > vp.last_purchase_at AND ve.event_type = ? THEN 1 ELSE 0 END) as post_page_view", [VisitorEvent::TYPE_PAGE_VIEW])
            ->selectRaw("MAX(CASE WHEN vp.last_purchase_at IS NOT NULL AND ve.created_at > vp.last_purchase_at AND ve.event_type = ? THEN 1 ELSE 0 END) as post_product_view", [VisitorEvent::TYPE_PRODUCT_VIEW])
            ->selectRaw("MAX(CASE WHEN vp.last_purchase_at IS NOT NULL AND ve.created_at > vp.last_purchase_at AND ve.event_type = ? THEN 1 ELSE 0 END) as post_cart", [VisitorEvent::TYPE_ADD_TO_CART])
            ->selectRaw("MAX(CASE WHEN vp.last_purchase_at IS NOT NULL AND ve.created_at > vp.last_purchase_at AND ve.event_type = ? THEN 1 ELSE 0 END) as post_checkout", [VisitorEvent::TYPE_CHECKOUT_START])
            ->selectRaw("(
                SELECT ve2.meta->>'product_name'
                FROM visitor_events as ve2
                WHERE ve2.visitor_id = ve.visitor_id
                AND ve2.event_type = ?
                ORDER BY ve2.created_at DESC
                LIMIT 1
            ) as cart_product_name", [VisitorEvent::TYPE_ADD_TO_CART])
            ->selectRaw("(
                SELECT COALESCE(
                    c_prod.name,
                    c_slug.name,
                    ve_cat.meta->>'category_name',
                    ve_cat.meta->>'category',
                    NULLIF(ve_cat.product_type, '')
                )
                FROM visitor_events as ve_cat
                LEFT JOIN products p ON (
                    p.id = ve_cat.product_id
                    OR (ve_cat.product_id IS NULL AND (ve_cat.meta->>'product_name') IS NOT NULL AND p.name = ve_cat.meta->>'product_name')
                )
                LEFT JOIN categories c_prod ON c_prod.id = p.category_id
                LEFT JOIN categories c_slug ON (
                    ve_cat.url LIKE '%/' || c_slug.slug
                    OR ve_cat.url LIKE '%/' || c_slug.slug || '/%'
                    OR ve_cat.url LIKE '%category=' || c_slug.slug || '%'
                )
                WHERE ve_cat.visitor_id = ve.visitor_id
                  AND (
                      c_prod.name IS NOT NULL
                      OR c_slug.name IS NOT NULL
                      OR (ve_cat.meta->>'category_name') IS NOT NULL
                      OR (ve_cat.meta->>'category') IS NOT NULL
                      OR (ve_cat.product_type IS NOT NULL AND ve_cat.product_type != '')
                  )
                ORDER BY ve_cat.created_at DESC
                LIMIT 1
            ) as category_name")
            ->selectRaw("MAX(CASE
                WHEN ve.referrer ILIKE '%facebook%' THEN 'Facebook'
                WHEN ve.referrer ILIKE '%instagram%' THEN 'Instagram'
                WHEN ve.referrer ILIKE '%google%' THEN 'Google'
                WHEN ve.referrer IS NULL OR ve.referrer = '' THEN 'Direct'
                ELSE 'Autre'
            END) as source")
            ->whereBetween('ve.created_at', [$start, $end]);

        if ($hideDirect) {
            $visitorsQuery->whereIn('ve.visitor_id', $nonDirectVisitors);
        }

        $visitorsQuery->groupBy('ve.visitor_id');

        // 🔥 Filtre par Statut / Action (prend en compte la nouvelle session si ré-entré)
        if ($status && $status !== 'all') {
            $postActivityCheck = "MAX(CASE WHEN vp.last_purchase_at IS NOT NULL AND ve.created_at > vp.last_purchase_at THEN 1 ELSE 0 END)";

            $statusCase = "CASE
                WHEN {$postActivityCheck} = 1 THEN
                    CASE
                        WHEN MAX(CASE WHEN vp.last_purchase_at IS NOT NULL AND ve.created_at > vp.last_purchase_at AND ve.event_type = '" . VisitorEvent::TYPE_CHECKOUT_START . "' THEN 1 ELSE 0 END) = 1 THEN 'checkout'
                        WHEN MAX(CASE WHEN vp.last_purchase_at IS NOT NULL AND ve.created_at > vp.last_purchase_at AND ve.event_type = '" . VisitorEvent::TYPE_ADD_TO_CART . "' THEN 1 ELSE 0 END) = 1 THEN 'cart'
                        WHEN MAX(CASE WHEN vp.last_purchase_at IS NOT NULL AND ve.created_at > vp.last_purchase_at AND ve.event_type = '" . VisitorEvent::TYPE_PRODUCT_VIEW . "' THEN 1 ELSE 0 END) = 1 THEN 'product_view'
                        WHEN MAX(CASE WHEN vp.last_purchase_at IS NOT NULL AND ve.created_at > vp.last_purchase_at AND ve.event_type = '" . VisitorEvent::TYPE_PAGE_VIEW . "' THEN 1 ELSE 0 END) = 1 THEN 'page_view'
                        ELSE 'bounce'
                    END
                ELSE
                    CASE
                        WHEN MAX(CASE WHEN ve.event_type = '" . VisitorEvent::TYPE_PURCHASE . "' THEN 1 ELSE 0 END) = 1 THEN 'purchase'
                        WHEN MAX(CASE WHEN ve.event_type = '" . VisitorEvent::TYPE_CHECKOUT_START . "' THEN 1 ELSE 0 END) = 1 THEN 'checkout'
                        WHEN MAX(CASE WHEN ve.event_type = '" . VisitorEvent::TYPE_ADD_TO_CART . "' THEN 1 ELSE 0 END) = 1 THEN 'cart'
                        WHEN MAX(CASE WHEN ve.event_type = '" . VisitorEvent::TYPE_PRODUCT_VIEW . "' THEN 1 ELSE 0 END) = 1 THEN 'product_view'
                        WHEN MAX(CASE WHEN ve.event_type = '" . VisitorEvent::TYPE_PAGE_VIEW . "' THEN 1 ELSE 0 END) = 1 THEN 'page_view'
                        ELSE 'bounce'
                    END
            END";
            $visitorsQuery->havingRaw("{$statusCase} = ?", [$status]);
        }

        $visitors = $visitorsQuery
            ->orderByDesc('last_seen')
            ->orderByDesc('ve.visitor_id')
            ->cursorPaginate($perPage);

        // Transform results: if customer re-entered after purchasing, reinitialize pipeline to current visit
        $visitors->through(function ($visitor) {
            $hasPurchasedBefore = ((int) $visitor->total_purchases) > 0;
            $isReentered = $hasPurchasedBefore && ((int) $visitor->has_post_activity) === 1;

            $visitor->is_client = $hasPurchasedBefore;
            $visitor->is_reentered = $isReentered;

            if ($isReentered) {
                $visitor->has_page_view = (int) $visitor->post_page_view;
                $visitor->has_product_view = (int) $visitor->post_product_view;
                $visitor->has_cart = (int) $visitor->post_cart;
                $visitor->has_checkout = (int) $visitor->post_checkout;
                $visitor->has_purchase = 0; // reinitialised for current session
                if (!$visitor->has_cart) {
                    $visitor->cart_product_name = null;
                }
            } else {
                $visitor->has_page_view = (int) $visitor->has_page_view_raw;
                $visitor->has_product_view = (int) $visitor->has_product_view_raw;
                $visitor->has_cart = (int) $visitor->has_cart_raw;
                $visitor->has_checkout = (int) $visitor->has_checkout_raw;
                $visitor->has_purchase = (int) $visitor->has_purchase_raw;
            }

            return $visitor;
        });

        // ── 3. Chart data ──
        $dailyQuery = VisitorEvent::query()->whereBetween('created_at', [$start, $end]);
        if ($hideDirect) {
            $dailyQuery->whereIn('visitor_id', $nonDirectVisitors);
        }

        $dailyRaw = $dailyQuery
            ->selectRaw('DATE(created_at) as date')
            ->selectRaw("COUNT(DISTINCT CASE WHEN event_type = ? THEN visitor_id END) as page_views", [VisitorEvent::TYPE_PAGE_VIEW])
            ->selectRaw("COUNT(DISTINCT CASE WHEN event_type = ? THEN visitor_id END) as product_views", [VisitorEvent::TYPE_PRODUCT_VIEW])
            ->selectRaw("COUNT(DISTINCT CASE WHEN event_type = ? THEN visitor_id END) as add_to_cart", [VisitorEvent::TYPE_ADD_TO_CART])
            ->selectRaw("COUNT(DISTINCT CASE WHEN event_type = ? THEN visitor_id END) as checkout", [VisitorEvent::TYPE_CHECKOUT_START])
            ->selectRaw("COUNT(CASE WHEN event_type = ? THEN 1 END) as purchase", [VisitorEvent::TYPE_PURCHASE])
            ->groupByRaw('DATE(created_at)')
            ->orderBy('date')
            ->get()
            ->keyBy(function ($item) {
                return Carbon::parse($item->date)->format('Y-m-d');
            });

        $daily = [];
        $period = Carbon::parse($start)->daysUntil($end);
        foreach ($period as $date) {
            $dateKey = $date->format('Y-m-d');
            $entry = $dailyRaw->get($dateKey);
            $daily[] = [
                'date'          => $dateKey,
                'page_views'    => (int) ($entry->page_views ?? 0),
                'product_views' => (int) ($entry->product_views ?? 0),
                'add_to_cart'   => (int) ($entry->add_to_cart ?? 0),
                'checkout'      => (int) ($entry->checkout ?? 0),
                'purchase'      => (int) ($entry->purchase ?? 0),
            ];
        }

        // ── Mini list ──
        $recentVisitors = VisitorEvent::query()
            ->selectRaw('visitor_id, MAX(created_at) as last_seen')
            ->selectRaw("MAX(CASE WHEN event_type = ? THEN 1 ELSE 0 END) as has_purchase", [VisitorEvent::TYPE_PURCHASE])
            ->whereBetween('created_at', [now()->subHours(24), now()])
            ->groupBy('visitor_id')
            ->orderByDesc('last_seen')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Stats', [
            'funnel'         => $funnel,
            'visitors'       => $visitors,
            'daily'          => $daily,
            'range'          => $range,
            'start'          => $start->format('Y-m-d'),
            'end'            => $end->format('Y-m-d'),
            'recentVisitors' => $recentVisitors,
            'filters'        => [
                'per_page'    => $perPage,
                'hide_direct' => $hideDirect,
                'status'      => $status,
            ],
        ]);
    }

    private function dateRange(string $range): array
    {
        return match ($range) {
            'today' => [now()->startOfDay(), now()->endOfDay()],
            '7d'    => [now()->subDays(6)->startOfDay(), now()->endOfDay()],
            '30d'   => [now()->subDays(29)->startOfDay(), now()->endOfDay()],
            'month' => [now()->startOfMonth(), now()->endOfMonth()],
            default => [now()->subDays(29)->startOfDay(), now()->endOfDay()],
        };
    }

    public function visitorJourney(string $visitorId): \Illuminate\Http\JsonResponse
    {
        $events = VisitorEvent::where('visitor_id', $visitorId)
            ->orderBy('created_at', 'asc')
            ->get(['event_type', 'url', 'referrer', 'meta', 'created_at', 'product_type']);

        $journey = $events->map(function ($event) {
            return [
                'step' => $this->resolvePageName($event->url, $event->event_type, $event->meta, $event->product_type),
                'url' => $event->url,
                'event_type' => $event->event_type,
                'time' => $event->created_at->format('H:i:s'),
                'date' => $event->created_at->format('d/m/Y'),
                'referrer' => $this->resolveReferrerName($event->referrer),
                'meta' => $event->meta,
            ];
        });

        return response()->json([
            'visitor_id' => $visitorId,
            'total_steps' => $journey->count(),
            'duration_minutes' => $events->count() > 1
                ? round($events->last()->created_at->diffInMinutes($events->first()->created_at), 1)
                : 0,
            'journey' => $journey,
        ]);
    }

    private function resolvePageName(string $url, string $eventType, ?array $meta, ?string $productType): string
    {
        $path = parse_url($url, PHP_URL_PATH) ?? '/';
        $path = rtrim($path, '/') ?: '/';

        if ($eventType === VisitorEvent::TYPE_ADD_TO_CART) {
            $productName = $meta['product_name'] ?? null;
            return $productName ? "🛒 Ajout panier : {$productName}" : '🛒 Ajout au panier';
        }
        if ($eventType === VisitorEvent::TYPE_CHECKOUT_START) {
            return '💳 Début du paiement';
        }
        if ($eventType === VisitorEvent::TYPE_PURCHASE) {
            $orderId = $meta['order_id'] ?? null;
            return $orderId ? "✅ Commande #{$orderId}" : '✅ Achat confirmé';
        }

        return match ($path) {
            '/' => '🏠 Accueil',
            '/shop' => '🏪 Boutique',
            '/cart' => '🛒 Panier',
            '/checkout' => '💳 Checkout',
            '/about' => 'ℹ️ À propos',
            '/contact' => '📧 Contact',
            '/profile' => '👤 Profil',
            '/login' => '🔑 Connexion',
            '/register' => '📝 Inscription',
            default => $this->resolveDynamicPage($path, $eventType, $meta, $productType),
        };
    }

    private function resolveDynamicPage(string $path, string $eventType, ?array $meta, ?string $productType): string
    {
        if (str_starts_with($path, '/shop/') || str_starts_with($path, '/product/')) {
            $slug = basename($path);
            $productName = $meta['product_name'] ?? null;
            return $productName ? "👁️ Produit : {$productName}" : "👁️ Produit : {$slug}";
        }

        if (str_starts_with($path, '/category/')) {
            $slug = basename($path);
            return "📂 Catégorie : {$slug}";
        }

        if (str_starts_with($path, '/admin')) return '🔐 Admin';
        if (str_starts_with($path, '/dashboard')) return '📊 Dashboard';

        return $path;
    }

    private function resolveReferrerName(?string $referrer): ?string
    {
        if (!$referrer) return null;
        $ref = strtolower($referrer);
        if (str_contains($ref, 'facebook')) return 'Facebook';
        if (str_contains($ref, 'instagram')) return 'Instagram';
        if (str_contains($ref, 'google')) return 'Google';
        if (str_contains($ref, 'vellure')) return 'Site Vellure';
        return 'Externe';
    }
}