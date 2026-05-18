import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmation({ order }) {
    return (
        <MainLayout>
            <div className="max-w-lg mx-auto px-4 py-24 text-center">
                <CheckCircle size={72} className="mx-auto text-green-500 mb-6" />
                <h1 className="text-3xl font-serif text-stone-900 mb-3">Commande confirmée !</h1>
                <p className="text-stone-500 mb-2">Merci, <strong>{order.customer_name}</strong> !</p>
                <p className="text-stone-500 mb-8">
                    Votre commande <strong>#{order.id}</strong> de <strong>{parseFloat(order.total_price).toFixed(2)} DT</strong> a bien été reçue.
                    Nous vous contacterons bientôt pour confirmer la livraison.
                </p>
                <Link href={route('products')} className="bg-sky-700 text-white px-8 py-3 rounded-full hover:bg-sky-800 transition">
                    Continuer mes achats
                </Link>
            </div>
        </MainLayout>
    );
}