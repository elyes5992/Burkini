import { Star, Quote } from 'lucide-react';

// --- Avis clients (mix Français / Tounsi) ---
const REVIEWS = [
    { name: 'Sarra M.', lang: 'fr', rating: 5, text: "Le tissu est vraiment magnifique et sèche en un rien de temps. Je recommande à 100%." },
    { name: 'Amira B.', lang: 'ar', rating: 5, text: "الطلبية وصلت بسرعة و الجودة برشا زينة، ما يلزقش بالجسم و اللون ما يفوتش." },
    { name: 'Nour H.', lang: 'fr', rating: 5, text: "Coupe parfaite, matière légère, exactement comme sur les photos. Vellure ne déçoit jamais." },
    { name: 'Rahma T.', lang: 'ar', rating: 4, text: "المايو حلو برشا و القياسات مظبوطة، غير التوصيل تاخر شوية عليا." },
    { name: 'Yasmine K.', lang: 'fr', rating: 5, text: "J'ai commandé pour mes vacances et j'ai reçu tellement de compliments. Merci Vellure !" },
    { name: 'Ines D.', lang: 'ar', rating: 5, text: "أول مرة نشري مايو أونلاين و نخاف، لكن الجودة فاقت التوقعات. ماشية نعاود نشري." },
    { name: 'Chaima R.', lang: 'fr', rating: 5, text: "Le service client a été très réactif pour un échange de taille. Une équipe adorable." },
    { name: 'Emna S.', lang: 'ar', rating: 5, text: "التصميم أنيق و مريح برشا للسباحة، ما يحسش بيه في الماء و الألوان ثابتة." },
    { name: 'Salma A.', lang: 'fr', rating: 4, text: "Très joli maillot, doux et confortable. Juste un peu long pour ma taille mais rien de grave." },
    { name: 'Wafa G.', lang: 'ar', rating: 5, text: "نصيحة صادقة: الماركة تستاهل، القماش ثقيل شوية و هذا يعطيه مظهر فاخر." },
    { name: 'Lina F.', lang: 'fr', rating: 5, text: "Enfin une collection voilée qui allie modestie et élégance. Bravo pour ce travail !" },
    { name: 'Mariem Z.', lang: 'ar', rating: 5, text: "خدمة ممتازة و التغليف كان أنيق برشا، حسيت روحي نشري من ماركة عالمية." },
];

// Avis clients dédiés à la collection Chemises
// Mix Français / Tounsi — même format que ReviewsCarousel ({ name, lang, rating, text })

const CHEMISES_REVIEWS = [
    { name: 'Aya B.', lang: 'fr', rating: 5, text: "Une matière incroyablement fluide, elle ne se froisse presque pas et tombe parfaitement." },
    { name: 'Mouna K.', lang: 'ar', rating: 5, text: "القميص خفيف برشا و الخياطة نظيفة، لبستو للخدمة و الصيف و كان مريح برشا." },
    { name: 'Dorra L.', lang: 'fr', rating: 5, text: "La coupe est moderne sans être moulante, parfait pour un look chic au bureau." },
    { name: 'Hiba R.', lang: 'ar', rating: 4, text: "القماش زين و الألوان حلوة، غير المقاس عندي طلع شوية كبير، لازم ننتبه للجدول." },
    { name: 'Syrine M.', lang: 'fr', rating: 5, text: "Je l'ai porté avec un jean et avec une jupe, elle se marie avec tout. Un basique indispensable." },
    { name: 'Ghofrane T.', lang: 'ar', rating: 5, text: "التوصيل جا في وقتو و القميص بالضبط كيما في الصور، ما فماش خيبة ولا حاجة." },
    { name: 'Nesrine A.', lang: 'fr', rating: 5, text: "Finitions soignées, boutons de qualité, on sent que ce n'est pas du bas de gamme." },
    { name: 'Rania S.', lang: 'ar', rating: 5, text: "حبيت برشا كيفاش القماش ما يعرقش، تبقى مرتاحة طول النهار حتى في الصيف." },
    { name: 'Olfa H.', lang: 'fr', rating: 4, text: "Très jolie chemise, agréable à porter, juste les manches un peu longues pour moi." },
    { name: 'Yosra Z.', lang: 'ar', rating: 5, text: "نصيحة: خذو القميص الأبيض، يلبق مع كل حاجة و اللون ما يصفرش مع الغسيل." },
    { name: 'Fatma G.', lang: 'fr', rating: 5, text: "Livraison rapide, emballage soigné et une chemise qui a dépassé mes attentes." },
    { name: 'Wided N.', lang: 'ar', rating: 5, text: "خدمة الزبائن كانت لطيفة برشا و عاونوني نبدل المقاس بلا مشاكل، ماركة تستاهل." },
];



const splitIntoRows = (arr) => {
    const mid = Math.ceil(arr.length / 2);
    return [arr.slice(0, mid), arr.slice(mid)];
};

const ReviewCard = ({ review }) => (
    <div
        dir={review.lang === 'ar' ? 'rtl' : 'ltr'}
        className="shrink-0 w-[280px] md:w-[340px] bg-[#F9F8F6] border border-burgundy/10 rounded-2xl px-6 py-6 mx-3 shadow-sm flex flex-col justify-between"
    >
        <div>
            <Quote size={18} className="text-burgundy/25 mb-3" />
            <p className={`text-charcoal/80 leading-relaxed text-sm ${review.lang === 'ar' ? 'font-arabic text-[15px]' : 'font-serif'}`}>
                {review.text}
            </p>
        </div>
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-burgundy/10">
            <span className="text-xs font-bold uppercase tracking-widest text-charcoal">
                {review.name}
            </span>
            <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        size={13}
                        className={i < review.rating ? 'text-burgundy' : 'text-charcoal/15'}
                        fill={i < review.rating ? 'currentColor' : 'none'}
                    />
                ))}
            </div>
        </div>
    </div>
);

const MarqueeRow = ({ items, direction = 'left', duration = 60 }) => {
    // Duplicate the list so the loop is seamless
    const looped = [...items, ...items];

    return (
        <div className="relative overflow-hidden">
            {/* fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-cream to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-cream to-transparent z-10" />

            <div
                className="flex w-max group"
                style={{
                    animation: `marquee-${direction} ${duration}s linear infinite`,
                }}
            >
                <div className="flex group-hover:[animation-play-state:paused]">
                    {looped.map((review, idx) => (
                        <ReviewCard key={idx} review={review} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function ReviewsCarousel() {
    const [rowA, rowB] = splitIntoRows(REVIEWS);

    return (
        <section className="mt-24 pt-16 border-t border-burgundy/10">
            <div className="text-center mb-12">
                <p className="text-[11px] uppercase tracking-[0.3em] font-bold text-burgundy/70 mb-3">
                    Elles nous font confiance
                </p>
                <h2 className="text-3xl md:text-4xl font-dream text-charcoal tracking-wide">
                    Avis de nos clientes
                </h2>
                <div className="flex justify-center items-center gap-4 mt-5">
                    <span className="h-[1px] w-12 bg-burgundy/20" />
                    <span className="w-1.5 h-1.5 rounded-full bg-burgundy/40" />
                    <span className="h-[1px] w-12 bg-burgundy/20" />
                </div>
            </div>

            {/* Desktop / tablet : une seule ligne, défilement lent droite -> gauche */}
            <div className="hidden md:block">
                <MarqueeRow items={REVIEWS} direction="left" duration={70} />
            </div>

            {/* Mobile : deux lignes, sens opposés */}
            <div className="md:hidden flex flex-col gap-5">
                <MarqueeRow items={rowA} direction="left" duration={38} />
                <MarqueeRow items={rowB} direction="right" duration={42} />
            </div>

            <style>{`
                @keyframes marquee-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes marquee-right {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
            `}</style>
        </section>
    );
}