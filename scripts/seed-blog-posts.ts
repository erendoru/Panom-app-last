// Son 2 blog yazısını Supabase'e ekle
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const blogPosts = [
    {
        slug: "acik-hava-vs-dijital-reklam",
        title: "Açık Hava vs Dijital Reklam: Hangisi Daha Etkili?",
        excerpt: "Billboard ve dijital reklam karşılaştırması. Hangisi markanız için daha uygun? Avantajlar, dezavantajlar ve maliyet analizi.",
        content: `
<h2>Reklam Dünyasında İki Dev: Açık Hava ve Dijital</h2>
<p>Pazarlama bütçenizi nasıl değerlendireceğinize karar verirken, açık hava (billboard, CLP, raket pano) ve dijital reklam (Google Ads, Facebook, Instagram) arasında seçim yapmak zorlaşabilir.</p>

<h2>Açık Hava Reklamın Avantajları</h2>
<ul>
<li><strong>Engellenemez:</strong> AdBlock yok, skip butonu yok</li>
<li><strong>7/24 görünürlük:</strong> Sürekli gösterim</li>
<li><strong>Yerel hedefleme:</strong> Belirli bölgeye odaklanma</li>
<li><strong>Güvenilirlik:</strong> Fiziksel varlık marka güveni artırır</li>
<li><strong>Marka bilinirliği:</strong> Görsel etki uzun süre hafızada kalır</li>
</ul>

<h2>Dijital Reklamın Avantajları</h2>
<ul>
<li><strong>Hassas hedefleme:</strong> Yaş, ilgi alanı, davranış</li>
<li><strong>Ölçülebilirlik:</strong> Tıklama, dönüşüm takibi</li>
<li><strong>Esneklik:</strong> Anında değişiklik yapabilme</li>
<li><strong>A/B testi:</strong> Farklı versiyonları test etme</li>
</ul>

<h2>En İyi Strateji: İkisini Birlikte Kullanmak</h2>
<p>Araştırmalar, açık hava reklamın dijital kampanyaların etkinliğini %40'a kadar artırdığını gösteriyor. Billboard'da gördüğü markayı internette arayan kullanıcılar, daha yüksek dönüşüm oranları sağlıyor.</p>
        `,
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
        published: true,
    },
    {
        slug: "kobiler-icin-billboard-stratejileri",
        title: "KOBİ'ler İçin Billboard Reklam Stratejileri",
        excerpt: "Küçük ve orta ölçekli işletmeler için etkili billboard reklam stratejileri. Sınırlı bütçeyle maksimum etki nasıl sağlanır?",
        content: `
<h2>Billboard Reklamı Sadece Büyük Markalar İçin mi?</h2>
<p>Hayır! Küçük ve orta ölçekli işletmeler için billboard reklamı, büyük markaların dijitalde sahip olduğu bütçe avantajını dengeleyebilecek güçlü bir araçtır.</p>

<h2>5 Temel KOBİ Billboard Stratejisi</h2>

<h3>1. Hiper-Yerel Hedefleme</h3>
<p>Şehir genelinde reklam vermek yerine, müşterilerinizin yoğun olduğu 1-2 lokasyona odaklanın.</p>

<h3>2. CLP Panoları Tercih Edin</h3>
<p>CLP (City Light Poster) panolar, haftalık ₺1.500-3.000 gibi uygun fiyatlarla başlangıç için ideal.</p>

<h3>3. Stratejik Zamanlama</h3>
<p>Tüm yıl reklam vermek yerine, sezonunuzun en yoğun dönemlerine odaklanın.</p>

<h3>4. Tek Bir Net Mesaj</h3>
<p>Billboard'da sadece 3-5 saniye dikkat çekebilirsiniz. Tek bir güçlü mesaj yeterli.</p>

<h3>5. Rakip Lokasyonları Hedefleyin</h3>
<p>Rakibinizin dükkanına giden yol üzerinde pano kiralamak, onların müşterilerini size çekebilir.</p>

<h2>Panobu ile KOBİ Avantajları</h2>
<ul>
<li>Haftalık ₺1.500'den başlayan fiyatlar</li>
<li>Minimum 7 gün kiralama (uzun taahhüt yok)</li>
<li>Şeffaf fiyatlandırma (gizli maliyet yok)</li>
<li>Online rezervasyon (aracı yok)</li>
</ul>
        `,
        imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&auto=format&fit=crop&q=60",
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
