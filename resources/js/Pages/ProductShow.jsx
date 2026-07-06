import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, router } from '@inertiajs/react';
import {
    Star, ArrowLeft, Heart, ShoppingBag,
    X, Plus, Minus, Trash2, ArrowRight, CheckCircle,
    Flame, Sparkles, Tag, Droplets, Wind, Feather, RefreshCw,
    Truck, ShieldCheck
} from 'lucide-react';
import ReviewsCarousel from '@/Components/ReviewsCarousel';

// --- Badge Identique à la page Boutique ---
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
            className={`absolute top-4 left-4 z-10 flex items-center text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 shadow-sm backdrop-blur-sm ${config.bg}`}
        >
            {config.icon}
            <span>{config.text}</span>
        </motion.div>
    );
};

export default function ProductShow({ product, recommendations }) {
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1); // NOUVEAU : État pour la quantité
    const [mainImage, setMainImage] = useState(product.images[0]?.src);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [toast, setToast] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleAddToCart = () => {
        if (!selectedSize || processing) return;
        setProcessing(true);

        router.post(route('cart.add'), {
            product_id: product.id,
            size: selectedSize,
            quantity: quantity, // NOUVEAU : Envoi de la quantité choisie
        }, {
            preserveScroll: true,
            onSuccess: () => {
                fetchCart();
                setToast(true);
                setTimeout(() => setToast(false), 3000);
                setCartOpen(true);
                // Réinitialiser la quantité après ajout (optionnel, mais propre)
                setQuantity(1); 

                window.trackMetaEvent('add_to_cart', {
                    product_id: product.id,
                    quantity: quantity,
                    price: parseFloat(product.price),
                });
            },
            onFinish: () => setProcessing(false),
        });
    };

    const fetchCart = () => {
        fetch(route('cart.json'), {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
            },
            credentials: 'same-origin',
        })
            .then(r => r.json())
            .then(data => setCartItems(Object.values(data)))
            .catch(err => console.error('Cart fetch error:', err));
    };

    const updateQty = (key, qty) => {
        router.patch(route('cart.update', key), { quantity: qty }, {
            preserveScroll: true,
            onSuccess: () => fetchCart(),
        });
    };

    const removeItem = (key) => {
        router.delete(route('cart.remove', key), {
            preserveScroll: true,
            onSuccess: () => fetchCart(),
        });
    };

    const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <MainLayout>
            {/* Toast notification de luxe */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: 20 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, y: -20, x: 20 }}
                        className="fixed top-24 right-4 z-[60] flex items-center gap-3 bg-charcoal text-cream px-5 py-3.5 shadow-xl border border-white/10"
                    >
                        <CheckCircle size={18} className="text-cream shrink-0" />
                        <span className="text-xs uppercase tracking-widest font-bold mt-0.5">Ajouté au panier</span>
                        <button onClick={() => setToast(false)} className="ml-4 text-cream/50 hover:text-cream transition-colors">
                            <X size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sidebar Panier */}
            <AnimatePresence>
                {cartOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setCartOpen(false)}
                            className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-[70]"
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#F9F8F6] z-[80] flex flex-col shadow-2xl border-l border-burgundy/10"
                        >
                            {/* Header Panier */}
                            <div className="flex items-center justify-between px-6 py-6 border-b border-burgundy/10 bg-white">
                                <h2 className="text-lg font-dream text-charcoal flex items-center gap-3">
                                    <ShoppingBag size={20} className="text-burgundy" /> Mon Panier
                                    {cartItems.length > 0 && (
                                        <span className="bg-burgundy text-cream text-[10px] px-2 py-0.5 rounded-full font-bold font-sans">
                                            {cartItems.reduce((s, i) => s + i.quantity, 0)}
                                        </span>
                                    )}
                                </h2>
                                <button onClick={() => setCartOpen(false)} className="text-charcoal/40 hover:text-burgundy transition">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Items Panier */}
                            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                                {cartItems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center py-16">
                                        <ShoppingBag size={48} strokeWidth={1} className="text-charcoal/20 mb-4" />
                                        <p className="text-charcoal/50 font-serif italic text-lg">Votre panier est vide</p>
                                    </div>
                                ) : (
                                    cartItems.map((item) => (
                                        <div key={item.key} className="flex gap-4 bg-white border border-burgundy/5 p-3 group hover:border-burgundy/20 transition-colors">
                                            <img src={item.image} alt={item.name} className="w-20 h-28 object-cover flex-shrink-0 bg-[#F9F8F6]" />
                                            <div className="flex-1 min-w-0 flex flex-col">
                                                <p className="font-serif text-charcoal text-sm truncate">{item.name}</p>
                                                <p className="text-[10px] uppercase tracking-widest text-charcoal/50 mt-1 font-bold">Taille : {item.size}</p>
                                                <p className="text-burgundy font-bold text-sm mt-1">{item.price.toFixed(2)} DT</p>
                                                
                                                <div className="flex items-center gap-3 mt-auto">
                                                    <button
                                                        onClick={() => updateQty(item.key, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="text-charcoal/40 hover:text-burgundy disabled:opacity-30 transition"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-xs font-bold w-4 text-center text-charcoal">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQty(item.key, item.quantity + 1)}
                                                        disabled={item.quantity >= 10}
                                                        className="text-charcoal/40 hover:text-burgundy disabled:opacity-30 transition"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-between items-end">
                                                <button onClick={() => removeItem(item.key)} className="text-charcoal/20 hover:text-red-500 transition">
                                                    <Trash2 size={16} />
                                                </button>
                                                <p className="text-sm font-bold text-charcoal">{(item.price * item.quantity).toFixed(2)} DT</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer Panier */}
                            {cartItems.length > 0 && (
                                <div className="border-t border-burgundy/10 bg-white px-6 py-6 space-y-4">
                                    <div className="flex justify-between items-center text-charcoal">
                                        <span className="text-xs uppercase tracking-widest font-bold">Total</span>
                                        <span className="text-xl font-bold">{cartTotal.toFixed(2)} DT</span>
                                    </div>
                                    <Link
                                        href={route('checkout')}
                                        className="w-full bg-burgundy text-cream py-4 flex items-center justify-center gap-2 hover:bg-charcoal transition-colors text-xs uppercase tracking-widest font-bold shadow-md"
                                    >
                                        Finaliser la commande <ArrowRight size={16} />
                                    </Link>
                                    <button
                                        onClick={() => setCartOpen(false)}
                                        className="w-full text-charcoal/50 text-xs font-bold uppercase tracking-widest hover:text-burgundy transition-colors py-2"
                                    >
                                        Continuer mes achats
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Breadcrumb Élégant */}
            <div className="bg-[#F9F8F6] border-b border-burgundy/10 py-3 px-4">
                <div className="max-w-7xl mx-auto flex items-center text-[10px] uppercase tracking-widest font-bold text-charcoal/50">
                    <Link href={route('products')} className="flex items-center hover:text-burgundy transition-colors">
                        <ArrowLeft size={14} className="mr-2" /> Retour à la collection
                    </Link>
                    <span className="mx-3">/</span>
                    <span className="text-burgundy">{product.category}</span>
                </div>
            </div>

            {/* Contenu Principal */}
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">
                    
                    {/* Colonne Gauche : Images */}
                    <div className="w-full lg:w-1/2 flex flex-col-reverse md:flex-row gap-4 h-fit sticky top-24">
                        {/* Miniatures */}
                        <div className="flex md:flex-col gap-3 overflow-x-auto hide-scrollbar w-full md:w-24 shrink-0">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setMainImage(img.src)}
                                    className={`relative aspect-[3/4] md:w-full w-20 bg-[#F9F8F6] overflow-hidden flex-shrink-0 transition-all duration-300 ${
                                        mainImage === img.src ? 'border border-burgundy opacity-100 shadow-sm' : 'border border-transparent opacity-50 hover:opacity-100'
                                    }`}
                                >
                                    <img src={img.src} alt={`Vue ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Image Principale */}
                        <motion.div
                            key={mainImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="w-full bg-[#F9F8F6] overflow-hidden aspect-[3/4] relative shadow-sm border border-burgundy/5"
                        >
                            <ProductBadge tag={product.tag} discount={product.discount_pct} />

                            <img
                                src={mainImage}
                                srcSet={product.images.find(img => img.src === mainImage)?.srcset || undefined}
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                alt={product.name}
                                className="w-full h-full object-cover object-top"
                            />

                            <button
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-sm hover:scale-110 transition-transform text-charcoal/40 z-10"
                            >
                                <Heart size={18} className={isWishlisted ? "fill-burgundy text-burgundy" : ""} />
                            </button>
                        </motion.div>
                    </div>

                    {/* Colonne Droite : Infos Produit */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            
                            {/* Titre & Catégorie */}
                            <span className="text-burgundy font-bold text-[10px] tracking-[0.2em] uppercase mb-3 block">
                                Collection {product.category}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-dream text-charcoal mb-4 tracking-wide leading-tight">
                                {product.name}
                            </h1>

                            {/* Prix & Avis */}
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8 pb-8 border-b border-burgundy/10">
                                <span className={`text-2xl font-bold tracking-wide ${product.original_price ? 'text-charcoal' : 'text-burgundy'}`}>
                                    {parseFloat(product.price).toFixed(2)} DT
                                </span>

                                {product.original_price && (
                                    <span className="text-lg text-charcoal/40 line-through">
                                        {parseFloat(product.original_price).toFixed(2)} DT
                                    </span>
                                )}

                                <div className="flex items-center text-burgundy text-xs ml-auto bg-[#F9F8F6] px-3 py-1.5 border border-burgundy/10">
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} fill="currentColor" />
                                    <span className="text-charcoal ml-2 font-bold uppercase tracking-widest">4.8/5</span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-charcoal/80 font-serif italic leading-relaxed mb-10 text-sm md:text-base">
                                "{product.description}"
                            </p>

                            {/* Sélecteur de Tailles */}
                            <div className="mb-8">
                                <div className="flex justify-between items-end mb-4">
                                    <h3 className="font-bold text-[11px] uppercase tracking-widest text-charcoal">Sélectionnez la taille</h3>
                                    <a href={route('guide-tailles')} className="text-[10px] uppercase tracking-widest text-burgundy border-b border-burgundy/30 hover:border-burgundy transition-colors pb-0.5">
                                        Guide des tailles
                                    </a>
                                </div>
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`py-3 text-[11px] uppercase tracking-widest font-bold transition-all duration-300 ${
                                                selectedSize === size
                                                    ? 'bg-charcoal text-cream shadow-md scale-105 border-transparent'
                                                    : 'bg-white border border-burgundy/20 text-charcoal hover:border-burgundy hover:bg-[#F9F8F6]'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* ACTIONS : Quantité + Ajouter au Panier (Alignés) */}
                            <div className="flex items-center gap-3 mb-10 h-[54px]">
                                
                                {/* Sélecteur de Quantité */}
                                <div className="flex items-center justify-between border border-burgundy/20 bg-white w-28 h-full shrink-0">
                                    <button 
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="w-10 h-full flex items-center justify-center text-charcoal/40 hover:text-burgundy transition-colors"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="text-xs font-bold text-charcoal">{quantity}</span>
                                    <button 
                                        onClick={() => setQuantity(q => Math.min(10, q + 1))}
                                        className="w-10 h-full flex items-center justify-center text-charcoal/40 hover:text-burgundy transition-colors"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>

                                {/* Bouton Ajouter */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!selectedSize || processing}
                                    className={`flex-1 h-full flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-300 shadow-lg ${
                                        selectedSize
                                            ? 'bg-burgundy text-cream hover:bg-charcoal hover:shadow-xl'
                                            : 'bg-[#F9F8F6] border border-burgundy/10 text-charcoal/40 cursor-not-allowed'
                                    }`}
                                >
                                    <ShoppingBag size={18} />
                                    {processing ? 'Ajout en cours...' : selectedSize ? 'Ajouter au panier' : 'Sélectionner la taille'}
                                </button>
                                
                            </div>

                            {/* Avantages Spécifiques Produits (Grille 2x2 élégante) */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-6 mt-12 pt-8 border-t border-burgundy/10">
                                {[
                                    { icon: <Droplets size={18} strokeWidth={1.5} />, text: "Tissu polyamide spécial maillot" },
                                    { icon: <Wind size={18} strokeWidth={1.5} />, text: "Séchage ultra-rapide" },
                                    { icon: <Feather size={18} strokeWidth={1.5} />, text: "Ne colle pas au corps" },
                                    { icon: <RefreshCw size={18} strokeWidth={1.5} />, text: "Possibilité d'échange" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className="text-burgundy mt-0.5">{item.icon}</div>
                                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-charcoal/80 leading-relaxed">
                                            {item.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Réassurance Livraison/Paiement */}
                            <div className="flex items-center justify-center gap-8 mt-10 p-6 bg-[#F9F8F6] border border-burgundy/5 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <Truck size={20} className="text-charcoal/60" strokeWidth={1.5} />
                                    <span className="text-[9px] uppercase tracking-widest font-bold text-charcoal">Livraison 48h</span>
                                </div>
                                <div className="w-[1px] h-8 bg-burgundy/10"></div>
                                <div className="flex flex-col items-center gap-2">
                                    <ShieldCheck size={20} className="text-charcoal/60" strokeWidth={1.5} />
                                    <span className="text-[9px] uppercase tracking-widest font-bold text-charcoal">Paiement à la livraison</span>
                                </div>
                            </div>

                        </motion.div>
                    </div>
                </div>
            </div>
             {/* --- AVIS SUR CE PRODUIT --- */}
            <div className="max-w-7xl mx-auto px-4">
                <ReviewsCarousel
                    eyebrow="Ce qu'elles en disent"
                    title="Avis sur ce modèle"
                />
            </div>

            {/* --- SECTION RECOMMANDATIONS --- */}
            <div className="bg-[#F9F8F6] py-20 border-t border-burgundy/10 mt-12">
                <div className="max-w-7xl mx-auto px-4">
                    
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-dream text-charcoal">Vous aimerez aussi</h2>
                        <div className="flex justify-center items-center gap-3 mt-4">
                            <span className="h-[1px] w-8 bg-burgundy/20"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-burgundy/40"></span>
                            <span className="h-[1px] w-8 bg-burgundy/20"></span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {recommendations.map((rec) => (
                            <motion.div
                                key={rec.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="flex flex-col group h-full"
                            >
                                <Link href={route('product.show', rec.id)} className="block w-full h-full cursor-pointer flex flex-col">

                                    <div className="relative aspect-[3/4] overflow-hidden bg-white mb-5 shadow-sm border border-burgundy/5 group-hover:shadow-md transition-all duration-500">
                                        <ProductBadge tag={rec.tag} discount={rec.discount_pct} />

                                        <img 
                                            src={rec.image} 
                                            alt={rec.name} 
                                            loading="lazy"
                                            className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-700 ease-in-out" 
                                        />

                                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out hidden md:block">
                                            <button className="bg-cream/95 text-burgundy w-full py-3 text-[10px] uppercase font-bold tracking-[0.1em] hover:bg-burgundy hover:text-cream transition-colors duration-300 shadow-lg border border-transparent hover:border-cream/20">
                                                Découvrir
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-sm md:text-base font-medium text-charcoal truncate group-hover:text-burgundy transition-colors duration-300 mb-1.5 font-serif text-center px-2">
                                        {rec.name}
                                    </h3>

                                    <div className="mt-auto flex flex-wrap items-center justify-center gap-2.5">
                                        <p className={`text-sm tracking-wide ${rec.original_price ? 'text-charcoal font-bold' : 'text-burgundy font-medium'}`}>
                                            {parseFloat(rec.price).toFixed(2)} DT
                                        </p>
                                        {rec.original_price && (
                                            <p className="text-[11px] text-charcoal/40 line-through">
                                                {parseFloat(rec.original_price).toFixed(2)} DT
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}