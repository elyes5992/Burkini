import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { Search, Pencil, Trash2, Eye, Copy, Check, X, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';

const STATUS_MAP = {
    pending:   { label: 'En attente', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
    confirmed: { label: 'Confirmé',   color: 'border-sky-500/40 text-sky-400 bg-sky-500/10' },
    shipped:   { label: 'Expédié',    color: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10' },
    delivered: { label: 'Terminé',    color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
    cancelled: { label: 'Annulé',     color: 'border-red-500/40 text-red-400 bg-red-500/10' },
};

export default function Index({ orders, filters, counts }) {
    const [search, setSearch] = useState(filters.search || '');
    const [previewOrder, setPreviewOrder] = useState(null);
    const [copiedPhone, setCopiedPhone] = useState(null);

    const applyFilter = (key, value) => {
        router.get(
            route('admin.orders.index'),
            { ...filters, [key]: value, page: 1 },
            { preserveState: true, replace: true }
        );
    };

    const submitSearch = (e) => {
        e.preventDefault();
        applyFilter('search', search);
    };

    const handleStatusChange = (orderId, newStatus) => {
        router.patch(route('admin.orders.status', orderId), { status: newStatus }, { preserveScroll: true });
    };

    const copyToClipboard = (phone) => {
        navigator.clipboard.writeText(phone);
        setCopiedPhone(phone);
        setTimeout(() => setCopiedPhone(null), 2000);
    };

    const remove = (id) => {
        if (confirm(`Supprimer définitivement la commande #${id} ?`)) {
            router.delete(route('admin.orders.destroy', id), { preserveScroll: true });
        }
    };

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-adm-text">Commandes</h1>
                    <p className="mt-1 text-sm text-adm-muted">Gérez les commandes, les expéditions et les statuts clients.</p>
                </div>
            </div>

            {/* Quick KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
                <div 
                    onClick={() => applyFilter('status', 'all')}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                        filters.status === 'all' ? 'bg-adm-raise border-adm-accent' : 'bg-adm-panel border-adm-line hover:border-adm-faint'
                    }`}
                >
                    <span className="block text-xs font-semibold text-adm-muted uppercase">Total</span>
                    <b className="block mt-1 text-2xl font-bold text-adm-text">{counts.total}</b>
                </div>

                <div 
                    onClick={() => applyFilter('status', 'pending')}
                    className={`p-4 rounded-xl border border-l-4 border-l-amber-500 cursor-pointer transition ${
                        filters.status === 'pending' ? 'bg-adm-raise border-amber-500' : 'bg-adm-panel border-adm-line hover:border-adm-faint'
                    }`}
                >
                    <span className="block text-xs font-semibold text-adm-muted uppercase">En attente</span>
                    <b className="block mt-1 text-2xl font-bold text-amber-400">{counts.pending}</b>
                </div>

                <div 
                    onClick={() => applyFilter('status', 'confirmed')}
                    className={`p-4 rounded-xl border border-l-4 border-l-sky-500 cursor-pointer transition ${
                        filters.status === 'confirmed' ? 'bg-adm-raise border-sky-500' : 'bg-adm-panel border-adm-line hover:border-adm-faint'
                    }`}
                >
                    <span className="block text-xs font-semibold text-adm-muted uppercase">Confirmées</span>
                    <b className="block mt-1 text-2xl font-bold text-sky-400">{counts.confirmed}</b>
                </div>

                <div 
                    onClick={() => applyFilter('status', 'delivered')}
                    className={`p-4 rounded-xl border border-l-4 border-l-emerald-500 cursor-pointer transition ${
                        filters.status === 'delivered' ? 'bg-adm-raise border-emerald-500' : 'bg-adm-panel border-adm-line hover:border-adm-faint'
                    }`}
                >
                    <span className="block text-xs font-semibold text-adm-muted uppercase">Livrées</span>
                    <b className="block mt-1 text-2xl font-bold text-emerald-400">{counts.delivered}</b>
                </div>

                <div 
                    onClick={() => applyFilter('status', 'cancelled')}
                    className={`p-4 rounded-xl border border-l-4 border-l-red-500 cursor-pointer transition ${
                        filters.status === 'cancelled' ? 'bg-adm-raise border-red-500' : 'bg-adm-panel border-adm-line hover:border-adm-faint'
                    }`}
                >
                    <span className="block text-xs font-semibold text-adm-muted uppercase">Annulées</span>
                    <b className="block mt-1 text-2xl font-bold text-red-400">{counts.cancelled}</b>
                </div>
            </div>

            {/* Toolbar Filters */}
            <div className="flex flex-wrap gap-2.5 mb-4">
                <form onSubmit={submitSearch} className="relative flex-1 min-w-[240px]">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-adm-faint pointer-events-none" />
                    <input
                        className="w-full h-[42px] bg-adm-panel text-adm-text border border-adm-line rounded-xl pl-10 pr-3.5 text-sm focus:outline-none focus:border-adm-accent transition"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher par #ID, client, téléphone, ville…"
                    />
                </form>

                <select
                    className="h-[42px] bg-adm-panel text-adm-text border border-adm-line rounded-xl px-3.5 text-sm focus:outline-none focus:border-adm-accent cursor-pointer transition min-w-[170px]"
                    value={filters.status || 'all'}
                    onChange={(e) => applyFilter('status', e.target.value)}
                >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">🕐 En attente</option>
                    <option value="confirmed">🔄 Confirmé</option>
                    <option value="shipped">🚚 Expédié</option>
                    <option value="delivered">✅ Terminé</option>
                    <option value="cancelled">❌ Annulé</option>
                </select>
            </div>

            {/* Table Card */}
            <div className="bg-adm-panel border border-adm-line rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-adm-line text-xs font-medium text-adm-faint uppercase">
                                <th className="p-4 w-16">#</th>
                                <th className="p-4">Produits</th>
                                <th className="p-4 text-center">Aperçu</th>
                                <th className="p-4">Client</th>
                                <th className="p-4">Téléphone</th>
                                <th className="p-4">Ville & Adresse</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Statut</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-adm-line text-sm">
                            {orders.data.map((order) => (
                                <tr key={order.id} className="hover:bg-white/[0.02] transition">
                                    <td className="p-4 font-bold text-adm-faint">#{order.id}</td>

                                    {/* Products Column */}
                                    <td className="p-4">
                                        <div className="flex flex-col gap-2 min-w-[220px]">
                                            {order.items.map((item) => (
                                                <div key={item.id} className="flex items-center gap-2.5">
                                                    <div className="w-9 h-12 rounded bg-adm-raise border border-adm-line overflow-hidden flex-none">
                                                        {item.product_image ? (
                                                            <img src={item.product_image} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full bg-zinc-800" />
                                                        )}
                                                    </div>
                                                    <div className="leading-tight">
                                                        <div className="font-medium text-xs text-adm-text truncate max-w-[160px]">{item.product_name}</div>
                                                        <div className="text-[11px] text-adm-muted">Taille: {item.size} • Qté: {item.quantity}</div>
                                                        <div className="text-[11px] font-bold text-sky-400">{Number(item.product_price).toFixed(2)} DT</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </td>

                                    {/* Aperçu Button */}
                                    <td className="p-4 text-center">
                                        <button
                                            type="button"
                                            onClick={() => setPreviewOrder(order)}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-400 text-xs font-semibold transition"
                                        >
                                            <Eye size={13} /> Aperçu
                                        </button>
                                    </td>

                                    {/* Customer */}
                                    <td className="p-4 font-semibold text-adm-text whitespace-nowrap">{order.customer_name}</td>

                                    {/* Phone with 1-click Copy */}
                                    <td className="p-4 whitespace-nowrap">
                                        <button
                                            type="button"
                                            onClick={() => copyToClipboard(order.customer_phone)}
                                            className="inline-flex items-center gap-1 text-xs text-adm-muted hover:text-adm-text bg-adm-raise px-2 py-1 rounded-md transition"
                                            title="Cliquer pour copier"
                                        >
                                            {copiedPhone === order.customer_phone ? <Check size={12} className="text-adm-ok" /> : <Copy size={12} />}
                                            <span>{order.customer_phone}</span>
                                        </button>
                                    </td>

                                    {/* City & Address */}
                                    <td className="p-4 text-xs max-w-[200px]">
                                        <b className="block text-adm-text font-medium truncate">{order.customer_city}</b>
                                        <span className="text-adm-muted truncate block" title={order.customer_address}>
                                            {order.customer_address}
                                        </span>
                                    </td>

                                    {/* Total */}
                                    <td className="p-4 font-bold text-adm-text whitespace-nowrap">
                                        {Number(order.total_price).toFixed(2)} DT
                                    </td>

                                    {/* Inline Status Dropdown (Same as Filament) */}
                                    <td className="p-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className={`h-8 px-2.5 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none transition ${
                                                STATUS_MAP[order.status]?.color || 'bg-adm-raise border-adm-line text-adm-text'
                                            }`}
                                        >
                                            <option value="pending" className="bg-adm-panel text-adm-text">🕐 En attente</option>
                                            <option value="confirmed" className="bg-adm-panel text-adm-text">🔄 Confirmé</option>
                                            <option value="shipped" className="bg-adm-panel text-adm-text">🚚 Expédié</option>
                                            <option value="delivered" className="bg-adm-panel text-adm-text">✅ Terminé</option>
                                            <option value="cancelled" className="bg-adm-panel text-adm-text">❌ Annulé</option>
                                        </select>
                                    </td>

                                    {/* Date */}
                                    <td className="p-4 text-xs whitespace-nowrap">
                                        <span className="block text-adm-text">{order.created_at}</span>
                                        <span className="text-[11px] text-adm-faint">{order.created_since}</span>
                                    </td>

                                    {/* Actions */}
                                    <td className="p-4 text-right whitespace-nowrap">
                                        <div className="inline-flex gap-1">
                                            <Link
                                                href={route('admin.orders.edit', order.id)}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-adm-muted hover:text-adm-text hover:bg-adm-raise transition"
                                                title="Modifier"
                                            >
                                                <Pencil size={14} />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => remove(order.id)}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-adm-muted hover:text-adm-bad hover:bg-adm-bad-soft transition"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {orders.data.length === 0 && (
                                <tr>
                                    <td colSpan={10} className="p-16 text-center text-adm-muted">
                                        Aucune commande ne correspond à ces critères.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {orders.links && orders.links.length > 3 && (
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-t border-adm-line text-xs text-adm-muted">
                        <span>{orders.from}–{orders.to} sur {orders.total}</span>
                        <div className="flex gap-1">
                            {orders.links.map((link, i) =>
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        className={`min-w-[32px] h-8 px-2.5 grid place-items-center rounded-lg font-semibold transition ${
                                            link.active ? 'bg-adm-accent text-[#17130a]' : 'hover:bg-adm-raise text-adm-muted hover:text-adm-text'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={i}
                                        className="min-w-[32px] h-8 px-2.5 grid place-items-center rounded-lg font-semibold text-adm-muted opacity-40 pointer-events-none"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Slide-Over Modal "Aperçu de la commande" (Same as Filament) ── */}
            {previewOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="w-full max-w-2xl bg-adm-panel border border-adm-line rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-4 border-b border-adm-line mb-5">
                            <div>
                                <h3 className="text-lg font-bold text-adm-text">
                                    Commande #{previewOrder.id} — {previewOrder.customer_name}
                                </h3>
                                <span className="text-xs text-adm-muted">{previewOrder.created_at}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setPreviewOrder(null)}
                                className="w-8 h-8 rounded-lg bg-adm-raise hover:bg-adm-line-2 text-adm-muted hover:text-adm-text grid place-items-center transition"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Items Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                            {previewOrder.items.map((item) => (
                                <div key={item.id} className="bg-adm-raise border border-adm-line rounded-xl p-3 text-center">
                                    <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-zinc-900 border border-adm-line mb-2">
                                        {item.product_image ? (
                                            <img src={item.product_image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full grid place-items-center text-xs text-adm-faint">Pas d'image</div>
                                        )}
                                    </div>
                                    <div className="text-xs font-semibold text-adm-text truncate mb-1" title={item.product_name}>
                                        {item.product_name}
                                    </div>
                                    <div className="text-[11px] text-adm-muted">Taille: {item.size}</div>
                                    <div className="text-[11px] text-adm-muted mb-1">Qté: {item.quantity}</div>
                                    <div className="text-xs font-bold text-sky-400">{Number(item.product_price).toFixed(2)} DT</div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary Strip */}
                        <div className="p-4 rounded-xl bg-adm-raise border border-adm-line text-xs flex flex-wrap gap-4 items-center justify-between">
                            <span className="flex items-center gap-1.5 text-adm-text">
                                <Phone size={13} className="text-adm-accent" /> {previewOrder.customer_phone}
                            </span>
                            <span className="flex items-center gap-1.5 text-adm-muted">
                                <MapPin size={13} className="text-adm-ok" /> {previewOrder.customer_city} — {previewOrder.customer_address}
                            </span>
                            <span className="text-base font-extrabold text-adm-ok">
                                Total: {Number(previewOrder.total_price).toFixed(2)} DT
                            </span>
                        </div>

                        <div className="mt-5 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setPreviewOrder(null)}
                                className="px-4 py-2 rounded-xl bg-adm-raise border border-adm-line-2 text-adm-text font-semibold text-xs hover:bg-adm-line transition"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}