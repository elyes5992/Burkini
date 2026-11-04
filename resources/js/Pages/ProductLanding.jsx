import { useState, useRef, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Star, ShoppingBag, Plus, Minus,
    Flame, Sparkles, Tag, Droplets, Wind, Feather, RefreshCw,
    Truck, ShieldCheck, Check
} from 'lucide-react';
import ReviewsCarousel from '@/Components/ReviewsCarousel';
import WhatsAppButton from '@/Components/WhatsAppButton';

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
        <div className={`absolute top-4 left-4 z-10 flex items-center text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 shadow-sm backdrop-blur-sm ${config.bg}`}>
            {config.icon}
            <span>{config.text}</span>
        </div>
    );
};

export default function ProductLanding({ product }) {
    const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState(product.images[0]?.src);
    const [processing, setProcessing] = useState(false);

    // Sticky mobile bottom bar tracking
    const ctaRef = useRef(null);
    const [showStickyBar, setShowStickyBar] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0);
            },
            { threshold: 0 }
        );

        if (ctaRef.current) observer.observe(ctaRef.current);
        return () => observer.disconnect();
    }, []);

    // ⚡️ DIRECT CHECKOUT BYPASS
    const handleDirectOrder = () => {
        if (!selectedSize || processing) return;
        setProcessing(true);

        router.post(route('cart.add'), {
            product_id: product.id,
            size: selectedSize,
            quantity: quantity,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                if (window.trackMetaEvent) {
                    window.trackMetaEvent('add_to_cart', {
                        product_id: product.id,
                        quantity: quantity,
                        price: parseFloat(product.price),
                    });
                }
                // Directly redirect to checkout
                window.location.href = route('checkout');
            },
            onError: () => setProcessing(false),
        });
    };

    return (
        <div className="bg-[#FAF9F5] min-h-screen text-charcoal font-sans selection:bg-burgundy selection:text-cream pb-24 lg:pb-0 relative">
            <Head>
                <title>{`${product.name} — Commande Express`}</title>
                <link rel="canonical" href={route('product.show', product.id)} />
            </Head>

            {/* ── HEADER WITH LOGO LINKING TO /survetements ── */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-burgundy/10 px-5 sm:px-8 py-3 flex items-center justify-between">
                <Link href={route('survetements')} className="block group">
                    <img
                        src="/image/logo.png"
                        alt="Vellure Logo"
                        className="h-10 sm:h-12 w-auto object-contain transition duration-300 group-hover:opacity-80"
                    />
                </Link>

                <a
                    href={`https://wa.me/21695940668?text=Bonjour,%20je%20souhaite%20commander%20le%20modèle%20${encodeURIComponent(product.name)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] sm:text-[11px] uppercase tracking-widest font-bold text-burgundy hover:text-charcoal transition flex items-center gap-1.5"
                >
                    Besoin d'aide ? WhatsApp
                </a>
            </header>

            {/* ── BREADCRUMB ── */}
            <div className="bg-[#F4F1EA] border-b border-burgundy/10 py-2.5 px-5 sm:px-8 text-[10px] uppercase tracking-widest font-bold text-charcoal/50">
                <div className="max-w-7xl mx-auto flex items-center gap-2">
                    <Link href="/" className="hover:text-burgundy transition">Accueil</Link>
                    <span>/</span>
                    <Link href={route('survetements')} className="hover:text-burgundy transition">Survêtements</Link>
                    <span>/</span>
                    <span className="text-charcoal truncate">{product.name}</span>
                </div>
            </div>

            {/* ── MAIN PRODUCT BLOCK ── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-start">

                    {/* ── STANDARD E-COMMERCE IMAGE GALLERY ── */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-3">
                        {/* 1. Large Main Photo */}
                        <div className="w-full bg-[#F4F1EA] overflow-hidden aspect-[3/4] relative shadow-sm border border-burgundy/5 rounded-[2px]">
                            <ProductBadge tag={product.tag} discount={product.discount_pct} />
                            <img
                                src={mainImage}
                                alt={product.name}
                                className="w-full h-full object-cover object-top"
                            />
                        </div>

                        {/* 2. Small Thumbnails Row Underneath Main Photo */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setMainImage(img.src)}
                                        className={`relative aspect-[3/4] w-16 sm:w-20 bg-[#F4F1EA] overflow-hidden flex-shrink-0 transition-all rounded-[2px] cursor-pointer ${
                                            mainImage === img.src
                                                ? 'border-2 border-burgundy ring-1 ring-burgundy/30 shadow-sm opacity-100 scale-102'
                                                : 'border border-burgundy/10 opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img.src} alt={`Vue ${index + 1}`} className="w-full h-full object-cover object-top" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── PRODUCT INFO & FAST ORDER ── */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        <span className="text-burgundy font-bold text-[10px] tracking-[0.25em] uppercase mb-2 block">
                            Collection {product.category}
                        </span>

                        <h1 className="text-3xl md:text-5xl font-dream text-charcoal mb-4 tracking-wide leading-tight">
                            {product.name}
                        </h1>

                        {/* Price & Rating */}
                        <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-burgundy/10">
                            <span className="text-3xl font-bold tracking-wide text-burgundy">
                                {parseFloat(product.price).toFixed(2)} DT
                            </span>

                            {product.original_price && (
                                <span className="text-lg text-charcoal/40 line-through">
                                    {parseFloat(product.original_price).toFixed(2)} DT
                                </span>
                            )}

                            <div className="flex items-center text-burgundy text-xs ml-auto bg-white px-3 py-1.5 border border-burgundy/10 rounded-full">
                                <Star size={12} fill="currentColor" />
                                <span className="text-charcoal ml-1.5 font-bold tracking-widest text-[11px]">4.9/5 (Avis vérifiés)</span>
                            </div>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <p className="text-charcoal/80 font-serif italic leading-relaxed mb-6 text-sm md:text-base">
                                "{product.description}"
                            </p>
                        )}

                        {/* Size Selector */}
                        <div className="mb-6">
                            <div className="flex justify-between items-end mb-3">
                                <h3 className="font-bold text-[11px] uppercase tracking-widest text-charcoal">
                                    Choisir la taille :
                                </h3>
                                <Link
                                    href={route('guide-tailles')}
                                    className="text-[10px] uppercase tracking-widest text-burgundy border-b border-burgundy/30 hover:border-burgundy transition-colors pb-0.5"
                                >
                                    Guide des tailles
                                </Link>
                            </div>
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => setSelectedSize(size)}
                                        className={`py-3 text-[11px] uppercase tracking-widest font-bold transition-all cursor-pointer ${
                                            selectedSize === size
                                                ? 'bg-charcoal text-cream shadow-md scale-102 border-charcoal'
                                                : 'bg-white border border-burgundy/20 text-charcoal hover:border-burgundy'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ⚡️ Action: Quantity + Direct Order Button */}
                        <div ref={ctaRef} className="flex items-center gap-3 mb-6 h-[54px]">
                            {/* Quantity Stepper */}
                            <div className="flex items-center justify-between border border-burgundy/20 bg-white w-28 h-full shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="w-10 h-full flex items-center justify-center text-charcoal/40 hover:text-burgundy transition-colors cursor-pointer"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="text-xs font-bold text-charcoal">{quantity}</span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                                    className="w-10 h-full flex items-center justify-center text-charcoal/40 hover:text-burgundy transition-colors cursor-pointer"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>

                            {/* Direct Buy Button */}
                            <button
                                type="button"
                                onClick={handleDirectOrder}
                                disabled={!selectedSize || processing}
                                className={`flex-1 h-full flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.2em] font-bold transition-all shadow-lg cursor-pointer ${
                                    selectedSize
                                        ? 'bg-burgundy text-cream hover:bg-charcoal hover:shadow-xl active:scale-98'
                                        : 'bg-gray-200 text-charcoal/40 cursor-not-allowed'
                                }`}
                            >
                                {processing ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin text-cream" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        <span>Redirection...</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag size={18} />
                                        <span>Commander directement →</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Reassurance Line */}
                        <div className="grid grid-cols-2 gap-3 p-4 bg-white border border-burgundy/10 mb-8 text-xs text-charcoal/80">
                            <div className="flex items-center gap-2">
                                <Truck size={16} className="text-burgundy shrink-0" />
                                <span>Livraison express 24h-48h</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={16} className="text-burgundy shrink-0" />
                                <span>Paiement à la livraison</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <RefreshCw size={16} className="text-burgundy shrink-0" />
                                <span>Échange de taille facile</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check size={16} className="text-emerald-600 shrink-0" />
                                <span>Vérification à la réception</span>
                            </div>
                        </div>

                        {/* Fabric Advantages */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-4 pt-6 border-t border-burgundy/10">
                            {[
                                { icon: <Droplets size={16} strokeWidth={1.5} />, text: 'Tissu maillot haut de gamme' },
                                { icon: <Wind size={16} strokeWidth={1.5} />, text: 'Séchage ultra-rapide' },
                                { icon: <Feather size={16} strokeWidth={1.5} />, text: 'Ne colle pas au corps' },
                                { icon: <ShieldCheck size={16} strokeWidth={1.5} />, text: 'Opaque même mouillé' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-2.5">
                                    <div className="text-burgundy mt-0.5">{item.icon}</div>
                                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-charcoal/80">
                                        {item.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Social Proof */}
            <div className="max-w-7xl mx-auto px-4 py-12 border-t border-burgundy/10">
                <ReviewsCarousel eyebrow="Avis Vérifiés" title="Ce qu'elles en disent" />
            </div>

            {/* ── MINIMAL FOOTER ── */}
            <footer className="py-8 px-6 border-t border-burgundy/10 text-center text-xs text-charcoal/60 bg-white">
                <p className="mb-2">© {new Date().getFullYear()} VELLURE STORE — Tous droits réservés.</p>
                <div className="flex justify-center gap-4">
                    <Link href={route('survetements')} className="underline hover:text-burgundy">Voir les survêtements</Link>
                    <Link href={route('products')} className="underline hover:text-burgundy">Voir tous nos maillots</Link>
                </div>
            </footer>

            {/* ── STICKY MOBILE CONVERSION BAR ── */}
            <div
                className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-white/95 backdrop-blur-md border-t border-burgundy/10 flex items-center justify-between gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-transform duration-300 ${
                    showStickyBar ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
                <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-bold uppercase text-charcoal/50">Taille:</span>
                    <select
                        value={selectedSize || ''}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="bg-[#FAF9F5] border border-burgundy/20 text-xs font-bold py-1.5 px-2 rounded focus:outline-none"
                    >
                        {product.sizes.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <button
                    type="button"
                    onClick={handleDirectOrder}
                    disabled={!selectedSize || processing}
                    className="flex-1 h-11 bg-burgundy text-cream text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow cursor-pointer active:scale-98"
                >
                    {processing ? 'Redirection...' : `Commander (${parseFloat(product.price).toFixed(0)} DT)`}
                </button>
            </div>

            {/* ── FLOATING WHATSAPP BUTTON COMPONENT ── */}
            <div className={showStickyBar ? '[&_a]:bottom-20 md:[&_a]:bottom-8' : ''}>
                <WhatsAppButton />
            </div>
        </div>
    );
}