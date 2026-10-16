import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

const BADGES = {
    promo: { label: 'Promo', cls: 'bg-adm-bad-soft text-[#f09a94]' },
    bestseller: { label: 'Best seller', cls: 'bg-adm-accent-soft text-adm-accent' },
    nouveaute: { label: 'Nouveauté', cls: 'bg-adm-ok-soft text-adm-ok' },
};

export default function Index({ products, categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const applyFilter = (key, value) => {
        router.get(
            route('admin.products.index'),
            { ...filters, [key]: value, page: 1 },
            { preserveState: true, replace: true }
        );
    };

    const submitSearch = (e) => {
        e.preventDefault();
        applyFilter('search', search);
    };

    const toggleActive = (id) =>
        router.patch(route('admin.products.toggle-active', id), {}, { preserveScroll: true });

    const toggleFrontPage = (id) =>
        router.patch(route('admin.products.toggle-front-page', id), {}, { preserveScroll: true });

    const remove = (id, name) => {
        if (confirm(`Supprimer définitivement « ${name} » ?`)) {
            router.delete(route('admin.products.destroy', id), { preserveScroll: true });
        }
    };

    const activeCount = products.data.filter((p) => p.is_active).length;
    const promoCount = products.data.filter((p) => p.tag === 'promo').length;

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-adm-text">Produits</h1>
                    <p className="mt-1 text-sm text-adm-muted">Gérez votre catalogue, les badges et les tailles.</p>
                </div>
                <Link
                    href={route('admin.products.create')}
                    className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold bg-adm-accent hover:bg-[#e4b255] text-[#17130a] transition"
                >
                    <Plus size={16} strokeWidth={2.4} />
                    Nouveau produit
                </Link>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 bg-adm-panel border border-adm-line rounded-2xl mb-5 overflow-hidden">
                <div className="p-5 border-b sm:border-b-0 sm:border-r border-adm-line">
                    <span className="block text-xs font-medium text-adm-muted uppercase tracking-wider">Modèles</span>
                    <b className="block mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-adm-text">{products.total}</b>
                </div>
                <div className="p-5 border-b sm:border-b-0 sm:border-r border-adm-line">
                    <span className="block text-xs font-medium text-adm-muted uppercase tracking-wider">Actifs en boutique</span>
                    <b className="block mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-adm-ok">{activeCount}</b>
                </div>
                <div className="p-5">
                    <span className="block text-xs font-medium text-adm-muted uppercase tracking-wider">En promotion</span>
                    <b className="block mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-adm-accent">{promoCount}</b>
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
                        placeholder="Rechercher un produit…"
                    />
                </form>

                <select
                    className="h-[42px] bg-adm-panel text-adm-text border border-adm-line rounded-xl px-3.5 text-sm focus:outline-none focus:border-adm-accent cursor-pointer transition min-w-[170px]"
                    value={filters.category_id || 'all'}
                    onChange={(e) => applyFilter('category_id', e.target.value)}
                >
                    <option value="all">Toutes les catégories</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                <select
                    className="h-[42px] bg-adm-panel text-adm-text border border-adm-line rounded-xl px-3.5 text-sm focus:outline-none focus:border-adm-accent cursor-pointer transition min-w-[150px]"
                    value={filters.tag || 'all'}
                    onChange={(e) => applyFilter('tag', e.target.value)}
                >
                    <option value="all">Tous les badges</option>
                    <option value="promo">Promo</option>
                    <option value="bestseller">Best seller</option>
                    <option value="nouveaute">Nouveauté</option>
                </select>

                <select
                    className="h-[42px] bg-adm-panel text-adm-text border border-adm-line rounded-xl px-3.5 text-sm focus:outline-none focus:border-adm-accent cursor-pointer transition min-w-[150px]"
                    value={filters.is_active ?? 'all'}
                    onChange={(e) => applyFilter('is_active', e.target.value)}
                >
                    <option value="all">Tous les statuts</option>
                    <option value="1">Actifs</option>
                    <option value="0">Inactifs</option>
                </select>
            </div>

            {/* Table Card */}
            <div className="bg-adm-panel border border-adm-line rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-adm-line text-xs font-medium text-adm-faint uppercase">
                                <th className="p-4 w-20">Photo</th>
                                <th className="p-4">Modèle</th>
                                <th className="p-4">Catégorie</th>
                                <th className="p-4">Prix</th>
                                <th className="p-4">Badge</th>
                                <th className="p-4 text-center">Actif</th>
                                <th className="p-4 text-center">Page d'accueil</th>
                                <th className="p-4">Tailles</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-adm-line text-sm">
                            {products.data.map((p) => (
                                <tr key={p.id} className="hover:bg-white/[0.02] transition">
                                    <td className="p-4">
                                        <div className="w-12 h-[60px] rounded-lg overflow-hidden bg-adm-raise border border-adm-line grid place-items-center text-xs text-adm-faint flex-none">
                                            {p.image ? (
                                                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                            ) : (
                                                'N/A'
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 font-semibold text-adm-text">{p.name}</td>
                                    <td className="p-4 text-adm-muted">{p.category}</td>
                                    <td className="p-4">
                                        <div className="font-bold text-adm-text whitespace-nowrap">{Number(p.price).toFixed(3)} TND</div>
                                        {p.original_price && (
                                            <div className="text-xs text-adm-faint line-through whitespace-nowrap">
                                                {Number(p.original_price).toFixed(3)} TND
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {BADGES[p.tag] ? (
                                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${BADGES[p.tag].cls}`}>
                                                {BADGES[p.tag].label}
                                            </span>
                                        ) : (
                                            <span className="text-adm-faint">—</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={!!p.is_active}
                                            onClick={() => toggleActive(p.id)}
                                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                                                p.is_active ? 'bg-adm-accent' : 'bg-adm-line-2'
                                            }`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out mt-[3px] ml-[3px] ${
                                                    p.is_active ? 'translate-x-4 !bg-[#17130a]' : 'translate-x-0'
                                                }`}
                                            />
                                        </button>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={!!p.front_page}
                                            onClick={() => toggleFrontPage(p.id)}
                                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                                                p.front_page ? 'bg-adm-accent' : 'bg-adm-line-2'
                                            }`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out mt-[3px] ml-[3px] ${
                                                    p.front_page ? 'translate-x-4 !bg-[#17130a]' : 'translate-x-0'
                                                }`}
                                            />
                                        </button>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-1">
                                            {p.sizes.map((s) => (
                                                <span key={s} className="px-2 py-0.5 rounded-md bg-adm-raise border border-adm-line text-xs font-semibold text-adm-muted">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="inline-flex gap-1.5">
                                            <Link
                                                href={route('admin.products.edit', p.id)}
                                                className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-semibold text-adm-muted hover:text-adm-text hover:bg-adm-raise transition"
                                            >
                                                <Pencil size={14} /> Modifier
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => remove(p.id, p.name)}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-adm-muted hover:text-adm-bad hover:bg-adm-bad-soft transition"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {products.data.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="p-16 text-center text-adm-muted">
                                        Aucun produit ne correspond à ces critères.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {products.links && products.links.length > 3 && (
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-t border-adm-line text-xs text-adm-muted">
                        <span>{products.from}–{products.to} sur {products.total}</span>
                        <div className="flex gap-1">
                            {products.links.map((link, i) =>
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
        </AdminLayout>
    );
}