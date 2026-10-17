import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link, router } from '@inertiajs/react';
import { ArrowLeft, Save, Upload, Trash2, Star, Plus } from 'lucide-react';
import { useState } from 'react';

export default function Form({ categories, availableSizes, product }) {
    const isEditing = !!product;

    const { data, setData, post, processing, errors } = useForm({
        category_id: product?.category_id || '',
        name: product?.name || '',
        slug: product?.slug || '',
        description: product?.description || '',
        price: product?.price || '',
        original_price: product?.original_price || '',
        tag: product?.tag || '',
        is_active: product ? Boolean(product.is_active) : true,
        front_page: product ? Boolean(product.front_page) : false,
        sizes: product?.selected_sizes || [],
        primary_image: null,
        images: [],
    });

    // Staging state for new images previews with their unique local IDs
    const [primaryPreview, setPrimaryPreview] = useState(null);
    const [newGalleryItems, setNewGalleryItems] = useState([]); // Array of { id, file, url }

    const handleNameChange = (e) => {
        const val = e.target.value;
        setData((prev) => ({
            ...prev,
            name: val,
            slug: !isEditing
                ? val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                : prev.slug,
        }));
    };

    // --- Primary Image Handlers ---
    const handlePrimaryImage = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (primaryPreview) URL.revokeObjectURL(primaryPreview);
            setData('primary_image', file);
            setPrimaryPreview(URL.createObjectURL(file));
        }
        e.target.value = '';
    };

    const removeNewPrimaryImage = () => {
        if (primaryPreview) URL.revokeObjectURL(primaryPreview);
        setPrimaryPreview(null);
        setData('primary_image', null);
    };

    // --- Gallery Images Handlers ---
    const handleGalleryImages = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const newItems = files.map((file) => ({
            id: Math.random().toString(36).substring(2, 9),
            file,
            url: URL.createObjectURL(file),
        }));

        const updated = [...newGalleryItems, ...newItems];
        setNewGalleryItems(updated);
        setData('images', updated.map((item) => item.file));
        e.target.value = ''; // Reset input to allow selecting the same files again if needed
    };

    const removeNewGalleryImage = (idToRemove) => {
        const updated = newGalleryItems.filter((item) => {
            if (item.id === idToRemove) {
                URL.revokeObjectURL(item.url);
                return false;
            }
            return true;
        });
        setNewGalleryItems(updated);
        setData('images', updated.map((item) => item.file));
    };

    // --- Delete Existing Saved Image on the Server ---
    const deleteExisting = (imageItem) => {
        if (confirm('Supprimer définitivement cette image ?')) {
            router.delete(
                route('admin.products.images.delete', [product.id, imageItem.id]) +
                    `?source=${imageItem.source || 'media'}`,
                { preserveScroll: true }
            );
        }
    };

    const toggleSize = (id) =>
        setData('sizes', data.sizes.includes(id) ? data.sizes.filter((s) => s !== id) : [...data.sizes, id]);

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            router.post(
                route('admin.products.update', product.id),
                {
                    _method: 'put',
                    ...data,
                },
                { forceFormData: true }
            );
        } else {
            post(route('admin.products.store'));
        }
    };

    const inputCls = (key) =>
        `w-full h-[42px] bg-adm-panel text-adm-text border rounded-xl px-3.5 text-sm focus:outline-none transition ${
            errors[key] ? 'border-adm-bad' : 'border-adm-line focus:border-adm-accent'
        }`;

    const existingPrimary = product?.primary_image || null;
    const existingGallery = product?.existing_images || [];

    return (
        <AdminLayout>
            <form onSubmit={submit}>
                {/* Header */}
                <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
                    <div>
                        <Link
                            href={route('admin.products.index')}
                            className="inline-flex items-center gap-1.5 text-sm text-adm-muted hover:text-adm-text transition mb-2"
                        >
                            <ArrowLeft size={15} /> Produits
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight text-adm-text">
                            {isEditing ? product.name : 'Nouveau produit'}
                        </h1>
                    </div>
                </div>

                {/* 2-Column Responsive Form Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
                    {/* Main Left Column */}
                    <div className="flex flex-col gap-6">
                        {/* ================= PHOTOS SECTION ================= */}
                        <div className="bg-adm-panel border border-adm-line rounded-2xl p-6">
                            <h2 className="text-base font-bold text-adm-text mb-4">Photos du produit</h2>

                            {/* --- 1. PRINCIPAL IMAGE (PLACED ABOVE) --- */}
                            <div className="p-4 rounded-xl border border-adm-line-2 bg-adm-raise/40 mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Star size={16} className="text-adm-accent fill-adm-accent" />
                                        <span className="text-sm font-bold text-adm-text">Image principale</span>
                                    </div>
                                    <span className="text-xs text-adm-muted">Photo de couverture principale</span>
                                </div>

                                {primaryPreview || existingPrimary?.url ? (
                                    <div className="relative w-48 aspect-[3/4] rounded-xl overflow-hidden bg-adm-panel border border-adm-line mb-3 group">
                                        <img
                                            src={primaryPreview || existingPrimary.url}
                                            alt="Principale"
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Delete button for newly staged primary image */}
                                        {primaryPreview && (
                                            <button
                                                type="button"
                                                onClick={removeNewPrimaryImage}
                                                className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-600/90 text-white grid place-items-center hover:bg-red-700 transition shadow"
                                                title="Supprimer cette nouvelle image"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}

                                        {/* Delete button for existing saved primary image */}
                                        {existingPrimary && !primaryPreview && (
                                            <button
                                                type="button"
                                                onClick={() => deleteExisting(existingPrimary)}
                                                className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/80 text-white grid place-items-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition shadow"
                                                title="Supprimer l'image actuelle"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                ) : null}

                                <label className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-adm-line-2 hover:border-adm-accent rounded-xl text-xs font-semibold text-adm-text cursor-pointer hover:bg-adm-accent-soft transition">
                                    <Upload size={14} />
                                    <span>
                                        {primaryPreview || existingPrimary
                                            ? "Remplacer l'image principale"
                                            : "Choisir l'image principale"}
                                    </span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handlePrimaryImage} />
                                </label>
                                {errors.primary_image && (
                                    <p className="text-xs text-adm-bad mt-1.5">{errors.primary_image}</p>
                                )}
                            </div>

                            {/* --- 2. SECONDARY / GALLERY IMAGES (BELOW THE PRINCIPAL) --- */}
                            <div className="p-4 rounded-xl border border-adm-line-2 bg-adm-raise/40">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-bold text-adm-text">Images secondaires</span>
                                    <span className="text-xs text-adm-muted">
                                        Total: {existingGallery.length + newGalleryItems.length} photo(s)
                                    </span>
                                </div>

                                {/* Images Grid */}
                                {(existingGallery.length > 0 || newGalleryItems.length > 0) && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3.5 mb-4">
                                        {/* Existing saved secondary images */}
                                        {existingGallery.map((img) => (
                                            <div
                                                key={img.id}
                                                className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-adm-panel border border-adm-line"
                                            >
                                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => deleteExisting(img)}
                                                    className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/80 text-white grid place-items-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition shadow"
                                                    title="Supprimer cette image"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}

                                        {/* Newly added gallery images */}
                                        {newGalleryItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-adm-panel border-2 border-emerald-500/80"
                                            >
                                                <img src={item.url} alt="" className="w-full h-full object-cover" />
                                                {/* Delete button for new image before upload */}
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewGalleryImage(item.id)}
                                                    className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-600/95 text-white grid place-items-center hover:bg-red-700 transition shadow"
                                                    title="Retirer cette image"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add more secondary images upload button */}
                                <label className="flex flex-col items-center justify-center gap-1.5 p-6 border-2 border-dashed border-adm-line-2 hover:border-adm-accent hover:bg-adm-accent-soft/40 rounded-xl text-adm-muted cursor-pointer transition text-center">
                                    <div className="w-8 h-8 rounded-full bg-adm-panel border border-adm-line flex items-center justify-center text-adm-accent">
                                        <Plus size={16} />
                                    </div>
                                    <b className="text-adm-text text-xs">Ajouter des images secondaires</b>
                                    <small className="text-[11px] text-adm-faint">
                                        Sélection multiple acceptée (PNG, JPG, WEBP)
                                    </small>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleGalleryImages}
                                    />
                                </label>
                                {errors.images && <p className="text-xs text-adm-bad mt-1.5">{errors.images}</p>}
                            </div>
                        </div>

                        {/* Information Section */}
                        <div className="bg-adm-panel border border-adm-line rounded-2xl p-6">
                            <h2 className="text-base font-bold text-adm-text mb-5">Informations</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-adm-muted mb-1.5">Nom du produit</label>
                                    <input
                                        className={inputCls('name')}
                                        type="text"
                                        value={data.name}
                                        onChange={handleNameChange}
                                        placeholder="ex : Sm51 Maillot non voilé"
                                    />
                                    {errors.name && <p className="text-xs text-adm-bad mt-1.5">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-adm-muted mb-1.5">Slug (URL)</label>
                                    <input
                                        className={inputCls('slug')}
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="sm51-maillot-non-voile"
                                    />
                                    {errors.slug && <p className="text-xs text-adm-bad mt-1.5">{errors.slug}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label className="block text-xs font-semibold text-adm-muted mb-1.5">Catégorie</label>
                                    <select
                                        className={inputCls('category_id')}
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                    >
                                        <option value="">Choisir une catégorie</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && (
                                        <p className="text-xs text-adm-bad mt-1.5">{errors.category_id}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-adm-muted mb-1.5">Badge</label>
                                    <select
                                        className={inputCls('tag')}
                                        value={data.tag}
                                        onChange={(e) => setData('tag', e.target.value)}
                                    >
                                        <option value="">Aucun</option>
                                        <option value="promo">Promo</option>
                                        <option value="bestseller">Best seller</option>
                                        <option value="nouveaute">Nouveauté</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-xs font-semibold text-adm-muted mb-1.5">Description</label>
                                <textarea
                                    className={`w-full bg-adm-panel text-adm-text border rounded-xl p-3.5 text-sm focus:outline-none transition min-h-[120px] ${
                                        errors.description
                                            ? 'border-adm-bad'
                                            : 'border-adm-line focus:border-adm-accent'
                                    }`}
                                    rows={5}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Coupe, matière, entretien…"
                                />
                                {errors.description && (
                                    <p className="text-xs text-adm-bad mt-1.5">{errors.description}</p>
                                )}
                            </div>
                        </div>

                        {/* Pricing Section */}
                        <div className="bg-adm-panel border border-adm-line rounded-2xl p-6">
                            <h2 className="text-base font-bold text-adm-text mb-5">Prix</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-adm-muted mb-1.5">
                                        Prix de vente (TND)
                                    </label>
                                    <input
                                        className={inputCls('price')}
                                        type="number"
                                        step="0.001"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="129.000"
                                    />
                                    {errors.price && <p className="text-xs text-adm-bad mt-1.5">{errors.price}</p>}
                                </div>

                                {data.tag === 'promo' && (
                                    <div>
                                        <label className="block text-xs font-semibold text-adm-muted mb-1.5">
                                            Ancien prix barré (TND)
                                        </label>
                                        <input
                                            className={inputCls('original_price')}
                                            type="number"
                                            step="0.001"
                                            value={data.original_price}
                                            onChange={(e) => setData('original_price', e.target.value)}
                                            placeholder="169.000"
                                        />
                                        {errors.original_price && (
                                            <p className="text-xs text-adm-bad mt-1.5">{errors.original_price}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sizes Section */}
                        <div className="bg-adm-panel border border-adm-line rounded-2xl p-6">
                            <h2 className="text-base font-bold text-adm-text mb-5">Tailles disponibles</h2>
                            <div className="flex flex-wrap gap-2">
                                {availableSizes.map((s) => (
                                    <button
                                        type="button"
                                        key={s.id}
                                        onClick={() => toggleSize(s.id)}
                                        className={`min-w-[50px] h-10 px-3.5 rounded-xl text-sm font-semibold border transition ${
                                            data.sizes.includes(s.id)
                                                ? 'bg-adm-accent-soft border-adm-accent text-adm-accent'
                                                : 'bg-transparent border-adm-line-2 text-adm-muted hover:border-adm-faint hover:text-adm-text'
                                        }`}
                                    >
                                        {s.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Right Column */}
                    <div className="sticky top-6 flex flex-col gap-5">
                        {/* Visibility & Actions Card */}
                        <div className="bg-adm-panel border border-adm-line rounded-2xl p-6">
                            <h2 className="text-base font-bold text-adm-text mb-4">Visibilité & Enregistrement</h2>

                            <div className="flex items-center justify-between gap-4 py-3 border-b border-adm-line">
                                <div>
                                    <b className="block text-sm font-semibold text-adm-text">Produit actif</b>
                                    <span className="text-xs text-adm-faint">Visible en boutique</span>
                                </div>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={data.is_active}
                                    onClick={() => setData('is_active', !data.is_active)}
                                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                                        data.is_active ? 'bg-adm-accent' : 'bg-adm-line-2'
                                    }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out mt-[3px] ml-[3px] ${
                                            data.is_active ? 'translate-x-4 !bg-[#17130a]' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between gap-4 py-3">
                                <div>
                                    <b className="block text-sm font-semibold text-adm-text">Page d'accueil</b>
                                    <span className="text-xs text-adm-faint">Pièces maîtresses</span>
                                </div>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={data.front_page}
                                    onClick={() => setData('front_page', !data.front_page)}
                                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                                        data.front_page ? 'bg-adm-accent' : 'bg-adm-line-2'
                                    }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out mt-[3px] ml-[3px] ${
                                            data.front_page ? 'translate-x-4 !bg-[#17130a]' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="flex flex-col gap-2.5 mt-5">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-10 rounded-xl bg-adm-accent hover:bg-[#e4b255] text-[#17130a] font-semibold text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
                                >
                                    <Save size={16} />
                                    {processing ? 'Enregistrement…' : 'Enregistrer le produit'}
                                </button>
                                <Link
                                    href={route('admin.products.index')}
                                    className="w-full h-10 rounded-xl border border-adm-line-2 hover:bg-adm-raise text-adm-text font-semibold text-sm flex items-center justify-center transition"
                                >
                                    Annuler
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}