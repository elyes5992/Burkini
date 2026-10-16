import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Mail, Phone, ChevronDown } from 'lucide-react';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, usePage } from '@inertiajs/react';

import WhatsAppButton from '@/Components/WhatsAppButton';

export default function MainLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isMaillotsOpen, setIsMaillotsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    const navLinks = [
        { name: 'Accueil', href: route('home') },
        {
            name: 'Maillots',
            href: route('products'),
            subLinks: [
                { name: 'Toute la collection', href: route('products') },
                { name: 'Non Voilée', href: route('products', { category: 'non voilée' }) },
                { name: 'Voilée', href: route('products', { category: 'voilée' }) },
                { name: 'Enfant', href: route('products', { category: 'enfant' }) },
            ]
        },
        { name: 'Chemises', href: route('chemises') },
        { name: 'Pyjamas', href: route('pyjamas') },
        { name: 'Survêtements', href: route('survetements') },
        { name: 'À Propos', href: route('about') },
    ];

    const leftLinks = navLinks.slice(0, 3);
    const rightLinks = navLinks.slice(3);

    const { cartCount = 0 } = usePage().props || {};

    const menuVars = {
        initial: { opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
        animate: { opacity: 1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] } },
        exit: { opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)", transition: { duration: 0.5, ease: [0.11, 0, 0.5, 0] } }
    };

    return (
        <div className="min-h-screen flex flex-col bg-cream font-sans text-charcoal overflow-x-hidden selection:bg-burgundy selection:text-cream">
            {/* Navbar */}
            <nav className={`fixed w-full top-0 z-50 transition-all duration-700 ${scrolled ? 'bg-cream/95 backdrop-blur-md py-3 shadow-sm' : 'bg-transparent py-5'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center relative">

                        {/* Mobile Hamburger & Desktop Left Links */}
                        <div className="flex-1 flex items-center justify-start">
                            <button
                                className="lg:hidden text-charcoal hover:text-burgundy transition z-[60] relative p-1"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="Toggle Menu"
                            >
                                {isMobileMenuOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
                            </button>

                            <div className="hidden lg:flex items-center space-x-7">
                                {leftLinks.map((link) => (
                                    <div key={link.name} className="relative group">
                                        {link.subLinks ? (
                                            <div className="flex items-center cursor-pointer text-[11px] uppercase tracking-[0.15em] font-medium hover:text-burgundy transition duration-300 py-2">
                                                <Link href={link.href}>{link.name}</Link>
                                                <ChevronDown size={12} className="ml-1 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
                                                <div className="absolute top-full left-0 mt-2 w-48 bg-cream/95 backdrop-blur-md shadow-lg border border-burgundy/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col p-2 rounded-sm z-50">
                                                    {link.subLinks.map(subLink => (
                                                        <Link
                                                            key={subLink.name}
                                                            href={subLink.href}
                                                            className="text-left text-[10px] uppercase tracking-widest px-3 py-2.5 hover:bg-burgundy hover:text-cream transition-colors duration-200 rounded-sm"
                                                        >
                                                            {subLink.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <Link href={link.href} className="text-[11px] uppercase tracking-[0.15em] font-medium hover:text-burgundy transition duration-300 relative group py-2">
                                                {link.name}
                                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-burgundy transition-all duration-300 group-hover:w-full"></span>
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Centered Brand Logo */}
                        <div className="flex-shrink-0 absolute left-1/2 -translate-x-1/2 z-[60]">
                            <Link href={route('home')} className="block group" onClick={() => setIsMobileMenuOpen(false)}>
                                <img
                                    src="/image/logo.png"
                                    alt="Vellure Logo"
                                    className="h-12 md:h-16 w-auto object-contain transition duration-300 group-hover:opacity-80"
                                />
                            </Link>
                        </div>

                        {/* Desktop Right Links & Cart */}
                        <div className="flex-1 flex items-center justify-end space-x-7">
                            <div className="hidden lg:flex items-center space-x-7">
                                {rightLinks.map((link) => (
                                    <Link key={link.name} href={link.href} className="text-[11px] uppercase tracking-[0.15em] font-medium hover:text-burgundy transition duration-300 relative group py-2">
                                        {link.name}
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-burgundy transition-all duration-300 group-hover:w-full"></span>
                                    </Link>
                                ))}
                            </div>

                            <Link href={route('cart')} className="text-charcoal hover:text-burgundy transition relative z-[60]">
                                <ShoppingBag size={23} strokeWidth={1.3} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-2 bg-burgundy text-cream text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-md">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            variants={menuVars}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="fixed inset-0 bg-cream z-50 flex flex-col h-screen overflow-y-auto pt-24 pb-20 px-8"
                        >
                            <div className="flex flex-col w-full divide-y divide-burgundy/15 mt-4">
                                {navLinks.map((link) => (
                                    <div key={link.name} className="py-4">
                                        {link.subLinks ? (
                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <Link
                                                        href={link.href}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className="font-dream text-3xl text-charcoal hover:text-burgundy transition-colors"
                                                    >
                                                        {link.name}
                                                    </Link>
                                                    <button
                                                        onClick={() => setIsMaillotsOpen(!isMaillotsOpen)}
                                                        className="p-2 text-charcoal/60 hover:text-burgundy"
                                                    >
                                                        <ChevronDown size={24} className={`transition-transform duration-300 ${isMaillotsOpen ? 'rotate-180' : ''}`} />
                                                    </button>
                                                </div>
                                                <AnimatePresence>
                                                    {isMaillotsOpen && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden mt-3 pl-4 border-l-2 border-burgundy/20 flex flex-col gap-2.5"
                                                        >
                                                            {link.subLinks.map((subLink) => (
                                                                <Link
                                                                    key={subLink.name}
                                                                    href={subLink.href}
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                    className="text-lg font-serif text-charcoal/70 hover:text-burgundy"
                                                                >
                                                                    {subLink.name}
                                                                </Link>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ) : (
                                            <Link
                                                href={link.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="block font-dream text-3xl text-charcoal hover:text-burgundy transition-colors"
                                            >
                                                {link.name}
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto pt-8 flex flex-col items-center gap-3">
                                <div className="flex space-x-6 text-charcoal">
                                    <a href="https://www.instagram.com/boutheina_maillotdeplage" target="_blank" rel="noreferrer" className="hover:text-burgundy"><FaInstagram size={22} /></a>
                                    <a href="https://www.facebook.com/profile.php?id=100063644853182" target="_blank" rel="noreferrer" className="hover:text-burgundy"><FaFacebookF size={20} /></a>
                                </div>
                                <p className="text-[10px] uppercase tracking-widest text-burgundy font-bold">Vellure Store • Tunis</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <main className="flex-grow w-full pt-28">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-charcoal pt-20 pb-12 mt-16 text-cream">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        <div className="space-y-4">
                            <img src="/image/logo.png" alt="Vellure Logo" className="h-10 w-auto brightness-0 invert opacity-90" />
                            <p className="text-sm font-light text-cream/70 leading-relaxed">
                                L'alliance parfaite entre élégance balnéaire, pudeur et confort. Découvrez toutes nos collections exclusives.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-cream/90">Boutique</h4>
                            <ul className="space-y-3 text-sm font-light text-cream/75">
                                <li><Link href={route('products')} className="hover:text-cream">Maillots de Plage</Link></li>
                                <li><Link href={route('chemises')} className="hover:text-cream">Chemises</Link></li>
                                <li><Link href={route('pyjamas')} className="hover:text-cream">Pyjamas</Link></li>
                                <li><Link href={route('survetements')} className="hover:text-cream">Survêtements Sport</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-cream/90">Assistance</h4>
                            <ul className="space-y-3 text-sm font-light text-cream/75">
                                <li><Link href={route('about')} className="hover:text-cream">L'Histoire Vellure</Link></li>
                                <li><Link href={route('livraison')} className="hover:text-cream">Livraison & Retours</Link></li>
                                <li><Link href={route('guide-tailles')} className="hover:text-cream">Guide des Tailles</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-cream/90">Contact</h4>
                            <ul className="space-y-3 text-sm font-light text-cream/75">
                                <li className="flex items-center gap-2"><Mail size={16} /> <span>contact@vellure-store.com</span></li>
                                <li className="flex items-center gap-2"><Phone size={16} /> <span>+216 95 940 668</span></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-cream/10 pt-6 text-center text-xs text-cream/50">
                        &copy; {new Date().getFullYear()} VELLURE Store. Tous droits réservés.
                    </div>
                </div>
            </footer>
            <WhatsAppButton />
        </div>
    );
}