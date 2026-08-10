<?php
// app/Http/Controllers/Admin/StatsController.php

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

        $visitors = $visitorsQuery->cursorPaginate($perPage);

        // ── Chart data ──
        $daily = VisitorEvent::query()
            ->whereBetween('created_at', [$start, $end])
            ->where('event_type', VisitorEvent::TYPE_PAGE_VIEW)
            ->selectRaw('DATE(created_at) as date, COUNT(DISTINCT visitor_id) as visitors')
            ->groupByRaw('DATE(created_at)')
            ->orderBy('date')
            ->get();

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
            'filters' => ['per_page' => $perPage],
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
}