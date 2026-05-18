import MainLayout from '@/Layouts/MainLayout';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { Sun, Droplet, ShieldCheck } from 'lucide-react'; // Icônes pour la section textile

export default function Home() {
    // Faux produits pour la section Tendance (à remplacer par la BDD plus tard)
    const trendingProducts = [
        { id: 1, name: "Ensemble Dalia Noir", price: "79.99", img: "/image/image1.jpg", category: "voilée" },
        { id: 2, name: "Maillot Azure Une Pièce", price: "45.00", img: "/image/image4.jpg", category: "non voilée" },
        { id: 3, name: "Burkini Floral Premium", price: "89.00", img: "/image/image2.png", category: "voilée" },
        { id: 4, name: "Ensemble Enfant Sirène", price: "35.00", img: "/image/image3.png", category: "enfant" },
    ];

    return (
        <MainLayout>
            {/* Hero Section */}
            <section className="relative h-[70vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
                <img 
                    src="/image/image1.jpg" 
                    alt="Hero Maillots Burkini" 
                    className="absolute inset-0 w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-stone-900/40"></div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-center text-white px-4"
                >
                    <h1 className="text-4xl md:text-6xl font-serif mb-4 drop-shadow-md">L'Élégance à la Plage</h1>
                    <p className="text-lg md:text-xl font-light mb-8 max-w-lg mx-auto drop-shadow-sm">
                        Découvrez notre collection de maillots de bain conçue pour sublimer toutes les femmes, en alliant pudeur et modernité.
                    </p>
                    <Link 
                        href={route('products')} 
                        className="inline-block bg-white text-stone-900 px-8 py-4 rounded-full text-sm uppercase tracking-widest font-semibold hover:bg-sky-50 hover:scale-105 transition duration-300 shadow-lg"
                    >
                        Découvrir la collection
                    </Link>
                </motion.div>
            </section>

            {/* Categories Section */}
            <section className="py-20 px-4 max-w-7xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-serif text-stone-800">Nos Catégories</h2>
                    <div className="w-20 h-1 bg-sky-700 mx-auto mt-4 rounded-full"></div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: 'Non Voilée', img: '/image/image2.png', cat: 'non voilée' },
                        { title: 'Voilée', img: '/image/image3.png', cat: 'voilée' },
                        { title: 'Enfant', img: '/image/image4.jpg', cat: 'enfant' }
                    ].map((item, index) => (
                        <Link href={route('products', { category: item.cat })} key={index}>
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                whileHover={{ y: -10 }}
                                className="relative h-96 rounded-2xl overflow-hidden group cursor-pointer shadow-xl"
                            >
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent flex items-end p-8">
                                    <div>
                                        <h3 className="text-white text-3xl font-serif mb-2">{item.title}</h3>
                                        <span className="text-sky-300 text-sm uppercase tracking-wider font-semibold group-hover:text-white transition">Voir les modèles &rarr;</span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Trending Products Section */}
            <section className="py-20 bg-stone-100/50">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row justify-between items-end mb-12"
                    >
                        <div>
                            <h2 className="text-3xl md:text-4xl font-serif text-stone-800">Tendances du Moment</h2>
                            <div className="w-20 h-1 bg-sky-700 mt-4 rounded-full"></div>
                        </div>
                        <Link href={route('products')} className="text-sky-700 font-medium hover:text-sky-900 hidden md:block">
                            Voir tout &rarr;
                        </Link>
                    </motion.div>

                    {/* Grille : 2 colonnes mobile, 4 bureau */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {trendingProducts.map((product, index) => (
                            <motion.div 
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group cursor-pointer"
                            >
                                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition duration-300">
                                    <img src={product.img} alt={product.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500" />
                                    {/* Badge Nouveauté */}
                                    {index === 0 && (
                                        <div className="absolute top-3 left-3 bg-white text-stone-900 text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-sm">Nouveau</div>
                                    )}
                                    {/* Bouton au survol (Bureau) */}
                                    <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden md:flex">
                                        <button className="bg-stone-900/90 backdrop-blur text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-sky-700 w-10/12">
                                            Aperçu Rapide
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-sm md:text-base font-medium text-stone-800 truncate">{product.name}</h3>
                                <p className="text-stone-500 text-xs capitalize mb-1">{product.category}</p>
                                <p className="text-sky-700 font-bold">{product.price} €</p>
                            </motion.div>
                        ))}
                    </div>
                    
                    {/* Bouton Voir Tout Mobile */}
                    <div className="mt-10 text-center md:hidden">
                        <Link href={route('products')} className="inline-block border border-stone-800 text-stone-800 px-8 py-3 rounded-full text-sm font-medium">
                            Voir toute la collection
                        </Link>
                    </div>
                </div>
            </section>

            {/* Textile Quality Section */}
            <section className="py-24 bg-stone-900 text-stone-100 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
                    {/* Image gauche */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2 relative"
                    >
                        <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                            <img src="/image/image4.jpg" alt="Qualité de nos textiles" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-sky-900/20 mix-blend-multiply"></div>
                        </div>
                        {/* Décoration */}
                        <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-sky-700/30 rounded-full blur-3xl -z-10"></div>
                    </motion.div>

                    {/* Contenu droite */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2"
                    >
                        <h2 className="text-3xl md:text-4xl font-serif mb-6 text-white">Nos Textiles, Votre Confort.</h2>
                        <p className="text-stone-400 mb-10 text-lg font-light leading-relaxed">
                            Nous concevons nos maillots Burkini avec des tissus de la plus haute qualité. Chaque pièce est pensée pour épouser parfaitement vos mouvements tout en respectant votre peau et vos valeurs.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="bg-sky-800 p-3 rounded-lg text-white shrink-0">
                                    <Droplet size={24} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-medium text-white mb-2">Séchage Rapide & Léger</h4>
                                    <p className="text-stone-400 text-sm">Notre technologie de tissu permet à l'eau de s'évacuer rapidement. Ne restez plus mouillée une fois sortie de l'eau.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-sky-800 p-3 rounded-lg text-white shrink-0">
                                    <Sun size={24} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-medium text-white mb-2">Protection Anti-UV (UPF 50+)</h4>
                                    <p className="text-stone-400 text-sm">Profitez du soleil en toute sérénité. Notre tissu agit comme un bouclier contre les rayons nocifs pour préserver votre peau.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-sky-800 p-3 rounded-lg text-white shrink-0">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-medium text-white mb-2">Opacité & Résistance au Chlore</h4>
                                    <p className="text-stone-400 text-sm">Même mouillé, le tissu reste parfaitement opaque et ne colle pas à la peau. Il résiste également au sel de mer et au chlore des piscines.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </MainLayout>
    );
}