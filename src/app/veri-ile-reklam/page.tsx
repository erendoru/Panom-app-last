import type { Metadata } from "next";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import {
    Activity,
    ArrowRight,
    BarChart3,
    Building2,
    CheckCircle2,
    Compass,
    Eye,
    Globe2,
    Layers,
    Lock,
    MapPin,
    Radar,
    ShieldCheck,
    Sparkles,
    Target,
    TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Panobu İçgörü Motoru — Veri ile Açık Hava Reklamı | Panobu",
    description:
        "Her billboard için trafik skoru, tahmini gösterim, çevre analizi ve dijital kıyas. Panobu İçgörü Motoru; global pazarların outdoor medya planlama disiplininden ilham alan, Türkiye'ye özel geliştirilmiş bir karar destek katmanıdır.",
    alternates: { canonical: "https://panobu.com/veri-ile-reklam" },
    openGraph: {
        title: "Panobu İçgörü Motoru — Veri ile Açık Hava Reklamı | Panobu",
        description:
            "Panoyu seçmeden önce ne iş çıkardığını gör. Trafik skoru, tahmini gösterim, çevre analizi ve dijital kıyas — tek sayfada.",
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
                            Panobu İçgörü Motoru
                        </div>
                        <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                            Panoyu hisle değil <br />
                            <span className="text-[#11b981]">veriyle</span> seçin.
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
                            Trafik skoru, tahmini gösterim, çevre analizi ve dijital reklamla kıyas.
                            Panoyu seçmeden önce gerçek performansını görmenizi sağlayan, Türkiye'ye
                            özel geliştirilmiş karar destek katmanı.
                        </p>

                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Link
                                href="/static-billboards"
                                className="inline-flex items-center gap-2 rounded-full bg-[#11b981] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#0d9669]"
                            >
                                Panoları Keşfet <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="#neler-goruyorsunuz"
                                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                            >
                                Neler Göreceksiniz
                            </Link>
                        </div>

                        {/* Canlı kart — motorun çıktısını hissettiren */}
                        <div className="mt-14 grid grid-cols-2 gap-3 text-left sm:grid-cols-4">
                            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 backdrop-blur-sm">
                                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                                    <Activity className="h-3 w-3" /> Skor
                                </div>
                                <div className="mt-1 text-2xl font-bold tabular-nums text-slate-900 sm:text-3xl">
                                    1–100
                                </div>
                                <div className="text-[11px] text-slate-500">Her panoya özgü</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 backdrop-blur-sm">
                                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                                    <Eye className="h-3 w-3" /> Gösterim
                                </div>
                                <div className="mt-1 text-2xl font-bold tabular-nums text-slate-900 sm:text-3xl">
                                    Günlük
                                </div>
                                <div className="text-[11px] text-slate-500">Hafta / ay tahmini</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 backdrop-blur-sm">
                                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                                    <MapPin className="h-3 w-3" /> Çevre
                                </div>
                                <div className="mt-1 text-2xl font-bold tabular-nums text-slate-900 sm:text-3xl">
                                    500m
                                </div>
                                <div className="text-[11px] text-slate-500">Komşu markalar & mekânlar</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 backdrop-blur-sm">
                                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                                    <BarChart3 className="h-3 w-3" /> CPM
                                </div>
                                <div className="mt-1 text-2xl font-bold tabular-nums text-slate-900 sm:text-3xl">
                                    ₺
                                </div>
                                <div className="text-[11px] text-slate-500">Dijital reklamla kıyas</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PROBLEM */}
            <section className="py-20">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                                <Target className="h-3.5 w-3.5" /> Sektörün sorunu
                            </div>
                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                Outdoor reklamcılık hâlâ "hissiyat" ile satılıyor.
                            </h2>
                            <p className="mt-4 text-base leading-relaxed text-slate-600">
                                Ajanslar "bu lokasyon çok iyi, günde 50 bin kişi görür" der. Sayının
                                kaynağı sorulmaz; çünkü kimse söyleyemez. Bütçeyi hangi panoya
                                koyduğunuzu, yanındakine göre neden daha pahalı olduğunu gerçekten
                                anlamazsınız. Dijital reklamla kıyaslama? O bir tabu.
                            </p>
                            <ul className="mt-6 space-y-3">
                                {[
                                    "Panoya özel metrikler sizden saklanır",
                                    "Aynı caddedeki iki panonun fiyat farkı açıklanamaz",
                                    "Günlük gösterim tahminleri kulaktan dolmadır",
                                    "Google/Meta reklamıyla verim kıyası yapılamaz",
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
                                <Sparkles className="h-3.5 w-3.5" /> Panobu farkı
                            </div>
                            <h3 className="mt-4 text-2xl font-bold leading-snug">
                                Biz her panoya konuşan bir kartvizit veriyoruz.
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-emerald-50">
                                Trafik skoru, tahmini gösterim, çevre analizi ve CPM değeri —
                                hepsi pano detay sayfasında açık. Medya satın almayı dijital
                                reklam almak kadar net hale getiren bir içgörü katmanı.
                            </p>
                            <div className="mt-6 grid grid-cols-3 gap-2">
                                <div className="rounded-xl bg-white/10 p-3 text-center backdrop-blur-sm">
                                    <div className="text-[10px] font-medium uppercase tracking-wider text-emerald-100">
                                        Skor
                                    </div>
                                    <div className="mt-0.5 text-2xl font-bold">82</div>
                                </div>
                                <div className="rounded-xl bg-white/10 p-3 text-center backdrop-blur-sm">
                                    <div className="text-[10px] font-medium uppercase tracking-wider text-emerald-100">
                                        Günlük
                                    </div>
                                    <div className="mt-0.5 text-sm font-bold">43.2K</div>
                                </div>
                                <div className="rounded-xl bg-white/10 p-3 text-center backdrop-blur-sm">
                                    <div className="text-[10px] font-medium uppercase tracking-wider text-emerald-100">
                                        CPM
                                    </div>
                                    <div className="mt-0.5 text-2xl font-bold">₺24</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* NELER GÖRECEKSİNİZ */}
            <section
                id="neler-goruyorsunuz"
                className="border-t border-slate-200 bg-slate-50 py-20"
            >
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                            <Layers className="h-3.5 w-3.5" /> Panoda göreceğiniz metrikler
                        </div>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Her pano detayında <span className="text-[#11b981]">dört katman</span>
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
                            Panobu İçgörü Motoru, onlarca sinyali tek bir kartta birleştirir.
                            Teknik detay değil, karar verdirten bir özet.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-2">
                        {/* 1. Trafik skoru */}
                        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md">
                            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br from-[#11b981] to-emerald-600 opacity-10 transition-opacity group-hover:opacity-20" />
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#11b981] to-emerald-600 text-white shadow-sm">
                                <Activity className="h-5 w-5" />
                            </div>
                            <h3 className="mt-5 text-lg font-bold text-slate-900">
                                Trafik Skoru · 1–100
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                Panonun yayını ne kadar "canlı" yaptığını tek rakamla özetler.
                                82 ve üzeri premium lokasyondur, 40 altı ise niş hedefleme için
                                uygundur. Aynı il içinde iki panoyu saniyede kıyaslarsınız.
                            </p>
                        </div>

                        {/* 2. Tahmini gösterim */}
                        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md">
                            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 opacity-10 transition-opacity group-hover:opacity-20" />
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-sm">
                                <Eye className="h-5 w-5" />
                            </div>
                            <h3 className="mt-5 text-lg font-bold text-slate-900">
                                Tahmini Gösterim · günlük / haftalık / aylık
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                "Şu panoya haftada 300 bin kişi bakar" cümlesi boşuna değil.
                                Pano tipi, konum ve görünürlük birlikte hesaplanır; dijital
                                reklamın "impression" kavramıyla aynı dilde konuşur.
                            </p>
                        </div>

                        {/* 3. Çevre analizi */}
                        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md">
                            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 opacity-10 transition-opacity group-hover:opacity-20" />
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-sm">
                                <Compass className="h-5 w-5" />
                            </div>
                            <h3 className="mt-5 text-lg font-bold text-slate-900">
                                Çevre Analizi · 500m komşuları
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                Panonun etrafındaki <strong>markalar, AVM'ler, okullar,
                                restoranlar, hastaneler</strong> — hedef kitlenizin panodan
                                geçerken hangi karardan çıktığı önemlidir. Sektörde Türkiye'de
                                bir ilk.
                            </p>
                        </div>

                        {/* 4. Dijital kıyas / CPM */}
                        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md">
                            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 opacity-10 transition-opacity group-hover:opacity-20" />
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <h3 className="mt-5 text-lg font-bold text-slate-900">
                                CPM · Dijital reklamla tek dilde
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                "1.000 kişiye kaç ₺'ye ulaşıyorum?" — Google Ads ekranında
                                kullandığınız metriğin aynısı billboardınız için de hazır.
                                Kampanya bütçeniz artık kanallar arasında tek cetvelle ölçülür.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ÇEVRE ANALİZİ ÖZEL VİTRİNİ */}
            <section className="py-20">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800">
                                <Compass className="h-3.5 w-3.5" /> Çevre Analizi
                            </div>
                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                Panonun komşusu <span className="text-[#11b981]">kim?</span>
                            </h2>
                            <p className="mt-4 text-base leading-relaxed text-slate-600">
                                Bir panoyu özel yapan sadece geçen kişi sayısı değildir; kimin,
                                neden oradan geçtiğidir. AVM çıkışındaki bir CLP ile fabrika
                                yolundaki bir billboard aynı panoya benzemez — hedef kitleleri,
                                tüketim alışkanlıkları, alışveriş anı bambaşkadır.
                            </p>
                            <p className="mt-3 text-base leading-relaxed text-slate-600">
                                Çevre Analizi, panonun 500m yakınındaki markaları, okulları,
                                sağlık merkezlerini, AVM'leri ve gastronomi noktalarını tek
                                bakışta size gösterir. Kampanyanız için doğru panoyu, fiyata
                                değil <strong>komşuluğa</strong> göre seçin.
                            </p>

                            <div className="mt-8 grid grid-cols-2 gap-3">
                                {[
                                    { label: "Markalar", value: "🏬" },
                                    { label: "Okul & eğitim", value: "🎓" },
                                    { label: "Sağlık", value: "🏥" },
                                    { label: "Restoran & kafe", value: "🍽️" },
                                    { label: "AVM & alışveriş", value: "🛍️" },
                                    { label: "Ofis bölgesi", value: "💼" },
                                ].map((x) => (
                                    <div
                                        key={x.label}
                                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm"
                                    >
                                        <span className="text-lg">{x.value}</span>
                                        <span className="text-sm font-medium text-slate-700">
                                            {x.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Örnek çevre kartı */}
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                        Çevre kartı — örnek
                                    </div>
                                    <div className="mt-0.5 text-base font-bold text-slate-900">
                                        Kocaeli · Körfez D-100
                                    </div>
                                </div>
                                <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                                    <MapPin className="h-3 w-3" /> 500m
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                        Çevredeki markalar
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {["Migros", "Starbucks", "Teknosa", "LC Waikiki", "Shell", "BİM", "Defacto"].map(
                                            (b) => (
                                                <span
                                                    key={b}
                                                    className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700"
                                                >
                                                    {b}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="rounded-xl bg-emerald-50 p-3">
                                        <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                                            Mekân
                                        </div>
                                        <div className="mt-0.5 text-xl font-bold text-emerald-800">37</div>
                                    </div>
                                    <div className="rounded-xl bg-sky-50 p-3">
                                        <div className="text-[10px] font-semibold uppercase tracking-wider text-sky-700">
                                            Marka
                                        </div>
                                        <div className="mt-0.5 text-xl font-bold text-sky-800">14</div>
                                    </div>
                                    <div className="rounded-xl bg-rose-50 p-3">
                                        <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-700">
                                            Kategori
                                        </div>
                                        <div className="mt-0.5 text-xl font-bold text-rose-800">9</div>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-slate-900 px-4 py-3 text-xs text-slate-100">
                                    <span className="text-emerald-300">✓ İpucu:</span> "Yakınında
                                    Starbucks ve Teknosa olan panolar, 25–40 yaş dijital yerli
                                    tüketici kampanyalarında daha yüksek dönüşüm verir."
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* DİJİTAL KIYAS */}
            <section className="border-y border-slate-200 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40 py-20">
                <div className="container mx-auto max-w-5xl px-4">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                            <BarChart3 className="h-3.5 w-3.5" /> CPM kıyası
                        </div>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Aynı 1.000 kişiye <span className="text-[#11b981]">hangi kanal</span>{" "}
                            daha ucuz?
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
                            Billboardu artık Google/Meta reklamlarıyla aynı metrikle
                            ölçebilirsiniz.
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
                                    <td className="px-5 py-4 text-slate-600">Coğrafi + komşu</td>
                                    <td className="px-5 py-4 text-slate-600">7/24, hafta/ay</td>
                                </tr>
                                <tr className="border-t border-slate-100">
                                    <td className="px-5 py-4 text-slate-700">Google Ads (display)</td>
                                    <td className="px-5 py-4 tabular-nums text-slate-700">₺80 – ₺250</td>
                                    <td className="px-5 py-4 text-slate-600">İlgi / demografi</td>
                                    <td className="px-5 py-4 text-slate-600">Tıklama süresi</td>
                                </tr>
                                <tr className="border-t border-slate-100">
                                    <td className="px-5 py-4 text-slate-700">
                                        Meta (Instagram/Facebook)
                                    </td>
                                    <td className="px-5 py-4 tabular-nums text-slate-700">₺90 – ₺220</td>
                                    <td className="px-5 py-4 text-slate-600">Davranış / ilgi</td>
                                    <td className="px-5 py-4 text-slate-600">Kaydırma anı</td>
                                </tr>
                                <tr className="border-t border-slate-100">
                                    <td className="px-5 py-4 text-slate-700">TV (prime time)</td>
                                    <td className="px-5 py-4 tabular-nums text-slate-700">
                                        ₺150 – ₺400
                                    </td>
                                    <td className="px-5 py-4 text-slate-600">Yayın/kanal</td>
                                    <td className="px-5 py-4 text-slate-600">20–30 sn</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-4 text-center text-xs text-slate-500">
                        Rakamlar 2025–2026 Türkiye pazarı sektör raporlarından alınmış ortalama
                        referanslardır.
                    </p>
                </div>
            </section>

            {/* GLOBAL İLHAM + TÜRKİYE'YE ÖZEL */}
            <section className="py-20">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                        <div className="order-2 lg:order-1">
                            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-xl">
                                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                                    <Globe2 className="h-3.5 w-3.5" /> Global pratik
                                </div>
                                <h3 className="mt-4 text-2xl font-bold leading-snug">
                                    Londra, NYC, Tokyo'da medya planlamacılar nasıl çalışıyor?
                                </h3>
                                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                                    Global pazarlarda outdoor reklamcılık; gözlem skorları,
                                    hedef kitle komşuluğu, dijital kampanya paraleli ve marka
                                    kıyasıyla yönetilir. Bir billboard artık "çok iyi lokasyon
                                    diyorlar" yorumuyla satılmaz — her panonun performansı
                                    sayısallaştırılır.
                                </p>
                                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                                    Panobu İçgörü Motoru, bu anlayışı Türkiye pazarının özel
                                    dinamikleriyle (AVM kültürü, D-yolları, yerel marka
                                    yoğunlukları) birleştiren yerli bir karar destek
                                    katmanıdır.
                                </p>

                                <div className="mt-6 grid grid-cols-3 gap-3">
                                    <div className="rounded-xl bg-white/5 p-3 text-center backdrop-blur-sm">
                                        <div className="text-2xl font-bold text-emerald-400">1.</div>
                                        <div className="mt-1 text-[11px] text-slate-300">
                                            Türkiye'de sunulan çevre analizi
                                        </div>
                                    </div>
                                    <div className="rounded-xl bg-white/5 p-3 text-center backdrop-blur-sm">
                                        <div className="text-2xl font-bold text-emerald-400">81</div>
                                        <div className="mt-1 text-[11px] text-slate-300">
                                            İl için tek motor
                                        </div>
                                    </div>
                                    <div className="rounded-xl bg-white/5 p-3 text-center backdrop-blur-sm">
                                        <div className="text-2xl font-bold text-emerald-400">4</div>
                                        <div className="mt-1 text-[11px] text-slate-300">
                                            Katmanlı içgörü
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                                <ShieldCheck className="h-3.5 w-3.5" /> Fark
                            </div>
                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                Kolay söylenir, zor yapılır.
                            </h2>
                            <p className="mt-4 text-base leading-relaxed text-slate-600">
                                Her panoya rakam vermek bir Excel hücresi değildir. Yüzlerce
                                sinyali — yol karakteri, pano tipi, görünürlük, çevre yoğunluğu,
                                marka kimliği — birleştirip saniyede karar destek çıktısına
                                çeviren bir sistemdir. Bizim için yıllar süren bir iş; size
                                panonun yanında beliren 82/100 rakamı.
                            </p>
                            <ul className="mt-6 space-y-3">
                                {[
                                    {
                                        icon: Radar,
                                        t: "Çok kaynaklı sinyal füzyonu",
                                        d: "Konum, yol karakteri, pano tipi ve çevre verileri tek bir skora dönüşür.",
                                    },
                                    {
                                        icon: Lock,
                                        t: "Türkiye'ye özel modelleme",
                                        d: "AVM kültürü, D-yolları, yerli marka profilleri — yabancı bir modelin yapamayacağı ince ayarlar.",
                                    },
                                    {
                                        icon: Building2,
                                        t: "Her gün gelişen zekâ",
                                        d: "Kampanya geri bildirimleriyle skorlar düzenli olarak yeniden kalibre edilir.",
                                    },
                                ].map((x) => (
                                    <li key={x.t} className="flex gap-3">
                                        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                                            <x.icon className="h-4 w-4" />
                                        </span>
                                        <div>
                                            <div className="text-sm font-semibold text-slate-900">
                                                {x.t}
                                            </div>
                                            <div className="text-sm text-slate-600">{x.d}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ÖRNEK PANO KARTI */}
            <section className="border-t border-slate-200 bg-slate-50 py-20">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Panoda gördüğünüz
                            </div>
                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                Her pano detayında hazır.
                            </h2>
                            <p className="mt-4 text-base leading-relaxed text-slate-600">
                                Skor, günlük gösterim, çevre kartı ve CPM — tek bakışta.
                                Satın alma kararınızı dijital reklamlar kadar kolay verin.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href="/static-billboards"
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#11b981] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#0d9669]"
                                >
                                    Panoları Keşfet <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href="/how-it-works"
                                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                                >
                                    Nasıl Çalışır?
                                </Link>
                            </div>
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
                                        <div className="mt-1 text-2xl font-black text-emerald-700">
                                            82
                                        </div>
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
                                <div className="mt-4 rounded-lg bg-slate-900/5 px-3 py-2">
                                    <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                        Çevrede
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {["Migros", "Starbucks", "Teknosa", "Shell", "+34"].map((b) => (
                                            <span
                                                key={b}
                                                className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 shadow-sm"
                                            >
                                                {b}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-24">
                <div className="container mx-auto max-w-4xl px-4 text-center">
                    <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                        Panoyu hisle değil, <span className="text-[#11b981]">veriyle</span> seçin.
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600">
                        Panobu İçgörü Motoru her panonun yanında. Siz sadece bütçenizi ve
                        hedefinizi belirleyin.
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
                            Nasıl Çalışır?
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
                        headline:
                            "Panobu İçgörü Motoru — Veri ile Açık Hava Reklamı",
                        description:
                            "Trafik skoru, tahmini gösterim, çevre analizi ve dijital kıyas. Her pano için karar destek katmanı.",
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
