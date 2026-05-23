import MainLayout from '@/Layouts/MainLayout';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { Sun, Droplet, ShieldCheck } from 'lucide-react';

export default function Home() {
    const trendingProducts = [
        { id: 1, name: "Ensemble Dalia Noir", price: "79.99", img: "/image/image1.png", category: "voilée" },
        { id: 2, name: "Maillot Azure Une Pièce", price: "45.00", img: "/image/image4.jpg", category: "non voilée" },
        { id: 3, name: "Burkini Floral Premium", price: "89.00", img: "/image/image2.png", category: "voilée" },
        { id: 4, name: "Ensemble Enfant Sirène", price: "35.00", img: "/image/image3.png", category: "enfant" },
    ];

    return (
        <MainLayout>
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <motion.div 
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: "easeOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    <img 
                        src="/image/hero23.jpg" 
                        alt="Vellure Nouvelle Collection" 
                        className="w-full h-full object-cover object-top"
                    />
                </motion.div>
                {/* Elegant dark overlay */}
                <div className="absolute inset-0 bg-charcoal/30"></div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative z-10 text-center text-cream px-4 mt-16"
                >
                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block text-cream/80">Nouvelle Collection</span>
                    <h1 className="text-5xl md:text-8xl font-dream mb-6 drop-shadow-lg tracking-wide">Vellure</h1>
                    <p className="text-base md:text-xl font-light mb-10 max-w-lg mx-auto drop-shadow-md text-cream/90">
                        Sublimez votre été. Découvrez nos collections exclusives alliant pudeur, confort et élégance absolue.
                    </p>
                    <Link 
                        href={route('products')} 
                        className="inline-block bg-cream text-burgundy px-10 py-4 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-burgundy hover:text-cream transition-all duration-500 shadow-[0_0_40px_rgba(0,0,0,0.3)]"
                    >
                        Découvrir la collection
                    </Link>
                </motion.div>
            </section>

            {/* Categories Section - UPDATED WITH MOBILE SLIDER */}
           <section className="py-24 px-4 max-w-7xl mx-auto bg-cream overflow-hidden">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="text-center mb-10 md:mb-16"
                >
                    <span className="text-burgundy text-[10px] font-bold uppercase tracking-[0.3em]">Notre Univers</span>
                    <h2 className="text-4xl md:text-5xl font-dream text-charcoal mt-4 mb-6">Collections Vellure</h2>
                    <div className="w-16 h-[1px] bg-burgundy mx-auto"></div>
                </motion.div>

                {/* Container: Changed mobile gap to gap-5 for better breathing room */}
                <div className="flex md:grid md:grid-cols-3 gap-5 md:gap-10 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-8 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {[
                        { title: 'Non Voilée', img: '/image/cat-nonv.png', cat: 'non voilée' },
                        { title: 'Voilée', img: '/image/cat-v1.png', cat: 'voilée' },
                        { title: 'Enfant', img: '/image/cat-e.jpg', cat: 'enfant' }
                    ].map((item, index) => (
                        <Link 
                            href={route('products', { category: item.cat })} 
                            key={index}
                            // CHANGED: w-[72vw] makes it narrower, revealing more of the next card to encourage swiping
                            className="relative block w-[72vw] md:w-auto flex-shrink-0 snap-center group cursor-pointer"
                        >
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2, duration: 0.7 }}
                                // CHANGED: h-[34rem] on mobile, h-[38rem] on desktop for elegant tall portrait aspect ratio
                                className="relative h-[42rem] md:h-[38rem] overflow-hidden rounded-2xl md:rounded-none shadow-lg md:shadow-none"
                            >
                                {/* Image */}
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition duration-1000 md:group-hover:scale-110" />
                                
                                {/* Burgundy Gradient Overlay - Adjusted slightly for the taller height */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#7e0220]/95 via-[#7e0220]/30 to-transparent opacity-100 md:opacity-80 md:group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                {/* Content Container */}
                                <div className="absolute inset-0 flex items-end justify-center pb-12 z-10">
                                    <div className="text-center transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                        
                                        {/* Cream Text */}
                                        <h3 className="text-[#f4e8ce] text-3xl font-dream mb-2 tracking-wide drop-shadow-md">
                                            {item.title}
                                        </h3>
                                        
                                        {/* Explorer link */}
                                        <span className="text-[#f4e8ce] md:text-[#f4e8ce]/80 text-[10px] uppercase tracking-[0.25em] relative inline-block md:group-hover:text-[#f4e8ce] transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 mt-1">
                                            Explorer
                                            {/* Underline */}
                                            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-full md:w-0 h-[1px] bg-[#f4e8ce] transition-all duration-500 delay-100 md:group-hover:w-full"></span>
                                        </span>

                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Trending Products Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row justify-between items-end mb-14"
                    >
                        <div>
                            <h2 className="text-4xl md:text-5xl font-dream text-charcoal mb-4">Pièces Maîtresses</h2>
                            <div className="w-16 h-[1px] bg-burgundy"></div>
                        </div>
                        <Link href={route('products')} className="text-burgundy text-[11px] font-bold uppercase tracking-[0.2em] hover:text-charcoal transition hidden md:inline-block relative group">
                            Voir le vestiaire
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-charcoal transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </motion.div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {trendingProducts.map((product, index) => (
                            <motion.div 
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group cursor-pointer text-center"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-cream/30">
                                    <img src={product.img} alt={product.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-700" />
                                    {index === 0 && (
                                        <div className="absolute top-4 left-4 bg-burgundy text-cream text-[9px] uppercase tracking-widest font-bold px-4 py-1">Exclusivité</div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out hidden md:block">
                                        <button className="bg-cream/95 text-burgundy w-full py-3 text-[10px] uppercase font-bold tracking-[0.1em] hover:bg-burgundy hover:text-cream transition-colors duration-300">
                                            Aperçu Rapide
                                        </button>
                                    </div>
                                </div>
                                <p className="text-charcoal/50 text-[10px] uppercase tracking-widest mb-2">{product.category}</p>
                                <h3 className="text-sm font-medium text-charcoal mb-2 font-serif">{product.name}</h3>
                                <p className="text-burgundy text-sm">{product.price} €</p>
                            </motion.div>
                        ))}
                    </div>
                    
                    <div className="mt-16 text-center md:hidden">
                        <Link href={route('products')} className="inline-block border border-burgundy text-burgundy px-10 py-3 text-[11px] font-bold uppercase tracking-[0.2em]">
                            Voir toute la collection
                        </Link>
                    </div>
                </div>
            </section>

            {/* Textile Quality Section */}
            <section className="py-24 bg-cream text-charcoal overflow-hidden border-t border-burgundy/10">
                <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-20">
                    
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2 relative"
                    >
                        <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden">
                            <img src="/image/texture.png" alt="L'Exigence Vellure" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 border border-burgundy/20 m-6"></div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2"
                    >
                        <span className="text-burgundy text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">Le Savoir-Faire</span>
                        <h2 className="text-4xl md:text-6xl font-dream mb-8 text-charcoal">L'Exigence Absolue</h2>
                        <p className="text-charcoal/70 mb-12 text-lg font-light leading-relaxed">
                            Chaque pièce de la collection Vellure est pensée pour sublimer la silhouette tout en respectant vos valeurs. Nous sélectionnons des étoffes nobles qui épousent vos mouvements avec grâce.
                        </p>

                        <div className="space-y-10">
                            <div className="flex items-start gap-6 group">
                                <div className="text-burgundy mt-1 group-hover:scale-110 transition duration-300">
                                    <Droplet size={28} strokeWidth={1} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-dream tracking-wide text-charcoal mb-2">Tissé pour l'océan</h4>
                                    <p className="text-charcoal/60 text-sm font-light leading-relaxed">Une technologie d'évacuation permettant un séchage instantané, pour une élégance ininterrompue hors de l'eau.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="text-burgundy mt-1 group-hover:scale-110 transition duration-300">
                                    <Sun size={28} strokeWidth={1} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-dream tracking-wide text-charcoal mb-2">Bouclier Solaire</h4>
                                    <p className="text-charcoal/60 text-sm font-light leading-relaxed">Une protection UPF 50+ intégrée au cœur des fibres, préservant votre peau des rayons nocifs avec légèreté.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="text-burgundy mt-1 group-hover:scale-110 transition duration-300">
                                    <ShieldCheck size={28} strokeWidth={1} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-dream tracking-wide text-charcoal mb-2">Opacité & Maintien</h4>
                                    <p className="text-charcoal/60 text-sm font-light leading-relaxed">Un drapé fluide garantissant une opacité totale même mouillé, résistant au chlore et au sel marin avec brio.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </MainLayout>
    );
}