// resources/js/Pages/Admin/Stats.jsx

import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, EyeOff, Eye } from 'lucide-react';
import DateRangePicker from '../../Components/Admin/DateRangePicker';
import FunnelCards from '../../Components/Admin/FunnelCards';
import LiveVisitorsTable from '../../Components/Admin/LiveVisitorsTable';
import FunnelBar from '../../Components/Admin/FunnelBar';
import TrafficChart from '../../Components/Admin/TrafficChart';
import MiniVisitorsList from '../../Components/Admin/MiniVisitorsList';

export default function Stats({ funnel, visitors, daily, range, start, end, recentVisitors, filters }) {
    const hideDirect = filters?.hide_direct ?? false;

    const handleDateChange = (newRange) => {
        const params = new URLSearchParams(window.location.search);
        params.set('start', newRange.start);
        params.set('end', newRange.end);
        params.delete('cursor');
        window.location.href = `${window.location.pathname}?${params.toString()}`;
    };

    const toggleHideDirect = () => {
        const params = new URLSearchParams(window.location.search);
        if (hideDirect) {
            params.delete('hide_direct');
        } else {
            params.set('hide_direct', '1');
        }
        params.delete('cursor');
        window.location.href = `${window.location.pathname}?${params.toString()}`;
    };

    return (
        <>
            <Head title="Statistiques — Vellure Store" />

            <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
                <header className="border-b border-gray-800/50 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
                    <div className="max-w-full mx-auto px-8 py-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">Statistiques</h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {new Date(start).toLocaleDateString('fr-FR')} — {new Date(end).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Bouton Toggle Cacher Direct */}
                            <button
                                onClick={toggleHideDirect}
                                className={`flex items-center gap-2 text-sm font-medium transition-all px-4 py-2.5 rounded-xl border ${
                                    hideDirect
                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                                        : 'bg-gray-900/80 text-gray-400 border-gray-800 hover:text-gray-200 hover:bg-gray-800'
                                }`}
                                title={hideDirect ? "Afficher les visites Direct" : "Cacher les visites Direct (bots)"}
                            >
                                {hideDirect ? (
                                    <>
                                        <Eye className="w-4 h-4" />
                                        Afficher Direct
                                    </>
                                ) : (
                                    <>
                                        <EyeOff className="w-4 h-4" />
                                        Cacher Direct
                                    </>
                                )}
                            </button>

                            <DateRangePicker startDate={start} endDate={end} onChange={handleDateChange} />
                            <Link
                                href="/admin"
                                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group px-4 py-2.5 bg-gray-900/80 border border-gray-800 rounded-xl"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="max-w-full mx-auto px-8 py-8 space-y-8">
                    <FunnelCards funnel={funnel} />

                    <LiveVisitorsTable
                        visitors={visitors?.data || []}
                        pagination={visitors || {}}
                        filters={filters || {}}
                    />

                    <FunnelBar funnel={funnel} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <TrafficChart daily={daily} />
                        </div>
                       
                    </div>
                </main>
            </div>
        </>
    );
}