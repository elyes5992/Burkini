<?php

namespace App\Filament\Pages;

use Filament\Pages\Dashboard;
use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;
use Carbon\CarbonPeriod;


class Dashboard1 extends Dashboard
{
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-home';
    protected static ?string $navigationLabel = 'Dashboard';
    protected static ?int $navigationSort = -2;
    protected static ?string $title = 'Dashboard';

    protected string $view = 'filament.pages.dashboard1';

    public function getViewData(): array
    {
        $orders = Order::all();
        $now = Carbon::now();

        // ── Time-based order data ──
        $last30Days = CarbonPeriod::create($now->copy()->subDays(29), '1 day', $now);
        $last12Months = CarbonPeriod::create($now->copy()->subMonths(11), '1 month', $now);
        $last7Days = CarbonPeriod::create($now->copy()->subDays(6), '1 day', $now);

        // Daily orders (last 30 days)
        $dailyOrders = [];
        $dailyRevenue = [];
        foreach ($last30Days as $date) {
            $d = $date->format('Y-m-d');
            $dailyOrders[$d] = $orders->whereBetween('created_at', [$date->copy()->startOfDay(), $date->copy()->endOfDay()])->count();
            $dailyRevenue[$d] = $orders->whereBetween('created_at', [$date->copy()->startOfDay(), $date->copy()->endOfDay()])->sum('total_price');
        }

        // Top 10 products sold
$topProducts = \App\Models\OrderItem::selectRaw('product_id, SUM(quantity) as total_qty, SUM(quantity * product_price) as total_revenue')
    ->groupBy('product_id')
    ->orderByDesc('total_qty')
    ->take(10)
    ->with('product:id,name')
    ->get()
    ->map(fn($item) => [
        'name'    => $item->product?->name ?? 'Produit #'.$item->product_id,
        'qty'     => (int) $item->total_qty,
        'revenue' => round($item->total_revenue, 2),
    ]);

        // Hourly heatmap data (orders by hour of day, last 7 days)
        $hourlyDistribution = array_fill(0, 24, 0);
        $recentForHourly = $orders->where('created_at', '>=', $now->copy()->subDays(7));
        foreach ($recentForHourly as $order) {
            $hour = (int) $order->created_at->format('G');
            $hourlyDistribution[$hour]++;
        }

        // Weekly pattern (orders by day of week)
        $weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        $weeklyPattern = array_fill(0, 7, 0);
        foreach ($orders as $order) {
            $weeklyPattern[$order->created_at->dayOfWeek]++;
        }

        // Status flow (cumulative over last 14 days)
        $statusFlow = [];
        $flowPeriod = CarbonPeriod::create($now->copy()->subDays(13), '1 day', $now);
        foreach ($flowPeriod as $date) {
            $d = $date->format('Y-m-d');
            $statusFlow[$d] = [
                'pending' => $orders->where('status', 'pending')->whereBetween('created_at', [$date->copy()->startOfDay(), $date->copy()->endOfDay()])->count(),
                'confirmed' => $orders->where('status', 'confirmed')->whereBetween('created_at', [$date->copy()->startOfDay(), $date->copy()->endOfDay()])->count(),
                'shipped' => $orders->where('status', 'shipped')->whereBetween('created_at', [$date->copy()->startOfDay(), $date->copy()->endOfDay()])->count(),
                'delivered' => $orders->where('status', 'delivered')->whereBetween('created_at', [$date->copy()->startOfDay(), $date->copy()->endOfDay()])->count(),
                'cancelled' => $orders->where('status', 'cancelled')->whereBetween('created_at', [$date->copy()->startOfDay(), $date->copy()->endOfDay()])->count(),
            ];
        }

        // Conversion funnel (last 30 days)
        $recent30 = $orders->where('created_at', '>=', $now->copy()->subDays(30));
        $funnel = [
            'total' => $recent30->count(),
            'pending' => $recent30->where('status', 'pending')->count(),
            'processing' => $recent30->whereIn('status', ['confirmed', 'shipped'])->count(),
            'delivered' => $recent30->where('status', 'delivered')->count(),
            'cancelled' => $recent30->where('status', 'cancelled')->count(),
        ];

        // Top cities
        $topCities = $orders->groupBy('customer_city')
            ->map(fn($group) => ['city' => $group->first()->customer_city, 'count' => $group->count(), 'revenue' => $group->sum('total_price')])
            ->sortByDesc('count')
            ->take(5)
            ->values();

        // Avg order value trend (7-day rolling)
        $avgOrderValue = [];
        foreach ($last7Days as $date) {
            $d = $date->format('Y-m-d');
            $dayOrders = $orders->whereBetween('created_at', [$date->copy()->startOfDay(), $date->copy()->endOfDay()]);
            $avgOrderValue[$d] = $dayOrders->count() > 0 ? round($dayOrders->avg('total_price'), 2) : 0;
        }

        // Peak day insight
        $peakDay = collect($dailyOrders)->sortDesc()->keys()->first();
        $peakDayOrders = collect($dailyOrders)->max();

        // Growth rate (today vs yesterday)
        $todayOrders = $orders->whereBetween('created_at', [$now->copy()->startOfDay(), $now->copy()->endOfDay()])->count();
        $yesterdayOrders = $orders->whereBetween('created_at', [$now->copy()->subDay()->startOfDay(), $now->copy()->subDay()->endOfDay()])->count();
        $growthRate = $yesterdayOrders > 0 ? round((($todayOrders - $yesterdayOrders) / $yesterdayOrders) * 100, 1) : ($todayOrders > 0 ? 100 : 0);

        return [
            // Stats cards
            'totalOrders'     => $orders->count(),
            'totalRevenue'    => $orders->whereIn('status', ['delivered', 'shipped'])->sum('total_price'),
            'pendingOrders'   => $orders->where('status', 'pending')->count(),
            'confirmedOrders' => $orders->where('status', 'confirmed')->count(),
            'deliveredOrders' => $orders->where('status', 'delivered')->count(),
            'cancelledOrders' => $orders->where('status', 'cancelled')->count(),
            'totalProducts'   => Product::count(),

            'topProducts' => $topProducts,

            // Chart data
            'dailyOrdersLabels' => collect($last30Days)->map(function (Carbon $d) {
                return $d->format('d/m');
            })->values(),
            'dailyOrdersData' => array_values($dailyOrders),
            'dailyRevenueData' => array_values($dailyRevenue),
            'hourlyDistribution' => $hourlyDistribution,
            'weeklyPatternLabels' => $weekDays,
            'weeklyPatternData' => $weeklyPattern,
            'statusFlowLabels' => collect($flowPeriod)->map(function (Carbon $d) {
                return $d->format('d/m');
            })->values(),
            'statusFlowData' => $statusFlow,
            'funnelData' => $funnel,
            'topCities' => $topCities,
            

            'avgOrderValueLabels' => collect($last7Days)->map(function (Carbon $d) {
                return $d->format('d/m');
            })->values(),
            
            'avgOrderValueData' => array_values($avgOrderValue),

            // Insights
            'peakDay' => $peakDay ? Carbon::parse($peakDay)->format('d/m/Y') : '-',
            'peakDayOrders' => $peakDayOrders,
            'growthRate' => $growthRate,
            'todayOrders' => $todayOrders,
        ];
    }
}
