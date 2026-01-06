import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, ArrowRight, Target, Wallet, MapPin, Users, TrendingUp, LightbulbIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/PublicLayout";

export const metadata: Metadata = {
    title: "KOBİ'ler İçin Billboard Reklam Stratejileri",
    description: "Küçük ve orta ölçekli işletmeler için etkili billboard reklam stratejileri. Sınırlı bütçeyle maksimum etki nasıl sağlanır?",
    keywords: ["kobi reklam", "küçük işletme billboard", "uygun fiyatlı billboard", "yerel reklam stratejisi"],
    openGraph: {
        title: "KOBİ'ler İçin Billboard Stratejileri | Panobu",
        description: "Küçük işletmeler için etkili billboard reklam stratejileri.",
    },
    alternates: {
        canonical: "https://panobu.com/blog/kobiler-icin-billboard-stratejileri",
    },
};

export default function KobiStratejileriPage() {
    return (
        <PublicLayout>
            {/* Hero */}
            <section className="py-16 bg-gradient-to-b from-blue-900/20 to-transparent">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <Link href="/blog" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6">
                            <ArrowLeft className="w-4 h-4" /> Blog'a Dön
                        </Link>
                        <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full">Strateji</span>
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> 06 Ocak 2026</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 6 dk okuma</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-6">
                            KOBİ'ler İçin Billboard Reklam Stratejileri
                        </h1>
                        <p className="text-xl text-slate-400">
                            Sınırlı bütçeyle maksimum etki: Küçük işletmelerin açık hava reklamdan nasıl faydalanabileceği.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 bg-white text-slate-900">
                <div className="container mx-auto px-4">
                    <article className="max-w-3xl mx-auto prose prose-lg prose-slate prose-headings:font-bold prose-headings:text-slate-900 prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:mb-5 prose-p:leading-relaxed prose-ul:my-5 prose-ol:my-5 prose-li:mb-2">

                        <h2>Billboard Reklamı Sadece Büyük Markalar İçin mi?</h2>
                        <p>
                            Hayır! Aksine, küçük ve orta ölçekli işletmeler için billboard reklamı, büyük markaların
                            dijitalde sahip olduğu bütçe avantajını dengeleyebilecek güçlü bir araçtır. Doğru stratejiyle,
                            sınırlı bütçeyle bile etkileyici sonuçlar elde edebilirsiniz.
                        </p>

                        <h2>5 Temel KOBİ Billboard Stratejisi</h2>

                        {/* Strategy Cards */}
                        <div className="not-prose my-8 space-y-6">
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-blue-900 mb-2">1. Hiper-Yerel Hedefleme</h3>
                                        <p className="text-slate-700">
                                            Şehir genelinde reklam vermek yerine, müşterilerinizin yoğun olduğu 1-2
                                            lokasyona odaklanın. Dükkanınızın 2 km çevresindeki panolar, city-wide
                                            kampanyadan çok daha etkili olacaktır.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Wallet className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-green-900 mb-2">2. CLP Panoları Tercih Edin</h3>
                                        <p className="text-slate-700">
                                            Büyük billboard'lar yerine CLP (City Light Poster) panolar, haftalık ₺1.500-3.000
                                            gibi uygun fiyatlarla başlangıç için ideal. Yaya trafiğinin yoğun olduğu
                                            duraklar ve kaldırımlar, yerel işletmeler için mükemmel.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Calendar className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-purple-900 mb-2">3. Stratejik Zamanlama</h3>
                                        <p className="text-slate-700">
                                            Tüm yıl reklam vermek yerine, sezonunuzun en yoğun dönemlerine odaklanın.
                                            Restoran için bayram öncesi, okul malzemecisi için Eylül, hediye dükkanı için Aralık.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Target className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-orange-900 mb-2">4. Tek Bir Net Mesaj</h3>
                                        <p className="text-slate-700">
                                            Billboard'da sadece 3-5 saniye dikkat çekebilirsiniz. Telefon numarası,
                                            adres, slogan, logo hepsini koymaya çalışmayın. Tek bir güçlü mesaj ve
                                            arama eylemi (call-to-action) yeterli.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-6 border border-pink-200">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-pink-900 mb-2">5. Rakip Lokasyonları Hedefleyin</h3>
                                        <p className="text-slate-700">
                                            Rakibinizin dükkanına giden yol üzerinde pano kiralamak, onların müşterilerini
                                            size çekebilir. Agresif ama etkili bir strateji!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h2>Bütçe Planlaması: Örnek Senaryo</h2>
                        <p>
                            Aylık ₺10.000 pazarlama bütçeniz varsa, nasıl dağıtmalısınız?
                        </p>

                        <div className="overflow-x-auto not-prose my-6">
                            <table className="w-full border-collapse border border-slate-300 rounded-lg overflow-hidden">
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="border border-slate-300 px-4 py-3 text-left">Kalem</th>
                                        <th className="border border-slate-300 px-4 py-3 text-left">Bütçe</th>
                                        <th className="border border-slate-300 px-4 py-3 text-left">Açıklama</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-slate-300 px-4 py-3 font-medium">CLP Pano (2 adet)</td>
                                        <td className="border border-slate-300 px-4 py-3">₺4.000</td>
                                        <td className="border border-slate-300 px-4 py-3">Dükkan yakını</td>
                                    </tr>
                                    <tr className="bg-slate-50">
                                        <td className="border border-slate-300 px-4 py-3 font-medium">Tasarım</td>
                                        <td className="border border-slate-300 px-4 py-3">₺1.000</td>
                                        <td className="border border-slate-300 px-4 py-3">Profesyonel görsel</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-slate-300 px-4 py-3 font-medium">Dijital Destek</td>
                                        <td className="border border-slate-300 px-4 py-3">₺3.000</td>
                                        <td className="border border-slate-300 px-4 py-3">Google/Facebook</td>
                                    </tr>
                                    <tr className="bg-slate-50">
                                        <td className="border border-slate-300 px-4 py-3 font-medium">Rezerv</td>
                                        <td className="border border-slate-300 px-4 py-3">₺2.000</td>
                                        <td className="border border-slate-300 px-4 py-3">Ani fırsatlar</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h2>Başarı Ölçümü</h2>
                        <p>
                            Billboard'un ROI'sini ölçmek zor olabilir, ama imkansız değil:
                        </p>
                        <ul>
                            <li><strong>Özel telefon numarası:</strong> Sadece billboard'da kullanılan numara</li>
                            <li><strong>Promosyon kodu:</strong> "PANO10" gibi indirim kodu</li>
                            <li><strong>Google aramaları:</strong> Marka adı aramalarındaki artış</li>
                            <li><strong>Müşteri anketi:</strong> "Bizi nereden duydunuz?"</li>
                        </ul>

                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 my-8 not-prose">
                            <div className="flex items-center gap-2 mb-4">
                                <LightbulbIcon className="w-6 h-6 text-yellow-500" />
                                <h3 className="text-xl font-bold text-blue-900">Panobu ile KOBİ Avantajları</h3>
                            </div>
                            <ul className="space-y-2 text-slate-700 mb-4">
                                <li>✓ Haftalık ₺1.500'den başlayan fiyatlar</li>
                                <li>✓ Minimum 7 gün kiralama (uzun taahhüt yok)</li>
                                <li>✓ Şeffaf fiyatlandırma (gizli maliyet yok)</li>
                                <li>✓ Online rezervasyon (aracı yok)</li>
                            </ul>
                            <Button asChild className="bg-blue-600 hover:bg-blue-700">
                                <Link href="/static-billboards">
                                    Uygun Fiyatlı Panoları Görüntüle <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>

                    </article>
                </div>
            </section>

            {/* Article Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": "KOBİ'ler İçin Billboard Reklam Stratejileri",
                        "description": "Küçük ve orta ölçekli işletmeler için etkili billboard stratejileri.",
                        "author": { "@type": "Organization", "name": "Panobu" },
                        "publisher": { "@type": "Organization", "name": "Panobu" },
                        "datePublished": "2026-01-06",
                        "dateModified": "2026-01-06"
                    })
                }}
            />
        </PublicLayout>
    );
}
