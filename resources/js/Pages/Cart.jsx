import { Link, useForm, router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";

const DELIVERY_FEE      = 8;
const FREE_DELIVERY_MIN = 300;

export default function Cart({ cart }) {
    const items    = Object.values(cart);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const delivery = subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE;
    const total    = subtotal + delivery;
    const remaining = FREE_DELIVERY_MIN - subtotal;

    function updateQty(key, quantity) {
    const item = items.find(i => i.key === key);
    // Only track if quantity is increasing (adding more)
    if (item && quantity > item.quantity) {
        window.trackMetaEvent('add-to-cart', {
            product_id: item.product_id ?? key,
            quantity: 1,
            price: item.price,
        });
    }
    router.patch(`/cart/${key}`, { quantity }, { preserveScroll: true });
}

    function remove(key) {
        router.delete(`/cart/${key}`, { preserveScroll: true });
    }

    if (items.length === 0) {
        return (
            <MainLayout>
                <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                    <p className="text-2xl mb-4">🛒</p>
                    <p className="text-gray-600 mb-6">Votre panier est vide.</p>
                    <Link
                        href="/produits"
                        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition"
                    >
                        Continuer mes achats
                    </Link>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto px-4 py-10">
                <h1 className="text-2xl font-bold mb-8 text-gray-900">Mon panier</h1>

                {/* Free delivery progress banner */}
                {delivery > 0 ? (
                    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
                        ✨ Plus que{" "}
                        <span className="font-bold">{remaining.toFixed(2)} DT</span>{" "}
                        d'achats pour bénéficier de la{" "}
                        <span className="font-bold">livraison gratuite</span> !
                    </div>
                ) : (
                    <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-800 font-medium">
                        🎉 Vous bénéficiez de la livraison gratuite !
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Items list */}
                    <ul className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <li
                                key={item.key}
                                className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-28 object-cover rounded-xl flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">Taille : {item.size}</p>
                                    <p className="text-sm font-bold text-gray-900 mt-1">
                                        {item.price.toFixed(2)} DT
                                    </p>

                                    {/* Qty controls */}
                                    <div className="flex items-center gap-3 mt-3">
                                        <button
                                            onClick={() => updateQty(item.key, Math.max(1, item.quantity - 1))}
                                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
                                        >
                                            −
                                        </button>
                                        <span className="text-sm font-medium w-4 text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQty(item.key, Math.min(10, item.quantity + 1))}
                                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
                                        >
                                            +
                                        </button>

                                        <button
                                            onClick={() => remove(item.key)}
                                            className="ml-auto text-xs text-red-500 hover:text-red-700"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>

                                <div className="text-right text-sm font-bold text-gray-900 flex-shrink-0">
                                    {(item.price * item.quantity).toFixed(2)} DT
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Summary */}
                    <div className="bg-gray-50 rounded-2xl p-6 space-y-4 h-fit">
                        <h2 className="text-base font-semibold text-gray-900">Résumé</h2>

                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Sous-total</span>
                            <span>{subtotal.toFixed(2)} DT</span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Livraison</span>
                            {delivery === 0 ? (
                                <span className="text-emerald-600 font-semibold">Gratuite</span>
                            ) : (
                                <span className="text-gray-800">{delivery.toFixed(2)} DT</span>
                            )}
                        </div>

                        <hr className="border-gray-200" />

                        <div className="flex justify-between font-bold text-gray-900">
                            <span>Total</span>
                            <span>{total.toFixed(2)} DT</span>
                        </div>

                        <Link
                            href="/commander"
                            className="block w-full bg-gray-900 text-white text-center py-3 rounded-xl font-semibold hover:bg-gray-700 transition mt-2"
                        >
                            Commander
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}