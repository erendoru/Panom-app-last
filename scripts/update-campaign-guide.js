const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const update = await prisma.update.updateMany({
        where: { title: 'Kampanya Nasıl Oluşturulur? - Adım Adım Rehber' },
        data: {
            imageUrl: null,
            content: `<p>Açık hava reklam kampanyanızı <strong>5 kolay adımda</strong> oluşturun:</p>
<ol>
<li><strong>Sepet:</strong> Panoları seçin, tarihleri belirleyin</li>
<li><strong>Bilgiler:</strong> Kampanya adı ve iletişim bilgileri</li>
<li><strong>Görseller:</strong> Hazır görsel veya tasarım desteği</li>
<li><strong>Özet:</strong> Son kontrol ve onay</li>
<li><strong>Tamamlandı:</strong> Görselleriniz panolara yerleştirilecek!</li>
</ol>
<p><a href="/kampanya-rehberi" style="color: #3b82f6;">👉 Görsel rehber için tıklayın</a></p>`
        }
    });
    console.log('Updated:', update.count);
}

main().catch(console.error).finally(() => prisma.$disconnect());
