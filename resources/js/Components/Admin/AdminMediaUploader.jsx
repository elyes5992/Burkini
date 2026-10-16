import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminMediaUploader({ existingImages = [], previewUrls = [], onFilesSelected, onDeleteExisting }) {
    return (
        <div className="space-y-4">
            {/* Existing Images from Spatie */}
            {existingImages.length > 0 && (
                <div>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-400 block mb-2">
                        Images Existantes ({existingImages.length})
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        <AnimatePresence>
                            {existingImages.map((img) => (
                                <motion.div
                                    key={img.id}
                                    layout
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="group relative aspect-[3/4] rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900 shadow-md"
                                >
                                    <img src={img.url} alt="media" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => onDeleteExisting(img.id)}
                                            className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-full transition-transform transform hover:scale-110 shadow-lg"
                                            title="Supprimer l'image"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* New Previews */}
            {previewUrls.length > 0 && (
                <div>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-400 block mb-2">
                        Nouvelles Images Sélectionnées ({previewUrls.length})
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {previewUrls.map((url, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="aspect-[3/4] rounded-lg overflow-hidden border-2 border-emerald-500/50 bg-zinc-900 shadow-lg relative"
                            >
                                <img src={url} alt="new preview" className="w-full h-full object-cover" />
                                <span className="absolute bottom-1 right-1 bg-emerald-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded">
                                    NOUVEAU
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Dropzone */}
            <label className="relative border-2 border-dashed border-zinc-700/80 hover:border-amber-400 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 bg-[#12141c]/50 hover:bg-[#161922] group">
                <div className="p-3 bg-zinc-800 group-hover:bg-amber-400/10 rounded-full text-zinc-400 group-hover:text-amber-400 transition-colors mb-3">
                    <Upload size={22} />
                </div>
                <span className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                    Glisser & déposer vos images ou <span className="text-amber-400 underline">parcourir</span>
                </span>
                <span className="text-[10px] text-zinc-400 mt-1">Spatie MediaLibrary • Format WebP / JPG / PNG jusqu'à 10MB</span>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={onFilesSelected}
                    className="hidden"
                />
            </label>
        </div>
    );
}