import Link from "next/link";
import Image from "next/image";
import {
    ArrowRight,
    MapPin,
    Building2,
    Target,
    ShieldCheck,
    Sparkles,
    Layers,
    Clock,
} from "lucide-react";
import { loadStoreOwner, loadStorePanels } from "@/lib/store/loader";
import { notFound } from "next/navigation";
import { PANEL_TYPE_LABELS } from "@/lib/turkey-data";
import { formatCurrency, weeklyEquivalent } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function StoreHomePage(
    { params }: { params: { slug: string } }
) {
    const owner = await loadStoreOwner(params.slug);
    if (!owner) notFound();

    const panels = await loadStorePanels(owner.id);
    const base = `/medya/${owner.slug}`;

    const cityCount = new Set(panels.map((p) => p.city)).size;
    const typeCount = new Set(panels.map((p) => p.type)).size;
    const weeklyPrices = panels
        .map((p) => weeklyEquivalent(p))
        .filter((v): v is number => typeof v === "number" && v > 0);
    const minPrice = weeklyPrices.length ? Math.min(...weeklyPrices) : 0;

    // Tür bazlı dağılım (ilk 4)
    const typeBreakdown = Object.entries(
        panels.reduce<Record<string, number>>((acc, p) => {
            acc[p.type] = (acc[p.type] ?? 0) + 1;
            return acc;
        }, {})
    )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4);

    const featurePanels = panels.slice(0, 6);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: owner.companyName,
        url: `https://panobu.com/medya/${owner.slug}`,
        logo: owner.logoUrl ?? undefined,
        image: owner.coverUrl || owner.logoUrl || undefined,
        description:
            owner.description ||
            `${owner.companyName} — ${panels.length} aktif billboard ve açık hava reklam ünitesi.`,
        email: owner.contactEmail ?? undefined,
        telephone: owner.phone ?? undefined,
        address: owner.cities.length > 0
            ? {
                "@type": "PostalAddress",
                addressLocality: owner.cities.join(", "),
                addressCountry: "TR",
            }
            : undefined,
        areaServed: owner.cities.length > 0 ? owner.cities : undefined,
        priceRange: minPrice > 0 ? `${formatCurrency(minPrice)}+ /haftalık` : undefined,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50" />
                    <div className="absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full bg-blue-100/40 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-[420px] h-[420px] rounded-full bg-emerald-100/40 blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20 grid md:grid-cols-[1.1fr_1fr] items-center gap-10">
                    <div>
                        <div className="flex items-center gap-2 mb-5">
                            {owner.logoUrl ? (
                                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden flex items-center justify-center">
                                    <Image
                                        src={owner.logoUrl}
                                        alt={owner.companyName}
                                        width={56}
                                        height={56}
                                        className="object-contain w-full h-full p-1.5"
                                    />
                                </div>
                            ) : (
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                                    <Building2 className="w-7 h-7 text-slate-400" />
                                </div>
                            )}
                            {owner.approved && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Onaylı Medya Sahibi
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                            {owner.companyName}
                        </h1>
                        <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-xl">
                            {owner.description ||
                                `${panels.length} aktif billboard ve açık hava reklam ünitesiyle markanızı doğru lokasyonlarda, doğru kitleye ulaştırıyoruz.`}
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3">
                            <Link
                                href={`${base}/panolar`}
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 shadow-sm"
                            >
                                Panoları Görüntüle
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href={`${base}/teklif`}
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 border border-slate-200 font-medium hover:bg-slate-50"
                            >
                                Teklif Al
                            </Link>
                            <Link
                                href={`${base}/iletisim`}
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-slate-700 hover:bg-slate-100 font-medium"
                            >
                                İletişime Geç
                            </Link>
                        </div>
                    </div>

                    {/* Hero preview card */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-white rounded-3xl -rotate-2" />
                        <div className="relative bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)]">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <Stat label="Aktif Ünite" value={panels.length.toString()} icon={Layers} />
                                <Stat label="Şehir" value={cityCount.toString()} icon={MapPin} />
                                <Stat label="Ünite Tipi" value={typeCount.toString()} icon={Target} />
                                <Stat
                                    label="Başlangıç"
                                    value={
                                        minPrice > 0
                                            ? formatCurrency(minPrice) + "/hf"
                                            : "—"
                                    }
                                    icon={Sparkles}
                                />
                            </div>

                            {typeBreakdown.length > 0 && (
                                <div className="space-y-2">
                                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                        Ünite Dağılımı
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {typeBreakdown.map(([type, count]) => (
                                            <span
                                                key={type}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700"
                                            >
                                                {PANEL_TYPE_LABELS[type] ?? type}
                                                <span className="text-slate-400">·</span>
                                                <span className="text-slate-900">{count}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature list */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14 grid md:grid-cols-3 gap-5">
                <FeatureCard
                    icon={MapPin}
                    title="Doğru Lokasyon"
                    desc="Yüksek yaya ve araç trafiğine sahip noktalarda konumlanmış panolar."
                />
                <FeatureCard
                    icon={Clock}
                    title="Hızlı Rezervasyon"
                    desc="Müsait dönemleri anında görüntüleyin, dilediğiniz periyotta teklif isteyin."
                />
                <FeatureCard
                    icon={ShieldCheck}
                    title="Güvenli Süreç"
                    desc="Tüm kiralama akışı Panobu altyapısı üzerinden şeffaf ve güvenle yürütülür."
                />
            </section>

            {/* Featured panels */}
            {featurePanels.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 md:px-6 pb-14">
                    <div className="flex items-end justify-between mb-5">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Öne Çıkan Üniteler</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Tüm üniteleri harita üzerinden keşfedin ve teklif için seçin.
                            </p>
                        </div>
                        <Link
                            href={`${base}/panolar`}
                            className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900"
                        >
                            Tüm panolar <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {featurePanels.map((p) => (
                            <Link
                                key={p.id}
                                href={`${base}/panolar?panel=${p.id}`}
                                className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md hover:border-slate-300 transition"
                            >
                                <div className="relative aspect-[16/10] bg-slate-100">
                                    {p.imageUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={p.imageUrl}
                                            alt={p.name}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-sm">
                                            Görsel yok
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/95 text-slate-700 border border-slate-200">
                                        {PANEL_TYPE_LABELS[p.type] ?? p.type}
                                    </div>
                                    {p.isAVM && (
                                        <div className="absolute top-2 right-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-pink-600/90 text-white">
                                            AVM
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="font-semibold text-slate-900 text-sm line-clamp-1">{p.name}</div>
                                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {p.district}, {p.city}
                                    </div>
                                    <div className="pt-3 flex items-end justify-between">
                                        <div>
                                            <div className="text-[11px] text-slate-400">
                                                {p.isStartingPrice ? "başlayan fiyat" : "haftalık"}
                                            </div>
                                            {(() => {
                                                const w = weeklyEquivalent(p);
                                                return w ? (
                                                    <div className="text-base font-bold text-slate-900">
                                                        {formatCurrency(w)}
                                                        <span className="text-xs text-slate-500 font-normal ml-1">/hf</span>
                                                    </div>
                                                ) : (
                                                    <div className="text-xs font-semibold text-slate-700">
                                                        Fiyat için iletişime geçin
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                        <span className="text-slate-700 text-xs font-medium inline-flex items-center gap-1 opacity-80 group-hover:opacity-100">
                                            Detay <ArrowRight className="w-3.5 h-3.5" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="md:hidden mt-5">
                        <Link
                            href={`${base}/panolar`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-slate-700"
                        >
                            Tüm panolar <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </section>
            )}
        </>
    );
}

function Stat({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
}) {
    return (
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
            <Icon className="w-4 h-4 text-slate-400 mb-2" />
            <div className="text-2xl font-bold text-slate-900 leading-tight">{value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
        </div>
    );
}

function FeatureCard({
    icon: Icon,
    title,
    desc,
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    desc: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-3">
                <Icon className="w-5 h-5" />
            </div>
            <div className="font-semibold text-slate-900 mb-1">{title}</div>
            <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
        </div>
    );
}
