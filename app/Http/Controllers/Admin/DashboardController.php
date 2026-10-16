<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $now = Carbon::now();
        $orders = Order::all();

        // ── Periods ──
        $last30Days = CarbonPeriod::create($now->copy()->subDays(29), '1 day', $now);
        $last14Days = CarbonPeriod::create($now->copy()->subDays(13), '1 day', $now);
        $last7Days  = CarbonPeriod::create($now->copy()->subDays(6), '1 day', $now);

        // ── 1. Daily Orders & Revenue (30 days) ──
        $dailyOrdersLabels = [];
        $dailyOrdersData = [];
        $dailyRevenueData = [];

        foreach ($last30Days as $date) {
            $d = $date->format('Y-m-d');
            $dailyOrdersLabels[] = $date->format('d/m');
            $dayOrders = $orders->whereBetween('created_at', [$date->copy()->startOfDay(), $date->copy()->endOfDay()]);
            $dailyOrdersData[] = $dayOrders->count();
            $dailyRevenueData[] = round((float) $dayOrders->sum('total_price'), 2);
        }

        // ── 2. Top 10 Products ──
        $topProducts = OrderItem::selectRaw('product_id, SUM(quantity) as total_qty, SUM(quantity * product_price) as total_revenue')
            ->groupBy('product_id')
            ->orderByDesc('total_qty')
            ->take(10)
            ->with('product:id,name')
            ->get()
            ->map(fn($item) => [
                'name'    => $item->product?->name ?? 'Produit #' . $item->product_id,
                'qty'     => (int) $item->total_qty,
                'revenue' => round((float) $item->total_revenue, 2),
            ]);

        // ── 3. Hourly Distribution (Last 7 days) ──
        $hourlyDistribution = array_fill(0, 24, 0);
        $recentForHourly = $orders->where('created_at', '>=', $now->copy()->subDays(7));
        foreach ($recentForHourly as $order) {
            $hour = (int) $order->created_at->format('G');
            $hourlyDistribution[$hour]++;
        }

        // ── 4. Status Flow (Last 14 days) ──
        $statusFlowLabels = [];
        $statusFlowData = [];
        foreach ($last14Days as $date) {
            $statusFlowLabels[] = $date->format('d/m');
            $day = $orders->whereBetween('created_at', [$date->copy()->startOfDay(), $date->copy()->endOfDay()]);
            $statusFlowData[] = [
                'pending'   => $day->where('status', 'pending')->count(),
                'confirmed' => $day->where('status', 'confirmed')->count(),
                'shipped'   => $day->where('status', 'shipped')->count(),
                'delivered' => $day->where('status', 'delivered')->count(),
                'cancelled' => $day->where('status', 'cancelled')->count(),
            ];
        }

        // ── 5. Average Order Value (7 days) ──
        $avgOrderValueLabels = [];
        $avgOrderValueData = [];
        foreach ($last7Days as $date) {
            $avgOrderValueLabels[] = $date->format('d/m');
            $dayOrders = $orders->whereBetween('created_at', [$date->copy()->startOfDay(), $date->copy()->endOfDay()]);
            $avgOrderValueData[] = $dayOrders->count() > 0 ? round((float) $dayOrders->avg('total_price'), 2) : 0;
        }

        // ── 6. Top Cities ──
        $totalOrdersCount = max($orders->count(), 1);
        $topCities = $orders->filter(fn($o) => !empty($o->customer_city))
            ->groupBy('customer_city')
            ->map(function ($group) use ($totalOrdersCount) {
                $count = $group->count();
                return [
                    'city'       => $group->first()->customer_city,
                    'count'      => $count,
                    'revenue'    => round((float) $group->sum('total_price'), 2),
                    'percentage' => round(($count / $totalOrdersCount) * 100, 1),
                ];
            })
            ->sortByDesc('count')
            ->take(5)
            ->values();

        // ── 7. Insights ──
        $peakDayIndex = array_search(max($dailyOrdersData ?: [0]), $dailyOrdersData);
        $peakDay = $dailyOrdersLabels[$peakDayIndex] ?? '-';
        $peakDayOrders = max($dailyOrdersData ?: [0]);

        $todayOrders = $orders->whereBetween('created_at', [$now->copy()->startOfDay(), $now->copy()->endOfDay()])->count();
        $yesterdayOrders = $orders->whereBetween('created_at', [$now->copy()->subDay()->startOfDay(), $now->copy()->subDay()->endOfDay()])->count();
        $growthRate = $yesterdayOrders > 0
            ? round((($todayOrders - $yesterdayOrders) / $yesterdayOrders) * 100, 1)
            : ($todayOrders > 0 ? 100 : 0);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalOrders'     => $orders->count(),
                'totalRevenue'    => (float) $orders->whereIn('status', ['delivered', 'shipped'])->sum('total_price'),
                'pendingOrders'   => $orders->where('status', 'pending')->count(),
                'confirmedOrders' => $orders->where('status', 'confirmed')->count(),
                'deliveredOrders' => $orders->where('status', 'delivered')->count(),
                'cancelledOrders' => $orders->where('status', 'cancelled')->count(),
                'totalProducts'   => Product::count(),
            ],
            'insights' => [
                'growthRate'    => $growthRate,
                'peakDay'       => $peakDay,
                'peakDayOrders' => $peakDayOrders,
                'todayOrders'   => $todayOrders,
            ],
            'charts' => [
                'dailyLabels'         => $dailyOrdersLabels,
                'dailyOrders'         => $dailyOrdersData,
                'dailyRevenue'        => $dailyRevenueData,
                'hourlyDistribution'  => $hourlyDistribution,
                'statusFlowLabels'    => $statusFlowLabels,
                'statusFlow'          => $statusFlowData,
                'avgOrderValueLabels' => $avgOrderValueLabels,
                'avgOrderValue'       => $avgOrderValueData,
                'topProducts'         => $topProducts,
                'topCities'           => $topCities,
            ],
        ]);
    }
}