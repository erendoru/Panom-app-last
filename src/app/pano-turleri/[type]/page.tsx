import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/PublicLayout";
import { notFound } from "next/navigation";

// Panel type data
const panelTypeData: Record<string, {
    name: string;
    title: string;
    description: string;
    features: string[];
    advantages: string[];
    sizes: string[];
    priceRange: string;
}> = {
    "billboard": {
        name: "Billboard",
        title: "Billboard Kiralama",
        description: "Büyük format açık hava panoları ile markanızı binlerce kişiye ulaştırın. Şehir merkezleri, ana yollar ve işlek kavşaklarda etkili reklam.",
        features: [
            "5x3m, 8x3m, 12x4m boyut seçenekleri",
            "Yüksek görünürlük ve etki",
            "7/24 reklam gösterimi",
            "Uzun mesafeden okunabilirlik"
        ],
        advantages: [
            "En yüksek görünürlük",
            "Marka bilinirliği artırma",
            "Geniş kitleye ulaşım",
            "Kalıcı görsel etki"
        ],
        sizes: ["5x3m", "8x3m", "10x4m", "12x4m"],
        priceRange: "₺10.000 - ₺50.000/hafta"
    },
    "clp-pano": {
        name: "CLP Pano",
        title: "CLP Pano Kiralama",
        description: "City Light Poster (CLP) panolar ile durak ve kaldırımlarda yaya trafiğine ulaşın. Işıklı ve dikkat çekici tasarım.",
        features: [
            "Aydınlatmalı görüntü",
            "Yaya trafiğine yakın konum",
            "Durak ve kaldırım yerleşimi",
            "Tek veya çift yüzlü seçenekler"
        ],
        advantages: [
            "Yayalara yakın mesafe",
            "Işıklı görüntü ile gece görünürlüğü",
            "Uygun fiyat",
            "Sık değişim imkanı"
        ],
        sizes: ["120x175cm", "118x175cm"],
        priceRange: "₺1.500 - ₺3.000/hafta"
    },
    "raket-pano": {
        name: "Raket Pano",
        title: "Raket Pano Kiralama",
        description: "Yol kenarlarında çift taraflı görünüm sağlayan raket panolar ile trafiğe her iki yönden ulaşın.",
        features: [
            "Çift taraflı görüntüleme",
            "Yol kenarı konumlandırma",
            "Orta boy format",
            "Araç trafiğine yönelik"
        ],
        advantages: [
            "Her iki yönden görünürlük",
            "Araç sürücülerine ulaşım",
            "Stratejik yol kenarı konumu",
            "Ekonomik fiyatlandırma"
        ],
        sizes: ["140x200cm", "150x210cm"],
        priceRange: "₺2.000 - ₺5.000/hafta"
    },
    "megalight": {
        name: "Megalight",
        title: "Megalight Pano Kiralama",
        description: "Büyük format ışıklı panolar ile gece ve gündüz maksimum etki. Premium lokasyonlarda marka görünürlüğü.",
        features: [
            "Büyük format ışıklı tasarım",
            "Gece görünürlüğü",
            "Premium lokasyonlar",
            "Yüksek kalite baskı"
        ],
        advantages: [
            "7/24 görünürlük",
            "Premium marka imajı",
            "Dikkat çekici boyut",
            "Profesyonel görünüm"
        ],
        sizes: ["4x3m", "6x3m", "8x4m"],
        priceRange: "₺15.000 - ₺40.000/hafta"
    },
    "totem": {
        name: "Totem",
        title: "Totem Pano Kiralama",
        description: "Dikey format totem panolar ile AVM girişleri, plaza önleri ve yaya bölgelerinde etkili reklam.",
        features: [
            "Dikey format tasarım",
            "AVM ve plaza girişleri",
            "Yaya bölgesi konumu",
            "360° görünürlük"
        ],
        advantages: [
            "Yaya trafiğine yakın",
            "Modern ve şık tasarım",
            "Yüksek dikkat çekme",
            "Çok yönlü görünüm"
        ],
        sizes: ["100x250cm", "120x300cm"],
        priceRange: "₺5.000 - ₺15.000/hafta"
    },
    "dijital-ekran": {
        name: "Dijital Ekran",
        title: "Dijital Ekran Kiralama",
        description: "LED ve dijital billboard'lar ile dinamik, değiştirilebilir içerik. Video, animasyon ve anlık güncelleme imkanı.",
        features: [
            "Video ve animasyon desteği",
            "Anlık içerik değişimi",
            "Programatik reklam imkanı",
            "Yüksek çözünürlük LED"
        ],
        advantages: [
            "Dinamik içerik",
            "Hedefli reklam gösterimi",
            "Güncel ve esnek kampanyalar",
            "Yüksek dikkat çekme oranı"
        ],
        sizes: ["LED 4x3m", "LED 6x4m", "LED 10x5m"],
        priceRange: "₺20.000 - ₺100.000/hafta"
    }
};

// Generate static params
export async function generateStaticParams() {
    return Object.keys(panelTypeData).map(type => ({
        type: type,
    }));
}

// Dynamic metadata
export async function generateMetadata({ params }: { params: { type: string } }): Promise<Metadata> {
    const data = panelTypeData[params.type];

    if (!data) {
        return { title: "Sayfa Bulunamadı" };
    }

    return {
        title: `${data.title} | Fiyatları ve Lokasyonlar - Panobu`,
        description: `${data.description} Türkiye genelinde ${data.name.toLowerCase()} kiralama. Şeffaf fiyatlar: ${data.priceRange}`,
        keywords: [
            `${data.name.toLowerCase()} kiralama`,
            `${data.name.toLowerCase()} fiyatları`,
            `${data.name.toLowerCase()} reklam`,
            "açık hava reklam",
            "billboard kiralama",
            "panobu"
        ],
        openGraph: {
            title: `${data.title} | Panobu`,
            description: data.description,
        },
        alternates: {
            canonical: `https://panobu.com/pano-turleri/${params.type}`,
        },
    };
}

export default function PanelTypePage({ params }: { params: { type: string } }) {
    const data = panelTypeData[params.type];

    if (!data) {
        notFound();
    }

    return (
        <PublicLayout>
            {/* Hero */}
            <section className="py-20 bg-gradient-to-b from-blue-900/20 to-transparent">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm mb-6">
                            Pano Türü
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            {data.title}
                        </h1>
                        <p className="text-xl text-slate-400 mb-8">
                            {data.description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                                <Link href="/static-billboards">
                                    {data.name} Panolarını İncele <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all">
                                <Link href="/how-it-works">
                                    Nasıl Çalışır?
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features & Advantages */}
            <section className="py-16 bg-white text-slate-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        {/* Features */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Özellikler</h2>
                            <ul className="space-y-4">
                                {data.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Advantages */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Avantajlar</h2>
                            <ul className="space-y-4">
                                {data.advantages.map((advantage, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span>{advantage}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sizes & Pricing */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Boyutlar ve Fiyatlandırma</h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Sizes */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                                <h3 className="text-xl font-bold mb-4">Mevcut Boyutlar</h3>
                                <div className="flex flex-wrap gap-3">
                                    {data.sizes.map((size, i) => (
                                        <span key={i} className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                                            {size}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                                <h3 className="text-xl font-bold mb-4">Fiyat Aralığı</h3>
                                <p className="text-2xl font-bold text-blue-400">{data.priceRange}</p>
                                <p className="text-sm text-slate-400 mt-2">Lokasyon ve süreye göre değişiklik gösterebilir</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        {data.name} ile Reklam Vermeye Başlayın
                    </h2>
                    <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                        Türkiye genelinde {data.name.toLowerCase()} panolarını inceleyin ve kampanyanızı başlatın.
                    </p>
                    <Button asChild size="lg" className="bg-white text-black hover:bg-slate-200">
                        <Link href="/static-billboards">
                            Panoları Keşfet <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Product Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        "name": data.title,
                        "description": data.description,
                        "brand": {
                            "@type": "Brand",
                            "name": "Panobu"
                        },
                        "offers": {
                            "@type": "AggregateOffer",
                            "priceCurrency": "TRY",
                            "availability": "https://schema.org/InStock"
                        }
                    })
                }}
            />
        </PublicLayout>
    );
}
