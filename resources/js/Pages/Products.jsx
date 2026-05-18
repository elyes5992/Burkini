import MainLayout from '@/Layouts/MainLayout';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';

export default function Products({ products, currentCategory }) {
    const categories = ['tous', 'non voilée', 'voilée', 'enfant'];

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-serif text-center mb-8 capitalize">
                    {currentCategory === 'tous' ? 'Notre Collection' : `Collection ${currentCategory}`}
                </h1>

                {/* Filtres par pilules (Très ergonomique sur mobile) */}
                <div className="flex overflow-x-auto space-x-3 pb-4 mb-8 hide-scrollbar justify-start md:justify-center">
                    {categories.map((cat) => (
                        <Link
                            key={cat}
                            href={route('products', { category: cat })}
                            className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium transition ${
                                currentCategory === cat 
                                ? 'bg-sky-700 text-white shadow-md' 
                                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                            }`}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </Link>
                    ))}
                </div>

                {/* Grille de produits : 2 colonnes mobile, 4 colonnes bureau */}
                <motion.div 
                    layout
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8"
                >
                    {products.map((product) => (
                        <motion.div 
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col group"
                        >
                            {/* 🔴 AJOUT DU LINK ICI POUR RENDRE LA CARTE CLIQUABLE 🔴 */}
                            <Link href={route('product.show', product.id)} className="block w-full h-full cursor-pointer">
                                
                                {/* Ratio 3/4 pour des images de mode uniformes */}
                                <div className="relative aspect-[3/4] overflow-hidden bg-stone-200 rounded-lg mb-3">
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                                    />
                                    {/* Le button est devenu une div pour respecter les standards HTML (pas de bouton dans un lien) */}
                                    <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur text-stone-800 text-xs py-2 rounded-md font-semibold opacity-0 group-hover:opacity-100 transition md:block hidden shadow-sm text-center">
                                        Voir le produit
                                    </div>
                                </div>
                                <h3 className="text-sm font-medium text-stone-800 truncate group-hover:text-sky-700 transition">{product.name}</h3>
                               <p className="text-sky-700 font-semibold mt-1">{Number(product.price).toFixed(2)} DT</p>
                                
                            </Link>
                        </motion.div>
                    ))}
                    
                    {products.length === 0 && (
                        <div className="col-span-full text-center py-12 text-stone-500">
                            Aucun produit trouvé dans cette catégorie.
                        </div>
                    )}
                </motion.div>
            </div>
        </MainLayout>
    );
}