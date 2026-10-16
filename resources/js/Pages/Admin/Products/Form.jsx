import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link, router } from '@inertiajs/react';
import { ArrowLeft, Save, Upload, Trash2, Star } from 'lucide-react';
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

    const [primaryPreview, setPrimaryPreview] = useState(null);
    const [galleryPreviews, setGalleryPreviews] = useState([]);

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

    const handlePrimaryImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('primary_image', file);
            setPrimaryPreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryImages = (e) => {
        const files = Array.from(e.target.files);
        setData('images', files);
        setGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
    };

    const toggleSize = (id) =>
        setData('sizes', data.sizes.includes(id) ? data.sizes.filter((s) => s !== id) : [...data.sizes, id]);

    const deleteExisting = (imageItem) => {
        if (confirm('Supprimer définitivement cette image ?')) {
            router.delete(
                route('admin.products.images.delete', [product.id, imageItem.id]) + `?source=${imageItem.source || 'media'}`,
                { preserveScroll: true }
            );
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(isEditing ? route('admin.products.update', product.id) : route('admin.products.store'));
    };

    const cls = (base, key) => `${base}${errors[key] ? ' is-error' : ''}`;
    const existingPrimary = product?.primary_image || null;
    const existingGallery = product?.existing_images || [];

    return (
        <AdminLayout>
            <form onSubmit={submit}>
                <div className="adm-head">
                    <div>
                        <Link href={route('admin.products.index')} className="adm-back">
                            <ArrowLeft size={15} /> Produits
                        </Link>
                        <h1 className="adm-title">{isEditing ? product.name : 'Nouveau produit'}</h1>
                    </div>
                </div>

                <div className="form-grid">
                    {/* ---------- Main Column ---------- */}
                    <div className="stack">
                        <section className="card section">
                            <h2>Informations</h2>

                            <div className="cols">
                                <div className="group">
                                    <label>Nom du produit</label>
                                    <input
                                        className={cls('field', 'name')}
                                        type="text"
                                        value={data.name}
                                        onChange={handleNameChange}
                                        placeholder="ex : Sm51 Maillot non voilé"
                                    />
                                    {errors.name && <p className="err">{errors.name}</p>}
                                </div>
                                <div className="group">
                                    <label>Slug (URL)</label>
                                    <input
                                        className={cls('field', 'slug')}
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="sm51-maillot-non-voile"
                                    />
                                    {errors.slug && <p className="err">{errors.slug}</p>}
                                </div>
                            </div>

                            <div className="cols">
                                <div className="group">
                                    <label>Catégorie</label>
                                    <select
                                        className={cls('select', 'category_id')}
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                    >
                                        <option value="">Choisir une catégorie</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="err">{errors.category_id}</p>}
                                </div>
                                <div className="group">
                                    <label>Badge</label>
                                    <select
                                        className="select"
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

                            <div className="group">
                                <label>Description</label>
                                <textarea
                                    className={cls('textarea', 'description')}
                                    rows={5}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Coupe, matière, entretien…"
                                />
                                {errors.description && <p className="err">{errors.description}</p>}
                            </div>
                        </section>

                        <section className="card section">
                            <h2>Prix</h2>
                            <div className="cols">
                                <div className="group">
                                    <label>Prix de vente (TND)</label>
                                    <input
                                        className={cls('field', 'price')}
                                        type="number"
                                        step="0.001"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="129.000"
                                    />
                                    {errors.price && <p className="err">{errors.price}</p>}
                                </div>

                                {data.tag === 'promo' && (
                                    <div className="group">
                                        <label>Ancien prix barré (TND)</label>
                                        <input
                                            className={cls('field', 'original_price')}
                                            type="number"
                                            step="0.001"
                                            value={data.original_price}
                                            onChange={(e) => setData('original_price', e.target.value)}
                                            placeholder="169.000"
                                        />
                                        {errors.original_price && <p className="err">{errors.original_price}</p>}
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="card section">
                            <h2>Tailles disponibles</h2>
                            <div className="size-grid">
                                {availableSizes.map((s) => (
                                    <button
                                        type="button"
                                        key={s.id}
                                        aria-pressed={data.sizes.includes(s.id)}
                                        className={`size ${data.sizes.includes(s.id) ? 'on' : ''}`}
                                        onClick={() => toggleSize(s.id)}
                                    >
                                        {s.name}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* ---------- Gallery / Other Photos ---------- */}
                        <section className="card section">
                            <h2>Autres photos (Galerie)</h2>

                            {existingGallery.length > 0 && (
                                <>
                                    <p className="photo-label">Photos secondaires actuelles ({existingGallery.length})</p>
                                    <div className="photos">
                                        {existingGallery.map((img) => (
                                            <div key={img.id} className="photo">
                                                <img src={img.url} alt="" />
                                                <button
                                                    type="button"
                                                    className="photo-del"
                                                    aria-label="Supprimer la photo"
                                                    onClick={() => deleteExisting(img)}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {galleryPreviews.length > 0 && (
                                <>
                                    <p className="photo-label">Nouvelles photos à ajouter ({galleryPreviews.length})</p>
                                    <div className="photos">
                                        {galleryPreviews.map((url, i) => (
                                            <div key={i} className="photo new">
                                                <img src={url} alt="" />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            <label className="drop">
                                <Upload size={22} />
                                <b>Ajouter des photos à la galerie</b>
                                <small>PNG, JPG ou WEBP, 10 Mo max par photo</small>
                                <input type="file" multiple accept="image/*" onChange={handleGalleryImages} />
                            </label>
                            {errors.images && <p className="err">{errors.images}</p>}
                        </section>
                    </div>

                    {/* ---------- Sidebar Column ---------- */}
                    <aside className="aside">
                        {/* Principal Image Card */}
                        <div className="card section">
                            <h2>Image principale</h2>

                            {(primaryPreview || existingPrimary?.url) ? (
                                <div className="primary-photo-box">
                                    <span className="primary-tag">
                                        <Star size={11} fill="currentColor" /> Principale
                                    </span>
                                    <img src={primaryPreview || existingPrimary.url} alt="Principale" />
                                    {existingPrimary && !primaryPreview && (
                                        <button
                                            type="button"
                                            className="photo-del"
                                            aria-label="Supprimer photo principale"
                                            onClick={() => deleteExisting(existingPrimary)}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ) : null}

                            <label className="drop compact">
                                <Upload size={18} />
                                <b>{(primaryPreview || existingPrimary) ? 'Remplacer l’image' : 'Importer image principale'}</b>
                                <small>Couverture du produit</small>
                                <input type="file" accept="image/*" onChange={handlePrimaryImage} />
                            </label>
                            {errors.primary_image && <p className="err">{errors.primary_image}</p>}
                        </div>

                        {/* Visibility & Actions Card */}
                        <div className="card section">
                            <h2>Visibilité</h2>

                            <div className="toggle-row">
                                <div>
                                    <b>Produit actif</b>
                                    <span>Visible par les clients</span>
                                </div>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={data.is_active}
                                    aria-label="Produit actif"
                                    className={`switch ${data.is_active ? 'on' : ''}`}
                                    onClick={() => setData('is_active', !data.is_active)}
                                />
                            </div>

                            <div className="toggle-row">
                                <div>
                                    <b>Page d'accueil</b>
                                    <span>Afficher dans « Pièces maîtresses »</span>
                                </div>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={data.front_page}
                                    aria-label="Afficher sur la page d'accueil"
                                    className={`switch ${data.front_page ? 'on' : ''}`}
                                    onClick={() => setData('front_page', !data.front_page)}
                                />
                            </div>

                            <div className="aside-actions">
                                <button type="submit" className="btn btn-primary" disabled={processing}>
                                    <Save size={16} />
                                    {processing ? 'Enregistrement…' : 'Enregistrer'}
                                </button>
                                <Link href={route('admin.products.index')} className="btn">
                                    Annuler
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </form>
        </AdminLayout>
    );
}