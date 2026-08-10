import { Activity, TrendingUp } from 'lucide-react';

const STAGES = [
    { key: 'arrives', label: 'Trafic', color: '#3b82f6' },
    { key: 'vus', label: 'Intérêt', color: '#a855f7' },
    { key: 'panier', label: 'Désir', color: '#f59e0b' },
    { key: 'checkout', label: 'Action', color: '#ec4899' },
    { key: 'achats', label: 'Fidélité', color: '#22c55e' },
];

export default function FunnelBar({ funnel }) {
    const maxFunnel = Math.max(1, funnel.arrives);
    const data = STAGES.map((s) => ({
        ...s,
        width: Math.max((funnel[s.key] / maxFunnel) * 100, 1),
        value: funnel[s.key],
    }));

    return (
        <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-gray-500" />
                    Tunnel de conversion
                </h3>
                <TrendingUp className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-800/80 mb-4">
                {data.map((stage) => (
                    <div
                        key={stage.key}
                        style={{ width: `${stage.width}%`, backgroundColor: stage.color }}
                        className="relative group/bar transition-all duration-500"
                    >
                        <div className="absolute inset-0 bg-white/0 group-hover/bar:bg-white/10 transition-colors" />
                    </div>
                ))}
            </div>
            <div className="flex justify-between">
                {data.map((stage) => (
                    <div key={stage.key} className="text-center flex-1">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                            <span className="text-xs font-medium text-gray-400">{stage.label}</span>
                        </div>
                        <div className="text-sm font-bold text-white">{stage.value.toLocaleString('fr-FR')}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}