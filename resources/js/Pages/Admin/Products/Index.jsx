import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

const BADGES = {
    promo: 'Promo',
    bestseller: 'Best seller',
    nouveaute: 'Nouveauté',
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
            <div className="adm-head">
                <div>
                    <h1 className="adm-title">Produits</h1>
                    <p className="adm-sub">Gérez votre catalogue, les badges et les tailles.</p>
                </div>
                <Link href={route('admin.products.create')} className="btn btn-primary">
                    <Plus size={16} strokeWidth={2.4} />
                    Nouveau produit
                </Link>
            </div>

            <div className="stats">
                <div className="stat">
                    <span>Modèles</span>
                    <b>{products.total}</b>
                </div>
                <div className="stat">
                    <span>Actifs en boutique</span>
                    <b className="ok">{activeCount}</b>
                </div>
                <div className="stat">
                    <span>En promotion</span>
                    <b className="accent">{promoCount}</b>
                </div>
            </div>

            <div className="toolbar">
                <form onSubmit={submitSearch} className="search">
                    <Search size={16} />
                    <input
                        className="field"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher un produit…"
                    />
                </form>

                <select
                    className="select"
                    value={filters.category_id || 'all'}
                    onChange={(e) => applyFilter('category_id', e.target.value)}
                >
                    <option value="all">Toutes les catégories</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                <select
                    className="select"
                    value={filters.tag || 'all'}
                    onChange={(e) => applyFilter('tag', e.target.value)}
                >
                    <option value="all">Tous les badges</option>
                    <option value="promo">Promo</option>
                    <option value="bestseller">Best seller</option>
                    <option value="nouveaute">Nouveauté</option>
                </select>

                <select
                    className="select"
                    value={filters.is_active ?? 'all'}
                    onChange={(e) => applyFilter('is_active', e.target.value)}
                >
                    <option value="all">Tous les statuts</option>
                    <option value="1">Actifs</option>
                    <option value="0">Inactifs</option>
                </select>
            </div>

            <div className="card">
                <div className="table-wrap">
                    <table className="tbl">
                        <thead>
                            <tr>
                                <th style={{ width: 80 }}>Photo</th>
                                <th>Modèle</th>
                                <th>Catégorie</th>
                                <th>Prix</th>
                                <th>Badge</th>
                                <th className="c">Actif</th>
                                <th className="c">Page d'accueil</th>
                                <th>Tailles</th>
                                <th className="r">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.data.map((p) => (
                                <tr key={p.id}>
                                    <td>
                                        <div className="thumb">
                                            {p.image ? <img src={p.image} alt={p.name} /> : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="p-name">{p.name}</td>
                                    <td className="p-muted">{p.category}</td>
                                    <td>
                                        <div className="p-price">{Number(p.price).toFixed(3)} TND</div>
                                        {p.original_price && (
                                            <div className="p-old">{Number(p.original_price).toFixed(3)} TND</div>
                                        )}
                                    </td>
                                    <td>
                                        {BADGES[p.tag] ? (
                                            <span className={`badge ${p.tag}`}>{BADGES[p.tag]}</span>
                                        ) : (
                                            <span className="p-muted">—</span>
                                        )}
                                    </td>
                                    <td className="c">
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={!!p.is_active}
                                            aria-label="Produit actif"
                                            className={`switch ${p.is_active ? 'on' : ''}`}
                                            onClick={() => toggleActive(p.id)}
                                        />
                                    </td>
                                    <td className="c">
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={!!p.front_page}
                                            aria-label="Afficher sur la page d'accueil"
                                            className={`switch ${p.front_page ? 'on' : ''}`}
                                            onClick={() => toggleFrontPage(p.id)}
                                        />
                                    </td>
                                    <td>
                                        <div className="chips">
                                            {p.sizes.map((s) => (
                                                <span key={s} className="chip">{s}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="r">
                                        <div className="row-actions">
                                            <Link href={route('admin.products.edit', p.id)} className="icon-btn">
                                                <Pencil size={15} />
                                                Modifier
                                            </Link>
                                            <button
                                                type="button"
                                                className="icon-btn danger"
                                                title="Supprimer"
                                                aria-label={`Supprimer ${p.name}`}
                                                onClick={() => remove(p.id, p.name)}
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {products.data.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="empty">
                                        Aucun produit ne correspond à ces filtres.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {products.links && products.links.length > 3 && (
                    <div className="pager">
                        <span>{products.from}–{products.to} sur {products.total}</span>
                        <div className="pager-links">
                            {products.links.map((link, i) =>
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        className={link.active ? 'is-active' : ''}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span key={i} className="is-off" dangerouslySetInnerHTML={{ __html: link.label }} />
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}