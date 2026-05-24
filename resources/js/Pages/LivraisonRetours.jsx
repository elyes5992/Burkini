import MainLayout from '@/Layouts/MainLayout';
import { motion } from 'framer-motion';
import { Truck, RotateCcw, Box, Clock } from 'lucide-react';

export default function LivraisonRetours() {
    return (
        <MainLayout>
            {/* Header Section */}
            <section className="pt-20 pb-16 px-4 bg-cream text-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl mx-auto"
                >
                    <span className="text-burgundy text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">Assistance</span>
                    <h1 className="text-4xl md:text-6xl font-dream text-charcoal mb-6">Livraison & Retours</h1>
                    <div className="w-16 h-[1px] bg-burgundy mx-auto mb-8"></div>
                    <p className="text-charcoal/70 font-light leading-relaxed">
                        Parce que votre satisfaction est notre priorité absolue, nous avons simplifié nos processus d'expédition et de retour pour vous offrir une expérience sans tracas.
                    </p>
                </motion.div>
            </section>

            {/* Expédition Section */}
            <section className="py-16 px-4 max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-dream text-charcoal mb-6">Politique d'Expédition</h2>
                        <p className="text-charcoal/70 font-light mb-8 leading-relaxed">
                            Chaque pièce Vellure est soigneusement préparée et emballée dans nos ateliers. Nous livrons sur tout le territoire national avec nos partenaires de confiance.
                        </p>
                        
                        <div className="space-y-6">
                            <div className="flex gap-4 items-start">
                                <div className="mt-1 bg-cream p-3 rounded-full text-burgundy"><Truck size={24} strokeWidth={1.5} /></div>
                                <div>
                                    <h4 className="font-bold text-charcoal tracking-wide mb-1">Livraison Standard</h4>
                                    <p className="text-sm text-charcoal/60 font-light">2 à 4 jours ouvrables. Frais de livraison : 7 TND.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="mt-1 bg-cream p-3 rounded-full text-burgundy"><Clock size={24} strokeWidth={1.5} /></div>
                                <div>
                                    <h4 className="font-bold text-charcoal tracking-wide mb-1">Traitement des Commandes</h4>
                                    <p className="text-sm text-charcoal/60 font-light">Toute commande passée avant 14h est expédiée le jour même.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-8 md:p-12 shadow-sm border border-cream/50 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cream rounded-bl-full -z-10 opacity-50"></div>
                        <Box size={40} className="text-burgundy mb-6" strokeWidth={1} />
                        <h3 className="text-2xl font-dream text-charcoal mb-4">L'Emballage Vellure</h3>
                        <p className="text-charcoal/70 text-sm font-light leading-relaxed">
                            Votre commande arrivera dans notre coffret signature exclusif, discrètement emballé pour garantir la sécurité et la confidentialité de vos achats jusqu'à vos mains.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Retours Section (Smart Step-by-Step) */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <RotateCcw size={32} className="mx-auto text-burgundy mb-4" strokeWidth={1} />
                        <h2 className="text-4xl font-dream text-charcoal mb-4">Retours & Échanges</h2>
                        <p className="text-charcoal/70 font-light max-w-2xl mx-auto">
                            Vous disposez de 7 jours après réception pour demander un échange ou un retour, à condition que l'article n'ait pas été porté ni lavé.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Ligne connectrice pour Desktop */}
                        <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-[1px] bg-burgundy/20 z-0"></div>

                        {[
                            { step: "01", title: "Contactez-nous", desc: "Envoyez-nous un message via WhatsApp ou email avec votre numéro de commande." },
                            { step: "02", title: "Préparez le colis", desc: "Replacez l'article dans son emballage d'origine avec toutes ses étiquettes intactes." },
                            { step: "03", title: "Collecte", desc: "Notre livreur passera récupérer le colis directement chez vous pour procéder à l'échange." }
                        ].map((item, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="relative z-10 text-center bg-white pt-2 px-4"
                            >
                                <div className="w-16 h-16 mx-auto bg-cream rounded-full flex items-center justify-center text-burgundy font-dream text-2xl mb-6 shadow-sm border border-burgundy/10">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-medium text-charcoal mb-3">{item.title}</h3>
                                <p className="text-charcoal/60 text-sm font-light leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}