import { useState, useEffect } from 'react';
import { Clock, ExternalLink, Timer, Loader2, ArrowRight, MapPin } from 'lucide-react';

const EVENT_CONFIG = {
    page_view: { color: 'bg-blue-500/15 border-blue-500/30 text-blue-300', dot: 'bg-blue-400', icon: '👁️' },
    product_view: { color: 'bg-purple-500/15 border-purple-500/30 text-purple-300', dot: 'bg-purple-400', icon: '🔍' },
    add_to_cart: { color: 'bg-amber-500/15 border-amber-500/30 text-amber-300', dot: 'bg-amber-400', icon: '🛒' },
    checkout_start: { color: 'bg-pink-500/15 border-pink-500/30 text-pink-300', dot: 'bg-pink-400', icon: '💳' },
    purchase: { color: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300', dot: 'bg-emerald-400', icon: '✅' },
};

const EVENT_LABELS = {
    page_view: 'Page',
    product_view: 'Produit',
    add_to_cart: 'Panier',
    checkout_start: 'Checkout',
    purchase: 'Achat',
};

export default function VisitorJourneyInline({ visitorId }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/admin/stats/visitor/${visitorId}/journey`)
            .then((r) => r.json())
            .then(setData)
            .finally(() => setLoading(false));
    }, [visitorId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-6 gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs">Chargement du parcours...</span>
            </div>
        );
    }

    if (!data || data.total_steps === 0) {
        return (
            <div className="py-4 px-8 text-gray-500 text-xs">
                Aucun parcours disponible.
            </div>
        );
    }

    return (
        <div className="px-6 py-4">
            {/* Header compact */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs font-semibold text-gray-300">Parcours</span>
                    <span className="text-[10px] text-gray-600">({data.total_steps} étapes)</span>
                </div>
                {data.duration_minutes > 0 && (
                    <div className="flex items-center gap-1 text-[10px] text-gray-600">
                        <Timer className="w-3 h-3" />
                        {data.duration_minutes} min
                    </div>
                )}
            </div>

            {/* 🔥 PIPELINE HORIZONTAL AVEC WRAP */}
            <div className="flex flex-wrap items-center gap-1">
                {data.journey.map((step, idx) => {
                    const cfg = EVENT_CONFIG[step.event_type] || EVENT_CONFIG.page_view;
                    const isFirst = idx === 0;

                    return (
                        <div key={idx} className="flex items-center">
                            {/* Arrow connector */}
                            {!isFirst && (
                                <div className="flex items-center px-1">
                                    <ArrowRight className="w-3 h-3 text-gray-700" />
                                </div>
                            )}

                            {/* Step Card */}
                            <div className={`
                                group relative flex items-center gap-1.5 
                                px-2.5 py-1.5 rounded-lg border 
                                ${cfg.color}
                                hover:scale-105 transition-transform cursor-default
                            `}>
                                <div className={`w-2 h-2 rounded-full ${cfg.dot} flex-shrink-0`} />

                                <div className="flex flex-col min-w-0">
                                    <span className="text-[11px] font-medium truncate max-w-[140px]" title={step.step}>
                                        {step.step}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[9px] opacity-70">{step.time}</span>
                                        {isFirst && step.referrer && (
                                            <span className="text-[9px] opacity-50">via {step.referrer}</span>
                                        )}
                                    </div>
                                </div>

                                <a
                                    href={step.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-0.5"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <ExternalLink className="w-2.5 h-2.5 opacity-50 hover:opacity-100" />
                                </a>

                                {/* Tooltip URL */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                                    opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                    <div className="bg-gray-800 border border-gray-700 rounded-md px-2 py-1 shadow-xl">
                                        <p className="text-[10px] text-gray-400 font-mono whitespace-nowrap">
                                            {step.url}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}