import { Link, usePage } from '@inertiajs/react';

export default function CategoryFilter({ categories, activeSlug }) {
    return (
        <>
            <style>{`
                .cat-filter {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                    justify-content: center;
                    margin: 0 auto 3.5rem;
                }

                .cat-pill {
                    display: inline-block;
                    padding: 0.5rem 1.3rem;
                    border-radius: 100px;
                    font-size: 0.78rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    font-family: var(--ff-body);
                    font-weight: 400;
                    cursor: pointer;
                    transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
                    border: 1.5px solid transparent;
                }

                .cat-pill-all {
                    background: transparent;
                    color: var(--ocean-mid);
                    border-color: var(--foam);
                }

                .cat-pill-all:hover,
                .cat-pill-all.active {
                    background: var(--ocean);
                    color: var(--white);
                    border-color: var(--ocean);
                    box-shadow: 0 4px 14px rgba(26,58,74,0.2);
                }

                .cat-pill-item {
                    background: transparent;
                    color: var(--ocean-mid);
                    border-color: var(--foam);
                }

                .cat-pill-item:hover {
                    background: var(--foam);
                    border-color: var(--wave);
                    color: var(--ocean);
                }

                .cat-pill-item.active {
                    background: var(--accent);
                    color: var(--white);
                    border-color: var(--accent);
                    box-shadow: 0 4px 14px rgba(196,149,106,0.3);
                }
            `}</style>

            <div className="cat-filter">
                <Link
                    href="/"
                    className={`cat-pill cat-pill-all${!activeSlug ? ' active' : ''}`}
                >
                    Tout voir
                </Link>
                {categories.map(cat => (
                    <Link
                        key={cat.id}
                        href={`/categorie/${cat.slug}`}
                        className={`cat-pill cat-pill-item${activeSlug === cat.slug ? ' active' : ''}`}
                    >
                        {cat.name}
                    </Link>
                ))}
            </div>
        </>
    );
}