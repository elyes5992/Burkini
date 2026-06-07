import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, router } from '@inertiajs/react';
import {
    Star, Truck, ShieldCheck, ArrowLeft, Heart, ShoppingBag,
    RotateCcw, X, Plus, Minus, Trash2, ArrowRight, CheckCircle,
    Flame, Sparkles, Tag
} from 'lucide-react';

// --- Smart Badge Component ---
const ProductBadge = ({ tag, discount }) => {
    if (!tag) return null;

    const badges = {
        promo: {
            bg: 'bg-red-500 text-white',
            icon: <Flame size={14} className="mr-1.5" />,
            text: discount ? `Promo -${discount}%` : 'Promo'
        },
        bestseller: {
            bg: 'bg-amber-400 text-amber-950',
            icon: <Star size={14} className="mr-1.5" fill="currentColor" />,
            text: 'Best Seller'
        },
        nouveaute: {
            bg: 'bg-emerald-500 text-white',
            icon: <Sparkles size={14} className="mr-1.5" />,
            text: 'Nouveau'
        }
    };

    const config = badges[tag] || { bg: 'bg-stone-800 text-white', icon: <Tag size={14} className="mr-1.5" />, text: tag };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            className={`absolute top-4 left-4 z-10 flex items-center text-xs font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm ${config.bg}`}
        >
            {config.icon}
            <span>{config.text}</span>
        </motion.div>
    );
};

export default function ProductShow({ product, recommendations }) {
    const [selectedSize, setSelectedSize] = useState(null);
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
            quantity: 1,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                fetchCart();
                setToast(true);
                setTimeout(() => setToast(false), 3000);
                setCartOpen(true);

                // ADD THIS:
                window.trackMetaEvent('add_to_cart', {
                    product_id: product.id,
                    quantity: 1,
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
            {/* Toast notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: 20 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, y: -20, x: 20 }}
                        className="fixed top-24 right-4 z-[60] flex items-center gap-3 bg-stone-900 text-white px-5 py-3 rounded-xl shadow-xl"
                    >
                        <CheckCircle size={20} className="text-green-400 shrink-0" />
                        <span className="text-sm font-medium">Article ajouté au panier !</span>
                        <button onClick={() => setToast(false)} className="ml-2 text-stone-400 hover:text-white">
                            <X size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cart Sidebar Overlay */}
            <AnimatePresence>
                {cartOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setCartOpen(false)}
                            className="fixed inset-0 bg-black/40 z-[70]"
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[80] flex flex-col shadow-2xl"
                        >
                            {/* Sidebar Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
                                <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
                                    <ShoppingBag size={20} /> Mon Panier
                                    {cartItems.length > 0 && (
                                        <span className="bg-sky-100 text-sky-700 text-xs px-2 py-0.5 rounded-full font-medium">
                                            {cartItems.reduce((s, i) => s + i.quantity, 0)}
                                        </span>
                                    )}
                                </h2>
                                <button onClick={() => setCartOpen(false)} className="text-stone-400 hover:text-stone-700 transition">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Sidebar Items */}
                            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                                {cartItems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center py-16">
                                        <ShoppingBag size={48} className="text-stone-200 mb-4" />
                                        <p className="text-stone-500 text-sm">Votre panier est vide</p>
                                    </div>
                                ) : (
                                    cartItems.map((item) => (
                                        <div key={item.key} className="flex gap-4 bg-stone-50 rounded-xl p-3">
                                            <img src={item.image} alt={item.name} className="w-20 h-28 object-cover rounded-lg flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-stone-900 text-sm truncate">{item.name}</p>
                                                <p className="text-xs text-stone-500 mt-0.5">Taille : {item.size}</p>
                                                <p className="text-sky-700 font-bold text-sm mt-1">{item.price.toFixed(2)} DT</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button
                                                        onClick={() => updateQty(item.key, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-200 disabled:opacity-40 transition"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQty(item.key, item.quantity + 1)}
                                                        disabled={item.quantity >= 10}
                                                        className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-200 disabled:opacity-40 transition"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-between items-end">
                                                <button onClick={() => removeItem(item.key)} className="text-stone-300 hover:text-red-500 transition">
                                                    <Trash2 size={16} />
                                                </button>
                                                <p className="text-sm font-semibold text-stone-800">{(item.price * item.quantity).toFixed(2)} DT</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Sidebar Footer */}
                            {cartItems.length > 0 && (
                                <div className="border-t border-stone-100 px-6 py-5 space-y-3">
                                    <div className="flex justify-between items-center font-semibold text-stone-900">
                                        <span>Total</span>
                                        <span>{cartTotal.toFixed(2)} DT</span>
                                    </div>
                                    <Link
                                        href={route('checkout')}
                                        className="w-full bg-sky-700 text-white py-3.5 rounded-full flex items-center justify-center gap-2 hover:bg-sky-800 transition font-medium text-sm"
                                    >
                                        Commander <ArrowRight size={16} />
                                    </Link>
                                    <button
                                        onClick={() => setCartOpen(false)}
                                        className="w-full text-stone-500 text-sm hover:text-stone-800 transition py-1"
                                    >
                                        Continuer mes achats
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Breadcrumb */}
            <div className="bg-white border-b border-stone-100 py-3 px-4">
                <div className="max-w-7xl mx-auto flex items-center text-sm text-stone-500">
                    <Link href={route('products')} className="flex items-center hover:text-sky-700 transition">
                        <ArrowLeft size={16} className="mr-2" /> Retour à la collection
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                    {/* Colonne Gauche : Images */}
                    <div className="w-full lg:w-1/2 flex flex-col-reverse md:flex-row gap-4">
                        <div className="flex md:flex-col gap-3 overflow-x-auto hide-scrollbar w-full md:w-20 shrink-0">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setMainImage(img.src)}
                                    className={`relative aspect-[3/4] md:w-full w-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${mainImage === img.src ? 'border-sky-700 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    <img src={img.src} alt={`Miniature ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Image Principale avec Badge Fièrement Affiché */}
                        <motion.div
                            key={mainImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="w-full bg-stone-100 rounded-2xl overflow-hidden aspect-[3/4] relative"
                        >
                            {/* Rendering the Smart Badge */}
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
                                className="absolute top-4 right-4 bg-white/90 p-3 rounded-full shadow-sm hover:scale-110 transition text-stone-400 z-10"
                            >
                                <Heart size={20} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
                            </button>
                        </motion.div>
                    </div>

                    {/* Colonne Droite : Infos Produit */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <span className="text-sky-700 font-medium text-sm tracking-widest uppercase mb-2 block">{product.category}</span>
                            <h1 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">{product.name}</h1>

                            {/* Prix avec support pour Promo (Original Price Barré) */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
                                <span className={`text-2xl font-bold ${product.original_price ? 'text-red-600' : 'text-stone-900'}`}>
                                    {parseFloat(product.price).toFixed(2)} DT
                                </span>

                                {product.original_price && (
                                    <span className="text-lg text-stone-400 line-through decoration-1">
                                        {parseFloat(product.original_price).toFixed(2)} DT
                                    </span>
                                )}

                                <div className="flex items-center text-amber-400 text-sm ml-auto bg-amber-50 px-2 py-1 rounded-md">
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <span className="text-stone-600 ml-2 font-medium">4.8/5</span>
                                </div>
                            </div>

                            <p className="text-stone-600 leading-relaxed mb-8">
                                {product.description}
                            </p>

                            {/* Sélecteur de Tailles */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-medium text-stone-900">Sélectionnez une taille</h3>
                                    <a href={route('guide-tailles')} className="text-sm text-sky-600 underline hover:text-sky-800">Guide des tailles</a>
                                </div>
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`py-3 rounded-lg border font-medium transition-all ${selectedSize === size
                                                ? 'bg-sky-900 border-sky-900 text-white shadow-md scale-105'
                                                : 'bg-white border-stone-200 text-stone-700 hover:border-sky-900'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={!selectedSize || processing}
                                className={`w-full py-4 rounded-full flex items-center justify-center gap-3 text-lg font-medium transition-all shadow-lg ${selectedSize
                                    ? 'bg-stone-900 text-white hover:bg-sky-900 hover:scale-[1.02]'
                                    : 'bg-stone-200 text-stone-500 cursor-not-allowed'
                                    }`}
                            >
                                <ShoppingBag size={24} />
                                {processing ? 'Ajout en cours...' : selectedSize ? 'Ajouter au panier' : 'Choisissez une taille'}
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 border-t border-stone-200 pt-8">
                                <div className="flex flex-col items-center text-center group">
                                    <Truck size={24} className="text-sky-700 mb-2 group-hover:scale-110 transition" strokeWidth={1.5} />
                                    <h4 className="text-sm font-semibold text-stone-800">Livraison Rapide</h4>
                                    <p className="text-xs text-stone-500 mt-1">Sous 48h/72h</p>
                                </div>
                                <div className="flex flex-col items-center text-center group">
                                    <ShieldCheck size={24} className="text-sky-700 mb-2 group-hover:scale-110 transition" strokeWidth={1.5} />
                                    <h4 className="text-sm font-semibold text-stone-800">Paiement Sécurisé</h4>
                                    <p className="text-xs text-stone-500 mt-1">100% à la livraison</p>
                                </div>
                                <div className="flex flex-col items-center text-center group">
                                    <RotateCcw size={24} className="text-sky-700 mb-2 group-hover:scale-110 transition" strokeWidth={1.5} />
                                    <h4 className="text-sm font-semibold text-stone-800">Retours Faciles</h4>
                                    <p className="text-xs text-stone-500 mt-1">Jusqu'à 14 jours</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Section Recommandations avec Badges de Promotion inclus */}
            <div className="bg-stone-50 py-16 mt-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-serif text-stone-900">Vous aimerez aussi</h2>
                        <div className="w-16 h-1 bg-sky-700 mx-auto mt-4 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {recommendations.map((rec) => (
                            <Link href={route('product.show', rec.id)} key={rec.id}>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="group cursor-pointer bg-white rounded-xl p-3 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col"
                                >
                                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-4">
                                        {/* Smart Badge on Recommendation Cards too */}
                                        <ProductBadge tag={rec.tag} discount={rec.discount_pct} />
                                        <img src={rec.image} alt={rec.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500" />
                                    </div>
                                    <h3 className="text-sm md:text-base font-medium text-stone-800 truncate mb-1">{rec.name}</h3>

                                    <div className="mt-auto flex flex-wrap items-center gap-2">
                                        <p className={`font-bold ${rec.original_price ? 'text-red-600' : 'text-sky-700'}`}>
                                            {parseFloat(rec.price).toFixed(2)} DT
                                        </p>
                                        {rec.original_price && (
                                            <p className="text-xs text-stone-400 line-through">
                                                {parseFloat(rec.original_price).toFixed(2)} DT
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}