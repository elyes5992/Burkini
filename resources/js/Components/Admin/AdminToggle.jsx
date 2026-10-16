import { motion } from 'framer-motion';

export default function AdminToggle({ checked, onChange, label, description }) {
    return (
        <div
            onClick={() => onChange(!checked)}
            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 select-none ${
                checked
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.08)]'
                    : 'bg-[#12141c] border-zinc-800 hover:border-zinc-700'
            }`}
        >
            <div className="pr-4">
                <p className={`text-xs font-bold uppercase tracking-wider ${checked ? 'text-amber-300' : 'text-zinc-300'}`}>
                    {label}
                </p>
                {description && <p className="text-[11px] text-zinc-400 mt-0.5">{description}</p>}
            </div>

            <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${checked ? 'bg-amber-400' : 'bg-zinc-700'}`}>
                <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 600, damping: 30 }}
                    className={`bg-zinc-950 w-4 h-4 rounded-full shadow-md ${checked ? 'ml-auto' : ''}`}
                />
            </div>
        </div>
    );
}