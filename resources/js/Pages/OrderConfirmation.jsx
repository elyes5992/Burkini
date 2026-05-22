import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function OrderConfirmation({ order }) {
    useEffect(() => {
        window.trackMetaEvent('purchase', {
            order_id: order.id,
            total: parseFloat(order.total_price),
            items: order.items?.map(item => ({
                id: item.product_id,
                quantity: item.quantity,
                price: item.price,
            })) ?? [],
        });
    }, []);

    return (
        <MainLayout>
            <div className="max-w-lg mx-auto px-4 py-24 text-center">
                <CheckCircle size={72} className="mx-auto text-green-500 mb-6" />
                <h1 className="text-3xl font-serif text-stone-900 mb-3">Commande confirmée !</h1>
                <p className="text-stone-500 mb-2">Merci, <strong>{order.customer_name}</strong> !</p>
                <p className="text-stone-500 mb-8">
                    Votre commande <strong>#{order.id}</strong> de{" "}
                    <strong>{parseFloat(order.total_price).toFixed(2)} DT</strong> a bien été reçue.
                    Nous vous contacterons bientôt pour confirmer la livraison.
                </p>
                <Link href={route('products')} className="bg-sky-700 text-white px-8 py-3 rounded-full hover:bg-sky-800 transition">
                    Continuer mes achats
                </Link>
            </div>
        </MainLayout>
    );
}