export default function AdminInput({ label, error, helper, ...props }) {
    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                    {label}
                </label>
            )}
            <input
                {...props}
                className="w-full bg-[#12141c] !bg-[#12141c] text-zinc-100 border border-zinc-700/60 rounded-lg px-3.5 py-2.5 text-xs placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-inner"
            />
            {helper && <p className="text-[10px] text-zinc-400 italic">{helper}</p>}
            {error && <p className="text-[11px] text-red-400 font-medium tracking-wide">{error}</p>}
        </div>
    );
}