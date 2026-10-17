import { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Activity } from 'lucide-react';

const SERIES = {
    product_views: {
        key: 'product_views',
        label: 'Vues produit',
        color: '#a855f7', // Violet
    },
    add_to_cart: {
        key: 'add_to_cart',
        label: 'Ajouts panier',
        color: '#f59e0b', // Ambre
    },
    checkout: {
        key: 'checkout',
        label: 'Checkout',
        color: '#ec4899', // Rose
    },
    purchase: {
        key: 'purchase',
        label: 'Achats',
        color: '#10b981', // Vert
    },
    page_views: {
        key: 'page_views',
        label: 'Trafic',
        color: '#3b82f6', // Bleu
    },
};

// Strict order inside the tooltip: Vues produit first!
const TOOLTIP_ORDER = ['product_views', 'add_to_cart', 'checkout', 'purchase', 'page_views'];

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null;

    // Sort items so 'Vues produit' is always at the top
    const sortedPayload = [...payload].sort((a, b) => {
        const indexA = TOOLTIP_ORDER.indexOf(a.dataKey);
        const indexB = TOOLTIP_ORDER.indexOf(b.dataKey);
        return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    });

    return (
        <div className="bg-[#0b1120]/95 border border-[#1e293b] rounded-xl p-3 shadow-2xl min-w-[155px] backdrop-blur-md">
            <p className="text-gray-300 font-bold text-xs mb-2 pb-1 border-b border-gray-800/80">
                {label}
            </p>
            <div className="space-y-1.5">
                {sortedPayload.map((item) => {
                    const config = SERIES[item.dataKey];
                    if (!config) return null;
                    return (
                        <div
                            key={item.dataKey}
                            className="flex items-center justify-between gap-3 text-xs"
                            style={{ color: config.color }}
                        >
                            <span className="font-medium">{config.label} :</span>
                            <span className="font-bold font-mono">{item.value}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function TrafficChart({ daily = [] }) {
    const [viewMode, setViewMode] = useState('tunnel');

    const [visibleSeries, setVisibleSeries] = useState({
        product_views: true,
        add_to_cart: true,
        checkout: true,
        purchase: true,
        page_views: false,
    });

    const handleModeChange = (mode) => {
        setViewMode(mode);
        if (mode === 'tunnel') {
            setVisibleSeries({
                product_views: true,
                add_to_cart: true,
                checkout: true,
                purchase: true,
                page_views: false,
            });
        } else if (mode === 'trafic') {
            setVisibleSeries({
                product_views: false,
                add_to_cart: false,
                checkout: false,
                purchase: false,
                page_views: true,
            });
        } else if (mode === 'tout') {
            setVisibleSeries({
                product_views: true,
                add_to_cart: true,
                checkout: true,
                purchase: true,
                page_views: true,
            });
        }
    };

    const toggleSingleSeries = (key) => {
        setVisibleSeries((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const formattedData = daily.map((d) => ({
        ...d,
        displayDate: new Date(d.date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
        }),
    }));

    return (
        <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2.5">
                    <Activity className="w-5 h-5 text-purple-400" />
                    <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">
                        Performance du tunnel
                    </h3>
                </div>

                {/* Right controls */}
                <div className="flex flex-wrap items-center gap-4">
                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-3">
                        {Object.values(SERIES).map((s) => {
                            if (viewMode === 'tunnel' && s.key === 'page_views' && !visibleSeries.page_views) {
                                return null;
                            }

                            const isActive = visibleSeries[s.key];
                            return (
                                <button
                                    key={s.key}
                                    type="button"
                                    onClick={() => toggleSingleSeries(s.key)}
                                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md transition ${
                                        isActive
                                            ? 'text-gray-200 hover:bg-gray-800'
                                            : 'text-gray-600 line-through opacity-50 hover:opacity-80'
                                    }`}
                                >
                                    <span
                                        className="w-2.5 h-2.5 rounded-full"
                                        style={{ backgroundColor: s.color }}
                                    />
                                    <span>{s.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Mode Buttons */}
                    <div className="flex items-center bg-gray-950/70 border border-gray-800 rounded-xl p-1">
                        <button
                            type="button"
                            onClick={() => handleModeChange('tunnel')}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                                viewMode === 'tunnel'
                                    ? 'bg-purple-600 text-white shadow-sm'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            Tunnel
                        </button>
                        <button
                            type="button"
                            onClick={() => handleModeChange('trafic')}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                                viewMode === 'trafic'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            Trafic
                        </button>
                        <button
                            type="button"
                            onClick={() => handleModeChange('tout')}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                                viewMode === 'tout'
                                    ? 'bg-gray-800 text-white shadow-sm'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            Tout
                        </button>
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} opacity={0.6} />

                        <XAxis
                            dataKey="displayDate"
                            stroke="#4b5563"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#4b5563"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                        />

                        {/* Custom Tooltip with Vues produit guaranteed at top */}
                        <Tooltip content={<CustomTooltip />} />

                        {/* 1. Vues produit */}
                        {visibleSeries.product_views && (
                            <Line
                                type="monotone"
                                dataKey="product_views"
                                name="product_views"
                                stroke={SERIES.product_views.color}
                                strokeWidth={2.5}
                                dot={{ fill: SERIES.product_views.color, r: 2.5 }}
                                activeDot={{ r: 5, fill: SERIES.product_views.color }}
                            />
                        )}

                        {/* 2. Ajouts panier */}
                        {visibleSeries.add_to_cart && (
                            <Line
                                type="monotone"
                                dataKey="add_to_cart"
                                name="add_to_cart"
                                stroke={SERIES.add_to_cart.color}
                                strokeWidth={2.5}
                                dot={{ fill: SERIES.add_to_cart.color, r: 2.5 }}
                                activeDot={{ r: 5, fill: SERIES.add_to_cart.color }}
                            />
                        )}

                        {/* 3. Checkout */}
                        {visibleSeries.checkout && (
                            <Line
                                type="monotone"
                                dataKey="checkout"
                                name="checkout"
                                stroke={SERIES.checkout.color}
                                strokeWidth={2.5}
                                dot={{ fill: SERIES.checkout.color, r: 2.5 }}
                                activeDot={{ r: 5, fill: SERIES.checkout.color }}
                            />
                        )}

                        {/* 4. Achats */}
                        {visibleSeries.purchase && (
                            <Line
                                type="monotone"
                                dataKey="purchase"
                                name="purchase"
                                stroke={SERIES.purchase.color}
                                strokeWidth={2.5}
                                dot={{ fill: SERIES.purchase.color, r: 2.5 }}
                                activeDot={{ r: 5, fill: SERIES.purchase.color }}
                            />
                        )}

                        {/* 5. Trafic */}
                        {visibleSeries.page_views && (
                            <Line
                                type="monotone"
                                dataKey="page_views"
                                name="page_views"
                                stroke={SERIES.page_views.color}
                                strokeWidth={2.5}
                                dot={{ fill: SERIES.page_views.color, r: 2.5 }}
                                activeDot={{ r: 5, fill: SERIES.page_views.color }}
                            />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}