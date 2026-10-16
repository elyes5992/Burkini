import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { 
    TrendingUp, 
    Flame, 
    Package, 
    Clock, 
    Layers, 
    Coins, 
    ShoppingBag, 
    MapPin 
} from 'lucide-react';

export default function Dashboard({ stats, insights, charts }) {
    const [ordersChartMetric, setOrdersChartMetric] = useState('orders'); // 'orders' | 'revenue'
    const [topProductsMetric, setTopProductsMetric] = useState('qty'); // 'qty' | 'revenue'

    // Formatter helpers
    const fmtMoney = (v) => Number(v || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' DT';

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-adm-text">Dashboard</h1>
                    <p className="mt-1 text-sm text-adm-muted">Aperçu global des performances de la boutique Vellure.</p>
                </div>
            </div>

            {/* ── 1. Top 7 Metric KPI Cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-5">
                {/* Total Commandes */}
                <div className="bg-adm-panel border border-adm-line border-l-4 border-l-adm-line-2 rounded-xl p-4 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-adm-faint uppercase tracking-wider">Total Commandes</span>
                    <b className="text-2xl font-extrabold text-adm-text my-1">{stats.totalOrders}</b>
                    <span className="text-xs text-adm-muted">Toutes périodes</span>
                </div>

                {/* Chiffre d'affaires */}
                <div className="bg-adm-panel border border-adm-line border-l-4 border-l-adm-ok rounded-xl p-4 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-adm-faint uppercase tracking-wider">Chiffre d'affaires</span>
                    <b className="text-2xl font-extrabold text-adm-ok my-1">{fmtMoney(stats.totalRevenue)}</b>
                    <span className="text-xs text-adm-muted">Expédiées + Terminées</span>
                </div>

                {/* En attente */}
                <div className="bg-adm-panel border border-adm-line border-l-4 border-l-amber-500 rounded-xl p-4 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-adm-faint uppercase tracking-wider">En attente</span>
                    <b className="text-2xl font-extrabold text-amber-500 my-1">{stats.pendingOrders}</b>
                    <span className="text-xs text-adm-muted">À traiter</span>
                </div>

                {/* En cours */}
                <div className="bg-adm-panel border border-adm-line border-l-4 border-l-sky-400 rounded-xl p-4 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-adm-faint uppercase tracking-wider">En cours</span>
                    <b className="text-2xl font-extrabold text-sky-400 my-1">{stats.confirmedOrders}</b>
                    <span className="text-xs text-adm-muted">Confirmées</span>
                </div>

                {/* Terminées */}
                <div className="bg-adm-panel border border-adm-line border-l-4 border-l-emerald-500 rounded-xl p-4 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-adm-faint uppercase tracking-wider">Terminées</span>
                    <b className="text-2xl font-extrabold text-emerald-400 my-1">{stats.deliveredOrders}</b>
                    <span className="text-xs text-adm-muted">Livrées</span>
                </div>

                {/* Annulées */}
                <div className="bg-adm-panel border border-adm-line border-l-4 border-l-adm-bad rounded-xl p-4 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-adm-faint uppercase tracking-wider">Annulées</span>
                    <b className="text-2xl font-extrabold text-adm-bad my-1">{stats.cancelledOrders}</b>
                    <span className="text-xs text-adm-muted">Commandes annulées</span>
                </div>

                {/* Produits */}
                <div className="bg-adm-panel border border-adm-line border-l-4 border-l-indigo-500 rounded-xl p-4 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-adm-faint uppercase tracking-wider">Produits</span>
                    <b className="text-2xl font-extrabold text-adm-text my-1">{stats.totalProducts}</b>
                    <span className="text-xs text-adm-muted">Dans le catalogue</span>
                </div>
            </div>

            {/* ── 2. Insights Strip ── */}
            <div className="bg-adm-panel border border-adm-line rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-adm-line">
                <div className="flex items-center gap-3 flex-1 pt-1 sm:pt-0">
                    <div className="w-9 h-9 rounded-lg bg-adm-ok-soft text-adm-ok grid place-items-center flex-none">
                        <TrendingUp size={16} />
                    </div>
                    <div>
                        <span className="block text-xs text-adm-muted">Croissance aujourd'hui</span>
                        <b className="text-sm font-bold text-adm-ok">+{insights.growthRate}%</b>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-1 pt-3 sm:pt-0 sm:pl-6">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 grid place-items-center flex-none">
                        <Flame size={16} />
                    </div>
                    <div>
                        <span className="block text-xs text-adm-muted">Jour record</span>
                        <b className="text-sm font-bold text-amber-400">
                            {insights.peakDay} <span className="text-xs font-medium text-adm-faint">({insights.peakDayOrders} cmd)</span>
                        </b>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-1 pt-3 sm:pt-0 sm:pl-6">
                    <div className="w-9 h-9 rounded-lg bg-sky-400/10 text-sky-400 grid place-items-center flex-none">
                        <Package size={16} />
                    </div>
                    <div>
                        <span className="block text-xs text-adm-muted">Commandes aujourd'hui</span>
                        <b className="text-sm font-bold text-sky-400">{insights.todayOrders}</b>
                    </div>
                </div>
            </div>

            {/* ── 3. Charts Row 1: Evolution 30j + Heures de pointe ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 mb-5">
                {/* 30 Days Line Chart */}
                <div className="bg-adm-panel border border-adm-line rounded-2xl p-5 flex flex-col">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-adm-text">
                            <span className="w-2 h-2 rounded-full bg-sky-400" />
                            <span>Évolution des commandes (30 jours)</span>
                        </div>
                        <div className="flex gap-1 bg-adm-raise p-1 rounded-lg">
                            <button
                                type="button"
                                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                                    ordersChartMetric === 'orders'
                                        ? 'bg-adm-panel text-adm-text shadow-sm'
                                        : 'text-adm-muted hover:text-adm-text'
                                }`}
                                onClick={() => setOrdersChartMetric('orders')}
                            >
                                Commandes
                            </button>
                            <button
                                type="button"
                                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                                    ordersChartMetric === 'revenue'
                                        ? 'bg-adm-panel text-adm-text shadow-sm'
                                        : 'text-adm-muted hover:text-adm-text'
                                }`}
                                onClick={() => setOrdersChartMetric('revenue')}
                            >
                                Revenus (DT)
                            </button>
                        </div>
                    </div>

                    <div className="w-full h-[180px]">
                        <TrendLineChart 
                            labels={charts.dailyLabels}
                            data={ordersChartMetric === 'orders' ? charts.dailyOrders : charts.dailyRevenue}
                            color="#38bdf8"
                            isMoney={ordersChartMetric === 'revenue'}
                        />
                    </div>
                </div>

                {/* Peak Hours Histogram */}
                <div className="bg-adm-panel border border-adm-line rounded-2xl p-5 flex flex-col">
                    <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-adm-text">
                            <Clock size={16} className="text-adm-accent" />
                            <span>Heures de pointe (7j)</span>
                        </div>
                        <span className="text-xs text-adm-faint hidden sm:inline">Distribution horaire</span>
                    </div>

                    <div className="w-full h-[180px]">
                        <HourlyHistogram data={charts.hourlyDistribution} />
                    </div>
                </div>
            </div>

            {/* ── 4. Charts Row 2: Status Flow + Panier Moyen ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 mb-5">
                {/* Status Flow Grouped Bar */}
                <div className="bg-adm-panel border border-adm-line rounded-2xl p-5 flex flex-col">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-adm-text">
                            <Layers size={16} className="text-sky-400" />
                            <span>Flux des statuts (14 jours)</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-adm-muted">
                            <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-amber-500" /> En attente</span>
                            <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-sky-400" /> Confirmées</span>
                            <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-indigo-500" /> Expédiées</span>
                            <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-emerald-500" /> Livrées</span>
                            <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-red-500" /> Annulées</span>
                        </div>
                    </div>

                    <div className="w-full h-[180px]">
                        <StatusFlowChart labels={charts.statusFlowLabels} data={charts.statusFlow} />
                    </div>
                </div>

                {/* Average Basket 7 Days */}
                <div className="bg-adm-panel border border-adm-line rounded-2xl p-5 flex flex-col">
                    <div className="flex items-center gap-2 text-sm font-bold text-adm-text mb-4">
                        <Coins size={16} className="text-purple-400" />
                        <span>Panier moyen (7 jours)</span>
                    </div>

                    <div className="w-full h-[180px]">
                        <TrendLineChart 
                            labels={charts.avgOrderValueLabels}
                            data={charts.avgOrderValue}
                            color="#c084fc"
                            isMoney={true}
                        />
                    </div>
                </div>
            </div>

            {/* ── 5. Bottom Row: Top 10 Products + Top Villes ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 mb-5">
                {/* Top 10 Products */}
                <div className="bg-adm-panel border border-adm-line rounded-2xl p-5 flex flex-col">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-adm-text">
                            <ShoppingBag size={16} className="text-adm-accent" />
                            <span>Top 10 Produits vendus</span>
                        </div>
                        <div className="flex gap-1 bg-adm-raise p-1 rounded-lg">
                            <button
                                type="button"
                                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                                    topProductsMetric === 'qty'
                                        ? 'bg-adm-panel text-adm-text shadow-sm'
                                        : 'text-adm-muted hover:text-adm-text'
                                }`}
                                onClick={() => setTopProductsMetric('qty')}
                            >
                                Quantité vendue
                            </button>
                            <button
                                type="button"
                                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                                    topProductsMetric === 'revenue'
                                        ? 'bg-adm-panel text-adm-text shadow-sm'
                                        : 'text-adm-muted hover:text-adm-text'
                                }`}
                                onClick={() => setTopProductsMetric('revenue')}
                            >
                                Revenus (DT)
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                        {charts.topProducts.length === 0 ? (
                            <div className="py-8 text-center text-sm text-adm-faint">Aucune vente enregistrée pour le moment.</div>
                        ) : (
                            charts.topProducts.map((p, i) => {
                                const maxVal = Math.max(...charts.topProducts.map(x => topProductsMetric === 'qty' ? x.qty : x.revenue), 1);
                                const currentVal = topProductsMetric === 'qty' ? p.qty : p.revenue;
                                const widthPct = Math.max(8, (currentVal / maxVal) * 100);

                                return (
                                    <div key={i} className="grid grid-cols-[110px_1fr] sm:grid-cols-[140px_1fr] items-center gap-3">
                                        <div className="text-xs sm:text-sm font-semibold text-adm-text truncate" title={p.name}>
                                            {p.name}
                                        </div>
                                        <div className="w-full bg-adm-raise rounded-md h-6 overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-md flex items-center justify-end px-2.5 transition-all duration-300" 
                                                style={{ width: `${widthPct}%` }}
                                            >
                                                <span className="text-[11px] font-bold text-white whitespace-nowrap drop-shadow">
                                                    {topProductsMetric === 'qty' ? `${p.qty} pcs` : fmtMoney(p.revenue)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Top Cities */}
                <div className="bg-adm-panel border border-adm-line rounded-2xl p-5 flex flex-col">
                    <div className="flex items-center gap-2 text-sm font-bold text-adm-text mb-4">
                        <MapPin size={16} className="text-adm-ok" />
                        <span>Top Villes</span>
                    </div>

                    <div className="flex flex-col gap-2.5">
                        {charts.topCities.length === 0 ? (
                            <div className="py-8 text-center text-sm text-adm-faint">Aucune commande localisée.</div>
                        ) : (
                            charts.topCities.map((c, i) => (
                                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-adm-raise">
                                    <div className={`w-6 h-6 rounded-full flex-none grid place-items-center text-xs font-bold ${
                                        i === 0 ? 'bg-adm-accent text-black' :
                                        i === 1 ? 'bg-sky-400 text-black' :
                                        i === 2 ? 'bg-adm-ok text-black' :
                                        'bg-adm-line-2 text-adm-text'
                                    }`}>
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <b className="block text-xs sm:text-sm font-semibold text-adm-text truncate">{c.city}</b>
                                        <span className="text-[11px] text-adm-muted">{c.count} cmd • {fmtMoney(c.revenue)}</span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-md bg-adm-ok-soft text-adm-ok text-xs font-bold">
                                        {c.percentage}%
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

// ─────────────────────────────────────────────────────────────
// Pure SVG Vector Chart Components
// ─────────────────────────────────────────────────────────────

function TrendLineChart({ labels = [], data = [], color = '#38bdf8', isMoney = false }) {
    if (!data.length) return <div className="py-12 text-center text-xs text-adm-faint">Pas de données</div>;

    const maxVal = Math.max(...data, 1);
    const minVal = 0;
    const range = maxVal - minVal;

    const width = 600;
    const height = 180;
    const padTop = 20;
    const padBottom = 26;
    const padLeft = 40;
    const padRight = 10;
    const innerW = width - padLeft - padRight;
    const innerH = height - padTop - padBottom;

    const points = data.map((val, i) => {
        const x = padLeft + (i / Math.max(data.length - 1, 1)) * innerW;
        const y = padTop + innerH - ((val - minVal) / range) * innerH;
        return { x, y, val, label: labels[i] };
    });

    const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, '');
    const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${height - padBottom} L ${points[0].x.toFixed(1)} ${height - padBottom} Z`;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
                <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.0" />
                </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.5, 1].map((ratio, idx) => {
                const y = padTop + innerH * ratio;
                const val = (maxVal - ratio * range).toFixed(0);
                return (
                    <g key={idx}>
                        <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                        <text x={padLeft - 6} y={y + 3} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.35)">
                            {val} {isMoney ? 'DT' : ''}
                        </text>
                    </g>
                );
            })}

            {/* Area Fill & Line */}
            <path d={areaD} fill={`url(#grad-${color.replace('#', '')})`} />
            <path d={pathD} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

            {/* Interactive Points */}
            {points.map((p, i) => (
                <g key={i} className="group cursor-pointer">
                    <circle cx={p.x} cy={p.y} r="3" fill={color} stroke="#0e0f13" strokeWidth="1.5" className="transition-all duration-150 group-hover:r-5" />
                    <title>{`${p.label}: ${p.val}${isMoney ? ' DT' : ' cmd'}`}</title>
                </g>
            ))}

            {/* X Labels */}
            {points.map((p, i) => {
                const step = Math.ceil(points.length / 8);
                if (i % step !== 0 && i !== points.length - 1) return null;
                return (
                    <text key={i} x={p.x} y={height - 6} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)">
                        {p.label}
                    </text>
                );
            })}
        </svg>
    );
}

function HourlyHistogram({ data = [] }) {
    const maxVal = Math.max(...data, 1);
    const width = 360;
    const height = 180;
    const padBottom = 26;
    const barWidth = 9;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            {data.map((val, h) => {
                const x = 16 + h * ((width - 32) / 24);
                const barH = (val / maxVal) * (height - padBottom - 20);
                const y = height - padBottom - barH;

                return (
                    <g key={h} className="group cursor-pointer">
                        <rect 
                            x={x} 
                            y={y} 
                            width={barWidth} 
                            height={Math.max(barH, 2)} 
                            rx="2" 
                            fill={val > 0 ? '#d9a441' : 'rgba(255,255,255,0.06)'} 
                            className="transition-colors group-hover:fill-[#e4b255]"
                        >
                            <title>{`${h}h: ${val} commandes`}</title>
                        </rect>
                        {h % 4 === 0 && (
                            <text x={x + barWidth / 2} y={height - 6} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)">
                                {h}h
                            </text>
                        )}
                    </g>
                );
            })}
        </svg>
    );
}

function StatusFlowChart({ labels = [], data = [] }) {
    if (!data.length) return <div className="py-12 text-center text-xs text-adm-faint">Pas de données</div>;

    const maxTotal = Math.max(...data.map(d => d.pending + d.confirmed + d.shipped + d.delivered + d.cancelled), 1);
    const width = 600;
    const height = 180;
    const padBottom = 26;
    const colW = (width - 40) / data.length;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
            {data.map((d, i) => {
                const x = 20 + i * colW + colW * 0.15;
                const bW = colW * 0.7;
                let currentY = height - padBottom;

                const segments = [
                    { val: d.pending, color: '#f59e0b', name: 'En attente' },
                    { val: d.confirmed, color: '#38bdf8', name: 'Confirmées' },
                    { val: d.shipped, color: '#6366f1', name: 'Expédiées' },
                    { val: d.delivered, color: '#10b981', name: 'Livrées' },
                    { val: d.cancelled, color: '#ef4444', name: 'Annulées' },
                ];

                return (
                    <g key={i}>
                        {segments.map((seg, sIdx) => {
                            if (seg.val === 0) return null;
                            const h = (seg.val / maxTotal) * (height - padBottom - 20);
                            currentY -= h;
                            return (
                                <rect 
                                    key={sIdx} 
                                    x={x} 
                                    y={currentY} 
                                    width={bW} 
                                    height={h} 
                                    fill={seg.color} 
                                    rx={sIdx === segments.length - 1 ? 2 : 0}
                                    className="hover:opacity-85 transition-opacity"
                                >
                                    <title>{`${labels[i]} - ${seg.name}: ${seg.val}`}</title>
                                </rect>
                            );
                        })}
                        {i % 2 === 0 && (
                            <text x={x + bW / 2} y={height - 6} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)">
                                {labels[i]}
                            </text>
                        )}
                    </g>
                );
            })}
        </svg>
    );
}