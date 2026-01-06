// Blog yazılarını Supabase'e eklemek için bu script'i çalıştırın
// Kullanım: npx ts-node scripts/seed-blog-posts.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const blogPosts = [
    {
        slug: "billboard-reklam-fiyatlari-2026-rehberi",
        title: "Billboard Reklam Fiyatları 2026 Rehberi",
        excerpt: "Türkiye'de billboard kiralama fiyatları ne kadar? Şehir, lokasyon ve pano türüne göre 2026 yılı güncel fiyat rehberi. Bütçenizi en verimli şekilde kullanın.",
        content: `
<h2>Billboard Fiyatlarını Belirleyen Faktörler</h2>
<p>Billboard kiralama fiyatları birçok faktöre bağlı olarak değişir. 2026 yılında Türkiye'de billboard fiyatlarını etkileyen ana faktörler şunlardır:</p>
<ul>
<li><strong>Lokasyon:</strong> Şehir merkezi, ana yollar, kavşaklar daha yüksek fiyatlıdır</li>
<li><strong>Pano boyutu:</strong> Büyük format panolar daha pahalıdır</li>
<li><strong>Trafik yoğunluğu:</strong> Günlük geçiş sayısı fiyatı doğrudan etkiler</li>
<li><strong>Kiralama süresi:</strong> Uzun süreli kiralamalarda indirimler uygulanır</li>
<li><strong>Sezon:</strong> Bayram ve özel günlerde fiyatlar artabilir</li>
</ul>

<h2>2026 Yılı Billboard Fiyat Aralıkları</h2>
<p>Türkiye genelinde farklı pano türleri için ortalama haftalık fiyatlar:</p>
<ul>
<li><strong>Billboard (5x3m):</strong> ₺10.000 - ₺25.000/hafta</li>
<li><strong>Billboard (12x4m):</strong> ₺30.000 - ₺50.000/hafta</li>
<li><strong>CLP Pano:</strong> ₺1.500 - ₺3.000/hafta</li>
<li><strong>Raket Pano:</strong> ₺2.000 - ₺5.000/hafta</li>
<li><strong>Megalight:</strong> ₺15.000 - ₺40.000/hafta</li>
<li><strong>Dijital Ekran:</strong> ₺20.000 - ₺100.000/hafta</li>
</ul>

<h2>Şehirlere Göre Fiyat Karşılaştırması</h2>
<p>Billboard fiyatları şehirden şehire büyük farklılıklar gösterir:</p>
<ul>
<li><strong>İstanbul:</strong> En yüksek fiyatlar, merkezi lokasyonlar premium</li>
<li><strong>Ankara, İzmir:</strong> Orta-yüksek segment</li>
<li><strong>Kocaeli, Bursa:</strong> Sanayi bölgeleri ve ana yollar cazip</li>
<li><strong>Anadolu şehirleri:</strong> Daha uygun fiyatlarla etkili kampanyalar</li>
</ul>

<h2>Bütçenizi Optimize Etme İpuçları</h2>
<ol>
<li><strong>Uzun süreli kiralama:</strong> Aylık kiralamalarda %10-20 indirim</li>
<li><strong>Paket anlaşmalar:</strong> Birden fazla panoda toplu indirim</li>
<li><strong>Sezon dışı dönemler:</strong> Yaz aylarında daha uygun fiyatlar</li>
<li><strong>Alternatif lokasyonlar:</strong> Ana arterler yerine paralel yollar</li>
</ol>

<h2>Panobu ile Şeffaf Fiyatlandırma</h2>
<p>Panobu platformunda tüm panoların fiyatları şeffaf şekilde görüntülenir. Gizli ücret yoktur, gördüğünüz fiyat ödeyeceğiniz fiyattır.</p>
        `,
        imageUrl: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&auto=format&fit=crop&q=60",
        published: true,
    },
    {
        slug: "kocaelide-reklam-vermek-lokasyon-rehberi",
        title: "Kocaeli'de Reklam Vermek: Lokasyon Rehberi",
        excerpt: "Kocaeli'nin en etkili reklam lokasyonları ve gizli yüksek trafik noktaları. Panobu ile özel stratejiler ve aynı fiyata premium lokasyonlar.",
        content: `
<h2>Kocaeli: Türkiye'nin Sanayi Kalbi</h2>
<p>Kocaeli, İstanbul ile Ankara arasındaki stratejik konumu, güçlü sanayi altyapısı ve yoğun karayolu trafiği ile Türkiye'nin en önemli reklam pazarlarından biri. Günde yüz binlerce araç ve yaya trafiği, işletmeler için büyük bir reklam potansiyeli sunuyor.</p>

<h2>En Yüksek Trafik Alan Lokasyonlar</h2>

<h3>Gebze Bölgesi</h3>
<p>Türkiye'nin en büyük organize sanayi bölgelerinden birine ev sahipliği yapan Gebze, günlük 100.000+ araç trafiği ile premium bir reklam lokasyonu:</p>
<ul>
<li>D-100 üzeri kavşaklar</li>
<li>OSB giriş-çıkışları</li>
<li>Gebze Center AVM çevresi</li>
<li>Tren istasyonu yakınları</li>
</ul>

<h3>İzmit Merkez</h3>
<p>Şehrin kalbi olan İzmit merkez, hem yerel halk hem de transit trafik için yoğun görünürlük sağlar:</p>
<ul>
<li>Sahil yolu ve kordon</li>
<li>Merkez meydanı çevresi</li>
<li>Otogar bölgesi</li>
<li>Hastane ve üniversite çevreleri</li>
</ul>

<h2>🌟 Panobu Özel: Gizli Premium Lokasyonlar</h2>
<p>Panobu ile özel çalışmalar yürüten müşterilerimize sunduğumuz gizli yüksek trafik lokasyonları ile rekabet avantajı yakalayın:</p>
<ul>
<li><strong>Yüksek trafik, düşük fiyat:</strong> Henüz keşfedilmemiş ama yoğun geçişli noktalar</li>
<li><strong>Aynı fiyata premium:</strong> Diğer lokasyonlarla aynı fiyata ama çok daha yüksek görünürlük</li>
<li><strong>Stratejik konumlar:</strong> Rakiplerinizin bilmediği altın noktalar</li>
</ul>
<p><em>Bu lokasyonlar herkese açık değildir. Panobu ekibi ile özel görüşme yaparak bu fırsatlardan yararlanabilirsiniz.</em></p>

<h2>İlçelere Göre Reklam Stratejisi</h2>
<ul>
<li><strong>Gebze:</strong> B2B işletmeler için ideal - sanayi, lojistik, inşaat</li>
<li><strong>İzmit:</strong> Yerel işletmeler için - restoranlar, mağazalar, cafeler</li>
<li><strong>Körfez, Darıca, Dilovası:</strong> Sanayi ve liman firmaları için</li>
</ul>

<h2>Bütçe Optimizasyonu İpuçları</h2>
<ol>
<li>Çoklu lokasyon paketi ile toplu indirim</li>
<li>Sezonluk planlama ile uygun fiyatlar</li>
<li>Müşteri profilinize uygun ilçe seçimi</li>
<li>Panobu ile gizli lokasyonlara erişim</li>
</ol>
        `,
        imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&auto=format&fit=crop&q=60",
        published: true,
    }
];

async function main() {
    console.log('Blog yazıları ekleniyor...');

    for (const post of blogPosts) {
        const existing = await prisma.blogPost.findUnique({
            where: { slug: post.slug }
        });

        if (existing) {
            console.log(`Güncelleniyor: ${post.title}`);
            await prisma.blogPost.update({
                where: { slug: post.slug },
                data: post
            });
        } else {
            console.log(`Oluşturuluyor: ${post.title}`);
            await prisma.blogPost.create({
                data: post
            });
        }
    }

    console.log('✅ Blog yazıları başarıyla eklendi!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
