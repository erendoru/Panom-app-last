const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const update = await prisma.update.create({
        data: {
            title: "Kampanya Nasıl Oluşturulur? - Adım Adım Rehber",
            content: `<p>Artık Panobu'da açık hava reklam kampanyanızı <strong>5 kolay adımda</strong> oluşturabilirsiniz! İşte adım adım süreç:</p>

<h3>📦 1. Sepetinizi Oluşturun</h3>
<p>Haritadan veya listeden istediğiniz panoları seçerek sepetinize ekleyin. Her pano için başlangıç ve bitiş tarihlerini belirleyebilirsiniz.</p>
<ul>
<li>CLP panolarda <strong>tek yüz</strong> veya <strong>çift yüz</strong> seçimi yapabilirsiniz</li>
<li>Çift yüz seçerseniz fiyat 2 katına çıkar</li>
<li>Kocaeli'de 20+ CLP seçerseniz birim fiyat <strong>1.500₺</strong>'ye düşer</li>
</ul>

<h3>📝 2. Kampanya Bilgilerini Girin</h3>
<p>Kampanyanıza bir isim verin ve iletişim bilgilerinizi doldurun. Bu bilgiler size ulaşmamız için kullanılacaktır.</p>

<h3>🎨 3. Görsel Durumunu Seçin</h3>
<p>Reklam görselleriniz hazır mı yoksa tasarım desteği mi istiyorsunuz?</p>
<ul>
<li><strong>Görsellerim Hazır:</strong> Sipariş sonrası ekibimiz sizinle iletişime geçecek</li>
<li><strong>Tasarım Desteği:</strong> +2.500₺ karşılığında profesyonel tasarım hizmeti</li>
</ul>

<h3>✅ 4. Siparişinizi Kontrol Edin</h3>
<p>Tüm seçimlerinizi gözden geçirin ve "Siparişi Gönder" butonuyla talebi iletin.</p>

<h3>🎉 5. Tamamlandı!</h3>
<p>Siparişiniz alındı! Ekibimiz sizinle iletişime geçecek, görselleriniz panolara yerleştirilecek ve fotoğrafları size mail ile iletilecek.</p>

<p><a href="/kampanya-rehberi" style="color: #3b82f6; font-weight: bold;">👉 Detaylı görsel rehber için tıklayın</a></p>`,
            category: "Kampanya Başlatma",
            imageUrl: "/images/guide-step-1-cart.png",
            published: true
        }
    });

    console.log('Created update:', update.id);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
