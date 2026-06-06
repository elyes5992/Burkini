import MainLayout from '@/Layouts/MainLayout';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { Flame, Star, Sparkles, Tag } from 'lucide-react';

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

export default function Products({ products, currentCategory }) {
    const categories = ['tous', 'non voilée', 'voilée', 'enfant'];

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 pb-16">

                <h1 className="text-4xl md:text-5xl font-dream text-center mb-10 text-charcoal tracking-wide capitalize">
                    {currentCategory === 'tous' ? 'La Collection' : `Collection ${currentCategory}`}
                </h1>

                <div className="flex overflow-x-auto space-x-4 pb-4 mb-12 hide-scrollbar justify-start md:justify-center">
                    {categories.map((cat) => (
                        <Link
                            key={cat}
                            href={route('products', { category: cat })}
                            className={`whitespace-nowrap px-8 py-2.5 text-[11px] uppercase tracking-widest font-bold transition duration-300 ${currentCategory === cat
                                    ? 'bg-burgundy text-cream shadow-md'
                                    : 'bg-transparent text-charcoal border border-burgundy/20 hover:bg-burgundy/5'
                                }`}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </Link>
                    ))}
                </div>

                <motion.div
                    layout
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-10"
                >
                    {/* MODIFIED: We now map over products.data instead of products */}
                    {products.data.map((product) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col group h-full"
                        >
                            <Link href={route('product.show', product.id)} className="block w-full h-full cursor-pointer flex flex-col">

                                <div className="relative aspect-[3/4] overflow-hidden bg-cream/50 mb-4">
                                    <ProductBadge tag={product.tag} discount={product.discount_pct} />

                                    {/* MODIFIED: Added lazy loading here */}
                                    <img
                                        src={product.image}
                                        srcSet={product.srcset || undefined}
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        alt={product.name}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-700"
                                    />

                                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out hidden md:block">
                                        <button className="bg-cream/95 text-burgundy w-full py-3 text-[10px] uppercase font-bold tracking-[0.1em] hover:bg-burgundy hover:text-cream transition-colors duration-300 shadow-lg">
                                            Découvrir
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-sm font-medium text-charcoal truncate group-hover:text-burgundy transition mb-1 font-serif text-center">
                                    {product.name}
                                </h3>

                                <div className="mt-auto flex flex-wrap items-center justify-center gap-2">
                                    <p className={`text-sm ${product.original_price ? 'text-charcoal font-bold' : 'text-burgundy'}`}>
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

                    {/* MODIFIED: Check products.data.length */}
                    {products.data.length === 0 && (
                        <div className="col-span-full flex justify-center py-20">
                            <p className="text-charcoal/50 font-serif text-lg">Aucun modèle trouvé dans cette catégorie.</p>
                        </div>
                    )}
                </motion.div>

                {/* NEW: Pagination Links Container */}
                {products.links && products.links.length > 3 && (
                    <div className="flex justify-center mt-16 mb-8">
                        <div className="flex flex-wrap justify-center gap-1 md:gap-2">
                            {products.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 text-sm border transition-colors duration-300 ${link.active
                                            ? 'bg-burgundy text-cream border-burgundy'
                                            : !link.url
                                                ? 'text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                                                : 'text-charcoal border-gray-300 hover:bg-burgundy hover:text-cream hover:border-burgundy'
                                        }`}
                                    // React dangerouslySetInnerHTML is needed because Laravel sends "&laquo;" for Previous/Next arrows
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    preserveScroll
                                />
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </MainLayout>
    );
}