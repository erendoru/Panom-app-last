import type { AppLocale } from "@/messages/publicNav";

export const deliveryTitle = {
    tr: "Teslimat ve Yayın Koşulları",
    en: "Delivery & publishing terms",
};

export const deliveryUpdated = {
    tr: "Son güncelleme: 12 Ocak 2026",
    en: "Last updated: January 12, 2026",
};

export function deliveryCopy(locale: AppLocale) {
    const e = locale === "en";
    return {
        s1h: e ? "1. Nature of the service" : "1. Hizmet Türü",
        s1p: e
            ? "Panobu provides digital services. There is no shipment of physical goods. Services cover renting out-of-home inventory online and publishing your creatives on booked faces."
            : "Panobu, dijital hizmet sunmaktadır. Fiziksel bir ürün teslimatı bulunmamaktadır. Hizmetlerimiz açık hava reklam alanlarının dijital ortamda kiralanması ve reklam görsellerinin bu alanlarda yayınlanmasını kapsar.",
        s2h: e ? "2. Publishing workflow" : "2. Yayın Süreci",
        s2ol: e
            ? [
                  "Reservation: after payment is confirmed the face is reserved for you",
                  "Creative delivery: upload artwork or purchase design support",
                  "Approval: creatives are reviewed for technical and policy compliance",
                  "Go-live: your campaign starts on the agreed dates",
              ]
            : [
                  "Rezervasyon: Ödeme onaylandıktan sonra pano sizin adınıza rezerve edilir",
                  "Görsel Teslimi: Reklam görselinizi yüklemeniz veya tasarım hizmeti almanız gerekir",
                  "Onay: Görsel, yayın standartlarına uygunluk açısından kontrol edilir",
                  "Yayın: Belirlenen tarihte reklamınız yayına alınır",
              ],
        s3h: e ? "3. Creative specifications" : "3. Görsel Teslim Koşulları",
        s3h3: e ? "Technical requirements:" : "Teknik Gereksinimler:",
        s3ul: e
            ? ["Formats: JPG, PNG, PDF", "Maximum file size: 10 MB", "Resolution: 300 DPI recommended", "Dimensions must match the booked face"]
            : ["Formatlar: JPG, PNG, PDF", "Maksimum Dosya Boyutu: 10 MB", "Çözünürlük: Minimum 300 DPI önerilir", "Boyutlar: Panonun ölçülerine uygun olmalıdır"],
        s4h: e ? "4. Creative deadlines" : "4. Görsel Teslim Süreleri",
        s4ul: e
            ? [
                  "Artwork must arrive at least 48 hours before the flight date",
                  "Late delivery may delay the start date",
                  "If no creative is delivered, the booking may be cancelled (refund policy applies)",
              ]
            : [
                  "Görsel, yayın başlangıcından en az 48 saat önce teslim edilmelidir",
                  "Geç teslim edilen görseller, yayın başlangıcının ertelenmesine neden olabilir",
                  "Görsel teslim edilmezse, rezervasyon iptal edilebilir (iade koşulları geçerlidir)",
              ],
        s5h: e ? "5. Design services" : "5. Tasarım Hizmeti",
        s5p: e ? "If you purchase optional design support:" : "Tasarım hizmeti satın aldıysanız:",
        s5ul: e
            ? ["Our team delivers a first draft within 2–3 business days", "Two revision rounds are included", "After approval the file is prepared for printing or digital playout"]
            : ["Ekibimiz 2-3 iş günü içinde taslak tasarım sunar", "2 revizyon hakkınız bulunmaktadır", "Onayınız alındıktan sonra yayın için hazırlanır"],
        s6h: e ? "6. Proof of posting" : "6. Yayın Doğrulama",
        s6p: e ? "Once your campaign is live:" : "Reklamınızın yayına alındığına dair:",
        s6ul: e
            ? ["You receive an email notification", "Photo proof can be provided on request", "Status is visible in your dashboard"]
            : ["E-posta bildirimi gönderilir", "Fotoğraflı yayın kanıtı sunulabilir (talep üzerine)", "Dashboard üzerinden yayın durumunuzu takip edebilirsiniz"],
        s7h: e ? "7. Publishing guarantee" : "7. Yayın Garantisi",
        s7p: e ? "If your ad cannot run due to technical failure or force majeure:" : "Teknik arıza veya mücbir sebeplerle reklamınız yayınlanamadığı takdirde:",
        s7ul: e
            ? ["We extend the campaign by the missed duration, or", "We issue a proportional refund"]
            : ["Yayınlanamayan süre kadar ek yayın süresi verilir veya", "Oransal iade yapılır"],
        s8h: e ? "8. Contact" : "8. İletişim",
        s8p: e ? "Questions about delivery or publishing:" : "Teslimat ve yayın konularında sorularınız için:",
    };
}
