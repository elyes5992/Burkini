import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

export default function Edit({ order }) {
    const { data, setData, put, processing, errors } = useForm({
        customer_name: order.customer_name || '',
        customer_phone: order.customer_phone || '',
        customer_city: order.customer_city || '',
        customer_address: order.customer_address || '',
        status: order.status || 'pending',
        notes: order.notes || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.orders.update', order.id));
    };

    const inputCls = (key) =>
        `w-full h-[42px] bg-adm-panel text-adm-text border rounded-xl px-3.5 text-sm focus:outline-none transition ${
            errors[key] ? 'border-adm-bad' : 'border-adm-line focus:border-adm-accent'
        }`;

    return (
        <AdminLayout>
            <form onSubmit={submit}>
                {/* Header */}
                <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
                    <div>
                        <Link href={route('admin.orders.index')} className="inline-flex items-center gap-1.5 text-sm text-adm-muted hover:text-adm-text transition mb-2">
                            <ArrowLeft size={15} /> Commandes
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight text-adm-text">
                            Commande #{order.id} — {order.customer_name}
                        </h1>
                        <span className="text-xs text-adm-faint">{order.created_at}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
                    {/* Left Column: Form Details & Items */}
                    <div className="flex flex-col gap-5">
                        {/* Client Informations */}
                        <div className="bg-adm-panel border border-adm-line rounded-2xl p-6">
                            <h2 className="text-base font-bold text-adm-text mb-5">Coordonnées du client</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-adm-muted mb-1.5">Nom du client</label>
                                    <input
                                        type="text"
                                        className={inputCls('customer_name')}
                                        value={data.customer_name}
                                        onChange={(e) => setData('customer_name', e.target.value)}
                                    />
                                    {errors.customer_name && <p className="text-xs text-adm-bad mt-1">{errors.customer_name}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-adm-muted mb-1.5">Téléphone</label>
                                    <input
                                        type="text"
                                        className={inputCls('customer_phone')}
                                        value={data.customer_phone}
                                        onChange={(e) => setData('customer_phone', e.target.value)}
                                    />
                                    {errors.customer_phone && <p className="text-xs text-adm-bad mt-1">{errors.customer_phone}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label className="block text-xs font-semibold text-adm-muted mb-1.5">Ville</label>
                                    <input
                                        type="text"
                                        className={inputCls('customer_city')}
                                        value={data.customer_city}
                                        onChange={(e) => setData('customer_city', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-adm-muted mb-1.5">Total calculé (DT)</label>
                                    <input
                                        type="text"
                                        disabled
                                        className="w-full h-[42px] bg-adm-raise text-adm-ok font-bold border border-adm-line rounded-xl px-3.5 text-sm opacity-90 cursor-not-allowed"
                                        value={`${Number(order.total_price).toFixed(2)} DT`}
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-xs font-semibold text-adm-muted mb-1.5">Adresse de livraison</label>
                                <textarea
                                    rows={2}
                                    className={`w-full bg-adm-panel text-adm-text border rounded-xl p-3 text-sm focus:outline-none transition ${
                                        errors.customer_address ? 'border-adm-bad' : 'border-adm-line focus:border-adm-accent'
                                    }`}
                                    value={data.customer_address}
                                    onChange={(e) => setData('customer_address', e.target.value)}
                                />
                                {errors.customer_address && <p className="text-xs text-adm-bad mt-1">{errors.customer_address}</p>}
                            </div>

                            <div className="mt-4">
                                <label className="block text-xs font-semibold text-adm-muted mb-1.5">Notes internes</label>
                                <textarea
                                    rows={2}
                                    className="w-full bg-adm-panel text-adm-text border border-adm-line rounded-xl p-3 text-sm focus:outline-none focus:border-adm-accent transition"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Remarques, suivi du livreur…"
                                />
                            </div>
                        </div>

                        {/* Order Items Table */}
                        <div className="bg-adm-panel border border-adm-line rounded-2xl p-6">
                            <h2 className="text-base font-bold text-adm-text mb-4">Articles commandés ({order.items.length})</h2>

                            <div className="divide-y divide-adm-line">
                                {order.items.map((item) => (
                                    <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-16 rounded-lg bg-adm-raise border border-adm-line overflow-hidden flex-none">
                                                {item.product_image ? (
                                                    <img src={item.product_image} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-zinc-800" />
                                                )}
                                            </div>
                                            <div>
                                                <b className="block text-sm text-adm-text">{item.product_name}</b>
                                                <span className="text-xs text-adm-muted">Taille: {item.size} • Quantité: {item.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <b className="text-sm font-bold text-sky-400">
                                                {(item.quantity * item.product_price).toFixed(2)} DT
                                            </b>
                                            <span className="block text-[11px] text-adm-faint">
                                                {Number(item.product_price).toFixed(2)} DT / unité
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Status & Actions */}
                    <div className="sticky top-6 flex flex-col gap-5">
                        <div className="bg-adm-panel border border-adm-line rounded-2xl p-6">
                            <h2 className="text-base font-bold text-adm-text mb-4">Statut de la commande</h2>

                            <div className="mb-5">
                                <label className="block text-xs font-semibold text-adm-muted mb-2">État actuel</label>
                                <select
                                    className="w-full h-[42px] bg-adm-panel text-adm-text border border-adm-line rounded-xl px-3.5 text-sm focus:outline-none focus:border-adm-accent cursor-pointer transition"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                >
                                    <option value="pending">🕐 En attente</option>
                                    <option value="confirmed">🔄 En cours / Confirmé</option>
                                    <option value="shipped">🚚 Expédié</option>
                                    <option value="delivered">✅ Terminé / Livré</option>
                                    <option value="cancelled">❌ Annulé</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2.5">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-10 rounded-xl bg-adm-accent hover:bg-[#e4b255] text-[#17130a] font-semibold text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
                                >
                                    <Save size={16} />
                                    {processing ? 'Enregistrement…' : 'Enregistrer'}
                                </button>
                                <Link
                                    href={route('admin.orders.index')}
                                    className="w-full h-10 rounded-xl border border-adm-line-2 hover:bg-adm-raise text-adm-text font-semibold text-sm flex items-center justify-center transition"
                                >
                                    Annuler
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}