import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, ArrowRight, CheckCircle, XCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/PublicLayout";

export const metadata: Metadata = {
    title: "Açık Hava vs Dijital Reklam: Hangisi Daha Etkili?",
    description: "Billboard ve dijital reklam karşılaştırması. Hangisi markanız için daha uygun? Avantajlar, dezavantajlar ve maliyet analizi.",
    keywords: ["açık hava reklam", "dijital reklam", "billboard vs dijital", "outdoor reklam avantajları"],
    openGraph: {
        title: "Açık Hava vs Dijital Reklam | Panobu",
        description: "Billboard ve dijital reklam karşılaştırması. Hangisi daha etkili?",
    },
    alternates: {
        canonical: "https://panobu.com/blog/acik-hava-vs-dijital-reklam",
    },
};

export default function AcikHavaVsDijitalPage() {
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
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">Karşılaştırma</span>
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> 06 Ocak 2026</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 7 dk okuma</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-6">
                            Açık Hava vs Dijital Reklam: Hangisi Daha Etkili?
                        </h1>
                        <p className="text-xl text-slate-400">
                            İki reklam kanalının avantajları, dezavantajları ve hangi durumlarda hangisinin daha etkili olduğu.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <article className="max-w-3xl mx-auto prose prose-lg prose-slate prose-headings:font-bold prose-headings:text-white prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:mb-5 prose-p:leading-relaxed prose-ul:my-5 prose-ol:my-5 prose-li:mb-2">

                        <h2>Reklam Dünyasında İki Dev: Açık Hava ve Dijital</h2>
                        <p>
                            Pazarlama bütçenizi nasıl değerlendireceğinize karar verirken, açık hava (billboard, CLP, raket pano) ve
                            dijital reklam (Google Ads, Facebook, Instagram) arasında seçim yapmak zorlaşabilir. Her iki kanalın
                            kendine özgü güçlü ve zayıf yönleri vardır.
                        </p>

                        <h2>Açık Hava Reklamın Avantajları</h2>

                        <div className="not-prose my-6 space-y-3">
                            {[
                                "Engellenemez - AdBlock yok, skip butonu yok",
                                "7/24 görünürlük - Sürekli gösterim",
                                "Yerel hedefleme - Belirli bölgeye odaklanma",
                                "Güvenilirlik - Fiziksel varlık marka güveni artırır",
                                "Marka bilinirliği - Görsel etki uzun süre hafızada kalır",
                                "Rekabet avantajı - Dijitalde kaybolmayan mesaj"
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-300">{item}</span>
                                </div>
                            ))}
                        </div>

                        <h2>Dijital Reklamın Avantajları</h2>

                        <div className="not-prose my-6 space-y-3">
                            {[
                                "Hassas hedefleme - Yaş, ilgi alanı, davranış",
                                "Ölçülebilirlik - Tıklama, dönüşüm takibi",
                                "Esneklik - Anında değişiklik yapabilme",
                                "A/B testi - Farklı versiyonları test etme",
                                "Düşük başlangıç maliyeti - Küçük bütçelerle başlama"
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                    <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-300">{item}</span>
                                </div>
                            ))}
                        </div>

                        <h2>Karşılaştırma Tablosu</h2>

                        <div className="overflow-x-auto not-prose my-6">
                            <table className="w-full border-collapse border border-slate-300 rounded-lg overflow-hidden">
                                <thead className="bg-white/[0.06]">
                                    <tr>
                                        <th className="border border-slate-300 px-4 py-3 text-left">Özellik</th>
                                        <th className="border border-slate-300 px-4 py-3 text-left">Açık Hava</th>
                                        <th className="border border-slate-300 px-4 py-3 text-left">Dijital</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-slate-300 px-4 py-3 font-medium">Görünürlük</td>
                                        <td className="border border-slate-300 px-4 py-3 text-green-700">✓ Engellenemez</td>
                                        <td className="border border-slate-300 px-4 py-3 text-orange-700">△ AdBlock riski</td>
                                    </tr>
                                    <tr className="bg-white/[0.03]">
                                        <td className="border border-slate-300 px-4 py-3 font-medium">Hedefleme</td>
                                        <td className="border border-slate-300 px-4 py-3 text-orange-700">△ Lokasyon bazlı</td>
                                        <td className="border border-slate-300 px-4 py-3 text-green-700">✓ Hassas hedefleme</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-slate-300 px-4 py-3 font-medium">Ölçüm</td>
                                        <td className="border border-slate-300 px-4 py-3 text-orange-700">△ Tahmini</td>
                                        <td className="border border-slate-300 px-4 py-3 text-green-700">✓ Detaylı analitik</td>
                                    </tr>
                                    <tr className="bg-white/[0.03]">
                                        <td className="border border-slate-300 px-4 py-3 font-medium">Marka Güveni</td>
                                        <td className="border border-slate-300 px-4 py-3 text-green-700">✓ Yüksek</td>
                                        <td className="border border-slate-300 px-4 py-3 text-orange-700">△ Değişken</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-slate-300 px-4 py-3 font-medium">Maliyet/1000 Gösterim</td>
                                        <td className="border border-slate-300 px-4 py-3 text-green-700">✓ ₺5-15</td>
                                        <td className="border border-slate-300 px-4 py-3 text-orange-700">△ ₺20-100+</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h2>Ne Zaman Açık Hava Tercih Etmeli?</h2>
                        <ul>
                            <li><strong>Yerel işletmeler:</strong> Belirli bir bölgede bilinirlik istiyorsanız</li>
                            <li><strong>Marka lansmanları:</strong> Yeni ürün veya marka tanıtımları</li>
                            <li><strong>Etkinlik duyuruları:</strong> Konser, fuar, açılış gibi etkinlikler</li>
                            <li><strong>B2B hedefleme:</strong> Sanayi bölgelerindeki firmalar</li>
                            <li><strong>Uzun vadeli bilinirlik:</strong> Sürekli görünürlük isteyenler</li>
                        </ul>

                        <h2>Ne Zaman Dijital Tercih Etmeli?</h2>
                        <ul>
                            <li><strong>E-ticaret:</strong> Anında dönüşüm hedefleniyorsa</li>
                            <li><strong>Niş hedef kitle:</strong> Çok spesifik demografik</li>
                            <li><strong>Kısa kampanyalar:</strong> Hızlı sonuç isteniyor</li>
                            <li><strong>Test aşaması:</strong> Mesajı test etme ihtiyacı</li>
                        </ul>

                        <h2>En İyi Strateji: İkisini Birlikte Kullanmak</h2>
                        <p>
                            Araştırmalar, açık hava reklamın dijital kampanyaların etkinliğini %40'a kadar artırdığını gösteriyor.
                            Billboard'da gördüğü markayı internette arayan kullanıcılar, daha yüksek dönüşüm oranları sağlıyor.
                        </p>

                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 my-8 not-prose">
                            <h3 className="text-xl font-bold text-blue-900 mb-3">💡 Panobu Önerisi</h3>
                            <p className="text-slate-300 mb-4">
                                Dijital kampanyalarınızı başlatmadan önce, hedef bölgenizde açık hava reklamla marka bilinirliği oluşturun.
                                Bu, dijital reklamlarınızın tıklama oranını ve güvenilirliğini artıracaktır.
                            </p>
                            <Button asChild className="bg-blue-600 hover:bg-blue-700">
                                <Link href="/static-billboards">
                                    Billboard Lokasyonlarını İncele <ArrowRight className="w-4 h-4 ml-2" />
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
                        "headline": "Açık Hava vs Dijital Reklam: Hangisi Daha Etkili?",
                        "description": "Billboard ve dijital reklam karşılaştırması.",
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
