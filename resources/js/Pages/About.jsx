import MainLayout from '@/Layouts/MainLayout';
import { motion } from 'framer-motion';
import { Sparkles, Waves, ShieldCheck } from 'lucide-react';

export default function About() {
    // Animation variants for staggered effects
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const stats = [
        { number: "5+", text: "Années d'expertise" },
        { number: "5000+", text: "Créations vendues" },
        { number: "99%", text: "Clientes satisfaites" },
    ];

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
                
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-20"
                >
                    <h1 className="text-5xl md:text-6xl font-dream text-charcoal mb-6 tracking-wide">
                        L'Essence Vellure
                    </h1>
                    <div className="w-16 h-[1px] bg-burgundy mx-auto mb-8"></div>
                    <p className="max-w-2xl mx-auto text-charcoal/70 text-sm md:text-base leading-relaxed font-light">
                        Parce que la plage est un lieu de joie et d'expression de soi, 
                        nous avons créé un univers où l'élégance balnéaire rencontre le confort absolu.
                    </p>
                </motion.div>

                {/* Stats Section */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 relative"
                >
                    {/* Decorative background line for desktop */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-burgundy/10 -z-10 transform -translate-y-1/2"></div>
                    
                    {stats.map((stat, index) => (
                        <motion.div 
                            key={index} 
                            variants={itemVariants}
                            className="flex flex-col items-center justify-center bg-cream px-6 py-8 border border-burgundy/10 shadow-sm hover:shadow-md transition-shadow duration-300 group"
                        >
                            <span className="text-5xl font-dream text-burgundy mb-3 group-hover:scale-110 transition-transform duration-500">
                                {stat.number}
                            </span>
                            <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal font-bold text-center">
                                {stat.text}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Values Section (Replacing the long boring text) */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16"
                >
                    {/* Value 1 */}
                    <motion.div variants={itemVariants} className="text-center md:text-left flex flex-col items-center md:items-start group">
                        <div className="w-12 h-12 rounded-full bg-burgundy/5 flex items-center justify-center mb-6 group-hover:bg-burgundy/10 transition-colors">
                            <Sparkles className="text-burgundy" size={24} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-serif text-charcoal mb-4">Inclusivité & Style</h3>
                        <p className="text-charcoal/70 text-sm leading-relaxed font-light">
                            Née de l'envie de réunir la mode pour toutes, notre marque propose trois gammes distinctes : <strong className="text-charcoal font-medium">Non Voilée, Voilée et Enfant</strong>. Un maillot pour chaque femme, chaque style, chaque besoin.
                        </p>
                    </motion.div>

                    {/* Value 2 */}
                    <motion.div variants={itemVariants} className="text-center md:text-left flex flex-col items-center md:items-start group">
                        <div className="w-12 h-12 rounded-full bg-burgundy/5 flex items-center justify-center mb-6 group-hover:bg-burgundy/10 transition-colors">
                            <Waves className="text-burgundy" size={24} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-serif text-charcoal mb-4">Liberté de Mouvement</h3>
                        <p className="text-charcoal/70 text-sm leading-relaxed font-light">
                            Chaque coupe est minutieusement pensée pour épouser vos mouvements. Nous concevons des pièces qui vous garantissent une allure élégante sans jamais compromettre votre confort dans l'eau.
                        </p>
                    </motion.div>

                    {/* Value 3 */}
                    <motion.div variants={itemVariants} className="text-center md:text-left flex flex-col items-center md:items-start group">
                        <div className="w-12 h-12 rounded-full bg-burgundy/5 flex items-center justify-center mb-6 group-hover:bg-burgundy/10 transition-colors">
                            <ShieldCheck className="text-burgundy" size={24} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-serif text-charcoal mb-4">Qualité Supérieure</h3>
                        <p className="text-charcoal/70 text-sm leading-relaxed font-light">
                            Nos matériaux sont rigoureusement sélectionnés pour résister au sel, au soleil et au chlore. Plongez dans notre univers la l'esprit tranquille avec des tissus durables et premium.
                        </p>
                    </motion.div>
                </motion.div>

            </div>
        </MainLayout>
    );
}