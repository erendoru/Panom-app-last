import { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight, TrendingUp, Clock, Shield, Eye, BarChart3, Zap, Building2, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/PublicLayout";
import { TURKEY_CITIES, TURKEY_DISTRICTS } from "@/lib/turkey-data";
import { cityToSlug, cityFromSlug } from "@/lib/city-slug";
import { notFound } from "next/navigation";

const CITY_POPULATIONS: Record<string, string> = {
    "İstanbul": "16 milyon", "Ankara": "5.7 milyon", "İzmir": "4.4 milyon",
    "Bursa": "3.1 milyon", "Antalya": "2.6 milyon", "Konya": "2.3 milyon",
    "Adana": "2.3 milyon", "Gaziantep": "2.1 milyon", "Şanlıurfa": "2.1 milyon",
    "Kocaeli": "2 milyon", "Mersin": "1.9 milyon", "Diyarbakır": "1.8 milyon",
    "Hatay": "1.6 milyon", "Manisa": "1.4 milyon", "Kayseri": "1.4 milyon",
    "Samsun": "1.4 milyon", "Balıkesir": "1.2 milyon", "Tekirdağ": "1.1 milyon",
    "Van": "1.1 milyon", "Aydın": "1.1 milyon", "Denizli": "1 milyon",
    "Sakarya": "1 milyon", "Kahramanmaraş": "1.2 milyon", "Muğla": "1 milyon",
    "Eskişehir": "900 bin", "Mardin": "850 bin", "Trabzon": "820 bin",
    "Malatya": "810 bin", "Erzurum": "760 bin", "Sivas": "640 bin",
    "Ordu": "770 bin", "Batman": "630 bin", "Tokat": "600 bin",
    "Çorum": "530 bin", "Elazığ": "590 bin", "Aksaray": "420 bin",
    "Düzce": "400 bin", "Afyonkarahisar": "740 bin", "Zonguldak": "600 bin",
};

const CITY_REGIONS: Record<string, string> = {
    "İstanbul": "Marmara", "Ankara": "İç Anadolu", "İzmir": "Ege",
    "Bursa": "Marmara", "Antalya": "Akdeniz", "Konya": "İç Anadolu",
    "Adana": "Akdeniz", "Gaziantep": "Güneydoğu Anadolu", "Şanlıurfa": "Güneydoğu Anadolu",
    "Kocaeli": "Marmara", "Mersin": "Akdeniz", "Diyarbakır": "Güneydoğu Anadolu",
    "Hatay": "Akdeniz", "Manisa": "Ege", "Kayseri": "İç Anadolu",
    "Samsun": "Karadeniz", "Balıkesir": "Marmara", "Tekirdağ": "Marmara",
    "Van": "Doğu Anadolu", "Aydın": "Ege", "Denizli": "Ege",
    "Sakarya": "Marmara", "Kahramanmaraş": "Akdeniz", "Muğla": "Ege",
    "Eskişehir": "İç Anadolu", "Mardin": "Güneydoğu Anadolu", "Trabzon": "Karadeniz",
    "Malatya": "Doğu Anadolu", "Erzurum": "Doğu Anadolu", "Sivas": "İç Anadolu",
    "Ağrı": "Doğu Anadolu", "Bolu": "Karadeniz", "Edirne": "Marmara",
    "Kars": "Doğu Anadolu", "Rize": "Karadeniz", "Giresun": "Karadeniz",
    "Artvin": "Karadeniz", "Çanakkale": "Marmara", "Bingöl": "Doğu Anadolu",
    "Bitlis": "Doğu Anadolu", "Muş": "Doğu Anadolu", "Siirt": "Güneydoğu Anadolu",
    "Şırnak": "Güneydoğu Anadolu", "Hakkâri": "Doğu Anadolu", "Tunceli": "Doğu Anadolu",
    "Bayburt": "Karadeniz", "Gümüşhane": "Karadeniz", "Ardahan": "Doğu Anadolu",
    "Iğdır": "Doğu Anadolu", "Kilis": "Güneydoğu Anadolu",
};

function getNearbyCities(cityName: string): string[] {
    const regionCities: Record<string, string[]> = {
        "Marmara": ["İstanbul", "Bursa", "Kocaeli", "Balıkesir", "Tekirdağ", "Sakarya", "Edirne", "Çanakkale", "Yalova", "Bilecik"],
        "Ege": ["İzmir", "Aydın", "Denizli", "Manisa", "Muğla", "Uşak", "Kütahya", "Afyonkarahisar"],
        "Akdeniz": ["Antalya", "Adana", "Mersin", "Hatay", "Kahramanmaraş", "Osmaniye", "Isparta", "Burdur"],
        "İç Anadolu": ["Ankara", "Konya", "Kayseri", "Eskişehir", "Sivas", "Aksaray", "Nevşehir", "Kırşehir", "Kırıkkale", "Çankırı", "Karaman", "Niğde", "Yozgat", "Çorum"],
        "Karadeniz": ["Trabzon", "Samsun", "Ordu", "Rize", "Giresun", "Artvin", "Bolu", "Zonguldak", "Bartın", "Sinop", "Tokat", "Amasya", "Bayburt", "Gümüşhane", "Düzce", "Kastamonu", "Karabük"],
        "Doğu Anadolu": ["Erzurum", "Malatya", "Van", "Elazığ", "Ağrı", "Kars", "Erzincan", "Bingöl", "Muş", "Bitlis", "Tunceli", "Hakkâri", "Ardahan", "Iğdır"],
        "Güneydoğu Anadolu": ["Gaziantep", "Şanlıurfa", "Diyarbakır", "Mardin", "Batman", "Siirt", "Şırnak", "Kilis", "Adıyaman"],
    };

    const region = CITY_REGIONS[cityName] || "";
    const cities = regionCities[region] || [];
    return cities.filter(c => c !== cityName).slice(0, 6);
}

export async function generateStaticParams() {
    return TURKEY_CITIES.map(city => ({
        sehir: cityToSlug(city),
    }));
}

export async function generateMetadata({ params }: { params: { sehir: string } }): Promise<Metadata> {
    const cityName = cityFromSlug(params.sehir);

    if (!cityName) {
        return { title: "Sayfa Bulunamadı" };
    }

    const population = CITY_POPULATIONS[cityName] || "";
    const popText = population ? ` ${population} nüfuslu` : "";

    return {
        title: `${cityName} Billboard Kiralama | ${cityName} Açık Hava Reklam Fiyatları 2026`,
        description: `${cityName}'de billboard ve açık hava reklam alanı kiralama.${popText} ${cityName} ilinde CLP, raket pano, megalight ve dijital ekran kiralama. Aracısız, şeffaf fiyatlar. Panobu ile ${cityName}'de reklam verin.`,
        keywords: [
            `${cityName.toLowerCase()} billboard kiralama`,
            `${cityName.toLowerCase()} billboard fiyatları`,
            `${cityName.toLowerCase()} açık hava reklam`,
            `${cityName.toLowerCase()} reklam panosu kiralama`,
            `${cityName.toLowerCase()} outdoor reklam`,
            `${cityName.toLowerCase()} dijital billboard`,
            `${cityName.toLowerCase()} clp pano kiralama`,
            `${cityName.toLowerCase()} raket pano fiyat`,
            `${cityName.toLowerCase()} reklam alanı`,
            `${cityName.toLowerCase()} reklam fiyatları 2026`,
            `billboard kiralama ${cityName.toLowerCase()}`,
            `açık hava reklam ${cityName.toLowerCase()}`,
        ],
        openGraph: {
            title: `${cityName} Billboard Kiralama | Açık Hava Reklam Fiyatları - Panobu`,
            description: `${cityName}'de billboard, CLP pano, raket pano ve dijital ekran kiralama. Online fiyat karşılaştırma, aracısız rezervasyon.`,
            type: "website",
            locale: "tr_TR",
            url: `https://panobu.com/billboard-kiralama/${cityToSlug(cityName)}`,
            siteName: "Panobu",
        },
        twitter: {
            card: "summary_large_image",
            title: `${cityName} Billboard Kiralama | Panobu`,
            description: `${cityName}'de açık hava reklam alanları. Şeffaf fiyatlar, online kiralama.`,
        },
        alternates: {
            canonical: `https://panobu.com/billboard-kiralama/${cityToSlug(cityName)}`,
        },
    };
}

export default function CityBillboardPage({ params }: { params: { sehir: string } }) {
    const cityName = cityFromSlug(params.sehir);

    if (!cityName) {
        notFound();
    }

    const districts = TURKEY_DISTRICTS[cityName] || [];
    const population = CITY_POPULATIONS[cityName];
    const region = CITY_REGIONS[cityName];
    const nearbyCities = getNearbyCities(cityName);

    const panelTypes = [
        { name: "Billboard", desc: "Büyük format açık hava panoları. Yoğun trafikli caddelerde maksimum görünürlük.", icon: Eye },
        { name: "CLP Pano", desc: "City Light Poster — durak ve kaldırım panoları. Yaya trafiği yüksek bölgelerde etkili.", icon: Users },
        { name: "Raket Pano", desc: "Yol kenarı çift taraflı panolar. Araç trafiğine yönelik sürekli görünürlük.", icon: Target },
        { name: "Megalight", desc: "Işıklı büyük format panolar. Gece-gündüz dikkat çekici görünüm.", icon: Zap },
        { name: "Dijital Ekran", desc: "LED dijital billboard'lar. Dinamik içerik, anlık güncelleme imkanı.", icon: BarChart3 },
    ];

    const advantages = [
        {
            icon: TrendingUp,
            title: "Şeffaf Fiyatlandırma",
            desc: `${cityName}'deki tüm pano fiyatları platformda açıkça görünür. Ajans komisyonu veya gizli ücret yok. Bütçenizi tam kontrol altında tutun.`
        },
        {
            icon: Clock,
            title: "5 Dakikada Başlangıç",
            desc: `${cityName}'de reklam vermek için uzun süreçlere gerek yok. Online platform üzerinden 5 dakikada pano seçin, hemen kiralayın.`
        },
        {
            icon: Shield,
            title: "Güvenilir & Profesyonel",
            desc: `Tüm panolar doğrulanmış pano sahiplerinden temin edilir. Kampanya süresince profesyonel destek ve takip hizmeti.`
        },
        {
            icon: Building2,
            title: "Geniş Pano Ağı",
            desc: `${cityName} ve çevresinde billboard, CLP, raket, megalight ve dijital ekran dahil farklı formatlarda reklam alanları.`
        },
    ];

    const faqs = [
        {
            q: `${cityName}'de billboard kiralama fiyatları ne kadar?`,
            a: `${cityName}'de billboard fiyatları lokasyon, pano boyutu, görünürlük ve kiralama süresine göre değişir. Haftalık fiyatlar ortalama 1.500₺ ile 15.000₺ arasında değişebilir. Panobu platformunda ${cityName}'deki tüm mevcut panoların güncel fiyatlarını şeffaf bir şekilde görebilirsiniz.`
        },
        {
            q: `${cityName}'de hangi tür reklam panoları mevcut?`,
            a: `${cityName}'de billboard (büyük format), CLP (City Light Poster), raket pano, megalight (ışıklı büyük format) ve dijital LED ekran olmak üzere 5 farklı pano türü mevcuttur. Her türün kendine özgü avantajları ve fiyat aralıkları bulunmaktadır.`
        },
        {
            q: `${cityName}'de billboard minimum kaç gün kiralanır?`,
            a: `Panobu platformunda minimum kiralama süresi genellikle 7 gündür (1 hafta). Ancak bazı pano sahipleri günlük kiralama seçeneği de sunmaktadır. Uzun süreli kiralamalar (aylık, 3 aylık, yıllık) için önemli indirimler sağlanır.`
        },
        {
            q: `${cityName}'de açık hava reklam kampanyasını nasıl başlatabilirim?`,
            a: `Panobu ile ${cityName}'de reklam vermek çok kolay: 1) Platformda ${cityName}'deki panoları harita üzerinden görüntüleyin, 2) Bütçe ve lokasyonunuza uygun panoyu seçin, 3) Tarih aralığını belirleyip online kiralama yapın. Tüm süreç 5 dakika kadar kısa sürebilir.`
        },
        {
            q: `${cityName}'deki en etkili reklam lokasyonları nereler?`,
            a: `${cityName}'de en etkili reklam lokasyonları genellikle ana cadde ve bulvarlar, alışveriş merkezi çevreleri, toplu taşıma durakları yakınları ve şehir merkezi kavşaklarıdır.${districts.length > 0 ? ` ${cityName}'de ${districts.slice(0, 3).join(', ')} gibi ilçeler yoğun trafiğiyle öne çıkmaktadır.` : ''}`
        },
        {
            q: `Billboard tasarımımı kim hazırlayacak?`,
            a: `Panobu, pano kiralama hizmeti sunar. Reklam kreatifinizi kendi tasarım ekibinizle hazırlayabilir veya anlaşmalı ajanslardan destek alabilirsiniz. Baskı ve uygulama sürecinde pano sahibi ile koordinasyonu Panobu üzerinden yönetebilirsiniz.`
        },
    ];

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://panobu.com" },
            { "@type": "ListItem", "position": 2, "name": "Billboard Kiralama", "item": "https://panobu.com/billboard-kiralama" },
            { "@type": "ListItem", "position": 3, "name": `${cityName} Billboard Kiralama`, "item": `https://panobu.com/billboard-kiralama/${cityToSlug(cityName)}` },
        ]
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a,
            }
        }))
    };

    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": `${cityName} Billboard Kiralama`,
        "description": `${cityName}'de billboard ve açık hava reklam alanı kiralama hizmeti`,
        "provider": {
            "@type": "Organization",
            "name": "Panobu",
            "url": "https://panobu.com"
        },
        "areaServed": {
            "@type": "City",
            "name": cityName,
            "containedInPlace": {
                "@type": "Country",
                "name": "Türkiye"
            }
        },
        "serviceType": "Billboard Kiralama",
        "url": `https://panobu.com/billboard-kiralama/${cityToSlug(cityName)}`,
    };

    return (
        <PublicLayout>
            {/* Breadcrumb Navigation */}
            <nav className="container mx-auto px-4 pt-6 pb-2" aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 text-sm text-neutral-500">
                    <li><Link href="/" className="hover:text-blue-700 transition-colors">Ana Sayfa</Link></li>
                    <li>/</li>
                    <li><Link href="/static-billboards" className="hover:text-blue-700 transition-colors">Billboard Kiralama</Link></li>
                    <li>/</li>
                    <li className="text-blue-700 font-medium">{cityName}</li>
                </ol>
            </nav>

            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-transparent">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm mb-6">
                            <MapPin className="w-4 h-4" />
                            {cityName}{region ? ` — ${region} Bölgesi` : ""}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-neutral-900">
                            {cityName} <span className="text-blue-800">Billboard Kiralama</span>
                        </h1>
                        <p className="text-lg md:text-xl text-neutral-600 mb-4 max-w-3xl mx-auto">
                            {cityName}&apos;de açık hava reklam alanları kiralayın. Billboard, CLP, raket pano ve dijital ekran seçenekleri ile markanızı {population ? `${population} kişiye` : "tüm şehre"} duyurun.
                        </p>
                        <p className="text-sm text-neutral-500 mb-8">
                            Aracısız, şeffaf fiyatlar • Online karşılaştırma • Hızlı kiralama
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="bg-neutral-900 hover:bg-neutral-800 text-white text-lg h-14 px-8">
                                <Link href="/static-billboards">
                                    {cityName} Panolarını İncele <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="border-2 border-neutral-300 text-neutral-900 hover:bg-neutral-50 h-14 px-8">
                                <Link href="/how-it-works">
                                    Nasıl Çalışır?
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            {population && (
                <section className="py-8 border-y border-neutral-200">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-blue-800">{population}</div>
                                <div className="text-xs text-neutral-500 mt-1">Nüfus</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-emerald-700">5+</div>
                                <div className="text-xs text-neutral-500 mt-1">Pano Türü</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-neutral-800">%0</div>
                                <div className="text-xs text-neutral-500 mt-1">Komisyon</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-amber-800">7/24</div>
                                <div className="text-xs text-neutral-500 mt-1">Görünürlük</div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Introduction Text — unique SEO content per page */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-neutral-900">
                            {cityName}&apos;de Açık Hava Reklamcılığı
                        </h2>
                        <div className="text-neutral-600 leading-relaxed space-y-4">
                            <p>
                                {cityName}{population ? `, ${population} nüfusuyla` : ""}{region ? ` ${region} Bölgesi&apos;nin önemli şehirlerinden biridir` : " Türkiye&apos;nin önemli şehirlerinden biridir"}. 
                                Açık hava reklamcılığı, {cityName}&apos;de markaların geniş kitlelere ulaşmasının en etkili yollarından biridir. 
                                Billboard, CLP pano, raket pano, megalight ve dijital ekran gibi farklı formatlardaki reklam alanları, 
                                şehrin yoğun trafik noktalarında 7/24 görünürlük sağlar.
                            </p>
                            <p>
                                <strong className="text-neutral-900">Panobu</strong>, {cityName}&apos;de açık hava reklam alanı kiralama sürecini tamamen dijitalleştiren 
                                Türkiye&apos;nin ilk aracısız OOH (Out-of-Home) platformudur. Ajans komisyonu ödemeden, tüm pano fiyatlarını 
                                şeffaf şekilde karşılaştırabilir, online rezervasyon yapabilir ve kampanyanızı dakikalar içinde başlatabilirsiniz.
                            </p>
                            {districts.length > 0 && (
                                <p>
                                    {cityName}&apos;de {districts.slice(0, 5).join(", ")} gibi ilçelerde billboard ve açık hava reklam alanları mevcuttur. 
                                    Her ilçenin trafik yoğunluğu ve demografik yapısına göre en uygun pano türünü seçerek reklam kampanyanızın verimliliğini artırabilirsiniz.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Panel Types */}
            <section className="py-16 bg-neutral-50 border-y border-neutral-200">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-neutral-900 mb-4">
                        {cityName}&apos;de Kiralayabileceğiniz Pano Türleri
                    </h2>
                    <p className="text-neutral-600 text-center mb-12 max-w-2xl mx-auto">
                        Her bütçe ve hedefe uygun açık hava reklam formatları
                    </p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {panelTypes.map((type, i) => {
                            const Icon = type.icon;
                            return (
                                <div key={i} className="bg-white border border-neutral-200 rounded-xl p-6 hover:border-neutral-300 transition-all group shadow-sm">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                                        <Icon className="w-6 h-6 text-blue-800" />
                                    </div>
                                    <h3 className="font-bold text-lg text-neutral-900 mb-2">{type.name}</h3>
                                    <p className="text-sm text-neutral-600 leading-relaxed">{type.desc}</p>
                                </div>
                            );
                        })}
                        <Link
                            href="/pano-turleri/billboard"
                            className="bg-blue-50 border border-blue-200 rounded-xl p-6 hover:bg-blue-100 transition-all flex flex-col items-center justify-center text-center"
                        >
                            <ArrowRight className="w-8 h-8 text-blue-800 mb-3" />
                            <span className="font-semibold text-blue-800">Tüm Pano Türlerini İncele</span>
                            <span className="text-xs text-neutral-500 mt-1">Detaylı karşılaştırma</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Districts */}
            {districts.length > 0 && (
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-4 text-neutral-900">
                            {cityName} İlçelerinde Billboard Kiralama
                        </h2>
                        <p className="text-neutral-600 text-center mb-12 max-w-2xl mx-auto">
                            {cityName}&apos;in {districts.length} ilçesinde açık hava reklam alanları ile hedef kitlenize doğrudan ulaşın
                        </p>
                        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                            {districts.map((district, i) => (
                                <span
                                    key={i}
                                    className="px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-full text-sm text-neutral-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-800 transition-all cursor-default"
                                >
                                    {district}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Why Panobu */}
            <section className="py-16 bg-neutral-100 border-y border-neutral-200">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-4 text-neutral-900">
                        Neden Panobu ile {cityName}&apos;de Reklam Vermelisiniz?
                    </h2>
                    <p className="text-neutral-600 text-center mb-12 max-w-2xl mx-auto">
                        Türkiye&apos;nin ilk aracısız açık hava reklam platformunun avantajları
                    </p>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {advantages.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div key={i} className="flex gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                        <Icon className="w-6 h-6 text-blue-800" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2 text-neutral-900">{item.title}</h3>
                                        <p className="text-neutral-600 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="text-center mt-10">
                        <Link href="/platform/why-panobu" className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors">
                            Panobu hakkında daha fazla bilgi <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-4 text-neutral-900">
                        {cityName} Billboard Kiralama Hakkında Sık Sorulan Sorular
                    </h2>
                    <p className="text-neutral-600 text-center mb-12 max-w-2xl mx-auto">
                        {cityName}&apos;de açık hava reklamcılığı hakkında merak edilenler
                    </p>
                    <div className="max-w-3xl mx-auto space-y-4">
                        {faqs.map((faq, i) => (
                            <details key={i} className="group bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
                                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-neutral-50 transition-colors">
                                    <h3 className="font-semibold text-neutral-900 pr-4">{faq.q}</h3>
                                    <span className="text-blue-700 shrink-0 text-xl group-open:rotate-45 transition-transform">+</span>
                                </summary>
                                <div className="px-6 pb-6">
                                    <p className="text-neutral-600 leading-relaxed">{faq.a}</p>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Nearby Cities — Internal Linking */}
            {nearbyCities.length > 0 && (
                <section className="py-16 bg-neutral-50 border-y border-neutral-200">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-4 text-neutral-900">
                            Yakın Şehirlerde Billboard Kiralama
                        </h2>
                        <p className="text-neutral-600 text-center mb-12 max-w-2xl mx-auto">
                            {region} Bölgesi&apos;ndeki diğer şehirlerde de açık hava reklam alanlarını keşfedin
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                            {nearbyCities.map((city, i) => (
                                <Link
                                    key={i}
                                    href={`/billboard-kiralama/${cityToSlug(city)}`}
                                    className="flex items-center gap-3 p-4 bg-white border border-neutral-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all group shadow-sm"
                                >
                                    <MapPin className="w-4 h-4 text-neutral-500 group-hover:text-blue-700 transition-colors" />
                                    <div>
                                        <span className="font-medium text-neutral-900 group-hover:text-blue-800 transition-colors">{city}</span>
                                        {CITY_POPULATIONS[city] && (
                                            <span className="block text-xs text-neutral-500">{CITY_POPULATIONS[city]} nüfus</span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-20 bg-neutral-100 border-t border-neutral-200">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-neutral-900">
                        {cityName}&apos;de Reklam Vermeye Başlayın
                    </h2>
                    <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
                        Panobu ile {cityName}&apos;deki tüm panoları ücretsiz karşılaştırın ve dakikalar içinde kiralayın.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-neutral-900 text-white hover:bg-neutral-800 h-14 px-8 text-lg">
                            <Link href="/static-billboards">
                                Panoları Keşfet <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="border-2 border-neutral-300 text-neutral-900 hover:bg-white h-14 px-8">
                            <Link href="https://calendly.com/erendoru/30dk" target="_blank">
                                Ücretsiz Demo Al
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
            />
        </PublicLayout>
    );
}
