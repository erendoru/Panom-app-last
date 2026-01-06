import { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight, Phone, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/PublicLayout";
import { TURKEY_CITIES, TURKEY_DISTRICTS } from "@/lib/turkey-data";
import { notFound } from "next/navigation";

// Convert city names to URL-friendly slugs
function toSlug(cityName: string): string {
    const turkishMap: Record<string, string> = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
        'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
    };
    return cityName
        .toLowerCase()
        .split('')
        .map(char => turkishMap[char] || char)
        .join('')
        .replace(/\s+/g, '-');
}

// Find city name from slug
function fromSlug(slug: string): string | undefined {
    return TURKEY_CITIES.find(city => toSlug(city) === slug);
}

// Generate static params for all 81 cities
export async function generateStaticParams() {
    return TURKEY_CITIES.map(city => ({
        sehir: toSlug(city),
    }));
}

// Dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { sehir: string } }): Promise<Metadata> {
    const cityName = fromSlug(params.sehir);

    if (!cityName) {
        return {
            title: "Sayfa Bulunamadı",
        };
    }

    return {
        title: `${cityName} Billboard Kiralama | Açık Hava Reklam Fiyatları - Panobu`,
        description: `${cityName}'de billboard ve açık hava reklam alanı kiralama. CLP, raket pano, megalight ve dijital ekran seçenekleri. Şeffaf fiyatlar, hızlı rezervasyon. Panobu ile ${cityName}'de reklam verin.`,
        keywords: [
            `${cityName.toLowerCase()} billboard`,
            `${cityName.toLowerCase()} reklam panosu`,
            `${cityName.toLowerCase()} açık hava reklam`,
            `${cityName.toLowerCase()} billboard fiyatları`,
            `${cityName.toLowerCase()} outdoor reklam`,
        ],
        openGraph: {
            title: `${cityName} Billboard Kiralama | Panobu`,
            description: `${cityName}'de billboard ve açık hava reklam alanı kiralama. Şeffaf fiyatlar, online rezervasyon.`,
            type: "website",
            locale: "tr_TR",
        },
        alternates: {
            canonical: `https://panobu.com/billboard-kiralama/${params.sehir}`,
        },
    };
}

export default function CityBillboardPage({ params }: { params: { sehir: string } }) {
    const cityName = fromSlug(params.sehir);

    if (!cityName) {
        notFound();
    }

    const districts = TURKEY_DISTRICTS[cityName] || [];

    // Check if this city has active panels (Kocaeli for now)
    const hasActivePanels = cityName === "Kocaeli";

    const panelTypes = [
        { name: "Billboard", desc: "Büyük format açık hava panoları" },
        { name: "CLP Pano", desc: "City Light Poster - durak ve kaldırım panoları" },
        { name: "Raket Pano", desc: "Yol kenarı raket tipi panolar" },
        { name: "Megalight", desc: "Işıklı büyük format panolar" },
        { name: "Dijital Ekran", desc: "LED ve dijital billboard'lar" },
    ];

    return (
        <PublicLayout>
            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-b from-blue-900/20 to-transparent">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm mb-6">
                            <MapPin className="w-4 h-4" />
                            {cityName}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            {cityName} <span className="text-blue-400">Billboard Kiralama</span>
                        </h1>
                        <p className="text-xl text-slate-400 mb-8">
                            {cityName}'de açık hava reklam alanları kiralayın. Billboard, CLP, raket pano ve dijital ekran seçenekleri ile markanızı şehre duyurun.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                                <Link href="/static-billboards">
                                    Panoları İncele <ArrowRight className="w-4 h-4 ml-2" />
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

            {/* Panel Types */}
            <section className="py-16 bg-white text-slate-900">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        {cityName}'de Mevcut Pano Türleri
                    </h2>
                    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
                        {panelTypes.map((type, i) => (
                            <div key={i} className="bg-slate-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                                <h3 className="font-bold text-lg mb-2">{type.name}</h3>
                                <p className="text-sm text-slate-600">{type.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Districts */}
            {districts.length > 0 && (
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-4">
                            {cityName} İlçelerinde Billboard Kiralama
                        </h2>
                        <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
                            {cityName}'in tüm ilçelerinde açık hava reklam alanları mevcuttur.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                            {districts.map((district, i) => (
                                <span
                                    key={i}
                                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm hover:bg-white/10 transition-colors"
                                >
                                    {district}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Why Panobu */}
            <section className="py-16 bg-slate-900/50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Neden Panobu ile {cityName}'de Reklam Vermelisiniz?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {[
                            { title: "Şeffaf Fiyatlar", desc: "Tüm panoların fiyatları platformda görünür. Gizli ücret yok." },
                            { title: "Hızlı Süreç", desc: "Online rezervasyon ve hızlı onay süreci." },
                            { title: "Güvenilir Hizmet", desc: "Profesyonel destek ve kampanya takibi." },
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                <p className="text-slate-400 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        {cityName}'de Reklam Vermeye Başlayın
                    </h2>
                    <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                        Hemen ücretsiz hesap oluşturun ve {cityName}'deki panoları inceleyin.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-white text-black hover:bg-slate-200">
                            <Link href="/static-billboards">
                                Panoları Keşfet <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all">
                            <Link href="tel:+905551234567">
                                <Phone className="w-4 h-4 mr-2" /> Bizi Arayın
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* FAQ Schema for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": `${cityName}'de billboard kiralama fiyatları ne kadar?`,
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": `${cityName}'de billboard fiyatları lokasyon, boyut ve süreye göre değişiklik gösterir. Güncel fiyatları görmek için Panobu platformunu ziyaret edebilirsiniz.`
                                }
                            },
                            {
                                "@type": "Question",
                                "name": `${cityName}'de hangi tür panolar mevcut?`,
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": `${cityName}'de billboard, CLP pano, raket pano, megalight ve dijital ekran gibi farklı pano türleri mevcuttur.`
                                }
                            }
                        ]
                    })
                }}
            />
        </PublicLayout>
    );
}
