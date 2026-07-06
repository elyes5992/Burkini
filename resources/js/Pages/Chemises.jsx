import MainLayout from '@/Layouts/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, router } from '@inertiajs/react';
import { 
    Flame, Star, Sparkles, Tag, SlidersHorizontal, 
    Wind, Feather, Award, CheckCircle,
    ShoppingBag, Heart
} from 'lucide-react';

// IMPORT CORRIGÉ : Attention à l'orthographe du dossier 'Components' (et pas 'Componenets') 
// et au nom de la fonction exportée par défaut 'ChemisesReviewsCarousel'
import ChemisesReviewsCarousel from '@/Components/ChemisesReviews';

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

export default function Chemises({ products, currentSize, availableSizes }) {

    const handleFilterChange = (value) => {
        router.get(route('chemises'), {
            size: value || undefined
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 pb-20 pt-8 md:pt-12">

                {/* --- HEADER: Titre --- */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-dream text-charcoal tracking-wide capitalize mb-6">
                        Collection Chemises
                    </h1>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-2xl mx-auto"
                    >
                        <p className="text-charcoal/70 font-serif text-sm md:text-base leading-relaxed italic">
                            "L'élégance au quotidien. Découvrez notre collection de chemises fluides et raffinées, parfaites pour compléter votre tenue avec légèreté."
                        </p>
                    </motion.div>
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <span className="h-[1px] w-12 bg-burgundy/20"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-burgundy/40"></span>
                        <span className="h-[1px] w-12 bg-burgundy/20"></span>
                    </div>
                </div>

                {/* --- AVANTAGES SPÉCIFIQUES CHEMISES --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-14 max-w-5xl mx-auto">
                    {[
                        { icon: <Wind size={20} strokeWidth={1.5} />, text: "Tissu fluide et respirant" },
                        { icon: <Star size={20} strokeWidth={1.5} />, text: "Coupe élégante & moderne" },
                        { icon: <Feather size={20} strokeWidth={1.5} />, text: "Confort absolu" },
                        { icon: <Award size={20} strokeWidth={1.5} />, text: "Finitions premium" }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * idx }}
                            className="bg-[#F9F8F6] border border-burgundy/5 p-4 flex flex-col items-center justify-center text-center gap-3 hover:border-burgundy/20 transition-colors duration-300 shadow-sm"
                        >
                            <div className="text-burgundy bg-white p-2 rounded-full shadow-sm">
                                {item.icon}
                            </div>
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-charcoal leading-relaxed">
                                {item.text}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* --- BARRE DE FILTRE (Taille en pastilles) --- */}
                <div className="mb-14 flex flex-col items-center gap-6">

                    <div className="bg-[#F9F8F6] border border-burgundy/10 p-1.5 rounded-full shadow-sm flex flex-wrap justify-center gap-1.5">
                        <button
                            onClick={() => handleFilterChange('')}
                            className={`h-10 px-4 flex items-center justify-center rounded-full text-[10px] uppercase tracking-widest font-bold transition-colors duration-300 ${
                                !currentSize ? 'bg-burgundy text-cream shadow-sm' : 'text-charcoal/60 hover:text-burgundy'
                            }`}
                        >
                            Toutes les tailles
                        </button>
                        {availableSizes.map((size) => {
                            const active = currentSize === size;
                            return (
                                <button
                                    key={size}
                                    onClick={() => handleFilterChange(size)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-full text-[11px] font-bold uppercase transition-colors duration-300 ${
                                        active ? 'bg-burgundy text-cream shadow-sm' : 'text-charcoal/60 hover:text-burgundy'
                                    }`}
                                >
                                    {size}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-charcoal/60">
                            {products.total} Modèle{products.total > 1 ? 's' : ''}
                        </span>
                        {!!currentSize && (
                            <button
                                onClick={() => router.get(route('chemises'))}
                                className="flex items-center gap-1 text-[10px] md:text-xs uppercase tracking-widest font-bold text-burgundy/70 hover:text-burgundy transition-colors"
                            >
                                Effacer le filtre
                            </button>
                        )}
                    </div>

                </div>

                {/* --- GRILLE DE PRODUITS --- */}
                <motion.div
                    layout
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12"
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

                                    <div className="relative aspect-[3/4] overflow-hidden bg-[#F9F8F6] mb-5 shadow-sm group-hover:shadow-md transition-shadow duration-500">
                                        <ProductBadge tag={product.tag} discount={product.discount_pct} />

                                        <img
                                            src={product.image}
                                            srcSet={product.srcset || undefined}
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                            alt={product.name}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-700 ease-in-out"
                                        />

                                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out hidden md:block">
                                            <button className="bg-cream/95 text-burgundy w-full py-3 text-[10px] uppercase font-bold tracking-[0.1em] hover:bg-burgundy hover:text-cream transition-colors duration-300 shadow-lg border border-transparent hover:border-cream/20">
                                                Découvrir
                                            </button>
                                        </div>
                                    </div>

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
                        <div className="col-span-full flex flex-col items-center justify-center py-24 text-center bg-[#F9F8F6] border border-dashed border-burgundy/30">
                            <SlidersHorizontal size={40} className="text-burgundy/40 mb-4" />
                            <h3 className="text-xl font-dream text-charcoal mb-2">Aucun modèle disponible</h3>
                            <p className="text-charcoal/60 font-serif max-w-md">
                                Nous n'avons pas trouvé de chemises correspondant à cette taille.
                            </p>
                            <button
                                onClick={() => router.get(route('chemises'))}
                                className="mt-6 bg-burgundy text-cream px-6 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-charcoal transition-colors shadow-md"
                            >
                                Voir toutes les chemises
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
                                    className={`px-4 py-2 text-xs uppercase tracking-widest font-bold transition-colors duration-300 ${link.active
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

                {/* --- AVIS SUR LES CHEMISES (COMPOSANT INTÉGRÉ ICI) --- */}
                <ChemisesReviewsCarousel />

                {/* --- STATISTIQUES (RÉASSURANCE) --- */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                    className="mt-24 mb-8 pt-16 border-t border-burgundy/10 overflow-hidden"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-burgundy/10">
                        <div className="flex flex-col items-center justify-center relative group py-8 md:py-4">
                            <div className="absolute inset-0 flex items-center justify-center text-burgundy opacity-10 group-hover:opacity-20 transition-opacity duration-700 transform scale-[2.5] z-0">
                                <ShoppingBag size={100} strokeWidth={1} />
                            </div>
                            <div className="relative z-10 flex flex-col items-center">
                                <span className="text-6xl md:text-7xl font-dream text-burgundy mb-2 tracking-tighter">+3k</span>
                                <span className="text-[11px] md:text-xs uppercase tracking-[0.2em] font-bold text-charcoal/80">Unités Vendues</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center relative group py-8 md:py-4">
                            <div className="absolute inset-0 flex items-center justify-center text-burgundy opacity-10 group-hover:opacity-20 transition-opacity duration-700 transform scale-[2.5] z-0">
                                <Heart size={100} strokeWidth={1} />
                            </div>
                            <div className="relative z-10 flex flex-col items-center">
                                <span className="text-6xl md:text-7xl font-dream text-burgundy mb-2 tracking-tighter">98%</span>
                                <span className="text-[11px] md:text-xs uppercase tracking-[0.2em] font-bold text-charcoal/80">Clientes Satisfaites</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center relative group py-8 md:py-4">
                            <div className="absolute inset-0 flex items-center justify-center text-burgundy opacity-10 group-hover:opacity-20 transition-opacity duration-700 transform scale-[2.5] z-0">
                                <Award size={100} strokeWidth={1} />
                            </div>
                            <div className="relative z-10 flex flex-col items-center">
                                <span className="text-6xl md:text-7xl font-dream text-burgundy mb-2 tracking-tighter">5 Ans</span>
                                <span className="text-[11px] md:text-xs uppercase tracking-[0.2em] font-bold text-charcoal/80">D'Expertise Mode</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </MainLayout>
    );
}