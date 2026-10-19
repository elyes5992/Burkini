import MainLayout from '@/Layouts/MainLayout';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Link, router } from '@inertiajs/react';
import {
    Flame, Star, Sparkles, Tag, SlidersHorizontal,
    Activity, Zap, ShieldCheck, RefreshCw,
    Heart, X, ArrowUpDown, Check
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

/* ------------------------------------------------------------------ */
/* Config                                                             */
/* ------------------------------------------------------------------ */

const SORTS = [
    { value: '', label: 'Pertinence' },
    { value: 'price_asc', label: 'Prix croissant' },
    { value: 'price_desc', label: 'Prix décroissant' },
    { value: 'newest', label: 'Nouveautés' },
];

const PERKS = [
    { icon: Activity, text: 'Coupe ergonomique sport' },
    { icon: Zap, text: 'Tissu élastique & souple' },
    { icon: ShieldCheck, text: 'Haute durabilité' },
    { icon: RefreshCw, text: 'Échange possible' },
];

const EASE = [0.22, 1, 0.36, 1];
const NO_SCROLLBAR = '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden';

/* ------------------------------------------------------------------ */
/* Small Components                                                   */
/* ------------------------------------------------------------------ */

const ProductBadge = ({ tag, discount }) => {
    if (!tag) return null;

    const badges = {
        promo: {
            bg: 'bg-burgundy text-cream',
            icon: <Flame size={11} />,
            text: discount ? `-${discount}%` : 'Promo',
        },
        bestseller: {
            bg: 'bg-charcoal text-cream',
            icon: <Star size={11} fill="currentColor" />,
            text: 'Best seller',
        },
        nouveaute: {
            bg: 'bg-cream/95 text-burgundy',
            icon: <Sparkles size={11} />,
            text: 'Nouveau',
        },
    };

    const config = badges[tag] || { bg: 'bg-charcoal text-cream', icon: <Tag size={11} />, text: tag };

    return (
        <span className={`absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide shadow-sm backdrop-blur ${config.bg}`}>
            {config.icon}
            {config.text}
        </span>
    );
};

const ScrollRow = ({ children, className = '' }) => (
    <div className={`flex items-center gap-1.5 overflow-x-auto snap-x ${NO_SCROLLBAR} ${className}`}>
        {children}
    </div>
);

const SortMenu = ({ currentSort, onChange }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
        document.addEventListener('mousedown', close);
        document.addEventListener('touchstart', close);
        return () => {
            document.removeEventListener('mousedown', close);
            document.removeEventListener('touchstart', close);
        };
    }, []);

    const current = SORTS.find((s) => s.value === (currentSort || '')) || SORTS[0];

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                className="flex items-center gap-2 rounded-full border border-charcoal/15 px-3.5 h-9 text-xs font-medium text-charcoal/80 hover:border-burgundy hover:text-burgundy transition-colors"
            >
                <ArrowUpDown size={13} />
                <span className="hidden sm:inline">{current.label}</span>
                <span className="sm:hidden">Trier</span>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 top-11 z-30 min-w-[190px] overflow-hidden rounded-2xl border border-burgundy/10 bg-white shadow-xl"
                    >
                        {SORTS.map((s) => {
                            const active = (currentSort || '') === s.value;
                            return (
                                <button
                                    key={s.value}
                                    onClick={() => { onChange(s.value || undefined); setOpen(false); }}
                                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${
                                        active ? 'bg-burgundy/5 font-semibold text-burgundy' : 'text-charcoal/75 hover:bg-[#F9F8F6]'
                                    }`}
                                >
                                    {s.label}
                                    {active && <Check size={14} />}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ProductCard = ({ product, index, liked, onLike, reduce }) => (
    <motion.article
        initial={reduce ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: EASE, delay: (index % 4) * 0.07 }}
        className="group"
    >
        <Link href={route('product.show', product.id)} className="block">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#F1EEE8]">
                <ProductBadge tag={product.tag} discount={product.discount_pct} />

                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onLike(product.id); }}
                    aria-label="Ajouter aux favoris"
                    aria-pressed={liked}
                    className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 shadow-sm backdrop-blur transition-transform duration-300 hover:scale-110 active:scale-90"
                >
                    <motion.span key={liked} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
                        <Heart size={15} className={liked ? 'text-burgundy' : 'text-charcoal/60'} fill={liked ? 'currentColor' : 'none'} />
                    </motion.span>
                </button>

                <img
                    src={product.image}
                    srcSet={product.srcset || undefined}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-1/3 bg-gradient-to-t from-charcoal/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:block" />
                <span className="absolute inset-x-0 bottom-4 hidden translate-y-3 text-center text-xs font-medium tracking-[0.2em] text-cream opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:block">
                    Découvrir
                </span>
            </div>

            <div className="mt-4 px-1 text-center">
                <h3 className="truncate font-serif text-[15px] text-charcoal transition-colors duration-300 group-hover:text-burgundy md:text-base">
                    {product.name}
                </h3>
                <div className="mt-1.5 flex items-baseline justify-center gap-2">
                    <span className={`text-sm font-semibold tabular-nums ${product.original_price ? 'text-burgundy' : 'text-charcoal'}`}>
                        {parseFloat(product.price).toFixed(2)} DT
                    </span>
                    {product.original_price && (
                        <span className="text-xs tabular-nums text-charcoal/40 line-through">
                            {parseFloat(product.original_price).toFixed(2)} DT
                        </span>
                    )}
                </div>
            </div>
        </Link>
    </motion.article>
);

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function Survetements({ products, currentSize, currentSort, availableSizes = [] }) {
    const reduce = useReducedMotion();
    const [liked, setLiked] = useState(() => new Set());

    const toggleLike = (id) =>
        setLiked((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

    const handleFilterChange = (patch) => {
        router.get(
            route('survetements'),
            {
                size: currentSize || undefined,
                sort: currentSort || undefined,
                ...patch,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const hasActiveFilters = !!currentSize || !!currentSort;
    const gridKey = `${currentSize}-${currentSort}-${products.current_page ?? 1}`;

    return (
        <MainLayout>
            <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 md:pt-16">

                {/* ---------- HEADER ---------- */}
                <header className="mx-auto mb-8 max-w-2xl text-center md:mb-12">
                    <motion.h1
                        initial={reduce ? false : { opacity: 0, y: 24, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.9, ease: EASE }}
                        className="font-dream text-[2.6rem] leading-[1.05] tracking-wide text-charcoal first-letter:capitalize md:text-6xl"
                    >
                        Survêtements Sport
                    </motion.h1>
                    <motion.span
                        initial={reduce ? false : { scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.3, ease: EASE }}
                        className="mx-auto mt-6 block h-px w-24 origin-center bg-burgundy/30"
                    />
                </header>

                {/* ---------- PERKS (2x2 grid on mobile, inline row on desktop) ---------- */}
                <div className="mb-10 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-burgundy/10 py-4 md:mb-12 md:flex md:flex-row md:items-center md:justify-center md:gap-12">
                    {PERKS.map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-2 text-charcoal/75">
                            <Icon size={16} strokeWidth={1.5} className="shrink-0 text-burgundy" />
                            <span className="text-xs md:text-[13px]">{text}</span>
                        </div>
                    ))}
                </div>

                {/* ---------- FILTER BAR ---------- */}
                <div className="sticky top-2 z-20 mb-10 md:mb-14">
                    <div className="rounded-3xl border border-burgundy/10 bg-cream/90 px-3 py-3 shadow-md backdrop-blur-md md:px-6 md:py-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">

                            {/* Sizes */}
                            <div className="flex items-center gap-2">
                                <span className="mr-1 shrink-0 text-xs text-charcoal/45">Taille</span>
                                <ScrollRow className="min-w-0 flex-1 -mx-1 px-1 sm:mx-0 sm:flex-none sm:px-0">
                                    {[null, ...availableSizes].map((size) => {
                                        const active = (currentSize || null) === size;
                                        return (
                                            <button
                                                key={size ?? 'all'}
                                                onClick={() => handleFilterChange({ size: size || undefined })}
                                                aria-pressed={active}
                                                className={`relative flex h-9 shrink-0 snap-start items-center justify-center rounded-full border px-3 text-xs font-semibold transition-colors duration-300 ${
                                                    size ? 'min-w-[2.25rem]' : ''
                                                } ${
                                                    active
                                                        ? 'border-charcoal bg-charcoal text-cream'
                                                        : 'border-charcoal/15 text-charcoal/70 hover:border-charcoal hover:text-charcoal'
                                                }`}
                                            >
                                                {size ?? 'Toutes'}
                                            </button>
                                        );
                                    })}
                                </ScrollRow>
                            </div>

                            {/* Sort */}
                            <div className="flex justify-end">
                                <SortMenu currentSort={currentSort} onChange={(sort) => handleFilterChange({ sort })} />
                            </div>
                        </div>

                        {/* count + reset */}
                        <div className="mt-3 flex items-center justify-between border-t border-burgundy/10 pt-3 text-xs text-charcoal/55">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={products.total}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {products.total} modèle{products.total > 1 ? 's' : ''}
                                </motion.span>
                            </AnimatePresence>

                            <AnimatePresence>
                                {hasActiveFilters && (
                                    <motion.button
                                        initial={{ opacity: 0, x: 8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 8 }}
                                        onClick={() => router.get(route('survetements'))}
                                        className="flex items-center gap-1 font-medium text-burgundy hover:underline"
                                    >
                                        <X size={13} /> Réinitialiser
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* ---------- GRID ---------- */}
                <div key={gridKey} className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-7 md:gap-y-14 lg:grid-cols-4">
                    {products.data.map((product, i) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            index={i}
                            liked={liked.has(product.id)}
                            onLike={toggleLike}
                            reduce={reduce}
                        />
                    ))}

                    {products.data.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-burgundy/25 bg-[#F9F8F6] px-6 py-24 text-center">
                            <SlidersHorizontal size={36} className="mb-4 text-burgundy/40" />
                            <h3 className="mb-2 font-dream text-2xl text-charcoal">Aucun modèle disponible</h3>
                            <p className="max-w-md font-serif text-charcoal/60">
                                Aucun survêtement ne correspond à cette taille pour le moment.
                            </p>
                            <button
                                onClick={() => router.get(route('survetements'))}
                                className="mt-6 rounded-full bg-burgundy px-7 py-3 text-xs font-semibold tracking-wide text-cream shadow-md transition-colors hover:bg-charcoal"
                            >
                                Voir toute la collection
                            </button>
                        </div>
                    )}
                </div>

                {/* ---------- PAGINATION ---------- */}
                {products.links && products.links.length > 3 && (
                    <nav className="mt-20 flex justify-center border-t border-charcoal/10 pt-10" aria-label="Pagination">
                        <div className="flex flex-wrap justify-center gap-2">
                            {products.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    preserveScroll
                                    className={`flex h-10 min-w-[2.5rem] items-center justify-center rounded-full px-3 text-xs font-semibold transition-colors duration-300 ${
                                        link.active
                                            ? 'bg-burgundy text-cream shadow-sm'
                                            : !link.url
                                                ? 'cursor-not-allowed text-charcoal/30'
                                                : 'border border-transparent text-charcoal hover:border-burgundy/20 hover:bg-burgundy/5'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </nav>
                )}
            </div>
        </MainLayout>
    );
}