"use client";

import ContentPageLayout from "@/components/site/ContentPageLayout";
import { motion } from "framer-motion";
import { Target, Users, Zap, Globe, Award, Rocket } from "lucide-react";

export default function AboutPage() {
    const stats = [
        { label: "Aktif Pano", value: "15+" },
        { label: "Şehir", value: "1" },
        { label: "Partner", value: "10+" },
        { label: "Mutlu Müşteri", value: "50+" },
    ];

    const values = [
        {
            icon: Target,
            title: "Hedef Odaklılık",
            desc: "Reklam verenlerin doğru kitleye, doğru zamanda ve en uygun bütçeyle ulaşmasını sağlıyoruz."
        },
        {
            icon: Zap,
            title: "Hız ve Teknoloji",
            desc: "Geleneksel, yavaş süreçleri teknolojiyle hızlandırıyor; anında kiralama ve yayınlama imkanı sunuyoruz."
        },
        {
            icon: Users,
            title: "Şeffaflık",
            desc: "Gizli maliyetler, karmaşık sözleşmeler yok. Her şey platform üzerinde açık, net ve güvenilir."
        }
    ];

    return (
        <ContentPageLayout
            title="Hakkımızda"
            subtitle="Açık hava reklamcılığını teknolojiyle yeniden tanımlıyoruz."
        >
            {/* Mission Section */}
            <div className="prose prose-invert max-w-none mb-16">
                <p className="text-xl text-slate-300 leading-relaxed font-light">
                    Panobu, 2024 yılında kurulan ve Türkiye'nin ilk programatik dijital açık hava reklamcılığı (DOOH) platformu olma vizyonuyla yola çıkan bir teknoloji girişimidir.
                    Kocaeli'de başlayan yolculuğumuz, reklamcılık sektöründeki "erişilebilirlik" sorununu çözmeyi hedeflemektedir.
                </p>
                <p className="text-slate-400">
                    Geleneksel medyanın gücünü dijitalin hızı ve ölçülebilirliği ile birleştiriyoruz. Sadece büyük markaların değil, yerel işletmelerin de
                    şehrin en değerli noktalarında var olabilmesini sağlıyoruz.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-16">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center"
                    >
                        <div className="text-3xl font-bold text-blue-400 mb-1">{stat.value}</div>
                        <div className="text-sm text-slate-400">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Values Section */}
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Award className="w-6 h-6 text-yellow-500" /> Değerlerimiz
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-16">
                {values.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/5 hover:border-blue-500/30 transition-colors"
                    >
                        <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                            <item.icon className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {item.desc}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Vision Quote */}
            <div className="relative p-8 rounded-2xl bg-blue-900/20 border border-blue-500/20 my-12">
                <Rocket className="absolute top-6 left-6 w-8 h-8 text-blue-500/20" />
                <blockquote className="relative z-10 text-center">
                    <p className="text-2xl font-medium text-blue-100 italic mb-4">
                        "Amacımız, dünyanın her yerindeki dijital ekranları tek bir platform üzerinden yönetilebilir ve erişilebilir kılarak, global bir reklam ağı oluşturmak."
                    </p>
                    <footer className="text-sm text-blue-300 font-bold uppercase tracking-wider">
                        — Panobu Vizyonu
                    </footer>
                </blockquote>
            </div>

        </ContentPageLayout>
    );
}
