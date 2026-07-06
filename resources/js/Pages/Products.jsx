import MainLayout from '@/Layouts/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, router } from '@inertiajs/react';
import {
    Flame, Star, Sparkles, Tag, SlidersHorizontal,
    Droplets, Wind, Feather, RefreshCw,
    ShoppingBag, Heart, Award, X, ArrowUpDown
} from 'lucide-react';
import { useState } from 'react';
import ReviewsCarousel from '@/Components/ReviewsCarousel';

const ProductBadge = ({ tag, discount }) => {
    if (!tag) return null;

    const badges = {
        promo: {
            bg: 'bg-burgundy text-cream',
            icon: <Flame size={12} className="mr-1" />,
            text: discount ? `Promo -${discount}%` : 'Promo'
        },
        bestseller: {
            bg: 'bg-charcoal text-cream',
            icon: <Star size={12} className="mr-1" fill="currentColor" />,
            text: 'Best Seller'
        },
        nouveaute: {
            bg: 'bg-cream text-burgundy border border-burgundy/20',
            icon: <Sparkles size={12} className="mr-1" />,
            text: 'Nouveau'
        }
    };

    const config = badges[tag] || { bg: 'bg-charcoal text-cream', icon: <Tag size={12} className="mr-1" />, text: tag };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            className={`absolute top-3 left-3 z-10 flex items-center text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 shadow-sm backdrop-blur-sm ${config.bg}`}
        >
            {config.icon}
            <span>{config.text}</span>
        </motion.div>
    );
};

const CATEGORIES = [
    { value: 'tous', label: 'Toutes' },
    { value: 'non voilée', label: 'Non Voilées' },
    { value: 'voilée', label: 'Voilées' },
    { value: 'enfant', label: 'Enfants' }
];

const SORTS = [
    { value: '', label: 'Pertinence' },
    { value: 'price_asc', label: 'Prix croissant' },
    { value: 'price_desc', label: 'Prix décroissant' },
    { value: 'newest', label: 'Nouveautés' },
];

export default function Products({ products, currentCategory, currentSize, currentSort, availableSizes }) {
    const [sortOpen, setSortOpen] = useState(false);

    const handleFilterChange = (patch) => {
        router.get(route('products'), {
            category: currentCategory,
            size: currentSize || undefined,
            sort: currentSort || undefined,
            ...patch,
        }, { preserveState: true, preserveScroll: true });
    };

    const hasActiveFilters = currentCategory !== 'tous' || !!currentSize || !!currentSort;

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 pb-24 pt-8 md:pt-12">

                {/* --- HEADER --- */}
                <div className="text-center mb-12">
                    <p className="text-[11px] uppercase tracking-[0.35em] font-bold text-burgundy/70 mb-3">
                        Vellure Store
                    </p>
                    <h1 className="text-4xl md:text-5xl font-dream text-charcoal tracking-wide capitalize mb-4">
                        {currentCategory === 'tous' ? 'Collection Maillots' : `Collection ${currentCategory}`}
                    </h1>
                    <p className="text-sm text-charcoal/50 font-serif max-w-md mx-auto">
                        Des maillots pensés pour nager, bronzer et vivre l'été en toute confiance.
                    </p>
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <span className="h-[1px] w-12 bg-burgundy/20" />
                        <span className="w-1.5 h-1.5 rounded-full bg-burgundy/40" />
                        <span className="h-[1px] w-12 bg-burgundy/20" />
                    </div>
                </div>

                {/* --- AVANTAGES --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-14 max-w-5xl mx-auto">
                    {[
                        { icon: <Droplets size={20} strokeWidth={1.5} />, text: "Tissu polyamide spécial maillot" },
                        { icon: <Wind size={20} strokeWidth={1.5} />, text: "Séchage ultra-rapide" },
                        { icon: <Feather size={20} strokeWidth={1.5} />, text: "Ne colle pas au corps" },
                        { icon: <RefreshCw size={20} strokeWidth={1.5} />, text: "Possibilité d'échange" }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * idx }}
                            className="bg-[#F9F8F6] border border-burgundy/5 p-4 flex flex-col items-center justify-center text-center gap-3 hover:border-burgundy/20 transition-colors duration-300 shadow-sm"
                        >
                            <div className="text-burgundy bg-white p-2 rounded-full shadow-sm">{item.icon}</div>
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-charcoal leading-relaxed">
                                {item.text}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* --- BARRE DE FILTRES UNIFIÉE (sticky) --- */}
                <div className="sticky top-2 z-20 mb-14">
                    <div className="bg-cream/95 backdrop-blur-md border border-burgundy/10 rounded-2xl shadow-md px-4 md:px-6 py-4 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-0 lg:divide-x divide-burgundy/10">

                        {/* Catégories */}
                        <div className="flex-1 flex flex-wrap justify-center lg:justify-start gap-1.5 lg:pr-6">
                            {CATEGORIES.map((cat) => {
                                const active = currentCategory === cat.value;
                                return (
                                    <button
                                        key={cat.value}
                                        onClick={() => handleFilterChange({ category: cat.value })}
                                        className={`relative rounded-full px-4 py-2 text-[10px] md:text-[11px] uppercase tracking-widest font-bold whitespace-nowrap transition-colors duration-300 ${
                                            active ? 'text-cream' : 'text-charcoal/60 hover:text-burgundy'
                                        }`}
                                    >
                                        {active && (
                                            <motion.span
                                                layoutId="categoryPill"
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                                                className="absolute inset-0 -z-10 rounded-full bg-burgundy"
                                            />
                                        )}
                                        {cat.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tailles */}
                        <div className="flex items-center justify-center gap-2 lg:px-6">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 mr-1 hidden md:inline">
                                Taille
                            </span>
                            <button
                                onClick={() => handleFilterChange({ size: undefined })}
                                className={`h-9 px-3 flex items-center justify-center text-[10px] uppercase tracking-widest font-bold rounded-full border transition-colors duration-300 ${
                                    !currentSize ? 'bg-charcoal text-cream border-charcoal' : 'border-charcoal/20 text-charcoal/70 hover:border-charcoal hover:text-charcoal'
                                }`}
                            >
                                Toutes
                            </button>
                            {availableSizes.map((size) => {
                                const active = currentSize === size;
                                return (
                                    <button
                                        key={size}
                                        onClick={() => handleFilterChange({ size })}
                                        className={`w-9 h-9 flex items-center justify-center text-[11px] font-bold uppercase rounded-full border transition-colors duration-300 ${
                                            active ? 'bg-charcoal text-cream border-charcoal' : 'border-charcoal/20 text-charcoal/70 hover:border-charcoal hover:text-charcoal'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tri + compteur */}
                        <div className="flex items-center justify-center gap-3 lg:pl-6 relative">
                            <button
                                onClick={() => setSortOpen(!sortOpen)}
                                className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-charcoal/70 hover:text-burgundy transition-colors"
                            >
                               
                            </button>
                            <AnimatePresence>
                                {sortOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 6 }}
                                        className="absolute top-9 right-0 bg-white border border-burgundy/10 rounded-xl shadow-lg overflow-hidden z-30 min-w-[160px]"
                                    >
                                        {SORTS.map((s) => (
                                            <button
                                                key={s.value}
                                                onClick={() => { handleFilterChange({ sort: s.value || undefined }); setSortOpen(false); }}
                                                className={`block w-full text-left px-4 py-2.5 text-[11px] uppercase tracking-wide font-bold transition-colors ${
                                                    currentSort === s.value ? 'text-burgundy bg-burgundy/5' : 'text-charcoal/70 hover:bg-[#F9F8F6]'
                                                }`}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <span className="w-[1px] h-4 bg-burgundy/10" />

                            <span className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-charcoal/50 whitespace-nowrap">
                                {products.total} Modèle{products.total > 1 ? 's' : ''}
                            </span>

                            {hasActiveFilters && (
                                <button
                                    onClick={() => router.get(route('products'))}
                                    className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-burgundy/70 hover:text-burgundy transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- GRILLE DE PRODUITS --- */}
                <motion.div
                    layout
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-14"
                >
                    <AnimatePresence mode='popLayout'>
                        {products.data.map((product) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                className="flex flex-col group h-full"
                            >
                                <Link href={route('product.show', product.id)} className="block w-full h-full cursor-pointer flex flex-col">

                                    <div className="relative aspect-[3/4] overflow-hidden bg-[#F9F8F6] mb-4 rounded-sm shadow-sm group-hover:shadow-lg transition-shadow duration-500">
                                        <ProductBadge tag={product.tag} discount={product.discount_pct} />

                                        <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-cream/90 text-charcoal/60 hover:text-burgundy shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-110"
                                            aria-label="Ajouter aux favoris"
                                        >
                                            <Heart size={14} />
                                        </button>

                                        <img
                                            src={product.image}
                                            srcSet={product.srcset || undefined}
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                            alt={product.name}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover object-top group-hover:scale-[1.04] transition duration-700 ease-out"
                                        />

                                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out hidden md:block">
                                            <button className="bg-cream/95 text-burgundy w-full py-3 text-[10px] uppercase font-bold tracking-[0.15em] hover:bg-burgundy hover:text-cream transition-colors duration-300 shadow-lg rounded-sm">
                                                Découvrir
                                            </button>
                                        </div>
                                    </div>

                                    {product.category && (
                                        <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-burgundy/50 text-center mb-1">
                                            {product.category}
                                        </span>
                                    )}

                                    <h3 className="text-sm md:text-base font-medium text-charcoal truncate group-hover:text-burgundy transition-colors duration-300 mb-1.5 font-serif text-center px-2">
                                        {product.name}
                                    </h3>

                                    <div className="mt-auto flex flex-wrap items-center justify-center gap-2.5">
                                        <p className={`text-sm tracking-wide ${product.original_price ? 'text-charcoal font-bold' : 'text-burgundy font-medium'}`}>
                                            {parseFloat(product.price).toFixed(2)} DT
                                        </p>
                                        {product.original_price && (
                                            <p className="text-[11px] text-charcoal/40 line-through">
                                                {parseFloat(product.original_price).toFixed(2)} DT
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {products.data.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-24 text-center bg-[#F9F8F6] border border-dashed border-burgundy/30 rounded-lg">
                            <SlidersHorizontal size={40} className="text-burgundy/40 mb-4" />
                            <h3 className="text-xl font-dream text-charcoal mb-2">Aucun modèle disponible</h3>
                            <p className="text-charcoal/60 font-serif max-w-md">
                                Aucun modèle ne correspond à cette catégorie et cette taille. Essayez une autre combinaison.
                            </p>
                            <button
                                onClick={() => router.get(route('products'))}
                                className="mt-6 bg-burgundy text-cream px-6 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-charcoal transition-colors shadow-md rounded-full"
                            >
                                Voir toute la collection
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* --- PAGINATION --- */}
                {products.links && products.links.length > 3 && (
                    <div className="flex justify-center mt-20 border-t border-charcoal/10 pt-10">
                        <div className="flex flex-wrap justify-center gap-2">
                            {products.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`w-9 h-9 flex items-center justify-center rounded-full text-xs uppercase tracking-widest font-bold transition-colors duration-300 ${link.active
                                            ? 'bg-burgundy text-cream shadow-sm'
                                            : !link.url
                                                ? 'text-charcoal/30 cursor-not-allowed'
                                                : 'text-charcoal hover:bg-burgundy/5 border border-transparent hover:border-burgundy/20 bg-transparent'
                                        }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    preserveScroll
                                />
                            ))}
                        </div>
                    </div>
                )}
                <ReviewsCarousel />

                {/* --- STATISTIQUES --- */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                    className="mt-24 mb-8 pt-16 border-t border-burgundy/10 overflow-hidden"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-burgundy/10">
                        {[
                            { icon: <ShoppingBag size={100} strokeWidth={1} />, stat: '+5000', label: 'Unités Vendues' },
                            { icon: <Heart size={100} strokeWidth={1} />, stat: '98%', label: 'Clientes Satisfaites' },
                            { icon: <Award size={100} strokeWidth={1} />, stat: '5 Ans', label: "D'Expertise Mode" },
                        ].map((s, i) => (
                            <div key={i} className="flex flex-col items-center justify-center relative group py-8 md:py-4">
                                <div className="absolute inset-0 flex items-center justify-center text-burgundy opacity-10 group-hover:opacity-20 transition-opacity duration-700 transform scale-[2.5] z-0">
                                    {s.icon}
                                </div>
                                <div className="relative z-10 flex flex-col items-center">
                                    <span className="text-6xl md:text-7xl font-dream text-burgundy mb-2 tracking-tighter">{s.stat}</span>
                                    <span className="text-[11px] md:text-xs uppercase tracking-[0.2em] font-bold text-charcoal/80">
                                        {s.label}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

            </div>
        </MainLayout>
    );
}