<?php

namespace App\Filament\Pages;

use Filament\Pages\Dashboard;
use App\Models\Order;
use App\Models\Product;

class Dashboard1 extends Dashboard
{
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-home';
    protected static ?string $navigationLabel = 'Dashboard';
    protected static ?int $navigationSort = -2;
    protected static ?string $title = 'Dashboard';

    // ✅ This is the missing piece
    protected string $view = 'filament.pages.dashboard1';

    public function getViewData(): array
    {
        $orders = Order::all();

        return [
            'totalOrders'     => $orders->count(),
            'totalRevenue'    => $orders->whereIn('status', ['delivered', 'shipped'])->sum('total_price'),
            'pendingOrders'   => $orders->where('status', 'pending')->count(),
            'confirmedOrders' => $orders->where('status', 'confirmed')->count(),
           
            'deliveredOrders' => $orders->where('status', 'delivered')->count(),
            'cancelledOrders' => $orders->where('status', 'cancelled')->count(),
            'totalProducts'   => Product::count(),
            'recentOrders'    => Order::with('items')->latest()->take(5)->get(),
        ];
    }
}