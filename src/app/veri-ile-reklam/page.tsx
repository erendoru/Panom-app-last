import type { Metadata } from "next";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import {
    Activity,
    ArrowRight,
    BarChart3,
    Building2,
    Car,
    CheckCircle2,
    Database,
    Eye,
    MapPin,
    Radar,
    Sparkles,
    Target,
    TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Veriler ile Açık Hava Reklamı Verin — CPM Nasıl Hesaplanır? | Panobu",
    description:
        "Panobu, her billboard için OpenStreetMap verisi, yol tipi analizi, POI yoğunluğu ve pano tipi görünürlük katsayıları ile 1-100 arası trafik skoru, günlük/haftalık/aylık tahmini gösterim ve CPM değeri hesaplar. Metodolojimizi adım adım inceleyin.",
    alternates: { canonical: "https://panobu.com/veri-ile-reklam" },
    openGraph: {
        title: "Veriler ile Açık Hava Reklamı Verin | Panobu",
        description:
            "Trafik skoru, tahmini gösterim ve CPM hesaplamalarımızın arkasındaki metodolojiyi keşfedin. OpenStreetMap + POI + görünürlük faktörleri.",
        type: "article",
        url: "https://panobu.com/veri-ile-reklam",
    },
};

export default function DataDrivenPage() {
    return (
        <PublicLayout activeLink="nasil">
            {/* HERO */}
            <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
                <div className="absolute -top-20 -right-32 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
                <div className="absolute -bottom-24 -left-32 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl" />

                <div className="container relative mx-auto px-4 py-20 sm:py-28">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-[#0d9669] backdrop-blur-sm">
                            <Sparkles className="h-3.5 w-3.5" />
                            Panobu Metodoloji
                        </div>
                        <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                            Veriler ile <span className="text-[#11b981]">Açık Hava Reklamı</span> Verin
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
                            Panobu'da her pano için <strong>trafik skoru (1–100)</strong>, tahmini{" "}
                            <strong>günlük/haftalık/aylık gösterim</strong> ve{" "}
                            <strong>CPM (1.000 gösterim başına maliyet)</strong> değerini;
                            OpenStreetMap verisi, yol tipi sınıflandırması, POI yoğunluğu ve pano tipi görünürlük
                            katsayılarından hesaplıyoruz. "Tahmini bir rakam söyleyin" dönemi kapandı.
                        </p>

                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Link
                                href="/static-billboards"
                                className="inline-flex items-center gap-2 rounded-full bg-[#11b981] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#0d9669]"
                            >
                                Veri Destekli Panoları Keşfet <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="#metodoloji"
                                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                            >
                                Metodolojiye Geç
                            </Link>
                        </div>

                        {/* Mini KPI'lar */}
                        <div className="mt-12 grid grid-cols-3 gap-3 text-left sm:gap-6">
                            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 backdrop-blur-sm">
                                <div className="text-2xl font-bold text-[#11b981] sm:text-3xl">1–100</div>
                                <div className="text-[11px] font-medium text-slate-600 sm:text-xs">
                                    Trafik skoru aralığı
                                </div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 backdrop-blur-sm">
                                <div className="text-2xl font-bold text-[#11b981] sm:text-3xl">500m</div>
                                <div className="text-[11px] font-medium text-slate-600 sm:text-xs">
                                    POI analiz yarıçapı
                                </div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 backdrop-blur-sm">
                                <div className="text-2xl font-bold text-[#11b981] sm:text-3xl">5 tip</div>
                                <div className="text-[11px] font-medium text-slate-600 sm:text-xs">
                                    Yol sınıflandırması
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEDEN VERİ? */}
            <section className="py-20">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                                <Target className="h-3.5 w-3.5" /> Sorun
                            </div>
                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                Klasik billboard pazarı hâlâ "hissiyat"la çalışıyor
                            </h2>
                            <p className="mt-4 text-base leading-relaxed text-slate-600">
                                Geleneksel outdoor ajansları size "bu lokasyon çok iyi, günde 50 bin kişi görür" der
                                — ama bu sayının <strong>kaynağı, formülü, şeffaf metodolojisi yoktur.</strong>{" "}
                                Reklamveren, bütçeyi hangi panoya koyduğunu gerçekten anlamaz.
                            </p>
                            <ul className="mt-6 space-y-3">
                                {[
                                    "Panoya özgü CPM değeri genelde paylaşılmaz",
                                    "Aynı şehirdeki iki pano neden farklı fiyatlanır belirsizdir",
                                    "Günlük gösterim tahminleri kulaktan dolma rakamlardır",
                                    "Dijital reklamla verim kıyası yapılamaz",
                                ].map((x) => (
                                    <li key={x} className="flex items-start gap-3">
                                        <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                                        <span className="text-sm text-slate-700">{x}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative rounded-3xl bg-gradient-to-br from-[#0ea472] via-[#11b981] to-[#0d9669] p-8 text-white shadow-xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                                <Sparkles className="h-3.5 w-3.5" /> Panobu Yaklaşımı
                            </div>
                            <h3 className="mt-4 text-2xl font-bold leading-snug">
                                Her panoya, herkesin görebileceği, açıklanabilir bir sayı veririz
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-emerald-50">
                                Pano detay sayfasında trafik skorunu, yol tipini, 500m içindeki POI sayısını,
                                günlük/haftalık/aylık tahmini gösterimi ve CPM'i açıkça gösteriyoruz. Formülümüz bu
                                sayfada, sadece sizin için değil — medya sahipleri için de şeffaf.
                            </p>
                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                                    <div className="text-xs font-medium uppercase tracking-wider text-emerald-100">
                                        Örnek
                                    </div>
                                    <div className="mt-1 text-2xl font-bold">82/100</div>
                                    <div className="text-[11px] text-emerald-50">Trafik skoru</div>
                                </div>
                                <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                                    <div className="text-xs font-medium uppercase tracking-wider text-emerald-100">
                                        Örnek
                                    </div>
                                    <div className="mt-1 text-2xl font-bold">₺24</div>
                                    <div className="text-[11px] text-emerald-50">CPM</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* METODOLOJİ */}
            <section id="metodoloji" className="border-t border-slate-200 bg-slate-50 py-20">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                            <Database className="h-3.5 w-3.5" /> Metodoloji
                        </div>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Bir panoya nasıl "82/100" veriyoruz?
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
                            Her pano için aşağıdaki 4 kaynaktan veri topluyoruz, birleştirip sektör standartlarına
                            göre normalize ediyoruz.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                icon: MapPin,
                                title: "1. Konum & Koordinat",
                                desc: "Pano GPS noktası (lat/lng) girildiği anda, etrafındaki yolu ve POI yoğunluğunu sorgulamak için kullanılır.",
                                accent: "from-[#11b981] to-emerald-600",
                            },
                            {
                                icon: Radar,
                                title: "2. OpenStreetMap / Overpass API",
                                desc: "60m yarıçapında en yakın yolu ve 500m yarıçapında dükkan/okul/hastane/AVM gibi POI'leri tarıyoruz.",
                                accent: "from-emerald-500 to-teal-500",
                            },
                            {
                                icon: Car,
                                title: "3. Yol Tipi Sınıflandırması",
                                desc: "Yol OSM 'highway' etiketine göre 5 sınıfa ayrılır: Otoyol, Ana cadde, Tali yol, Ara sokak, Yaya bölgesi.",
                                accent: "from-amber-500 to-orange-500",
                            },
                            {
                                icon: Eye,
                                title: "4. Pano Tipi Görünürlük",
                                desc: "Megaboard, billboard, CLP, raket — her tip için farklı dikkat/görünürlük katsayısı uygulanır.",
                                accent: "from-rose-500 to-pink-500",
                            },
                        ].map((x, i) => (
                            <div
                                key={i}
                                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md"
                            >
                                <div
                                    className={`absolute -top-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br ${x.accent} opacity-10 transition-opacity group-hover:opacity-20`}
                                />
                                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${x.accent} text-white shadow-sm`}>
                                    <x.icon className="h-5 w-5" />
                                </div>
                                <h3 className="mt-4 text-base font-bold text-slate-900">{x.title}</h3>
                                <p className="mt-2 text-xs leading-relaxed text-slate-600">{x.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TRAFİK SKORU DETAY */}
            <section className="py-20">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
                        <div className="lg:sticky lg:top-24">
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                                <Activity className="h-3.5 w-3.5" /> Formül
                            </div>
                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                Trafik Skoru <span className="text-[#11b981]">Hesaplama Formülü</span>
                            </h2>
                            <p className="mt-4 text-base leading-relaxed text-slate-600">
                                Skor, yol tipinin taban değerinden başlar; POI yoğunluğu çarpanla artırır veya
                                azaltır ve 1–100 arasına sıkıştırılır.
                            </p>

                            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-900 p-5 font-mono text-xs text-slate-100 shadow-sm">
                                <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-slate-400">
                                    Temel formül
                                </div>
                                <pre className="mt-2 overflow-x-auto text-[12px] leading-relaxed">
{`trafficScore = clamp(1, 100,
  BASE_SCORE_BY_ROAD_TYPE[roadType] * poiMultiplier(poiCount)
  + poiBonus(poiCount)
)`}
                                </pre>
                            </div>

                            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-900 p-5 font-mono text-xs text-slate-100 shadow-sm">
                                <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-slate-400">
                                    Örnek hesaplama (Ana cadde, 25 POI)
                                </div>
                                <pre className="mt-2 overflow-x-auto text-[12px] leading-relaxed">
{`baseScore         = 50    // MAIN_ROAD
poiMultiplier(25) = 1.3   // yüksek
poiBonus(25)      = 8     // min(15, 25/3)

trafficScore      = 50 × 1.3 + 8
                  = 73 → "Yüksek trafik"`}
                                </pre>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900">
                                    Yol tipi taban puanları
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    OSM <code className="rounded bg-slate-100 px-1">highway</code> etiketinden
                                    çıkarılır.
                                </p>
                                <table className="mt-4 w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-left text-[11px] uppercase tracking-wider text-slate-500">
                                            <th className="py-2 font-semibold">Yol tipi</th>
                                            <th className="py-2 text-right font-semibold">Taban skor</th>
                                            <th className="py-2 text-right font-semibold">Günlük trafik*</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            ["Otoyol / Ana arter", 70, "50.000"],
                                            ["Ana cadde", 50, "25.000"],
                                            ["Tali yol", 30, "10.000"],
                                            ["Ara sokak", 15, "3.000"],
                                            ["Yaya bölgesi", 40, "8.000"],
                                        ].map(([name, score, traffic]) => (
                                            <tr
                                                key={name as string}
                                                className="border-b border-slate-100 last:border-0"
                                            >
                                                <td className="py-3 text-slate-700">{name}</td>
                                                <td className="py-3 text-right font-bold tabular-nums text-[#11b981]">
                                                    {score}
                                                </td>
                                                <td className="py-3 text-right tabular-nums text-slate-500">
                                                    {traffic}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <p className="mt-3 text-[10px] text-slate-400">
                                    * Referans değerler — gerçek günlük trafik, skor ve POI yoğunluğuyla düzeltilir.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900">
                                    500m POI yoğunluğu → çarpan & bonus
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    Yakındaki dükkan, okul, hastane, restoran, AVM vs. sayısı panonun "canlılığını"
                                    belirler.
                                </p>
                                <table className="mt-4 w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-left text-[11px] uppercase tracking-wider text-slate-500">
                                            <th className="py-2 font-semibold">POI sayısı</th>
                                            <th className="py-2 text-right font-semibold">Çarpan</th>
                                            <th className="py-2 text-right font-semibold">Bonus</th>
                                            <th className="py-2 text-right font-semibold">Yoğunluk</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            ["≥ 40", "1.5×", "+13", "Çok yoğun"],
                                            ["20 – 39", "1.3×", "+7 → +13", "Yüksek"],
                                            ["8 – 19", "1.0×", "+3 → +6", "Orta"],
                                            ["0 – 7", "0.7×", "0 → +2", "Düşük"],
                                        ].map(([poi, mult, bonus, level]) => (
                                            <tr
                                                key={poi as string}
                                                className="border-b border-slate-100 last:border-0"
                                            >
                                                <td className="py-3 font-semibold tabular-nums text-slate-700">
                                                    {poi}
                                                </td>
                                                <td className="py-3 text-right tabular-nums text-[#11b981]">
                                                    {mult}
                                                </td>
                                                <td className="py-3 text-right tabular-nums text-emerald-700">
                                                    {bonus}
                                                </td>
                                                <td className="py-3 text-right text-slate-500">{level}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* GÖSTERİM + CPM */}
            <section className="border-y border-slate-200 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40 py-20">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                            <BarChart3 className="h-3.5 w-3.5" /> Gösterim & CPM
                        </div>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Tahmini Gösterim ve CPM nasıl bulunur?
                        </h2>
                    </div>

                    <div className="mt-12 grid gap-6 lg:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                                <Eye className="h-5 w-5" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900">Günlük Gösterim</h3>
                            <div className="mt-3 rounded-xl bg-slate-900 p-4 font-mono text-xs text-slate-100">
                                <pre className="overflow-x-auto">
{`dailyImpressions =
  dailyTraffic
  × visibilityMultiplier
  × occupancy`}
                                </pre>
                            </div>
                            <ul className="mt-4 space-y-2 text-xs text-slate-600">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                                    <span>
                                        <strong>dailyTraffic:</strong> yol tipi + skora göre günlük araç/yaya
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                                    <span>
                                        <strong>visibility:</strong> billboard 0.5, megalight 0.7, CLP 0.4, ...
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                                    <span>
                                        <strong>occupancy:</strong> 1.6 (TR ort. araç başına yolcu) — yaya bölgesinde
                                        1.0
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900">Haftalık & Aylık</h3>
                            <div className="mt-3 rounded-xl bg-slate-900 p-4 font-mono text-xs text-slate-100">
                                <pre className="overflow-x-auto">
{`weekly  = daily × 7
monthly = daily × 30`}
                                </pre>
                            </div>
                            <p className="mt-4 text-xs leading-relaxed text-slate-600">
                                Panolar <strong>7/24 yayında</strong> olduğu için haftalık/aylık sayılar, günlük
                                gösterimin doğrudan katıdır. Dijital ekranlardan farklı olarak "gün içinde kaç slot"
                                hesabı yoktur — reklam orada sürekli duruyor.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-[#0ea472] via-[#11b981] to-[#0d9669] p-6 text-white shadow-md">
                            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold">CPM — 1.000 gösterim maliyeti</h3>
                            <div className="mt-3 rounded-xl bg-black/20 p-4 font-mono text-xs text-white">
                                <pre className="overflow-x-auto">
{`CPM = (priceWeekly / weekly) × 1000`}
                                </pre>
                            </div>
                            <p className="mt-4 text-xs leading-relaxed text-emerald-50">
                                Her panonun haftalık fiyatı biliniyor. Haftalık gösterim de hesaplanabildiği için
                                CPM elimize geliyor. Tipik OOH CPM ₺10–₺60 arasında; dijital reklam CPM'i ₺80–₺250
                                bandındadır.
                            </p>
                            <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2 text-xs backdrop-blur-sm">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Her panoda bu sayı açıkça yazar</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* DİJİTAL İLE KARŞILAŞTIRMA */}
            <section className="py-20">
                <div className="container mx-auto max-w-5xl px-4">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Açık hava mı, dijital reklam mı?
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
                            CPM bazlı bakınca fark netleşiyor. Aynı 1.000 kişiye ulaşmak için ne kadar ödeyeceksiniz?
                        </p>
                    </div>

                    <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">Kanal</th>
                                    <th className="px-5 py-3 font-semibold">Ortalama CPM</th>
                                    <th className="px-5 py-3 font-semibold">Hedefleme</th>
                                    <th className="px-5 py-3 font-semibold">Etki süresi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t border-slate-100 bg-emerald-50/50">
                                    <td className="px-5 py-4 font-semibold text-slate-900">
                                        Panobu Billboard (klasik)
                                    </td>
                                    <td className="px-5 py-4 font-bold text-[#11b981]">₺10 – ₺60</td>
                                    <td className="px-5 py-4 text-slate-600">Coğrafi (il/ilçe/yol)</td>
                                    <td className="px-5 py-4 text-slate-600">7/24, hafta/ay</td>
                                </tr>
                                <tr className="border-t border-slate-100">
                                    <td className="px-5 py-4 text-slate-700">Google Ads (display)</td>
                                    <td className="px-5 py-4 tabular-nums text-slate-700">₺80 – ₺250</td>
                                    <td className="px-5 py-4 text-slate-600">İlgi / demografi</td>
                                    <td className="px-5 py-4 text-slate-600">Tıklama süresi</td>
                                </tr>
                                <tr className="border-t border-slate-100">
                                    <td className="px-5 py-4 text-slate-700">Meta (Instagram/Facebook)</td>
                                    <td className="px-5 py-4 tabular-nums text-slate-700">₺90 – ₺220</td>
                                    <td className="px-5 py-4 text-slate-600">Davranış / ilgi</td>
                                    <td className="px-5 py-4 text-slate-600">Kaydırma anı</td>
                                </tr>
                                <tr className="border-t border-slate-100">
                                    <td className="px-5 py-4 text-slate-700">TV spotu (prime time)</td>
                                    <td className="px-5 py-4 tabular-nums text-slate-700">₺150 – ₺400</td>
                                    <td className="px-5 py-4 text-slate-600">Yayın/kanal</td>
                                    <td className="px-5 py-4 text-slate-600">20–30 sn</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-4 text-center text-xs text-slate-500">
                        Rakamlar sektör raporlarından alınmış ortalama referanslardır, 2025/2026 dönemi TR pazarı.
                    </p>
                </div>
            </section>

            {/* ŞEFFAFLIK */}
            <section className="border-t border-slate-200 bg-slate-50 py-20">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                                <Building2 className="h-3.5 w-3.5" /> Şeffaflık
                            </div>
                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                Verinin kaynağı, kararın arkasındadır
                            </h2>
                            <ul className="mt-6 space-y-4">
                                {[
                                    {
                                        t: "Açık kaynak veri",
                                        d: "Tüm lokasyon, yol, POI analizi OpenStreetMap üzerinden — komersiyel bir kara kutu değil.",
                                    },
                                    {
                                        t: "Formüller bu sayfada",
                                        d: "Skor hesaplaması, görünürlük katsayısı, CPM formülü — hepsi yukarıda görülebilir.",
                                    },
                                    {
                                        t: "Her panoda kartvizit",
                                        d: "Pano detay sayfasında skoru, yol tipini, POI sayısını, tahmini gösterimi ve CPM'i göreceksiniz.",
                                    },
                                    {
                                        t: "Manuel düzeltme imkânı",
                                        d: "Medya sahibi, lokasyonu çok iyi biliyorsa \"günlük ortalama trafik\" alanına elle değer girebilir; sistem buna saygı gösterir.",
                                    },
                                ].map((x) => (
                                    <li key={x.t} className="flex gap-3">
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                                        <div>
                                            <div className="text-sm font-semibold text-slate-900">{x.t}</div>
                                            <div className="text-sm text-slate-600">{x.d}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Örnek pano kartı
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5">
                                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Kocaeli — Körfez
                                </div>
                                <div className="mt-1 text-lg font-bold text-slate-900">
                                    Körfez D-100 Güney Billboard
                                </div>
                                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                                    <div className="rounded-xl bg-emerald-50 p-3">
                                        <div className="text-[9px] font-semibold uppercase tracking-wider text-emerald-700">
                                            Skor
                                        </div>
                                        <div className="mt-1 text-2xl font-black text-emerald-700">82</div>
                                    </div>
                                    <div className="rounded-xl bg-blue-50 p-3">
                                        <div className="text-[9px] font-semibold uppercase tracking-wider text-blue-700">
                                            Günlük
                                        </div>
                                        <div className="mt-1 text-sm font-bold tabular-nums text-blue-800">
                                            43.200
                                        </div>
                                    </div>
                                    <div className="rounded-xl bg-teal-50 p-3">
                                        <div className="text-[9px] font-semibold uppercase tracking-wider text-teal-700">
                                            CPM
                                        </div>
                                        <div className="mt-1 text-sm font-bold tabular-nums text-teal-800">
                                            ₺24
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-900/5 px-3 py-2 text-xs text-slate-600">
                                    <span>Yol tipi</span>
                                    <span className="font-semibold text-slate-800">Otoyol / Ana arter</span>
                                </div>
                                <div className="mt-1.5 flex items-center justify-between rounded-lg bg-slate-900/5 px-3 py-2 text-xs text-slate-600">
                                    <span>500m POI</span>
                                    <span className="font-semibold text-slate-800">37 mekân</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24">
                <div className="container mx-auto max-w-4xl px-4 text-center">
                    <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                        Verinin gücüyle pano seçmeye başlayın
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600">
                        Her panonun skoru, tahmini gösterimi ve CPM'i açık. Bütçenize en verimli lokasyonları
                        karşılaştırın.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            href="/static-billboards"
                            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                        >
                            Panoları Keşfet <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/how-it-works"
                            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                        >
                            Nasıl Çalışır sayfasına dön
                        </Link>
                    </div>
                </div>
            </section>

            {/* JSON-LD — Article */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        headline: "Veriler ile Açık Hava Reklamı Verin — Trafik Skoru ve CPM Metodolojisi",
                        description:
                            "Panobu'nun billboard trafik skoru, tahmini gösterim ve CPM hesaplama metodolojisi. OpenStreetMap, yol tipi, POI yoğunluğu ve görünürlük katsayılarıyla şeffaf formüller.",
                        author: { "@type": "Organization", name: "Panobu" },
                        publisher: {
                            "@type": "Organization",
                            name: "Panobu",
                            logo: {
                                "@type": "ImageObject",
                                url: "https://panobu.com/favicon.png",
                            },
                        },
                        mainEntityOfPage: "https://panobu.com/veri-ile-reklam",
                    }),
                }}
            />
        </PublicLayout>
    );
}
