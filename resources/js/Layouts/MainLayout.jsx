import { useState } from 'react';

import { Menu, X, ShoppingBag,  Mail, Phone, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, usePage } from '@inertiajs/react';

export default function MainLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Accueil', href: route('home') },
        { name: 'Collection', href: route('products') },
        { name: 'Non Voilée', href: route('products', { category: 'non voilée' }) },
        { name: 'Voilée', href: route('products', { category: 'voilée' }) },
        { name: 'Enfant', href: route('products', { category: 'enfant' }) },
        { name: 'À Propos', href: route('about') },
    ];
    const { cartCount } = usePage().props;

    return (
        <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-800 overflow-x-hidden">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-stone-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo mis à jour */}
                        <Link href={route('home')} className="text-xl md:text-2xl font-serif tracking-widest font-bold text-sky-900">
                            MAILLOTS <span className="font-light">BURKINI</span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-8">
                            {navLinks.map((link) => (
                                <Link key={link.name} href={link.href} className="text-sm font-medium hover:text-sky-600 transition duration-300">
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Cart & Mobile Toggle */}
                        <div className="flex items-center space-x-5">
                            <Link href={route('cart')} className="text-stone-600 hover:text-sky-600 transition relative">
    <ShoppingBag size={24} strokeWidth={1.5} />
    {cartCount > 0 && (
        <span className="absolute -top-1 -right-2 bg-sky-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
            {cartCount}
        </span>
    )}
</Link>
                            <button 
                                className="md:hidden text-stone-600 hover:text-sky-600 transition"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white border-t border-stone-100"
                        >
                            <div className="flex flex-col px-6 py-6 space-y-5 shadow-inner">
                                {navLinks.map((link) => (
                                    <Link 
                                        key={link.name} 
                                        href={link.href} 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-lg font-medium text-stone-600 hover:text-sky-700 hover:pl-2 transition-all duration-300"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Contenu principal */}
            <main className="flex-grow w-full">
                {children}
            </main>

            {/* Footer Professionnel */}
            <footer className="bg-stone-900 text-stone-300 pt-16 pb-8 border-t-4 border-sky-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        {/* Section Marque */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-serif text-white tracking-widest">
                                MAILLOTS <span className="font-light">BURKINI</span>
                            </h3>
                            <p className="text-sm text-stone-400 leading-relaxed">
                                L'alliance parfaite entre élégance, pudeur et confort. Découvrez notre gamme de maillots de bain conçue pour sublimer toutes les femmes, à la plage comme à la piscine.
                            </p>
                        </div>

                        {/* Liens Rapides */}
                        <div>
                            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Navigation</h4>
                            <ul className="space-y-3 text-sm">
                                {navLinks.slice(0, 5).map(link => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="hover:text-white hover:underline transition">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Service Client */}
                        <div>
                            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Service Client</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link href={route('about')} className="hover:text-white hover:underline transition">Qui sommes-nous ?</Link></li>
                                <li><a href="#" className="hover:text-white hover:underline transition">Livraison & Retours</a></li>
                                <li><a href="#" className="hover:text-white hover:underline transition">Guide des Tailles</a></li>
                                <li><a href="#" className="hover:text-white hover:underline transition">FAQ</a></li>
                            </ul>
                        </div>

                        {/* Contact & Réseaux */}
                        <div>
                            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Contactez-nous</h4>
                            <ul className="space-y-4 text-sm mb-6 text-stone-400">
                                <li className="flex items-center space-x-3">
                                    <Mail size={16} /> <span>contact@maillotsburkini.com</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <Phone size={16} /> <span>+33 1 23 45 67 89</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <MapPin size={16} className="mt-1 flex-shrink-0" /> 
                                    <span>123 Avenue de la Plage<br/>75000 Paris, France</span>
                                </li>
                            </ul>
                            {/* <div className="flex space-x-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-sky-700 hover:text-white transition duration-300">
                                    <Instagram size={18} />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-sky-700 hover:text-white transition duration-300">
                                    <Facebook size={18} />
                                </a>
                            </div> */}
                        </div>
                    </div>

                    <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500">
                        <p>&copy; {new Date().getFullYear()} Maillots Burkini. Tous droits réservés.</p>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <a href="#" className="hover:text-stone-300">Mentions Légales</a>
                            <a href="#" className="hover:text-stone-300">Politique de Confidentialité</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}