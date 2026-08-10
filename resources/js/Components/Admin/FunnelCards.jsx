import { Users, Eye, ShoppingCart, ClipboardCheck, CheckCircle } from 'lucide-react';

const STAGES = [
    { key: 'arrives', label: 'Trafic', color: '#3b82f6', icon: Users },
    { key: 'vus', label: 'Intérêt', color: '#a855f7', icon: Eye },
    { key: 'panier', label: 'Désir', color: '#f59e0b', icon: ShoppingCart },
    { key: 'checkout', label: 'Action', color: '#ec4899', icon: ClipboardCheck },
    { key: 'achats', label: 'Fidélité', color: '#22c55e', icon: CheckCircle },
];

export default function FunnelCards({ funnel }) {
    const pct = (part, whole) => whole > 0 ? ((part / whole) * 100).toFixed(1) : 0;

    const cards = [
        { ...STAGES[0], value: funnel.arrives, pct: '100%', prev: null },
        { ...STAGES[1], value: funnel.vus, pct: `${pct(funnel.vus, funnel.arrives)}%`, prev: funnel.arrives },
        { ...STAGES[2], value: funnel.panier, pct: `${pct(funnel.panier, funnel.vus)}%`, prev: funnel.vus },
        { ...STAGES[3], value: funnel.checkout, pct: `${pct(funnel.checkout, funnel.panier)}%`, prev: funnel.panier },
        { ...STAGES[4], value: funnel.achats, pct: `${pct(funnel.achats, funnel.checkout)}%`, prev: funnel.checkout },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {cards.map((card) => {
                const Icon = card.icon;
                const trend = card.prev ? pct(card.value, card.prev) : 100;
                const trendColor = trend >= 50 ? 'text-emerald-400' : trend >= 20 ? 'text-amber-400' : 'text-red-400';

                return (
                    <div
                        key={card.key}
                        className="group relative bg-gray-900/60 border border-gray-800/60 rounded-2xl p-5 hover:border-gray-700/80 transition-all duration-300 hover:bg-gray-900/80"
                    >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 rounded-xl bg-gray-800/50" style={{ color: card.color }}>
                                <Icon className="w-5 h-5" />
                            </div>
                            {card.prev !== null && (
                                <span className={`text-xs font-semibold ${trendColor}`}>{trend}%</span>
                            )}
                        </div>
                        <div className="text-3xl font-bold text-white tracking-tight">
                            {card.value.toLocaleString('fr-FR')}
                        </div>
                        <div className="text-sm text-gray-500 mt-1 font-medium">{card.label}</div>
                        <div className="mt-3 h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-700 ease-out"
                                style={{
                                    width: `${card.prev ? (card.value / card.prev) * 100 : 100}%`,
                                    backgroundColor: card.color,
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}