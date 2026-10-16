import '../../css/admin.css';
import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Tags, 
    Receipt, 
    Shirt, 
    Ruler, 
    BarChart3, 
    LogOut, 
    ExternalLink, 
    Menu, 
    X 
} from 'lucide-react';

const NAV = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, filament: true, match: (p) => p === '/admin' || p === '/admin/' },
    { name: 'Categories', href: '/admin/categories', icon: Tags, filament: true, match: (p) => p.startsWith('/admin/categories') },
    { name: 'Orders', href: '/admin/orders', icon: Receipt, filament: true, match: (p) => p.startsWith('/admin/orders') },
    { name: 'Products', href: '/admin/products', icon: Shirt, filament: false, match: (p) => p.startsWith('/admin/products') },
    { name: 'Sizes', href: '/admin/sizes', icon: Ruler, filament: true, match: (p) => p.startsWith('/admin/sizes') },
    { name: 'Statistiques', href: '/admin/stats', icon: BarChart3, filament: false, match: (p) => p.startsWith('/admin/stats') },
];

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const prev = { bg: document.body.style.backgroundColor, margin: document.body.style.margin };
        document.body.style.backgroundColor = '#0e0f13';
        document.body.style.margin = '0';
        return () => {
            document.body.style.backgroundColor = prev.bg;
            document.body.style.margin = prev.margin;
        };
    }, []);

    // Prevent body scrolling when mobile drawer is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [mobileOpen]);

    return (
        <div className="adm">
            {/* Dark Backdrop for Mobile Drawer */}
            <div 
                className={`adm-backdrop ${mobileOpen ? 'is-open' : ''}`}
                onClick={() => setMobileOpen(false)} 
            />

            {/* Sidebar (Desktop Fixed + Mobile Slide Drawer) */}
            <aside className={`adm-side ${mobileOpen ? 'is-open' : ''}`}>
                <div className="adm-brand">
                    <span className="adm-brand-name">
                        <i />
                        Vellure
                    </span>
                    <div className="adm-brand-actions">
                        <a href="/" target="_blank" rel="noreferrer" title="Voir la boutique" className="adm-icon-link">
                            <ExternalLink size={16} />
                        </a>
                        <button
                            type="button"
                            onClick={() => setMobileOpen(false)}
                            className="adm-close-btn"
                            aria-label="Fermer menu"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <nav className="adm-nav">
                    {NAV.map(({ name, href, icon: Icon, filament, match }) => {
                        const active = match(path);
                        const cls = active ? 'is-active' : '';
                        const inner = (
                            <>
                                <Icon size={18} strokeWidth={1.8} />
                                <span>{name}</span>
                            </>
                        );
                        return filament ? (
                            <a key={name} href={href} className={cls} onClick={() => setMobileOpen(false)}>
                                {inner}
                            </a>
                        ) : (
                            <Link key={name} href={href} className={cls} onClick={() => setMobileOpen(false)}>
                                {inner}
                            </Link>
                        );
                    })}
                </nav>

                <div className="adm-user">
                    <div className="adm-avatar">{auth?.user?.name?.charAt(0)?.toUpperCase() || 'A'}</div>
                    <div className="adm-user-meta">
                        <b>{auth?.user?.name || 'Admin'}</b>
                        <span>Administrateur</span>
                    </div>
                    <Link href={route('logout')} method="post" as="button" className="adm-logout" title="Déconnexion">
                        <LogOut size={16} />
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="adm-content-wrapper">
                {/* Mobile Header placed inside wrapper so it stays above <main> */}
                <header className="adm-mobile-header">
                    <button
                        type="button"
                        onClick={() => setMobileOpen(true)}
                        className="adm-burger"
                        aria-label="Ouvrir menu"
                    >
                        <Menu size={20} />
                    </button>

                    <span className="adm-brand-name">
                        <i />
                        Vellure
                    </span>

                    <a href="/" target="_blank" rel="noreferrer" title="Voir boutique" className="adm-icon-link">
                        <ExternalLink size={16} />
                    </a>
                </header>

                <main className="adm-main">{children}</main>
            </div>
        </div>
    );
}