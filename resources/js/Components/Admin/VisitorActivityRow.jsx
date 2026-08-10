import { Phone, Eye, ShoppingCart, ClipboardCheck, CheckCircle, XCircle } from 'lucide-react';

const ACTIVITIES = [
    { key: 'has_page_view', label: 'Trafic', icon: Phone, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { key: 'has_product_view', label: 'Produit', icon: Eye, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { key: 'has_cart', label: 'Panier', icon: ShoppingCart, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { key: 'has_checkout', label: 'Checkout', icon: ClipboardCheck, color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { key: 'has_purchase', label: 'Achat', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
];

const SOURCE_STYLES = {
    Facebook: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
    Instagram: 'bg-pink-500/15 text-pink-300 border-pink-500/20',
    Google: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/20',
    Direct: 'bg-gray-500/15 text-gray-300 border-gray-500/20',
    Autre: 'bg-gray-500/15 text-gray-300 border-gray-500/20',
};

export default function VisitorActivityRow({ visitor, index }) {
    return (
        <div
            className="group flex items-center gap-4 px-4 py-3 rounded-xl bg-gray-800/30 hover:bg-gray-800/60 border border-transparent hover:border-gray-700/40 transition-all duration-200"
            style={{ animationDelay: `${index * 40}ms` }}
        >
            {/* Visitor ID + Time */}
            <div className="min-w-[140px] flex-shrink-0">
                <div className="text-sm font-mono text-gray-200 font-medium">
                    visiteur_{visitor.visitor_id.slice(0, 8)}
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                    {new Date(visitor.last_seen).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </div>
            </div>

            {/* Source Badge */}
            <div className="min-w-[90px] flex-shrink-0">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${SOURCE_STYLES[visitor.source] || SOURCE_STYLES.Autre}`}>
                    {visitor.source}
                </span>
            </div>

            {/* Activity Icons - Funnel Progress */}
            <div className="flex items-center gap-1 flex-1 justify-center">
                {ACTIVITIES.map((activity, i) => {
                    const isDone = visitor[activity.key] == 1;
                    const Icon = activity.icon;

                    return (
                        <div key={activity.key} className="flex items-center">
                            {/* Connector line */}
                            {i > 0 && (
                                <div className={`w-6 h-[2px] mx-0.5 rounded-full transition-colors duration-300 ${isDone ? 'bg-emerald-500/40' : 'bg-gray-700'}`} />
                            )}

                            {/* Activity dot/icon */}
                            <div
                                className={`relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${isDone ? activity.bg : 'bg-gray-800/50'}`}
                                title={activity.label}
                            >
                                {isDone ? (
                                    <Icon className={`w-4 h-4 ${activity.color}`} />
                                ) : (
                                    <XCircle className="w-4 h-4 text-gray-600" />
                                )}

                                {/* Glow effect for completed */}
                                {isDone && (
                                    <div className={`absolute inset-0 rounded-lg ${activity.bg} blur-md opacity-50`} />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Progress Label */}
            <div className="min-w-[100px] flex-shrink-0 text-right">
                <span className={`text-xs font-medium ${getProgressColor(visitor)}`}>
                    {getProgressLabel(visitor)}
                </span>
            </div>
        </div>
    );
}

function getProgressColor(v) {
    if (v.has_purchase) return 'text-emerald-400';
    if (v.has_checkout) return 'text-pink-400';
    if (v.has_cart) return 'text-amber-400';
    if (v.has_product_view) return 'text-purple-400';
    if (v.has_page_view) return 'text-blue-400';
    return 'text-gray-500';
}

function getProgressLabel(v) {
    if (v.has_purchase) return 'Achat ✓';
    if (v.has_checkout) return 'Checkout';
    if (v.has_cart) return 'Panier';
    if (v.has_product_view) return 'Produit vu';
    if (v.has_page_view) return 'Trafic';
    return 'Bounce';
}   