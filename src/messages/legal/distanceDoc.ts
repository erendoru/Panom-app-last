import type { AppLocale } from "@/messages/publicNav";

export const distanceTitle = {
    tr: "Mesafeli Satış Sözleşmesi",
    en: "Distance sales agreement",
};

export const distanceUpdated = {
    tr: "Son güncelleme: 12 Ocak 2026",
    en: "Last updated: January 12, 2026",
};

export function distanceCopy(locale: AppLocale) {
    const e = locale === "en";
    return {
        m1h: e ? "ARTICLE 1 – PARTIES" : "MADDE 1 - TARAFLAR",
        m1s1: e ? "1.1 SELLER" : "1.1 SATICI",
        m1seller: e
            ? "Company: Pufero Mobilya Ticaret Limited Şirketi\nAddress: Esentepe Mah. İplik Sk. No: 23 İç Kapı No: 1 Körfez/Kocaeli\nPhone: +90 (262) 123 45 67\nEmail: destek@panobu.com\nTax office: Körfez\nTax ID: 7331202819"
            : "Unvan: Pufero Mobilya Ticaret Limited Şirketi\nAdres: Esentepe Mah. İplik Sk. No: 23 İç Kapı No: 1 Körfez/Kocaeli\nTelefon: +90 (262) 123 45 67\nE-Posta: destek@panobu.com\nVergi Dairesi: Körfez Vergi Dairesi\nVergi No: 7331202819",
        m1s2: e ? "1.2 BUYER" : "1.2 ALICI",
        m1buyer: e
            ? "The natural or legal person purchasing services via the Panobu platform. Buyer details are those provided during checkout."
            : "Panobu platformu üzerinden hizmet satın alan gerçek veya tüzel kişi. Alıcı bilgileri, sipariş sırasında alıcı tarafından sağlanan bilgilerdir.",
        m2h: e ? "ARTICLE 2 – SUBJECT" : "MADDE 2 - KONU",
        m2p: e
            ? "This agreement governs the sale of the digital out-of-home services ordered by the Buyer on www.panobu.com in accordance with Turkish Consumer Protection Law No. 6502 and the Regulation on Distance Contracts."
            : "İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait www.panobu.com internet sitesinden elektronik ortamda siparişini verdiği hizmetin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmelere Dair Yönetmelik hükümleri gereğince tarafların hak ve yükümlülüklerinin belirlenmesidir.",
        m3h: e ? "ARTICLE 3 – SERVICE DETAILS" : "MADDE 3 - HİZMET BİLGİLERİ",
        m3p: e ? "Key characteristics of the purchased service:" : "Satın alınan hizmetin temel özellikleri:",
        m3ul: e
            ? [
                  "Service type: rental of out-of-home advertising inventory",
                  "Scope: digital and/or classic billboard faces",
                  "Duration: date range selected during checkout",
                  "Total price: amount shown on the order summary and payment page (VAT included)",
              ]
            : [
                  "Hizmet Türü: Açık hava reklam alanı kiralama hizmeti",
                  "Hizmet Kapsamı: Dijital veya klasik billboard/pano kiralama",
                  "Hizmet Süresi: Sipariş sırasında belirlenen tarih aralığı",
                  "Hizmet Bedeli: Sipariş özeti ve ödeme sayfasında belirtilen tutar",
              ],
        m3p2: e
            ? "The final price including taxes is confirmed on the checkout screen and in the confirmation email."
            : "Hizmetin temel nitelikleri ve vergiler dahil satış fiyatı, sipariş onay sayfasında ve ALICI'ya gönderilen onay e-postasında belirtilmektedir.",
        m4h: e ? "ARTICLE 4 – PAYMENT & DELIVERY" : "MADDE 4 - ÖDEME VE TESLİMAT",
        m41h: e ? "4.1 Payment" : "4.1 Ödeme",
        m41ul: e
            ? ["Payments can be made by credit or debit card", "Processing is handled securely via iyzico", "Payment data is transmitted over TLS", "All prices include VAT"]
            : [
                  "Ödemeler kredi kartı veya banka kartı ile yapılabilir",
                  "Tüm ödemeler iyzico güvencesiyle gerçekleştirilir",
                  "Ödeme bilgileri şifrelenmiş olarak iletilir (SSL/TLS)",
                  "Tüm fiyatlar KDV dahildir",
              ],
        m42h: e ? "4.2 Service delivery" : "4.2 Hizmet Teslimi",
        m42ul: e
            ? [
                  "Creatives go live on the booked face on the agreed start date",
                  "No physical shipment — the service is digital",
                  "Start of flight is notified by email",
                  "Photo proof is available upon request",
              ]
            : [
                  "Reklam görseli, belirlenen tarihte ilgili panoda yayınlanır",
                  "Dijital hizmet olduğundan fiziksel teslimat yapılmaz",
                  "Yayın başlangıcı e-posta ile bildirilir",
                  "Talep halinde yayın fotoğrafı gönderilir",
              ],
        m5h: e ? "ARTICLE 5 – RIGHT OF WITHDRAWAL" : "MADDE 5 - CAYMA HAKKI",
        m5p: e
            ? "The Buyer may exercise the statutory withdrawal right before the service is fully delivered, subject to the refund windows below:"
            : "ALICI, hizmet teslim edilmeden önce cayma hakkını kullanabilir. Cayma koşulları:",
        m5lines: e
            ? [
                  { cls: "text-green-400", line: "14+ days before flight: 100% refund" },
                  { cls: "text-yellow-400", line: "7–14 days before flight: 50% refund" },
                  { cls: "text-orange-400", line: "3–7 days before flight: 25% refund" },
                  { cls: "text-red-400", line: "Less than 3 days before flight or after start: no refund" },
              ]
            : [
                  { cls: "text-green-400", line: "Yayın başlangıcından 14+ gün önce: %100 iade" },
                  { cls: "text-yellow-400", line: "Yayın başlangıcından 7-14 gün önce: %50 iade" },
                  { cls: "text-orange-400", line: "Yayın başlangıcından 3-7 gün önce: %25 iade" },
                  { cls: "text-red-400", line: "Yayın başlangıcından 3 günden az önce veya yayın başladıktan sonra: İade yapılmaz" },
              ],
        m5p2: e
            ? "Withdrawal requests must be emailed to destek@panobu.com in writing."
            : "Cayma hakkının kullanılması için destek@panobu.com adresine yazılı bildirim yapılması gerekmektedir.",
        m6h: e ? "ARTICLE 6 – GENERAL" : "MADDE 6 - GENEL HÜKÜMLER",
        m6ul: e
            ? [
                  "The Buyer declares they read and accepted the terms before ordering",
                  "By completing checkout the Buyer accepts this agreement",
                  "The Seller may refuse or cancel orders for legal or technical reasons",
                  "If the Seller cannot deliver, the Buyer is informed and payments are refunded",
                  "The Buyer is responsible for the accuracy of the information provided",
              ]
            : [
                  "ALICI, sipariş vermeden önce sözleşme koşullarını okuduğunu ve kabul ettiğini beyan eder.",
                  "Siparişin gerçekleşmesi durumunda ALICI, işbu sözleşmenin tüm koşullarını kabul etmiş sayılır.",
                  "SATICI, siparişi kabul etmeme veya iptal etme hakkını saklı tutar.",
                  "SATICI, teknik nedenlerle hizmeti sağlayamadığı takdirde ALICI'yı bilgilendirir ve ödeme iade edilir.",
                  "ALICI'nın verdiği bilgilerin doğruluğundan ALICI sorumludur.",
              ],
        m7h: e ? "ARTICLE 7 – DISPUTE RESOLUTION" : "MADDE 7 - UYUŞMAZLIK ÇÖZÜMÜ",
        m7p: e ? "For disputes arising from this agreement:" : "İşbu sözleşmeden kaynaklanan uyuşmazlıklarda:",
        m7ul: e
            ? [
                  "Turkish law applies to substantive matters",
                  "Consumer arbitration committees have jurisdiction for consumer complaints",
                  "For court actions, Kocaeli courts and enforcement offices are authorized",
              ]
            : [
                  "Türkiye Cumhuriyeti kanunları uygulanır",
                  "Tüketici şikayetleri için Tüketici Hakem Heyetleri yetkilidir",
                  "Mahkeme uyuşmazlıklarında Kocaeli Mahkemeleri ve İcra Daireleri yetkilidir",
              ],
        m8h: e ? "ARTICLE 8 – ENTRY INTO FORCE" : "MADDE 8 - YÜRÜRLÜK",
        m8p: e
            ? "The Buyer confirms they read the pre-contractual information form and accept all clauses. This agreement enters into force when the order is confirmed."
            : "ALICI, işbu sözleşmede yazılı tüm koşulları kabul ettiğini, sipariş vermeden önce ön bilgilendirme formunu okuduğunu ve anladığını kabul ve beyan eder. Bu sözleşme, siparişin onaylanması ile yürürlüğe girer.",
        m9h: e ? "CONTACT" : "İLETİŞİM",
    };
}
