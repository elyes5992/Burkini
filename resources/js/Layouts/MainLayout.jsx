import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Mail, Phone, ChevronDown } from 'lucide-react';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, usePage } from '@inertiajs/react';

import WhatsAppButton from '@/Components/WhatsAppButton';

export default function MainLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // État pour contrôler l'ouverture du sous-menu Maillots sur mobile.
    const [isMaillotsOpen, setIsMaillotsOpen] = useState(true);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Empêcher le scroll quand le menu mobile est ouvert
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
            setIsMaillotsOpen(true); // Ouvert par défaut
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    const navLinks = [
        { name: 'Accueil', href: route('home') },
        { name: 'Chemises', href: route('chemises') },
        {
            name: 'Maillots',
            href: route('products'),
            subLinks: [
                { name: 'Non Voilée', href: route('products', { category: 'non voilée' }) },
                { name: 'Voilée', href: route('products', { category: 'voilée' }) },
                { name: 'Enfant', href: route('products', { category: 'enfant' }) },
            ]
        },
        { name: 'À Propos', href: route('about') },
    ];

    const leftLinks = navLinks.slice(0, 2);
    const rightLinks = navLinks.slice(2, 4);

    const { cartCount = 0 } = usePage().props || {};

    const menuVars = {
        initial: { opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
        animate: { opacity: 1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] } },
        exit: { opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)", transition: { duration: 0.5, ease: [0.11, 0, 0.5, 0] } }
    };

    const linkVars = {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen flex flex-col bg-cream font-sans text-charcoal overflow-x-hidden selection:bg-burgundy selection:text-cream">
            {/* Navbar */}
            <nav className={`fixed w-full top-0 z-50 transition-all duration-700 ${scrolled ? 'bg-cream/95 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center relative">

                        {/* Menu Mobile (Hamburger) & Liens Gauche (PC) */}
                        <div className="flex-1 flex items-center justify-start">
                            <button
                                className="md:hidden text-charcoal hover:text-burgundy transition z-[60] relative p-1"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="Toggle Menu"
                            >
                                {isMobileMenuOpen ? <X size={30} strokeWidth={1.2} /> : <Menu size={30} strokeWidth={1.2} />}
                            </button>

                            <div className="hidden md:flex space-x-8">
                                {leftLinks.map((link) => (
                                    <Link key={link.name} href={link.href} className="text-[11px] uppercase tracking-[0.15em] font-medium hover:text-burgundy transition duration-300 relative group">
                                        {link.name}
                                        <span className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-0 h-[1px] bg-burgundy transition-all duration-300 group-hover:w-full"></span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Logo Centré */}
                        <div className="flex-shrink-0 absolute left-1/2 transform -translate-x-1/2 z-[60]">
                            <Link href={route('home')} className="block group" onClick={() => setIsMobileMenuOpen(false)}>
                                <img
                                    src="/image/logo.png"
                                    alt="Vellure Logo"
                                    className="h-14 md:h-20 w-auto object-contain transition duration-300 group-hover:opacity-70"
                                />
                            </Link>
                        </div>

                        {/* Liens Droite (PC) & Panier */}
                        <div className="flex-1 flex items-center justify-end space-x-8">
                            <div className="hidden md:flex items-center space-x-8">
                                {rightLinks.map((link) => (
                                    <div key={link.name} className="relative group">
                                        {link.subLinks ? (
                                            <div className="flex items-center cursor-pointer text-[11px] uppercase tracking-[0.15em] font-medium hover:text-burgundy transition duration-300 py-2">
                                                <Link href={link.href} className="flex items-center">
                                                    {link.name}
                                                </Link>
                                                <ChevronDown size={12} className="ml-1 opacity-50 group-hover:rotate-180 transition-transform duration-300" />

                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-40 bg-cream/95 backdrop-blur-md shadow-lg border border-burgundy/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col p-2">
                                                    {link.subLinks.map(subLink => (
                                                        <Link
                                                            key={subLink.name}
                                                            href={subLink.href}
                                                            className="text-center text-[10px] uppercase tracking-widest py-3 hover:bg-burgundy hover:text-cream transition-colors duration-300"
                                                        >
                                                            {subLink.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <Link href={link.href} className="text-[11px] uppercase tracking-[0.15em] font-medium hover:text-burgundy transition duration-300 relative group">
                                                {link.name}
                                                <span className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-0 h-[1px] bg-burgundy transition-all duration-300 group-hover:w-full"></span>
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <Link href={route('cart')} className="text-charcoal hover:text-burgundy transition relative z-[60]">
                                <ShoppingBag size={24} strokeWidth={1.2} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-2 bg-burgundy text-cream text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-md">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* --- NOUVEAU MENU MOBILE --- */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            variants={menuVars}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="fixed inset-0 bg-cream z-50 flex flex-col h-screen overflow-y-auto pt-28 pb-40"
                        >
                            <div className="flex flex-col w-full px-8 mt-4">
                                {navLinks.map((link, i) => (
                                    <div
                                        key={link.name}
                                        className="w-full"
                                        style={{ borderBottom: '1px solid rgba(128, 0, 32, 0.25)' }}
                                    >
                                        <motion.div variants={linkVars} custom={i} transition={{ delay: 0.1 * i }}>

                                            {link.subLinks ? (
                                                <div className="flex flex-col w-full">
                                                    {/* Ligne principale "Maillots" avec Chevron à droite */}
                                                    <div className="flex items-center justify-between w-full py-6">
                                                        <Link
                                                            href={link.href}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className="font-dream text-3xl md:text-4xl text-charcoal hover:text-burgundy transition-colors duration-300"
                                                        >
                                                            {link.name}
                                                        </Link>
                                                        <button
                                                            onClick={() => setIsMaillotsOpen(!isMaillotsOpen)}
                                                            className="p-2 -mr-2 text-charcoal hover:text-burgundy transition-colors"
                                                        >
                                                            <motion.div animate={{ rotate: isMaillotsOpen ? 180 : 0 }}>
                                                                <ChevronDown size={28} strokeWidth={1.5} />
                                                            </motion.div>
                                                        </button>
                                                    </div>

                                                    {/* Sous-catégories alignées à gauche et indentées */}
                                                    <AnimatePresence>
                                                        {isMaillotsOpen && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden w-full flex flex-col"
                                                            >
                                                                {/* CORRECTION ICI : border-burgundy/20 pour la ligne verticale */}
                                                                <div className="pb-5 pt-1 flex flex-col gap-4 pl-5 border-l-2 border-burgundy/20 ml-2 mb-2">
                                                                    {link.subLinks.map((subLink) => (
                                                                        <Link
                                                                            key={subLink.name}
                                                                            href={subLink.href}
                                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                                            className="font-dream text-2xl text-charcoal/70 hover:text-burgundy transition-colors block w-full"
                                                                        >
                                                                            {subLink.name}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            ) : (
                                                // Liens normaux
                                                <Link
                                                    href={link.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="block w-full py-6 font-dream text-3xl md:text-4xl text-charcoal hover:text-burgundy transition-colors duration-300"
                                                >
                                                    {link.name}
                                                </Link>
                                            )}

                                        </motion.div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer du Menu Mobile */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="mt-auto w-full flex flex-col items-center space-y-4 pt-12 pb-8"
                            >
                                <div className="flex space-x-6 text-charcoal">
                                    <a href="https://www.instagram.com/boutheina_maillotdeplage?igsh=MXF4ZGVpMTQ5dm44dg==" className="hover:text-burgundy hover:scale-110 transition duration-300">
                                        <FaInstagram size={24} />
                                    </a>
                                    <a href="https://www.facebook.com/profile.php?id=100063644853182" className="hover:text-burgundy hover:scale-110 transition duration-300">
                                        <FaFacebookF size={22} />
                                    </a>
                                </div>
                                <p className="text-[10px] uppercase tracking-widest text-burgundy">L'élégance balnéaire</p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <main className="flex-grow w-full pt-32">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-charcoal pt-24 pb-12 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

                        {/* Marque */}
                        <div className="space-y-6">
                            <Link href={route('home')} className="inline-block group">
                                <img
                                    src="/image/logo.png"
                                    alt="Vellure Logo"
                                    className="h-10 md:h-12 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition duration-300"
                                />
                            </Link>
                            <p className="text-sm leading-relaxed font-light text-cream opacity-60">
                                L'alliance parfaite entre élégance balnéaire, pudeur et confort. Découvrez notre collection conçue pour sublimer la silhouette féminine.
                            </p>
                            <div className="flex space-x-5 pt-4">
                                <a href="https://www.instagram.com/boutheina_maillotdeplage?igsh=MXF4ZGVpMTQ5dm44dg==" className="text-cream opacity-80 hover:opacity-100 hover:-translate-y-1 transition duration-300">
                                    <FaInstagram size={20} />
                                </a>
                                <a href="https://www.facebook.com/profile.php?id=100063644853182" className="text-cream opacity-80 hover:opacity-100 hover:-translate-y-1 transition duration-300">
                                    <FaFacebookF size={18} />
                                </a>
                            </div>
                        </div>

                        {/* Navigation Footer */}
                        <div>
                            <h4 className="text-cream text-[11px] font-bold uppercase tracking-[0.2em] mb-8">Boutique</h4>
                            <ul className="space-y-4 text-sm font-light">
                                <li><Link href={route('home')} className="text-cream opacity-70 hover:opacity-100 transition relative group inline-block">Accueil</Link></li>
                                <li><Link href={route('chemises')} className="text-cream opacity-70 hover:opacity-100 transition relative group inline-block">Chemises</Link></li>
                                <li><Link href={route('products')} className="text-cream opacity-70 hover:opacity-100 transition relative group inline-block">Maillots</Link></li>
                                <li><Link href={route('products', { category: 'enfant' })} className="text-cream opacity-70 hover:opacity-100 transition relative group inline-block">Filles</Link></li>
                            </ul>
                        </div>

                        {/* Assistance */}
                        <div>
                            <h4 className="text-cream text-[11px] font-bold uppercase tracking-[0.2em] mb-8">Assistance</h4>
                            <ul className="space-y-4 text-sm font-light text-cream opacity-70">
                                <li><Link href={route('about')} className="hover:opacity-100 transition">L'Histoire Vellure</Link></li>
                                <li><Link href={route('livraison')} className="hover:opacity-100 transition">Livraison & Retours</Link></li>
                                <li><Link href={route('guide-tailles')} className="hover:opacity-100 transition">Guide des Tailles</Link></li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h4 className="text-cream text-[11px] font-bold uppercase tracking-[0.2em] mb-8">Le Cercle Vellure</h4>
                            <p className="text-sm font-light mb-6 text-cream opacity-60">Inscrivez-vous pour découvrir nos nouvelles collections en avant-première.</p>
                            <div className="flex border-b border-cream border-opacity-30 pb-2 mb-8 focus-within:border-opacity-100 transition duration-300">
                                <input type="email" placeholder="Votre e-mail" className="bg-transparent border-none outline-none w-full text-sm text-cream placeholder-cream placeholder-opacity-40" />
                                <button className="text-cream uppercase text-[10px] font-bold tracking-widest hover:text-white transition">Rejoindre</button>
                            </div>
                            <ul className="space-y-3 text-sm font-light text-cream opacity-70">
                                <li className="flex items-center space-x-3"><Mail size={16} className="text-cream" /> <span>contact@vellure-store.com</span></li>
                                <li className="flex items-center space-x-3"><Phone size={16} className="text-cream" /> <span>+216 95 940 668</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-cream border-opacity-10 pt-8 flex flex-col md:flex-row justify-between items-center text-[11px] uppercase tracking-widest font-light text-cream opacity-40">
                        <p>&copy; {new Date().getFullYear()} VELLURE Store. Tous droits réservés.</p>
                        <div className="flex space-x-8 mt-6 md:mt-0">
                            <a href="#" className="hover:opacity-100 transition">Mentions Légales</a>
                            <a href="#" className="hover:opacity-100 transition">Confidentialité</a>
                        </div>
                    </div>
                </div>
            </footer>
            <WhatsAppButton />
        </div>
    );
}