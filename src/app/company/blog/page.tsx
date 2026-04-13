"use client";

import ContentPageLayout from "@/components/site/ContentPageLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";

const blogPosts = [
    {
        id: 5,
        slug: "billboard-reklam-fiyatlari-2026-rehberi",
        title: "Billboard Reklam Fiyatları 2026 Rehberi",
        excerpt: "Türkiye'de billboard kiralama fiyatları ne kadar? Şehir, lokasyon ve pano türüne göre 2026 yılı güncel fiyat rehberi. Bütçenizi en verimli şekilde kullanın.",
        category: "Fiyat Rehberi",
        author: "Panobu Ekibi",
        date: "06 Ocak 2026",
        readTime: "8 dk",
        image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: 6,
        slug: "kocaelide-reklam-vermek-lokasyon-rehberi",
        title: "Kocaeli'de Reklam Vermek: Lokasyon Rehberi",
        excerpt: "Kocaeli'nin en etkili reklam lokasyonları ve gizli yüksek trafik noktaları. Panobu ile özel stratejiler ve aynı fiyata premium lokasyonlar.",
        category: "Strateji",
        author: "Panobu Ekibi",
        date: "06 Ocak 2026",
        readTime: "6 dk",
        image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: 1,
        title: "2025'te Açık Hava Reklamcılığı Nereye Gidiyor?",
        excerpt: "Programatik DOOH (pDOOH), veri odaklı hedefleme ve dinamik içerik yönetimi ile açık hava reklamcılığının kurallarını yeniden yazıyor. İşte 2025 trendleri.",
        category: "Trendler",
        author: "Eren Doru",
        date: "15 Ekim 2024",
        readTime: "5 dk",
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
        id: 2,
        title: "Yerel Bir İşletme Panobu ile Satışlarını Nasıl %40 Artırdı?",
        excerpt: "Kocaeli'deki bir restoran zincirinin, sadece öğle saatlerinde ve trafiğin yoğun olduğu noktalarda reklam vererek yakaladığı başarı öyküsü.",
        category: "Başarı Hikayesi",
        author: "Zeynep Yılmaz",
        date: "22 Ekim 2024",
        readTime: "3 dk",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
        id: 3,
        title: "Programatik Reklamcılık Nedir? Yeni Başlayanlar İçin Rehber",
        excerpt: "Geleneksel medya satın almanın sonu mu? Programatik teknolojilerin nasıl çalıştığını ve reklam bütçenizi nasıl optimize ettiğini öğrenin.",
        category: "Eğitim",
        author: "Teknoloji Ekibi",
        date: "01 Kasım 2024",
        readTime: "7 dk",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
        id: 4,
        title: "Görsel Tasarımda Dikkat Edilmesi Gereken 5 Altın Kural",
        excerpt: "Billboard reklamlarında saniyeler içinde dikkat çekmek için tasarım prensipleri. Renk kullanımı, tipografi ve mesaj hiyerarşisi.",
        category: "Tasarım",
        author: "Creative Studio",
        date: "05 Kasım 2024",
        readTime: "4 dk",
        image: "https://images.unsplash.com/photo-1626785774573-4b799312c95d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
];

export default function BlogPage() {
    return (
        <ContentPageLayout
            title="Blog & İçgörüler"
            subtitle="Sektörden haberler, ipuçları ve başarı hikayeleri."
        >
            <div className="grid md:grid-cols-2 gap-8 mb-16">
                {blogPosts.map((post, i) => (
                    <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="group flex flex-col bg-white border border-neutral-200 rounded-3xl overflow-hidden hover:border-neutral-300 transition-all shadow-sm hover:shadow-md"
                    >
                        {/* Image */}
                        <div className="relative h-64 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/20 via-transparent to-transparent z-10" />
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute top-4 left-4 z-20">
                                <Badge variant="secondary" className="bg-neutral-900 text-white border-none hover:bg-neutral-800">
                                    {post.category}
                                </Badge>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-8 flex flex-col">
                            <div className="flex items-center gap-4 text-xs text-neutral-500 mb-4">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {post.date}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {post.readTime}
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-neutral-900 mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
                                <Link href="#">{post.title}</Link>
                            </h2>
                            <p className="text-neutral-600 mb-6 line-clamp-3 leading-relaxed">
                                {post.excerpt}
                            </p>

                            <div className="mt-auto pt-6 border-t border-neutral-200 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                                        <User className="w-4 h-4 text-neutral-500" />
                                    </div>
                                    <span className="text-sm text-neutral-700 font-medium">{post.author}</span>
                                </div>
                                <Button variant="ghost" className="text-blue-700 hover:text-blue-800 hover:bg-neutral-100 group-hover:translate-x-1 transition-all">
                                    Devamını Oku <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>

            {/* Newsletter Subscription */}
            <div className="rounded-3xl bg-neutral-100 border border-neutral-200 p-12 text-center relative overflow-hidden">
                <div className="relative z-10 max-w-2xl mx-auto">
                    <h3 className="text-3xl font-bold text-neutral-900 mb-4">Bültenimize Abone Olun</h3>
                    <p className="text-neutral-600 mb-8">
                        Dijital reklamcılık trendleri ve Panobu&apos;dan en son haberler gelen kutunuza gelsin.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="E-posta adresiniz"
                            className="flex-1 h-12 px-6 rounded-full bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 transition-colors"
                        />
                        <Button className="h-12 px-8 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 font-bold">
                            Kayıt Ol
                        </Button>
                    </form>
                </div>
            </div>
        </ContentPageLayout>
    );
}
