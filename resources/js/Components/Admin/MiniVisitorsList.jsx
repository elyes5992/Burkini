import { Globe } from 'lucide-react';

export default function MiniVisitorsList({ visitors }) {
    return (
        <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    Visiteurs récents
                </h3>
                <span className="text-[11px] text-emerald-400 font-semibold uppercase">Live</span>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {visitors.slice(0, 8).map((v) => (
                    <div key={v.visitor_id} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-800/30">
                        <div>
                            <div className="text-xs font-mono text-gray-300">visiteur_{v.visitor_id.slice(0, 8)}</div>
                            <div className="text-[10px] text-gray-500">{v.source}</div>
                        </div>
                        <div className="flex gap-1">
                            {v.has_page_view && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                            {v.has_product_view && <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                            {v.has_cart && <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                            {v.has_checkout && <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />}
                            {v.has_purchase && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}