import type { Metadata } from "next";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import {
    Activity,
    ArrowRight,
    BarChart3,
    Calendar,
    Compass,
    CreditCard,
    Eye,
    FileText,
    LayoutDashboard,
    Lock,
    MapPin,
    ShieldCheck,
    Sparkles,
    Target,
    Timer,
    TrendingUp,
    Zap,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Markalar İçin Panobu — Veriyle Seçin, Kazanın | Panobu",
    description:
        "Panobu İçgörü Motoru her panoyu 1-100 trafik skoru, 500m çevre analizi, CPM kıyası, doluluk takvimi ve rakip haritasıyla sunar. Türkiye'de outdoor reklam ilk kez dijital kadar veri zengin.",
    alternates: { canonical: "https://panobu.com/markalar-icin" },
    openGraph: {
        title: "Markalar İçin Panobu — Veriyle Seçin, Kazanın",
        description:
            "Panobu İçgörü Motoru: trafik skoru, 500m çevre analizi, CPM kıyası, doluluk takvimi, rakip haritası. Dijital reklam kadar zengin veri destekli OOH.",
        type: "article",
        url: "https://panobu.com/markalar-icin",
    },
};

const FEATURES = [
    {
        icon: Activity,
        title: "Panobu İçgörü Motoru",
        desc: "Her pano için 1-100 trafik skoru, tahmini günlük/haftalık gösterim, çevre analizi ve CPM değeri. Dijital reklamla aynı metrikte konuşan ilk OOH platformu.",
        accent: "from-emerald-500 to-teal-500",
    },
    {
        icon: Compass,
        title: "Çevre Analizi · 500m komşular",
        desc: "Panonun yakınındaki markalar, AVM'ler, okullar, hastaneler ve ofis bölgeleri tek kartta. Hedef kitlenize göre panoyu değil, komşuluğu seçin.",
        accent: "from-rose-500 to-pink-500",
    },
    {
        icon: Timer,
        title: "30 dakikada rezervasyon",
        desc: "Haritadan seç, sepete at, öde. Geleneksel ajans + operatör yazışması 2 hafta sürerdi. Panobu'da öğle arasında bitirin.",
        accent: "from-amber-500 to-orange-500",
    },
    {
        icon: Lock,
        title: "Açık fiyat, gizli komisyon yok",
        desc: "Listede yazan fiyat uygulanan fiyattır. Ajans komisyonu, 'sezon farkı', 'premium paket' yok. Her markanın aynı panoyu aynı ₺'ye aldığı ilk Türkiye pazar yeri.",
        accent: "from-indigo-500 to-blue-500",
    },
    {
        icon: Calendar,
        title: "Takvim şeffaflığı",
        desc: "Panonun önümüzdeki haftalarda dolu mu boş mu olduğunu görebilirsiniz. Rezerve ettiğiniz tarih aralığı otomatik güncellenir, çakışma riski yok.",
        accent: "from-sky-500 to-cyan-500",
    },
    {
        icon: FileText,
        title: "Kampanya raporları",
        desc: "Rezervasyon özetleri, fatura, baskı kanıtı (proof of posting), haftalık performans raporu — hepsi dashboard'unuzda. Excel'le uğraşmayın.",
        accent: "from-violet-500 to-purple-500",
    },
];

const COMPARISON = [
    {
        topic: "Rezervasyon süresi",
        traditional: "Ajansa brief + 3-5 iş günü dönüş + kontrat",
        panobu: "Ortalama 30 dakika — öğle arasında yeter",
    },
    {
        topic: "Fiyat şeffaflığı",
        traditional: "Her görüşmede farklı fiyat, ajans komisyonu gizli",
        panobu: "Her panoda açık liste fiyatı + periyodik fiyat seçenekleri",
    },
    {
        topic: "Veri",
        traditional: "'Çok iyi lokasyon' sözü, kaynağı yok",
        panobu: "Skor, tahmini gösterim, çevre markaları, CPM",
    },
    {
        topic: "Dijitalle kıyas",
        traditional: "Yapılamaz, farklı birimler",
        panobu: "CPM bazlı Google/Meta/TV kıyaslaması",
    },
    {
        topic: "Takvim",
        traditional: "E-postayla sorulur, günler sürer",
        panobu: "Canlı müsaitlik + anında alternatif öneri",
    },
    {
        topic: "Rapor",
        traditional: "PDF, elle hazırlanır, günler sonra gelir",
        panobu: "Dashboard'da canlı; baskı kanıtı + fatura",
    },
];

const AUDIENCE = [
    {
        icon: Zap,
        title: "D2C & e-ticaret",
        copy: "Trendyol, Hepsiburada butik markaları ve Shopify satıcıları için ilk outdoor deneyimi. Self-serve platform, hızlı test-and-learn.",
    },
    {
        icon: LayoutDashboard,
        title: "KOBİ & yerel işletmeler",
        copy: "Restoran zinciri, klinik, eğitim kurumu, emlak ofisi — 50-250 bin ₺ bütçeyle bölgesel çıkış yapın. Ajans filtresine takılmayın.",
    },
    {
        icon: TrendingUp,
        title: "Performance marketing takımları",
        copy: "CPM, erişim, frekans dilinden konuşan büyüme ekipleri. Panobu'nun veri katmanı sayesinde outdoor artık 'ölçülemez' değil.",
    },
    {
        icon: ShieldCheck,
        title: "Siyasi kampanyalar & STK'lar",
        copy: "Kısa sürede yerel yoğunluk ister misiniz? Panolar haritada, takvim canlı — sepete atıp aynı gün rezervasyon.",
    },
];

export default function MarkalarIcinPage() {
    return (
        <PublicLayout activeLink="markalar">
            {/* HERO */}
            <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
                <div className="absolute -top-20 -right-32 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
                <div className="absolute -bottom-24 -left-32 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl" />

                <div className="container relative mx-auto px-4 py-20 sm:py-28">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-[#0d9669] backdrop-blur-sm">
                            <Activity className="h-3.5 w-3.5" />
                            Panobu İçgörü Motoru · Markalar için
                        </div>
                        <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                            Panolarınızı hisle değil, <br />
                            <span className="text-[#11b981]">veriyle seçin.</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
                            Her pano için 1-100 trafik skoru, 500m çevre analizi, tahmini gösterim,
                            CPM kıyası, doluluk takvimi ve rakip haritası — tek ekranda.
                            Türkiye'de outdoor reklam ilk kez dijital reklam kadar zengin veri destekli.
                        </p>

                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Link
                                href="/static-billboards"
                                className="inline-flex items-center gap-2 rounded-full bg-[#11b981] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#0d9669]"
                            >
                                Veriyle panoyu keşfet <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/veri-ile-reklam"
                                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                            >
                                İçgörü motoru nedir?
                            </Link>
                        </div>

                        <div className="mt-12 grid grid-cols-2 gap-3 text-left sm:grid-cols-4">
                            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 backdrop-blur-sm">
                                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                                    <BarChart3 className="h-3 w-3" /> Skor
                                </div>
                                <div className="mt-1 text-2xl font-bold tabular-nums text-slate-900 sm:text-3xl">
                                    1-100
                                </div>
                                <div className="text-[11px] text-slate-500">Her pano puanlı</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 backdrop-blur-sm">
                                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                                    <Compass className="h-3 w-3" /> Çevre
                                </div>
                                <div className="mt-1 text-2xl font-bold tabular-nums text-slate-900 sm:text-3xl">
                                    500m
                                </div>
                                <div className="text-[11px] text-slate-500">Komşu marka + POI</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 backdrop-blur-sm">
                                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                                    <TrendingUp className="h-3 w-3" /> CPM
                                </div>
                                <div className="mt-1 text-2xl font-bold tabular-nums text-slate-900 sm:text-3xl">
                                    ✓
                                </div>
                                <div className="text-[11px] text-slate-500">Dijitalle kıyas</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 backdrop-blur-sm">
                                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                                    <Target className="h-3 w-3" /> Rakip
                                </div>
                                <div className="mt-1 text-2xl font-bold tabular-nums text-slate-900 sm:text-3xl">
                                    Harita
                                </div>
                                <div className="text-[11px] text-slate-500">Aktif kampanya katmanı</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* YENİ NESİL OOH — Wow Katmanları (hero altı) */}
            <section className="relative overflow-hidden py-24">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />
                <div className="absolute -right-32 top-20 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl" />
                <div className="absolute -left-24 bottom-10 h-64 w-64 rounded-full bg-teal-100/40 blur-3xl" />

                <div className="container relative mx-auto max-w-6xl px-4">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-[#0d9669] shadow-sm">
                            <Sparkles className="h-3.5 w-3.5" /> Yeni nesil OOH · Panobu
                        </div>
                        <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                            Yeni nesil OOH reklamcılığında{" "}
                            <span className="text-[#11b981]">Panobu&apos;nun getirdikleri</span>
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
                            Panobu İçgörü Motoru, pano seçimini fısıltı gazetesinden ölçülebilir
                            pazarlamaya taşıyan altı katmanı tek platformda birleştirir. Her katman
                            tek başına bir ürün büyüklüğünde; hepsi markalar için aynı anda çalışır.
                        </p>
                    </div>

                    <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                icon: BarChart3,
                                tag: "Katman 1",
                                title: "Trafik Skoru · 1-100",
                                desc:
                                    "Panonun yol karakteri, görünürlük açısı, akış yoğunluğu ve çevre dinamikleri içsel bir formülle 1-100 arasında puanlanır. Tek bakışta bu pano ne iş çıkarır — görürsünüz.",
                                accent: "from-emerald-500 to-teal-500",
                                badge: "Panobu'ya özel",
                            },
                            {
                                icon: Compass,
                                tag: "Katman 2",
                                title: "500m Çevre Analizi",
                                desc:
                                    "Panonun 500m yarıçapındaki markalar, AVM'ler, okullar, hastaneler, restoranlar ve ofis bölgeleri tek kartta. Panoyu değil, komşuluğu seçin.",
                                accent: "from-rose-500 to-pink-500",
                                badge: "Anında görünür",
                            },
                            {
                                icon: Eye,
                                tag: "Katman 3",
                                title: "Tahmini Gösterim + CPM",
                                desc:
                                    "Her pano için günlük ve haftalık tahmini görüntülenme + Google/Meta/TV CPM kıyası. Outdoor artık 'ölçülemez mecra' değil — dijital gibi konuşur.",
                                accent: "from-indigo-500 to-blue-500",
                                badge: "Dijital dili",
                            },
                            {
                                icon: Calendar,
                                tag: "Katman 4",
                                title: "Doluluk Takvimi",
                                desc:
                                    "Panonun önümüzdeki haftalarda hangi tarihlerde boş, hangi tarihlerde dolu olduğunu canlı görün. Sepete eklerken çakışma olmaz, en yakın boş tarih otomatik önerilir.",
                                accent: "from-sky-500 to-cyan-500",
                                badge: "Canlı müsaitlik",
                            },
                            {
                                icon: Target,
                                tag: "Katman 5",
                                title: "Rakip Haritası",
                                desc:
                                    "Hangi marka hangi şehirde kaç panoda — aktif kampanya görünümü haritada. Rakibinizin güçlü olduğu bölgeyi değil, zayıf bıraktığı bölgeyi görürsünüz.",
                                accent: "from-violet-500 to-purple-500",
                                badge: "Coğrafi görünüm",
                            },
                            {
                                icon: Zap,
                                tag: "Katman 6",
                                title: "Otomatik Paket Öneri",
                                desc:
                                    "Bütçenizi ve şehirlerinizi yazın, Panobu 30 saniyede skor-çevre-bütçe üçgenine göre üç paket önerir: Verimli / Dengeli / Premium. Medya planörün 3 günlük işi, tek sayfa.",
                                accent: "from-amber-500 to-orange-500",
                                badge: "Akıllı öneri",
                            },
                        ].map((k) => (
                            <div
                                key={k.title}
                                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg"
                            >
                                <div
                                    className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${k.accent} opacity-10 transition-opacity group-hover:opacity-20`}
                                />
                                <div className="relative flex items-center justify-between">
                                    <div
                                        className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${k.accent} text-white shadow-sm`}
                                    >
                                        <k.icon className="h-5 w-5" />
                                    </div>
                                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                                        {k.badge}
                                    </span>
                                </div>
                                <div className="relative mt-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                    {k.tag}
                                </div>
                                <h3 className="relative mt-0.5 text-base font-bold text-slate-900">
                                    {k.title}
                                </h3>
                                <p className="relative mt-2 text-sm leading-relaxed text-slate-600">
                                    {k.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="relative mt-14 overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-8 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#0d9669] shadow-sm">
                            <ShieldCheck className="h-3.5 w-3.5" /> Tek platform
                        </div>
                        <p className="mx-auto mt-4 max-w-3xl text-lg font-semibold text-slate-900 sm:text-xl">
                            Skor, çevre, gösterim, CPM, müsaitlik ve rakip — yeni nesil OOH&apos;da bu
                            altı katman bir arada çalışınca pano seçimi{" "}
                            <span className="text-[#11b981]">ölçülebilir</span> olur. Panobu hepsini
                            tek arayüzde toplar; ayrı araçlar ve tahminlerle uğraşmadan karar verin.
                        </p>
                    </div>
                </div>
            </section>

            {/* DEĞER ÖNERMELERİ — Kartvizit */}
            <section className="py-20">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                            <Sparkles className="h-3.5 w-3.5" /> Neler sunuyoruz?
                        </div>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Panobu'da bir pano{" "}
                            <span className="text-[#11b981]">kartvizit gibi</span> konuşur.
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
                            Her pano detayında karar vermenize yetecek kadar bilgi. Sahada gezmenize,
                            ajansa mail atmanıza, günlerce beklemenize gerek yok.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {FEATURES.map((f) => (
                            <div
                                key={f.title}
                                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md"
                            >
                                <div
                                    className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${f.accent} opacity-10 transition-opacity group-hover:opacity-20`}
                                />
                                <div
                                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.accent} text-white shadow-sm`}
                                >
                                    <f.icon className="h-5 w-5" />
                                </div>
                                <h3 className="mt-4 text-base font-bold text-slate-900">
                                    {f.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                    {f.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AKIŞ */}
            <section className="border-y border-slate-200 bg-slate-50 py-20">
                <div className="container mx-auto max-w-5xl px-4">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                            <Timer className="h-3.5 w-3.5" /> 30 dakikalık akış
                        </div>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Brieften rezervasyona{" "}
                            <span className="text-[#11b981]">tek oturumda</span>
                        </h2>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-4">
                        {[
                            {
                                step: "01",
                                title: "Haritadan seç",
                                desc: "Şehir, ilçe, yol tipi, skor filtreleriyle panoları keşfet.",
                                icon: MapPin,
                            },
                            {
                                step: "02",
                                title: "Verisine bak",
                                desc: "Skor, çevre analizi, tahmini gösterim ve CPM tek kartta.",
                                icon: Eye,
                            },
                            {
                                step: "03",
                                title: "Sepete at",
                                desc: "Birden çok pano, birden çok tarih aralığı — tek sepet.",
                                icon: Calendar,
                            },
                            {
                                step: "04",
                                title: "Öde & rezerve et",
                                desc: "Kredi kartı ya da havale. Kontrat ve fatura otomatik.",
                                icon: CreditCard,
                            },
                        ].map((s) => (
                            <div
                                key={s.step}
                                className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <div className="absolute -top-3 right-4 rounded-full bg-[#11b981] px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
                                    {s.step}
                                </div>
                                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                    <s.icon className="h-5 w-5" />
                                </div>
                                <h3 className="mt-4 text-base font-bold text-slate-900">
                                    {s.title}
                                </h3>
                                <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Video placeholder — yüklendiğinde buraya embed edilecek */}
                    <div className="mt-12 overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                        <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-semibold text-slate-700">
                            Yakında: 75 saniyelik canlı demo
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            Pano seçiminden rezervasyona bütün akış, tek ekran kaydında.
                        </p>
                    </div>
                </div>
            </section>

            {/* KARŞILAŞTIRMA */}
            <section className="py-20">
                <div className="container mx-auto max-w-5xl px-4">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                            <Target className="h-3.5 w-3.5" /> Geleneksel vs Panobu
                        </div>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Aynı panoya{" "}
                            <span className="text-[#11b981]">iki farklı yol</span>
                        </h2>
                    </div>

                    <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">Konu</th>
                                    <th className="px-5 py-3 font-semibold">Ajans / geleneksel</th>
                                    <th className="px-5 py-3 font-semibold">Panobu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {COMPARISON.map((row) => (
                                    <tr
                                        key={row.topic}
                                        className="border-t border-slate-100 last:border-0"
                                    >
                                        <td className="px-5 py-4 font-semibold text-slate-900">
                                            {row.topic}
                                        </td>
                                        <td className="px-5 py-4 text-slate-500">
                                            {row.traditional}
                                        </td>
                                        <td className="px-5 py-4 font-medium text-emerald-700">
                                            {row.panobu}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* KİMLER İÇİN? */}
            <section className="border-t border-slate-200 bg-slate-50 py-20">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                            <Sparkles className="h-3.5 w-3.5" /> Panobu en çok kime yarıyor?
                        </div>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Self-serve outdoor,{" "}
                            <span className="text-[#11b981]">modern markaların</span> dili.
                        </h2>
                    </div>

                    <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                        {AUDIENCE.map((a) => (
                            <div
                                key={a.title}
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                    <a.icon className="h-5 w-5" />
                                </div>
                                <h3 className="mt-4 text-base font-bold text-slate-900">
                                    {a.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                    {a.copy}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="border-t border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-24">
                <div className="container mx-auto max-w-4xl px-4 text-center">
                    <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                        Bir sonraki kampanyanız için{" "}
                        <span className="text-[#11b981]">15 dakika ayırın.</span>
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600">
                        Kayıt olmadan bile tüm panoları görebilirsiniz. Beğendiğinizi sepete
                        atın, sonra karar verin.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            href="/static-billboards"
                            className="inline-flex items-center gap-2 rounded-full bg-[#11b981] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#0d9669]"
                        >
                            Panoları Keşfet <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="https://calendly.com/erendoru/30dk"
                            target="_blank"
                            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                        >
                            Demo talep et
                        </Link>
                    </div>
                </div>
            </section>

            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        headline: "Markalar İçin Panobu — Veriyle Seçin, Yeni Nesil OOH",
                        description:
                            "Panobu İçgörü Motoru: trafik skoru, 500m çevre analizi, tahmini gösterim, CPM kıyası, doluluk takvimi ve rakip haritası. Self-serve outdoor, şeffaf fiyat.",
                        author: { "@type": "Organization", name: "Panobu" },
                        publisher: {
                            "@type": "Organization",
                            name: "Panobu",
                            logo: {
                                "@type": "ImageObject",
                                url: "https://panobu.com/favicon.png",
                            },
                        },
                        mainEntityOfPage: "https://panobu.com/markalar-icin",
                    }),
                }}
            />
        </PublicLayout>
    );
}
