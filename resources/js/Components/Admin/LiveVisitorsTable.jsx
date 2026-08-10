import { useState, Fragment } from 'react';
import {
    Globe, Clock, Users, Check, X,
    ChevronLeft, ChevronRight, ChevronDown,
    ShoppingCart, Smartphone, Monitor, Tablet
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import VisitorJourneyInline from './VisitorJourneyInline';

const COLUMNS = [
    { key: 'has_page_view', label: 'Page view', color: 'text-blue-400' },
    { key: 'has_product_view', label: 'Product view', color: 'text-purple-400' },
    { key: 'has_cart', label: 'Add to Cart', color: 'text-amber-400' },
    { key: 'has_checkout', label: 'Checkout', color: 'text-pink-400' },
    { key: 'has_purchase', label: 'Achat', color: 'text-emerald-400' },
];

const SOURCE_STYLES = {
    Facebook: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
    Instagram: 'bg-pink-500/15 text-pink-300 border-pink-500/20',
    Google: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/20',
    Direct: 'bg-gray-500/15 text-gray-300 border-gray-500/20',
    Autre: 'bg-gray-500/15 text-gray-300 border-gray-500/20',
};

const PLATFORM_ICONS = {
    mobile: { icon: Smartphone, color: 'text-pink-400', label: 'Mobile' },
    tablet: { icon: Tablet, color: 'text-purple-400', label: 'Tablette' },
    desktop: { icon: Monitor, color: 'text-blue-400', label: 'Desktop' },
    unknown: { icon: Monitor, color: 'text-gray-500', label: 'Inconnu' },
};

export default function LiveVisitorsTable({ visitors, pagination, filters }) {
    const prev_cursor = pagination?.prev_cursor ?? pagination?.previous_cursor ?? null;
    const next_cursor = pagination?.next_cursor ?? null;
    const hasPrev = !!prev_cursor;
    const hasNext = !!next_cursor;
    const perPage = filters?.per_page || 25;
    const [expandedVisitor, setExpandedVisitor] = useState(null);

    const toggleJourney = (visitorId) => {
        setExpandedVisitor(expandedVisitor === visitorId ? null : visitorId);
    };

    const buildUrl = (cursor) => {
        const params = new URLSearchParams(window.location.search);
        if (cursor) {
            params.set('cursor', cursor);
        } else {
            params.delete('cursor');
        }
        return `${window.location.pathname}?${params.toString()}`;
    };

    const PlatformIcon = ({ platform }) => {
        const config = PLATFORM_ICONS[platform] || PLATFORM_ICONS.unknown;
        const Icon = config.icon;
        return (
            <div className="flex items-center gap-1.5" title={config.label}>
                <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                <span className="text-xs text-gray-400">{config.label}</span>
            </div>
        );
    };

    return (
        <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800/60">
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-gray-800/50">
                        <Globe className="w-4 h-4 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
                        Parcours des visiteurs
                    </h3>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Afficher</span>
                        <select
                            value={perPage}
                            onChange={(e) => {
                                const params = new URLSearchParams(window.location.search);
                                params.set('per_page', e.target.value);
                                params.delete('cursor');
                                window.location.href = `${window.location.pathname}?${params.toString()}`;
                            }}
                            className="bg-gray-800/50 border border-gray-700/50 rounded-lg text-xs text-gray-300 px-2 py-1 outline-none focus:border-gray-600"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Users className="w-3.5 h-3.5" />
                        <span>{visitors.length} visiteurs</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">Live</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-800/40 bg-gray-950/30">
                            <th className="text-center px-3 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[40px]"></th>
                            <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[180px]">
                                Visiteur
                            </th>
                            <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[100px]">
                                Source
                            </th>
                            <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[120px]">
                                Dernière activité
                            </th>
                            {COLUMNS.map((col) => (
                                <th
                                    key={col.key}
                                    className="text-center px-3 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[80px]"
                                >
                                    {col.label}
                                </th>
                            ))}
                            <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[200px]">
                                <div className="flex items-center gap-1.5">
                                    <ShoppingCart className="w-3 h-3" />
                                    Produit ajouté
                                </div>
                            </th>
                            <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[100px]">
                                Plateforme
                            </th>
                            <th className="text-right px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[100px]">
                                Statut
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-800/20">
                        {visitors.length === 0 ? (
                            <tr>
                                <td colSpan={12} className="text-center py-16">
                                    <Clock className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm font-medium">Aucun visiteur récent</p>
                                    <p className="text-gray-600 text-xs mt-1">Les visiteurs apparaîtront ici en temps réel</p>
                                </td>
                            </tr>
                        ) : (
                            visitors.map((visitor) => {
                                const isExpanded = expandedVisitor === visitor.visitor_id;

                                return (
                                    <Fragment key={`group-${visitor.visitor_id}`}>
                                        {/* Ligne principale */}
                                        <tr
                                            className={`group transition-colors duration-150 cursor-pointer hover:bg-gray-800/40 ${isExpanded ? 'bg-gray-800/30' : ''}`}
                                            onClick={() => toggleJourney(visitor.visitor_id)}
                                        >
                                            {/* Expand Button */}
                                            <td className="px-3 py-3.5 w-[40px] text-center">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleJourney(visitor.visitor_id);
                                                    }}
                                                    className={`p-1 rounded-lg transition-all ${isExpanded ? 'bg-gray-700 text-white rotate-180' : 'text-gray-600 hover:text-gray-400 hover:bg-gray-800'}`}
                                                >
                                                    <ChevronDown className="w-4 h-4" />
                                                </button>
                                            </td>

                                            {/* Visitor ID */}
                                            <td className="px-6 py-3.5">
                                                <div className="text-sm font-mono text-gray-200 font-medium">
                                                    visiteur_{visitor.visitor_id.slice(0, 8)}
                                                </div>
                                            </td>

                                            {/* Source */}
                                            <td className="px-4 py-3.5">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${SOURCE_STYLES[visitor.source] || SOURCE_STYLES.Autre}`}>
                                                    {visitor.source}
                                                </span>
                                            </td>

                                            {/* Last Seen */}
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(visitor.last_seen).toLocaleTimeString('fr-FR', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </div>
                                            </td>

                                            {/* Activity Columns */}
                                            {COLUMNS.map((col) => {
                                                const isDone = visitor[col.key] == 1;
                                                return (
                                                    <td key={col.key} className="px-3 py-3.5 text-center">
                                                        {isDone ? (
                                                            <div className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${col.color.replace('text-', 'bg-').replace('400', '500')}/15`}>
                                                                <Check className={`w-4 h-4 ${col.color}`} strokeWidth={2.5} />
                                                            </div>
                                                        ) : (
                                                            <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-800/50">
                                                                <X className="w-3.5 h-3.5 text-gray-600" strokeWidth={2} />
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}

                                            {/* Produit ajouté */}
                                            <td className="px-4 py-3.5">
                                                {visitor.has_cart == 1 && visitor.cart_product_name ? (
                                                    <span className="text-xs text-gray-400 truncate max-w-[160px]" title={visitor.cart_product_name}>
                                                        {visitor.cart_product_name}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-600 text-xs">—</span>
                                                )}
                                            </td>

                                            {/* Platform */}
                                            <td className="px-4 py-3.5">
                                                <PlatformIcon platform={visitor.platform || 'unknown'} />
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-3.5 text-right">
                                                <span className={`text-xs font-semibold ${getStatusColor(visitor)}`}>
                                                    {getStatusLabel(visitor)}
                                                </span>
                                            </td>
                                        </tr>

                                        {/* Ligne expandée - PARCOURS */}
                                        {isExpanded && (
                                            <tr className="bg-gray-950/30">
                                                <td colSpan={12} className="px-0 py-0">
                                                    <VisitorJourneyInline visitorId={visitor.visitor_id} />
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800/60 bg-gray-950/20">
                <div className="text-xs text-gray-500">
                    {visitors.length > 0 && (
                        <span>
                            Affichage de <span className="text-gray-300 font-medium">{visitors.length}</span> visiteurs
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href={hasPrev ? buildUrl(prev_cursor) : '#'}
                        preserveState
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${hasPrev ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700/50' : 'bg-gray-900/30 text-gray-600 cursor-not-allowed border border-gray-800/30'}`}
                        onClick={(e) => !hasPrev && e.preventDefault()}
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        Précédent
                    </Link>

                    <Link
                        href={hasNext ? buildUrl(next_cursor) : '#'}
                        preserveState
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${hasNext ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700/50' : 'bg-gray-900/30 text-gray-600 cursor-not-allowed border border-gray-800/30'}`}
                        onClick={(e) => !hasNext && e.preventDefault()}
                    >
                        Suivant
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

function getStatusColor(v) {
    if (v.has_purchase) return 'text-emerald-400';
    if (v.has_checkout) return 'text-pink-400';
    if (v.has_cart) return 'text-amber-400';
    if (v.has_product_view) return 'text-purple-400';
    if (v.has_page_view) return 'text-blue-400';
    return 'text-gray-500';
}

function getStatusLabel(v) {
    if (v.has_purchase) return 'Achat ✓';
    if (v.has_checkout) return 'Checkout';
    if (v.has_cart) return 'Panier';
    if (v.has_product_view) return 'Produit vu';
    if (v.has_page_view) return 'Trafic';
    return 'Bounce';
}