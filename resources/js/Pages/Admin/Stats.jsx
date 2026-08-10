// resources/js/Pages/Admin/Stats.jsx

import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import DateRangePicker from '../../Components/Admin/DateRangePicker';
import FunnelCards from '../../Components/Admin/FunnelCards';
import LiveVisitorsTable from '../../Components/Admin/LiveVisitorsTable';
import FunnelBar from '../../Components/Admin/FunnelBar';
import TrafficChart from '../../Components/Admin/TrafficChart';
import MiniVisitorsList from '../../Components/Admin/MiniVisitorsList';

export default function Stats({ funnel, visitors, daily, range, start, end, recentVisitors, filters }) {
    const handleDateChange = (newRange) => {
        const params = new URLSearchParams(window.location.search);
        params.set('start', newRange.start);
        params.set('end', newRange.end);
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
                        <div className="lg:col-span-1">
                            <MiniVisitorsList visitors={recentVisitors} />
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}