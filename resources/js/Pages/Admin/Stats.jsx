import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { EyeOff, Eye } from 'lucide-react';
import DateRangePicker from '../../Components/Admin/DateRangePicker';
import FunnelCards from '../../Components/Admin/FunnelCards';
import LiveVisitorsTable from '../../Components/Admin/LiveVisitorsTable';

import TrafficChart from '../../Components/Admin/TrafficChart';

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

    const formatDate = (dateStr) => {
        try {
            return new Date(dateStr).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <AdminLayout>
            <Head title="Statistiques — Vellure Store" />

            {/* Unified Page Header */}
            <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-adm-text">Statistiques</h1>
                    <p className="mt-1 text-sm text-adm-muted">
                        Période : {formatDate(start)} — {formatDate(end)}
                    </p>
                </div>

                {/* Header Actions */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Toggle Cacher Direct */}
                    <button
                        type="button"
                        onClick={toggleHideDirect}
                        className={`inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2.5 rounded-xl border transition ${
                            hideDirect
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                                : 'bg-adm-panel text-adm-muted border-adm-line hover:text-adm-text hover:bg-adm-raise'
                        }`}
                        title={hideDirect ? "Afficher les visites Direct" : "Cacher les visites Direct (bots)"}
                    >
                        {hideDirect ? (
                            <>
                                <Eye className="w-4 h-4 text-amber-400" />
                                <span>Afficher Direct</span>
                            </>
                        ) : (
                            <>
                                <EyeOff className="w-4 h-4 text-adm-faint" />
                                <span>Cacher Direct</span>
                            </>
                        )}
                    </button>

                    {/* Date Picker */}
                    <DateRangePicker startDate={start} endDate={end} onChange={handleDateChange} />
                </div>
            </div>

            {/* Main Stats Stack */}
            <div className="space-y-6">
                {/* 1. Funnel Top Cards */}
                <FunnelCards funnel={funnel} />

                {/* 2. Live Visitors Table */}
                <LiveVisitorsTable
                    visitors={visitors?.data || []}
                    pagination={visitors || {}}
                    filters={filters || {}}
                />

              

                {/* 4. Traffic Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-3">
                        <TrafficChart daily={daily} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}