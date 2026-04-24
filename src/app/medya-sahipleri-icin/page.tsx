import type { Metadata } from "next";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import {
    ArrowRight,
    Banknote,
    BarChart3,
    Bell,
    Building2,
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    Download,
    FileText,
    Globe,
    Handshake,
    LayoutDashboard,
    Mail,
    Megaphone,
    MessageSquare,
    ShieldCheck,
    Sparkles,
    Store,
    TrendingUp,
    Users,
    Zap,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Medya Sahipleri İçin Panobu — Kendi Vitriniz, Kendi Müşteriniz | Panobu",
    description:
        "Ajans komisyonu ödemeden panolarınızı satın. Panobu medya sahiplerine storefront (vitrin), inquiry yönetimi, sipariş dashboard'u, faturalandırma ve yakında mail/SMS kampanya modülü sunar.",
    alternates: { canonical: "https://panobu.com/medya-sahipleri-icin" },
    openGraph: {
        title: "Medya Sahipleri İçin Panobu — Kendi Vitriniz, Kendi Müşteriniz",
        description:
            "Panobu pano sahipleri ve ajanslar için self-serve satış kanalı, vitrin ve CRM. Ajans komisyonu yok.",
        type: "article",
        url: "https://panobu.com/medya-sahipleri-icin",
    },
};

const FEATURES = [
    {
        icon: Store,
        title: "Kendi vitriniz",
        desc: "Her medya sahibi için özel storefront sayfası. Logonuz, panolarınız, şehirleriniz, fiyatlarınız. Markalar doğrudan sizi bulur — ajans aracı yok.",
        accent: "from-emerald-500 to-teal-500",
    },
    {
        icon: LayoutDashboard,
        title: "Pano yönetim paneli",
        desc: "Panoları tek tek ekleyip fotoğraf, koordinat, fiyat, müsaitlik atayın. Panobu tarafındaki veri motoru otomatik skor ve çevre analizi üretir.",
        accent: "from-sky-500 to-indigo-500",
    },
    {
        icon: MessageSquare,
        title: "Inquiry & teklif yönetimi",
        desc: "Markadan gelen sorular doğrudan dashboard'unuza düşer. Teklif gönderin, onay bekleyin, rezervasyonu tek tıkla kesinleştirin.",
        accent: "from-rose-500 to-pink-500",
    },
    {
        icon: BarChart3,
        title: "Haftalık performans raporu",
        desc: "Kaç kişi panolarınızı gördü, kaç sepete eklendi, kaç rezervasyon oldu — haftalık e-posta ve dashboard grafikleri.",
        accent: "from-amber-500 to-orange-500",
    },
    {
        icon: FileText,
        title: "Sipariş, fatura, baskı kanıtı",
        desc: "Hukuki süreç dahil tam sipariş yaşam döngüsü. Baskı kanıtı yükleyin, müşteriniz anında görsün.",
        accent: "from-violet-500 to-purple-500",
    },
    {
        icon: Megaphone,
        title: "Kampanya modülü (yakında)",
        desc: "Mail ve SMS kampanyaları ile müşterilerinize anons yollayın. Beta'ya ilk katılanlar öncelikli aktivasyon alır.",
        accent: "from-emerald-500 to-lime-500",
    },
];

const BENEFITS = [
    {
        title: "Komisyon değil, abonelik modeli",
        desc: "Ajanslara %15-25 komisyon yerine aylık sabit ücret + küçük işlem komisyonu. Her ₺1 ciro size daha fazla net gelir demek.",
    },
    {
        title: "Direkt müşteri ilişkisi",
        desc: "Markalar sizi tanıyor, sizinle iletişime geçiyor. İkinci kez geldiğinde 'Ajans X üstünden' değil, doğrudan sizinle konuşuyor.",
    },
    {
        title: "Veri sizinle",
        desc: "Panolarınızın trafik skoru, çevre analizi, geçmiş dolulukları — hepsi dashboard'unuzda. Ajansın sırrı değil, sizin avantajınız.",
    },
    {
        title: "Her yerde bulunabilirlik",
        desc: "Panobu haritasında, Google aramalarında, şehir filtrelerinde panolarınız görünür. SEO ve içerik katmanını Panobu yönetir.",
    },
];

const STEPS = [
    {
        step: "01",
        title: "Başvuru gönderin",
        desc: "Panobu ekibine kısa başvuru. 1-2 iş günü içinde dönüş.",
        icon: Handshake,
    },
    {
        step: "02",
        title: "Panolarınızı yükleyin",
        desc: "Dashboard'da pano ekle → fotoğraf, koordinat, fiyat. Panobu veri motoru skor üretir.",
        icon: ClipboardList,
    },
    {
        step: "03",
        title: "Vitrininiz yayında",
        desc: "Kendi storefront sayfanız aktif. Markalar haritadan ve şehir filtresinden size ulaşır.",
        icon: Globe,
    },
    {
        step: "04",
        title: "Siparişleri yönetin",
        desc: "Inquiry + teklif + sipariş + fatura — hepsi tek ekranda. Haftalık rapor e-postayla gelir.",
        icon: TrendingUp,
    },
];

export default function MedyaSahipleriIcinPage() {
    return (
        <PublicLayout activeLink="medya-sahipleri">
            {/* HERO */}
            <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
                <div className="absolute -top-20 -right-32 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
                <div className="absolute -bottom-24 -left-32 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />

                <div className="container relative mx-auto px-4 py-20 sm:py-28">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-indigo-800 backdrop-blur-sm">
                            <Sparkles className="h-3.5 w-3.5" />
                            Medya Sahipleri · Pano Sahipleri · Ajanslar
                        </div>
                        <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                            Panolarınız için <br />
                            <span className="text-indigo-600">kendi vitriniz.</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
                            Panobu, pano sahiplerine komisyon yerine platform hizmeti sunar. Vitrin,
                            inquiry yönetimi, sipariş paneli, fatura, baskı kanıtı ve yakında mail/SMS
                            kampanya modülü — hepsi tek dashboard'da.
                        </p>

                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Link
                                href="/auth/register?role=owner"
                                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-700"
                            >
                                Medya Sahibi Başvurusu <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="https://calendly.com/erendoru/30dk"
                                target="_blank"
                                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                            >
                                15 dk tanışma görüşmesi
                            </Link>
                        </div>

                        <div className="mt-12 grid grid-cols-3 gap-3 text-left">
                            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 backdrop-blur-sm">
                                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-700">
                                    <Banknote className="h-3 w-3" /> Komisyon
                                </div>
                                <div className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                                    %0
                                </div>
                                <div className="text-[11px] text-slate-500">Ajans aracı yok</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 backdrop-blur-sm">
                                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-700">
                                    <Store className="h-3 w-3" /> Kendi vitriniz
                                </div>
                                <div className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                                    ✓
                                </div>
                                <div className="text-[11px] text-slate-500">Marka sayfası + SEO</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 backdrop-blur-sm">
                                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-700">
                                    <Bell className="h-3 w-3" /> Haftalık
                                </div>
                                <div className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                                    Rapor
                                </div>
                                <div className="text-[11px] text-slate-500">Performans e-postası</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PROBLEM-ÇÖZÜM */}
            <section className="py-20">
                <div className="container mx-auto max-w-5xl px-4">
                    <div className="grid gap-10 md:grid-cols-2">
                        <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-8">
                            <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800">
                                Eski dünya
                            </div>
                            <h3 className="mt-3 text-xl font-bold text-slate-900">
                                Ajansın 3-4 hafta sürecek telefon trafiği
                            </h3>
                            <ul className="mt-5 space-y-3 text-sm text-slate-700">
                                <li className="flex gap-2">
                                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose-400" />
                                    %15-25 komisyon ajansta kalır
                                </li>
                                <li className="flex gap-2">
                                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose-400" />
                                    Müşteri sizinle değil ajansla konuşur, ikinci siparişte de aynı
                                </li>
                                <li className="flex gap-2">
                                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose-400" />
                                    Panonuz ne kadar aranıyor, kim sepete ekledi — bilinmez
                                </li>
                                <li className="flex gap-2">
                                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose-400" />
                                    Fatura, baskı kanıtı, rezervasyon — e-posta arşivinde kaybolur
                                </li>
                            </ul>
                        </div>

                        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-8">
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                                Panobu'da
                            </div>
                            <h3 className="mt-3 text-xl font-bold text-slate-900">
                                Kendi vitriniz + kendi CRM'iniz
                            </h3>
                            <ul className="mt-5 space-y-3 text-sm text-slate-700">
                                <li className="flex gap-2">
                                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                                    Komisyon yerine düşük sabit ücret + işlem başına küçük komisyon
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                                    Markalar sizinle doğrudan iletişime geçer, ikinci siparişte de
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                                    Haftalık performans raporu: görüntülenme, sepete ekleme, rezervasyon
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                                    Sipariş, fatura, baskı kanıtı — tek ekranda, arşiv sizde
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ÖZELLİKLER */}
            <section className="border-y border-slate-200 bg-slate-50 py-20">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800">
                            <Sparkles className="h-3.5 w-3.5" /> Medya sahiplerine sunuyoruz
                        </div>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Panobu,{" "}
                            <span className="text-indigo-600">sadece listeleme değil</span> —
                            tam CRM
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
                            Her medya sahibi bir yazılım şirketi gibi çalışabilsin diye dashboardu
                            tasarladık.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {FEATURES.map((f) => (
                            <div
                                key={f.title}
                                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
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

            {/* NEDEN PANOBU? */}
            <section className="py-20">
                <div className="container mx-auto max-w-5xl px-4">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                            <TrendingUp className="h-3.5 w-3.5" /> Medya sahibi kazanımı
                        </div>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Ajans aracı yerine{" "}
                            <span className="text-indigo-600">platform ortağı</span>
                        </h2>
                    </div>

                    <div className="mt-10 grid gap-5 md:grid-cols-2">
                        {BENEFITS.map((b) => (
                            <div
                                key={b.title}
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <h3 className="text-base font-bold text-slate-900">{b.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                    {b.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* NASIL ÇALIŞIR? */}
            <section className="border-y border-slate-200 bg-slate-50 py-20">
                <div className="container mx-auto max-w-5xl px-4">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800">
                            <Zap className="h-3.5 w-3.5" /> Başvurudan satışa
                        </div>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            4 adımda vitrininiz açılır
                        </h2>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-4">
                        {STEPS.map((s) => (
                            <div
                                key={s.step}
                                className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <div className="absolute -top-3 right-4 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
                                    {s.step}
                                </div>
                                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                                    <s.icon className="h-5 w-5" />
                                </div>
                                <h3 className="mt-4 text-base font-bold text-slate-900">
                                    {s.title}
                                </h3>
                                <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* YAKINDA */}
            <section className="py-20">
                <div className="container mx-auto max-w-5xl px-4">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                            <Sparkles className="h-3.5 w-3.5" /> Yakında
                        </div>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Kampanyalar (Mail & SMS)
                        </h2>
                        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">
                            Müşterilerinize "yeni pano eklendi", "son dakika indirimi", "sezon açıldı"
                            gibi mesajlarla Panobu dashboard'undan e-posta ve SMS gönderin.
                            Beta erken erişim için waitlist açık.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-4 md:grid-cols-3">
                        {[
                            {
                                icon: Mail,
                                title: "E-posta kampanyaları",
                                desc: "Şablonlu, segmentli, ölçülebilir. Markalarınıza haftalık/aylık bülten.",
                            },
                            {
                                icon: MessageSquare,
                                title: "SMS duyuruları",
                                desc: "Kısa, net, dönüşümsel. Son dakika fırsat kampanyaları için birebir.",
                            },
                            {
                                icon: Users,
                                title: "Müşteri listeleri",
                                desc: "Geçmiş siparişlerden otomatik. Favori markalarınıza doğrudan erişim.",
                            },
                        ].map((x) => (
                            <div
                                key={x.title}
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                                        <x.icon className="h-4 w-4" />
                                    </div>
                                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                                        YAKINDA
                                    </span>
                                </div>
                                <h3 className="mt-4 text-base font-bold text-slate-900">
                                    {x.title}
                                </h3>
                                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                                    {x.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="border-t border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-24">
                <div className="container mx-auto max-w-4xl px-4 text-center">
                    <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                        Panolarınızı{" "}
                        <span className="text-indigo-600">kendi vitrininizde</span> satın.
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600">
                        Başvurunuzu 5 dakikada bitirin. 1-2 iş günü içinde dönüş + onboarding.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            href="/auth/register?role=owner"
                            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-700"
                        >
                            Medya Sahibi Kaydı <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="https://calendly.com/erendoru/30dk"
                            target="_blank"
                            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                        >
                            15 dk tanışma
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
                        headline:
                            "Medya Sahipleri İçin Panobu — Kendi Vitriniz, Kendi Müşteriniz",
                        description:
                            "Panobu pano sahipleri ve ajanslar için self-serve satış kanalı, vitrin ve CRM. Ajans komisyonu yok.",
                        author: { "@type": "Organization", name: "Panobu" },
                        publisher: {
                            "@type": "Organization",
                            name: "Panobu",
                            logo: {
                                "@type": "ImageObject",
                                url: "https://panobu.com/favicon.png",
                            },
                        },
                        mainEntityOfPage: "https://panobu.com/medya-sahipleri-icin",
                    }),
                }}
            />
        </PublicLayout>
    );
}
