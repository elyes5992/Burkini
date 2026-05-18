import MainLayout from '@/Layouts/MainLayout';
import { motion } from 'framer-motion';

export default function About() {
    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto px-4 py-16">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-serif text-stone-800 mb-6">À Propos de Nous</h1>
                    <div className="w-20 h-0.5 bg-sky-600 mx-auto"></div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="prose prose-stone lg:prose-lg mx-auto text-stone-600 leading-relaxed text-justify"
                >
                    <p className="mb-6">
                        Chez AquaChic, nous croyons que la plage est un lieu de détente, de joie et d'expression de soi. 
                        Notre mission est d'offrir des maillots de bain de haute qualité, confortables et esthétiques pour 
                        toutes les femmes, qu'elles recherchent un style classique, couvrant ou pour leurs enfants.
                    </p>
                    <p className="mb-6">
                        Née de l'envie de réunir l'inclusivité et la mode, notre marque propose trois gammes distinctes : 
                        <strong> Non Voilée, Voilée, et Enfant</strong>. Chaque pièce est pensée pour épouser les mouvements, 
                        résister au sel et au soleil, tout en vous garantissant une allure élégante.
                    </p>
                    <p>
                        Nos matériaux sont soigneusement sélectionnés pour vous offrir la meilleure expérience aquatique possible. 
                        Plongez dans notre univers et trouvez le maillot qui vous ressemble.
                    </p>
                </motion.div>
            </div>
        </MainLayout>
    );
}