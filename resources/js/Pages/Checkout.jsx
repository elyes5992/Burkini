import { useForm } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";

export default function Checkout({ cart, subtotal, deliveryFee, freeDeliveryMin, total }) {
    const { data, setData, post, processing, errors } = useForm({
        customer_name: "",
        customer_phone: "",
        customer_address: "",
        customer_city: "",
        notes: "",
    });

    const remaining = freeDeliveryMin - subtotal;

     function submit(e) {
        e.preventDefault();
        // ✅ Fix: Use the named route defined in web.php
        post(route('order.store')); 
        
        // Alternatively, you could do: post('/commander');
    }

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto px-4 py-10">
                <h1 className="text-2xl font-bold mb-8 text-gray-900">Finaliser la commande</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* ── Form ── */}
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nom complet *
                            </label>
                            <input
                                type="text"
                                value={data.customer_name}
                                onChange={(e) => setData("customer_name", e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                                required
                            />
                            {errors.customer_name && (
                                <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Téléphone *
                            </label>
                            <input
                                type="tel"
                                value={data.customer_phone}
                                onChange={(e) => setData("customer_phone", e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                                required
                            />
                            {errors.customer_phone && (
                                <p className="text-red-500 text-xs mt-1">{errors.customer_phone}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ville
                            </label>
                            <input
                                type="text"
                                value={data.customer_city}
                                onChange={(e) => setData("customer_city", e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Adresse *
                            </label>
                            <textarea
                                value={data.customer_address}
                                onChange={(e) => setData("customer_address", e.target.value)}
                                rows={3}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                                required
                            />
                            {errors.customer_address && (
                                <p className="text-red-500 text-xs mt-1">{errors.customer_address}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notes (optionnel)
                            </label>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData("notes", e.target.value)}
                                rows={2}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition disabled:opacity-50"
                        >
                            {processing ? "Envoi en cours…" : "Confirmer la commande"}
                        </button>
                    </form>

                    {/* ── Order Summary ── */}
                    <div className="bg-gray-50 rounded-2xl p-6 space-y-4 h-fit">
                        <h2 className="text-lg font-semibold text-gray-900">Récapitulatif</h2>

                        {/* Cart items */}
                        <ul className="space-y-3">
                            {cart.map((item) => (
                                <li key={item.key} className="flex gap-3 items-center">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                        <p className="text-xs text-gray-500">Taille: {item.size} · Qté: {item.quantity}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
                                        {(item.price * item.quantity).toFixed(2)} DT
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <hr className="border-gray-200" />

                        {/* Subtotal */}
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Sous-total</span>
                            <span>{subtotal.toFixed(2)} DT</span>
                        </div>

                        {/* Delivery fee */}
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Livraison</span>
                            {deliveryFee === 0 ? (
                                <span className="text-emerald-600 font-semibold">Gratuite 🎉</span>
                            ) : (
                                <span className="text-gray-800 font-medium">{deliveryFee.toFixed(2)} DT</span>
                            )}
                        </div>

                        {/* Free delivery progress hint */}
                        {deliveryFee > 0 && (
                            <p className="text-xs text-gray-500 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                                ✨ Plus que{" "}
                                <span className="font-semibold text-amber-700">
                                    {remaining.toFixed(2)} DT
                                </span>{" "}
                                pour bénéficier de la livraison gratuite !
                            </p>
                        )}

                        <hr className="border-gray-200" />

                        {/* Total */}
                        <div className="flex justify-between text-base font-bold text-gray-900">
                            <span>Total</span>
                            <span>{total.toFixed(2)} DT</span>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}