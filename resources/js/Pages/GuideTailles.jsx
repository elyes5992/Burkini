import MainLayout from '@/Layouts/MainLayout';
import { motion } from 'framer-motion';
import { Ruler, Sparkles } from 'lucide-react';

export default function GuideTailles() {
    return (
        <MainLayout>
            {/* Header Section */}
            <section className="pt-20 pb-12 px-4 bg-cream text-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl mx-auto"
                >
                    <span className="text-burgundy text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">Mensurations</span>
                    <h1 className="text-4xl md:text-6xl font-dream text-charcoal mb-6">Guide des Tailles</h1>
                    <div className="w-16 h-[1px] bg-burgundy mx-auto mb-8"></div>
                    <p className="text-charcoal/70 font-light leading-relaxed">
                        Pour vous garantir une aisance parfaite et un tombé élégant, veuillez vous référer à notre tableau de mesures ci-dessous.
                    </p>
                </motion.div>
            </section>

            <section className="py-16 px-4 max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-start">
                
                {/* Tableau des Tailles */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full lg:w-2/3 bg-white shadow-sm border border-cream/50 overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-charcoal text-cream text-[11px] uppercase tracking-widest">
                                    <th className="p-5 font-medium">Taille</th>
                                    <th className="p-5 font-medium">Poitrine (cm)</th>
                                    <th className="p-5 font-medium">Taille (cm)</th>
                                    <th className="p-5 font-medium">Hanches (cm)</th>
                                </tr>
                            </thead>
                            <tbody className="text-charcoal/80 text-sm font-light">
                                {[
                                    { size: "S (36/38)", chest: "84 - 88", waist: "66 - 70", hips: "90 - 94" },
                                    { size: "M (38/40)", chest: "89 - 93", waist: "71 - 75", hips: "95 - 99" },
                                    { size: "L (40/42)", chest: "94 - 98", waist: "76 - 80", hips: "100 - 104" },
                                    { size: "XL (42/44)", chest: "99 - 103", waist: "81 - 85", hips: "105 - 109" },
                                    { size: "XXL (44/46)", chest: "104 - 109", waist: "86 - 92", hips: "110 - 116" },
                                ].map((row, idx) => (
                                    <tr key={idx} className="border-b border-cream/50 hover:bg-cream/20 transition-colors">
                                        <td className="p-5 font-medium text-burgundy">{row.size}</td>
                                        <td className="p-5">{row.chest}</td>
                                        <td className="p-5">{row.waist}</td>
                                        <td className="p-5">{row.hips}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Comment prendre ses mesures */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full lg:w-1/3 space-y-8"
                >
                    <div className="bg-cream p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Ruler className="text-burgundy" size={24} />
                            <h3 className="text-2xl font-dream text-charcoal">Prendre vos mesures</h3>
                        </div>
                        <ul className="space-y-6 text-sm text-charcoal/70 font-light">
                            <li>
                                <strong className="text-charcoal block mb-1">1. Tour de poitrine</strong>
                                Prenez la mesure à l'endroit le plus fort de votre poitrine, en gardant le mètre ruban bien horizontal.
                            </li>
                            <li>
                                <strong className="text-charcoal block mb-1">2. Tour de taille</strong>
                                Mesurez au creux de votre taille, là où elle est la plus fine (généralement juste au-dessus du nombril).
                            </li>
                            <li>
                                <strong className="text-charcoal block mb-1">3. Tour de hanches</strong>
                                Mesurez à l'endroit le plus large de vos hanches et de vos fesses.
                            </li>
                        </ul>
                    </div>

                    {/* Smart Tip Box */}
                    <div className="border border-burgundy p-6 relative">
                        <div className="absolute -top-3 left-6 bg-white px-2 text-burgundy">
                            <Sparkles size={20} />
                        </div>
                        <h4 className="font-bold text-charcoal uppercase text-[11px] tracking-widest mb-2 mt-2">Le Conseil Vellure</h4>
                        <p className="text-sm text-charcoal/70 font-light leading-relaxed">
                            Pour nos maillots de bain et burkinis, si vous hésitez entre deux tailles, nous vous conseillons de <strong>choisir la taille supérieure</strong>. Le tissu balnéaire est conçu pour être ajusté, une taille au-dessus vous garantira plus de pudeur et de confort.
                        </p>
                    </div>
                </motion.div>

            </section>
        </MainLayout>
    );
}