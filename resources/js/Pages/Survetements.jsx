import MainLayout from '@/Layouts/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, router } from '@inertiajs/react';
import { Flame, Star, Sparkles, Tag, SlidersHorizontal, Activity, Zap, ShieldCheck, RefreshCw } from 'lucide-react';

const ProductBadge = ({ tag, discount }) => {
    if (!tag) return null;
    const badges = {
        promo: { bg: 'bg-burgundy text-cream', icon: <Flame size={12} className="mr-1" />, text: discount ? `Promo -${discount}%` : 'Promo' },
        bestseller: { bg: 'bg-charcoal text-cream', icon: <Star size={12} className="mr-1" fill="currentColor" />, text: 'Best Seller' },
        nouveaute: { bg: 'bg-cream text-burgundy border border-burgundy/20', icon: <Sparkles size={12} className="mr-1" />, text: 'Nouveau' }
    };
    const config = badges[tag] || { bg: 'bg-charcoal text-cream', icon: <Tag size={12} className="mr-1" />, text: tag };
    return (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className={`absolute top-3 left-3 z-10 flex items-center text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 shadow-sm ${config.bg}`}>
            {config.icon}
            <span>{config.text}</span>
        </motion.div>
    );
};

export default function Survetements({ products, currentSize, availableSizes = [] }) {
    const handleSizeChange = (size) => {
        router.get(route('survetements'), { size: size || undefined }, { preserveState: true, preserveScroll: true });
    };

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 pb-24 pt-8 md:pt-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-[11px] uppercase tracking-[0.35em] font-bold text-burgundy/70 mb-3">Vellure Activewear</p>
                    <h1 className="text-4xl md:text-5xl font-dream text-charcoal tracking-wide mb-4">Survêtements Sport</h1>
                    <p className="text-sm text-charcoal/50 font-serif max-w-md mx-auto">
                        Alliez liberté de mouvement, style moderne et confort pour vos sessions sportives et sorties.
                    </p>
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <span className="h-[1px] w-12 bg-burgundy/20" />
                        <span className="w-1.5 h-1.5 rounded-full bg-burgundy/40" />
                        <span className="h-[1px] w-12 bg-burgundy/20" />
                    </div>
                </div>

                {/* Selling Points */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-14 max-w-5xl mx-auto">
                    {[
                        { icon: <Activity size={20} />, text: "Coupe ergonomique sport" },
                        { icon: <Zap size={20} />, text: "Tissu élastique & souple" },
                        { icon: <ShieldCheck size={20} />, text: "Haute durabilité" },
                        { icon: <RefreshCw size={20} />, text: "Échange garanti" }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-[#F9F8F6] border border-burgundy/5 p-4 flex flex-col items-center justify-center text-center gap-2">
                            <div className="text-burgundy bg-white p-2 rounded-full shadow-sm">{item.icon}</div>
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-charcoal">{item.text}</span>
                        </div>
                    ))}
                </div>

                {/* Size Filter Bar */}
                {availableSizes.length > 0 && (
                    <div className="sticky top-2 z-20 mb-10 flex justify-center">
                        <div className="bg-cream/95 backdrop-blur-md border border-burgundy/10 rounded-2xl shadow-md px-5 py-3 flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-charcoal/50 mr-2">Taille :</span>
                            <button
                                onClick={() => handleSizeChange(null)}
                                className={`h-8 px-3 rounded-full text-[10px] uppercase font-bold tracking-wider transition ${
                                    !currentSize ? 'bg-charcoal text-cream' : 'text-charcoal/70 hover:bg-burgundy/10'
                                }`}
                            >
                                Toutes
                            </button>
                            {availableSizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => handleSizeChange(size)}
                                    className={`w-8 h-8 rounded-full text-[11px] font-bold uppercase transition ${
                                        currentSize === size ? 'bg-charcoal text-cream' : 'text-charcoal/70 hover:bg-burgundy/10'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-14">
                    <AnimatePresence mode="popLayout">
                        {products.data.map((product) => (
                            <motion.div key={product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col group h-full">
                                <Link href={route('product.show', product.id)} className="block w-full h-full cursor-pointer flex flex-col">
                                    <div className="relative aspect-[3/4] overflow-hidden bg-[#F9F8F6] mb-4 rounded-sm shadow-sm group-hover:shadow-lg transition-shadow duration-500">
                                        <ProductBadge tag={product.tag} discount={product.discount_pct} />
                                        <img
                                            src={product.image}
                                            srcSet={product.srcset || undefined}
                                            alt={product.name}
                                            className="w-full h-full object-cover object-top group-hover:scale-[1.04] transition duration-700 ease-out"
                                        />
                                    </div>
                                    <h3 className="text-sm md:text-base font-medium text-charcoal truncate group-hover:text-burgundy transition-colors mb-1.5 font-serif text-center px-2">
                                        {product.name}
                                    </h3>
                                    <div className="mt-auto flex items-center justify-center gap-2.5">
                                        <p className="text-sm font-bold text-burgundy">{parseFloat(product.price).toFixed(2)} DT</p>
                                        {product.original_price && (
                                            <p className="text-[11px] text-charcoal/40 line-through">{parseFloat(product.original_price).toFixed(2)} DT</p>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {products.data.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-[#F9F8F6] border border-dashed border-burgundy/30 rounded-lg">
                            <SlidersHorizontal size={40} className="text-burgundy/40 mx-auto mb-3" />
                            <h3 className="text-xl font-dream text-charcoal">Aucun survêtement disponible pour le moment</h3>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}