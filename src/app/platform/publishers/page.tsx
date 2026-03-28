"use client";

import PublicLayout from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    TrendingUp, ShieldCheck, Clock, BarChart3, Users, Zap,
    CheckCircle2, ArrowRight, Building2, Monitor, Globe,
    Wallet, HeadphonesIcon, PieChart, CalendarCheck, Star
} from "lucide-react";

const STATS = [
    { value: "300+", label: "Aktif Reklam Ünitesi" },
    { value: "%95", label: "Ortalama Doluluk Oranı" },
    { value: "7/24", label: "Platform Erişimi" },
    { value: "48 saat", label: "Ortalama Ödeme Süresi" },
];

const ADVANTAGES = [
    {
        icon: TrendingUp,
        title: "Gelirlerinizi Katlayın",
        desc: "Boş kalan reklam ünitelerinizi Panobu ağı ile doldurun. Binlerce aktif reklam veren, panolarınızı keşfetsin. Doluluk oranınızı %90'ın üzerine çıkarın.",
        color: "emerald",
    },
    {
        icon: Clock,
        title: "Satış Operasyonundan Kurtulun",
        desc: "Müşteri bulma, teklif hazırlama, takip etme gibi süreçlerle uğraşmayın. Panobu tüm satış operasyonunu sizin adınıza yürütür, siz sadece kazanın.",
        color: "blue",
    },
    {
        icon: Wallet,
        title: "Düzenli & Güvenli Ödemeler",
        desc: "Her kiralama sonrası ödemeniz otomatik olarak hesabınıza yatar. Tahsilat riski yok, gecikme yok. Nakit akışınızı rahatlıkla planlayın.",
        color: "amber",
    },
    {
        icon: BarChart3,
        title: "Şeffaf Performans Takibi",
        desc: "Her ünitenizin doluluk oranını, kazancını ve performansını tek bir panelden takip edin. Hangi lokasyon ne kadar kazandırıyor, anlık görün.",
        color: "indigo",
    },
    {
        icon: ShieldCheck,
        title: "Sıfır Komisyon, Sıfır Sürpriz",
        desc: "Gizli ücret, komisyon veya kesinti yoktur. Belirlediğiniz fiyat üzerinden satış yapılır, kazancınız doğrudan sizindir.",
        color: "emerald",
    },
    {
        icon: Globe,
        title: "Türkiye Geneli Görünürlük",
        desc: "Panolarınız sadece yerel değil, tüm Türkiye'deki reklam verenlere açılır. İstanbul'daki bir marka, Kocaeli'deki panonuzu kolayca bulup kiralayabilir.",
        color: "blue",
    },
];

const STEPS = [
    {
        step: "1",
        title: "Ücretsiz Başvuru",
        desc: "Pano bilgilerinizi, lokasyonlarınızı ve fiyatlarınızı sisteme girin. Başvuru tamamen ücretsizdir ve 5 dakikada tamamlanır.",
        icon: Monitor,
    },
    {
        step: "2",
        title: "Hızlı Onay",
        desc: "Ekibimiz başvurunuzu 24 saat içinde inceler. Panolarınız platforma eklenir ve anında binlerce reklam verenin görebileceği hale gelir.",
        icon: CheckCircle2,
    },
    {
        step: "3",
        title: "Otomatik Eşleşme",
        desc: "Reklam verenler lokasyonunuza, bütçelerine ve hedef kitlelerine göre panolarınızı bulur. Sipariş geldiğinde anında bilgilendirilirsiniz.",
        icon: Users,
    },
    {
        step: "4",
        title: "Kazanmaya Başlayın",
        desc: "Her kiralama tamamlandığında ödemeniz otomatik hesabınıza aktarılır. Tüm süreç şeffaf, tüm detaylar panelinizde.",
        icon: Wallet,
    },
];

const TESTIMONIALS = [
    {
        quote: "Panobu ile tanışmadan önce panolarımızın %40'ı boş kalıyordu. Şimdi doluluk oranımız %95'in üzerinde. Satışla hiç uğraşmıyoruz.",
        name: "Medyapark Reklam",
        role: "Kocaeli · 45+ Ünite",
    },
    {
        quote: "Ödemelerin düzenli ve şeffaf olması bizi çok rahatlattı. Panel üzerinden her şeyi takip edebiliyoruz.",
        name: "Reklam Sahibi",
        role: "İstanbul · 12 Ünite",
    },
];

const FAQ = [
    { q: "Panobu'ya katılmak ücretsiz mi?", a: "Evet, tamamen ücretsizdir. Herhangi bir başvuru ücreti, komisyon veya gizli ücret yoktur." },
    { q: "Fiyatları ben mi belirliyorum?", a: "Evet, her ünitenizin haftalık/aylık fiyatını siz belirlersiniz. Panobu hiçbir fiyat değişikliği yapmaz." },
    { q: "Hangi tür üniteler kabul ediliyor?", a: "Billboard, raket pano, CLP, megalight, dijital ekran ve daha fazlası. Tüm açık hava reklam üniteleri platformumuza dahil edilebilir." },
    { q: "Ödemeler ne zaman yapılır?", a: "Her kiralama sonrası 48 saat içinde ödemeniz banka hesabınıza aktarılır." },
    { q: "Minimum ünite sayısı var mı?", a: "Hayır, tek bir üniteniz bile olsa platforma ekleyebilirsiniz." },
    { q: "Panolarımın doluluk oranını nasıl takip ederim?", a: "Partner panelinizden tüm ünitelerinizin doluluk, gelir ve performans verilerini anlık olarak görebilirsiniz." },
];

export default function ForPublishersPage() {
    return (
        <PublicLayout>
            {/* Hero */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-600/10 rounded-full blur-[150px] -z-10" />

                <div className="container mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6">
                            Reklam Ünitesi Sahipleri İçin
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            Panolarınızı <br className="hidden md:block" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                                Gelire Dönüştürün
                            </span>
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
                            Boş kalan reklam ünitelerinizi Panobu ağına ekleyin, Türkiye&apos;nin dört bir yanındaki reklam verenlerle buluşun.
                            Satış operasyonu yok, komisyon yok — sadece kazanç.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild size="lg" className="h-14 px-8 text-lg bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-all hover:scale-105">
                                <Link href="https://calendly.com/erendoru/30dk" target="_blank">
                                    Ücretsiz Başvur <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" className="h-14 px-8 text-lg border border-white/20 bg-transparent text-white hover:bg-white/10 rounded-full">
                                <Link href="#nasil-calisir">
                                    Nasıl Çalışır?
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 border-y border-white/5 bg-[#0f1829]">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {STATS.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{s.value}</div>
                                <div className="text-sm text-slate-500">{s.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Advantages */}
            <section className="py-24 bg-[#0B1120]">
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-4">Avantajlar</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Neden Panobu Partner Olmalısınız?</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            Reklam ünitelerinizin potansiyelini tam kapasiteye çıkarın.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {ADVANTAGES.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="bg-[#111827] border border-white/5 rounded-2xl p-7 hover:border-white/10 transition-all group"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                                    item.color === "emerald" ? "bg-emerald-500/15" : item.color === "blue" ? "bg-blue-500/15" : item.color === "amber" ? "bg-amber-500/15" : "bg-indigo-500/15"
                                }`}>
                                    <item.icon className={`w-6 h-6 ${
                                        item.color === "emerald" ? "text-emerald-400" : item.color === "blue" ? "text-blue-400" : item.color === "amber" ? "text-amber-400" : "text-indigo-400"
                                    }`} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="nasil-calisir" className="py-24 bg-[#0f1829] relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4">Süreç</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">4 Adımda Kazanmaya Başlayın</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            Başvurudan ilk ödemeye kadar her şey hızlı ve basit.
                        </p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-6">
                            {STEPS.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="relative bg-[#111827] border border-white/5 rounded-2xl p-7 hover:border-emerald-500/20 transition-all"
                                >
                                    <div className="flex items-start gap-5">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                            <span className="text-lg font-bold text-emerald-400">{item.step}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison */}
            <section className="py-24 bg-[#0B1120]">
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Panobu vs Geleneksel Yöntem</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            Neden yüzlerce pano sahibi Panobu&apos;yu tercih ediyor?
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
                        <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
                            <div className="grid grid-cols-3 bg-white/[0.03] border-b border-white/5">
                                <div className="p-4 text-sm font-medium text-slate-500"></div>
                                <div className="p-4 text-center text-sm font-bold text-red-400 border-x border-white/5">Geleneksel</div>
                                <div className="p-4 text-center text-sm font-bold text-emerald-400">Panobu</div>
                            </div>
                            {[
                                { label: "Müşteri Bulma", old: "Kendiniz ararsınız", new: "Otomatik eşleşme" },
                                { label: "Komisyon", old: "%10-30 ajans payı", new: "Sıfır komisyon" },
                                { label: "Ödeme Süresi", old: "30-90 gün", new: "48 saat" },
                                { label: "Fiyat Kontrolü", old: "Ajans belirler", new: "Siz belirlersiniz" },
                                { label: "Raporlama", old: "Excel ile takip", new: "Anlık dijital panel" },
                                { label: "Görünürlük", old: "Yerel ağ", new: "Tüm Türkiye" },
                                { label: "Destek", old: "Sınırlı", new: "7/24 partner desteği" },
                            ].map((row, i) => (
                                <div key={i} className={`grid grid-cols-3 ${i % 2 === 0 ? "bg-white/[0.01]" : ""} border-b border-white/5 last:border-b-0`}>
                                    <div className="p-4 text-sm font-medium text-slate-300">{row.label}</div>
                                    <div className="p-4 text-center text-sm text-slate-500 border-x border-white/5">{row.old}</div>
                                    <div className="p-4 text-center text-sm text-emerald-400 font-medium">{row.new}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-[#0f1829] relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Partnerlerimiz Ne Diyor?</h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {TESTIMONIALS.map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-[#111827] border border-white/5 rounded-2xl p-7"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    ))}
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed mb-5 italic">&ldquo;{t.quote}&rdquo;</p>
                                <div>
                                    <div className="text-white font-semibold text-sm">{t.name}</div>
                                    <div className="text-slate-500 text-xs">{t.role}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Accepted Panel Types */}
            <section className="py-24 bg-[#0B1120]">
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Hangi Üniteler Kabul Ediliyor?</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            Tüm açık hava reklam formatları platformumuza dahil edilebilir.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
                        {[
                            { name: "Billboard", icon: "🖼️" },
                            { name: "Raket Pano", icon: "🏷️" },
                            { name: "CLP", icon: "📋" },
                            { name: "Megalight", icon: "💡" },
                            { name: "Dijital Ekran", icon: "📺" },
                            { name: "LED Duvar", icon: "🔲" },
                        ].map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-[#111827] border border-white/5 rounded-xl p-5 text-center hover:border-emerald-500/20 transition-all"
                            >
                                <div className="text-3xl mb-2">{t.icon}</div>
                                <div className="text-sm font-medium text-white">{t.name}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 bg-[#0f1829] relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Sıkça Sorulan Sorular</h2>
                    </motion.div>

                    <div className="max-w-3xl mx-auto space-y-4">
                        {FAQ.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-[#111827] border border-white/5 rounded-xl p-6"
                            >
                                <h3 className="text-white font-semibold mb-2">{item.q}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{item.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-[#0B1120] relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto text-center bg-gradient-to-br from-emerald-600/20 to-teal-600/10 border border-emerald-500/20 rounded-3xl p-10 md:p-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Hemen Başlayın</h2>
                        <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                            Ücretsiz başvurunuzu yapın, panolarınızı platformumuza ekleyin ve kazanmaya başlayın.
                            Tek bir üniteniz bile olsa, Panobu ailesine katılabilirsiniz.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild size="lg" className="h-14 px-10 text-lg bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-all hover:scale-105">
                                <Link href="https://calendly.com/erendoru/30dk" target="_blank">
                                    Ücretsiz Başvur <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" className="h-14 px-10 text-lg border border-white/20 bg-transparent text-white hover:bg-white/10 rounded-full">
                                <Link href="/faq">
                                    Daha Fazla Bilgi
                                </Link>
                            </Button>
                        </div>
                        <p className="text-xs text-slate-500 mt-6">
                            Ücretsiz · Komisyon yok · 5 dakikada başvuru
                        </p>
                    </motion.div>
                </div>
            </section>
        </PublicLayout>
    );
}
