import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/PublicLayout";

export const metadata: Metadata = {
    title: "Billboard Reklam Fiyatları 2026 Rehberi",
    description: "Türkiye'de billboard kiralama fiyatları ne kadar? Şehir, lokasyon ve pano türüne göre 2026 yılı güncel fiyat rehberi. Bütçenizi en verimli şekilde kullanın.",
    keywords: ["billboard fiyatları", "billboard kiralama fiyatları 2026", "açık hava reklam fiyatları", "pano kiralama ücreti"],
    openGraph: {
        title: "Billboard Reklam Fiyatları 2026 Rehberi | Panobu",
        description: "Türkiye genelinde billboard kiralama fiyatları. Güncel 2026 fiyat rehberi.",
    },
    alternates: {
        canonical: "https://panobu.com/blog/billboard-reklam-fiyatlari-2026-rehberi",
    },
};

export default function BillboardFiyatlariPage() {
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
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">Fiyat Rehberi</span>
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> 06 Ocak 2026</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 8 dk okuma</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-6">
                            Billboard Reklam Fiyatları 2026 Rehberi
                        </h1>
                        <p className="text-xl text-slate-400">
                            Türkiye'de billboard kiralama fiyatları ne kadar? Şehir, lokasyon ve pano türüne göre güncel fiyat rehberi.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 bg-white text-slate-900">
                <div className="container mx-auto px-4">
                    <article className="max-w-3xl mx-auto prose prose-lg prose-slate prose-headings:font-bold prose-headings:text-slate-900 prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:mb-5 prose-p:leading-relaxed prose-ul:my-5 prose-ol:my-5 prose-li:mb-2">

                        <h2>Billboard Fiyatlarını Belirleyen Faktörler</h2>
                        <p>
                            Billboard kiralama fiyatları birçok faktöre bağlı olarak değişir. 2026 yılında Türkiye'de billboard
                            fiyatlarını etkileyen ana faktörler şunlardır:
                        </p>
                        <ul>
                            <li><strong>Lokasyon:</strong> Şehir merkezi, ana yollar, kavşaklar daha yüksek fiyatlıdır</li>
                            <li><strong>Pano boyutu:</strong> Büyük format panolar daha pahalıdır</li>
                            <li><strong>Trafik yoğunluğu:</strong> Günlük geçiş sayısı fiyatı doğrudan etkiler</li>
                            <li><strong>Kiralama süresi:</strong> Uzun süreli kiralamalarda indirimler uygulanır</li>
                            <li><strong>Sezon:</strong> Bayram ve özel günlerde fiyatlar artabilir</li>
                        </ul>

                        <h2>2026 Yılı Billboard Fiyat Aralıkları</h2>
                        <p>
                            Aşağıdaki tablo, Türkiye genelinde farklı pano türleri için ortalama haftalık fiyatları göstermektedir:
                        </p>

                        <div className="overflow-x-auto not-prose">
                            <table className="w-full border-collapse border border-slate-300">
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="border border-slate-300 px-4 py-3 text-left">Pano Türü</th>
                                        <th className="border border-slate-300 px-4 py-3 text-left">Boyut</th>
                                        <th className="border border-slate-300 px-4 py-3 text-left">Haftalık Fiyat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-slate-300 px-4 py-3">Billboard (Standart)</td>
                                        <td className="border border-slate-300 px-4 py-3">5x3m</td>
                                        <td className="border border-slate-300 px-4 py-3">₺10.000 - ₺25.000</td>
                                    </tr>
                                    <tr className="bg-slate-50">
                                        <td className="border border-slate-300 px-4 py-3">Billboard (Büyük)</td>
                                        <td className="border border-slate-300 px-4 py-3">12x4m</td>
                                        <td className="border border-slate-300 px-4 py-3">₺30.000 - ₺50.000</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-slate-300 px-4 py-3">CLP Pano</td>
                                        <td className="border border-slate-300 px-4 py-3">120x175cm</td>
                                        <td className="border border-slate-300 px-4 py-3">₺1.500 - ₺3.000</td>
                                    </tr>
                                    <tr className="bg-slate-50">
                                        <td className="border border-slate-300 px-4 py-3">Raket Pano</td>
                                        <td className="border border-slate-300 px-4 py-3">140x200cm</td>
                                        <td className="border border-slate-300 px-4 py-3">₺2.000 - ₺5.000</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-slate-300 px-4 py-3">Megalight</td>
                                        <td className="border border-slate-300 px-4 py-3">6x3m</td>
                                        <td className="border border-slate-300 px-4 py-3">₺15.000 - ₺40.000</td>
                                    </tr>
                                    <tr className="bg-slate-50">
                                        <td className="border border-slate-300 px-4 py-3">Dijital Ekran</td>
                                        <td className="border border-slate-300 px-4 py-3">LED 6x4m</td>
                                        <td className="border border-slate-300 px-4 py-3">₺20.000 - ₺100.000</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h2>Şehirlere Göre Fiyat Karşılaştırması</h2>
                        <p>
                            Billboard fiyatları şehirden şehire büyük farklılıklar gösterir. İstanbul ve Ankara gibi büyükşehirlerde
                            fiyatlar daha yüksekken, Anadolu şehirlerinde daha uygun fiyatlar bulunabilir.
                        </p>
                        <ul>
                            <li><strong>İstanbul:</strong> En yüksek fiyatlar, özellikle merkezi lokasyonlar premium</li>
                            <li><strong>Ankara, İzmir:</strong> Orta-yüksek segment</li>
                            <li><strong>Kocaeli, Bursa:</strong> Sanayi bölgeleri ve ana yollar cazip</li>
                            <li><strong>Anadolu şehirleri:</strong> Daha uygun fiyatlarla etkili kampanyalar</li>
                        </ul>

                        <h2>Bütçenizi Optimize Etme İpuçları</h2>
                        <ol>
                            <li><strong>Uzun süreli kiralama:</strong> Aylık kiralamalarda %10-20 indirim alabilirsiniz</li>
                            <li><strong>Paket anlaşmalar:</strong> Birden fazla pano kiraladığınızda toplu indirimler</li>
                            <li><strong>Sezon dışı dönemler:</strong> Yaz ayları ve tatil dönemlerinde fiyatlar düşebilir</li>
                            <li><strong>Alternatif lokasyonlar:</strong> Ana arterler yerine paralel yollar daha uygun</li>
                        </ol>

                        <h2>Panobu ile Şeffaf Fiyatlandırma</h2>
                        <p>
                            Panobu platformunda tüm panoların fiyatları şeffaf şekilde görüntülenir. Gizli ücret yoktur,
                            gördüğünüz fiyat ödeyeceğiniz fiyattır. Online rezervasyon sistemi ile hızlıca kampanyanızı başlatabilirsiniz.
                        </p>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8 not-prose">
                            <h3 className="text-xl font-bold text-blue-900 mb-3">Güncel Fiyatları İnceleyin</h3>
                            <p className="text-blue-800 mb-4">
                                Tüm panoların güncel fiyatlarını görmek ve kampanyanızı planlamak için Panobu'yu ziyaret edin.
                            </p>
                            <Button asChild className="bg-blue-600 hover:bg-blue-700">
                                <Link href="/static-billboards">
                                    Panoları İncele <ArrowRight className="w-4 h-4 ml-2" />
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
                        "headline": "Billboard Reklam Fiyatları 2026 Rehberi",
                        "description": "Türkiye'de billboard kiralama fiyatları ne kadar? Güncel 2026 fiyat rehberi.",
                        "author": {
                            "@type": "Organization",
                            "name": "Panobu"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "Panobu",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://panobu.com/favicon.png"
                            }
                        },
                        "datePublished": "2026-01-06",
                        "dateModified": "2026-01-06"
                    })
                }}
            />
        </PublicLayout>
    );
}
