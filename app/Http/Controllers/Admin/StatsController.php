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

        $hideDirect = $request->boolean('hide_direct', false);

        // ── Funnel stats ──
        $counts = VisitorEvent::query()
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw('event_type, COUNT(DISTINCT visitor_id) as visitors')
            ->groupBy('event_type')
            ->pluck('visitors', 'event_type');

        $funnel = [
            'arrives'  => (int) ($counts[VisitorEvent::TYPE_PAGE_VIEW] ?? 0),
            'vus'      => (int) ($counts[VisitorEvent::TYPE_PRODUCT_VIEW] ?? 0),
            'panier'   => (int) ($counts[VisitorEvent::TYPE_ADD_TO_CART] ?? 0),
            'checkout' => (int) ($counts[VisitorEvent::TYPE_CHECKOUT_START] ?? 0),
            'achats'   => (int) ($counts[VisitorEvent::TYPE_PURCHASE] ?? 0),
        ];

        // ── Visitors paginés ──
        $perPage = (int) $request->get('per_page', 25);
        $perPage = min(max($perPage, 10), 100);

        $visitorsQuery = DB::table('visitor_events as ve')
            ->select('ve.visitor_id')
            ->selectRaw('MAX(ve.created_at) as last_seen')
            ->selectRaw('MAX(ve.platform) as platform')
            ->selectRaw("MAX(CASE WHEN ve.event_type = ? THEN 1 ELSE 0 END) as has_page_view", [VisitorEvent::TYPE_PAGE_VIEW])
            ->selectRaw("MAX(CASE WHEN ve.event_type = ? THEN 1 ELSE 0 END) as has_product_view", [VisitorEvent::TYPE_PRODUCT_VIEW])
            ->selectRaw("MAX(CASE WHEN ve.event_type = ? THEN 1 ELSE 0 END) as has_cart", [VisitorEvent::TYPE_ADD_TO_CART])
            ->selectRaw("MAX(CASE WHEN ve.event_type = ? THEN 1 ELSE 0 END) as has_checkout", [VisitorEvent::TYPE_CHECKOUT_START])
            ->selectRaw("MAX(CASE WHEN ve.event_type = ? THEN 1 ELSE 0 END) as has_purchase", [VisitorEvent::TYPE_PURCHASE])
            ->selectRaw("(
                SELECT ve2.meta->>'product_name'
                FROM visitor_events as ve2
                WHERE ve2.visitor_id = ve.visitor_id
                AND ve2.event_type = ?
                ORDER BY ve2.created_at DESC
                LIMIT 1
            ) as cart_product_name", [VisitorEvent::TYPE_ADD_TO_CART])
            // ── Résolution de la catégorie (Produit -> Catégorie, Meta CAPI, ou URL) ──
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
            ->whereBetween('ve.created_at', [$start, $end])
            ->groupBy('ve.visitor_id')
            ->orderByDesc('last_seen')
            ->orderByDesc('ve.visitor_id');

        // Filtre pour cacher les visites Direct
        if ($hideDirect) {
            $visitorsQuery->havingRaw("MAX(CASE
                WHEN ve.referrer ILIKE '%facebook%' THEN 'Facebook'
                WHEN ve.referrer ILIKE '%instagram%' THEN 'Instagram'
                WHEN ve.referrer ILIKE '%google%' THEN 'Google'
                WHEN ve.referrer IS NULL OR ve.referrer = '' THEN 'Direct'
                ELSE 'Autre'
            END) != 'Direct'");
        }

        $visitors = $visitorsQuery->cursorPaginate($perPage);

        // ── Chart data (Performance du Tunnel: 5 courbes sur toute la période) ──
        $dailyRaw = VisitorEvent::query()
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw('DATE(created_at) as date')
            ->selectRaw("COUNT(DISTINCT CASE WHEN event_type = ? THEN visitor_id END) as page_views", [VisitorEvent::TYPE_PAGE_VIEW])
            ->selectRaw("COUNT(DISTINCT CASE WHEN event_type = ? THEN visitor_id END) as product_views", [VisitorEvent::TYPE_PRODUCT_VIEW])
            ->selectRaw("COUNT(DISTINCT CASE WHEN event_type = ? THEN visitor_id END) as add_to_cart", [VisitorEvent::TYPE_ADD_TO_CART])
            ->selectRaw("COUNT(DISTINCT CASE WHEN event_type = ? THEN visitor_id END) as checkout", [VisitorEvent::TYPE_CHECKOUT_START])
            ->selectRaw("COUNT(DISTINCT CASE WHEN event_type = ? THEN visitor_id END) as purchase", [VisitorEvent::TYPE_PURCHASE])
            ->groupByRaw('DATE(created_at)')
            ->orderBy('date')
            ->get()
            ->keyBy(function ($item) {
                return Carbon::parse($item->date)->format('Y-m-d');
            });

        // Remplir tous les jours de la période pour assurer des courbes fluides et continues
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
            'funnel' => $funnel,
            'visitors' => $visitors,
            'daily' => $daily,
            'range' => $range,
            'start' => $start->format('Y-m-d'),
            'end' => $end->format('Y-m-d'),
            'recentVisitors' => $recentVisitors,
            'filters' => [
                'per_page' => $perPage,
                'hide_direct' => $hideDirect,
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