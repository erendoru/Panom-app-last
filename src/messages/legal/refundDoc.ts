import type { AppLocale } from "@/messages/publicNav";

export const refundTitle = {
    tr: "İade ve İptal Politikası",
    en: "Refund & cancellation policy",
};

export const refundUpdated = {
    tr: "Son güncelleme: 12 Ocak 2026",
    en: "Last updated: January 12, 2026",
};

export type RefundTier = { key: string; title: string; body: string; color: "green" | "yellow" | "orange" | "red" };

export function refundTiers(locale: AppLocale): RefundTier[] {
    if (locale === "en") {
        return [
            { key: "a", title: "14+ days before flight date", body: "100% refund", color: "green" },
            { key: "b", title: "7–14 days before flight date", body: "50% refund", color: "yellow" },
            { key: "c", title: "3–7 days before flight date", body: "25% refund", color: "orange" },
            { key: "d", title: "Less than 3 days before flight date", body: "No refund", color: "red" },
        ];
    }
    return [
        { key: "a", title: "Yayın Başlangıcından 14+ Gün Önce", body: "%100 iade (tam iade)", color: "green" },
        { key: "b", title: "Yayın Başlangıcından 7-14 Gün Önce", body: "%50 iade", color: "yellow" },
        { key: "c", title: "Yayın Başlangıcından 3-7 Gün Önce", body: "%25 iade", color: "orange" },
        { key: "d", title: "Yayın Başlangıcından 3 Günden Az Önce", body: "İade yapılmaz", color: "red" },
    ];
}

export function refundCopy(locale: AppLocale) {
    const e = locale === "en";
    return {
        s1h: e ? "1. General refund rules" : "1. Genel İade Koşulları",
        s1p: e
            ? "The following refund rules apply to billboard rentals booked through Panobu. Each request is reviewed based on the stage of the campaign."
            : "Panobu platformu üzerinden yapılan pano kiralama işlemleri için aşağıdaki iade koşulları geçerlidir. İade talepleri, işlemin niteliğine göre değerlendirilir.",
        s2h: e ? "2. Cancellation windows" : "2. İptal ve İade Süreleri",
        s3h: e ? "3. Full refund scenarios" : "3. Tam İade Yapılan Durumlar",
        s3ul: e
            ? [
                  "Technical failures attributable to Panobu",
                  "The face cannot be used (maintenance, outage, etc.)",
                  "The service cannot be delivered as contracted",
                  "Force majeure (natural disaster, legal ban, etc.)",
              ]
            : ["Panobu kaynaklı teknik arızalar", "Panonun kullanılamaması (bakım, arıza vb.)", "Hizmetin sunulamaması", "Mücbir sebepler (doğal afet, yasal engeller vb.)"],
        s4h: e ? "4. Non-refundable scenarios" : "4. İade Yapılmayan Durumlar",
        s4ul: e
            ? [
                  "Cancellations after the campaign has started",
                  "Creative issues caused by the advertiser",
                  "Failure to deliver artwork on time",
                  "Incorrect information provided by the advertiser",
              ]
            : [
                  "Yayın başladıktan sonra yapılan iptal talepleri",
                  "Kullanıcı kaynaklı reklam içeriği sorunları",
                  "Görselin zamanında teslim edilmemesi",
                  "Kullanıcının hatalı bilgi vermesi",
              ],
        s5h: e ? "5. Design service refunds" : "5. Tasarım Hizmeti İadeleri",
        s5p: e ? "Refund rules for optional design services:" : "Tasarım desteği hizmeti için iade koşulları:",
        s5ul: e
            ? ["Before work starts: 100% refund", "After work has started: 50% refund", "After final approval: no refund"]
            : ["Tasarım başlamadan önce: %100 iade", "Tasarım süreci başladıysa: %50 iade", "Tasarım onaylandıktan sonra: İade yapılmaz"],
        s6h: e ? "6. Refund process" : "6. İade Süreci",
        s6ol: e
            ? [
                  "Send an email to destek@panobu.com with your order number and reason",
                  "Include order number and reason in the email",
                  "We review within 3 business days",
                  "Approved refunds are returned within 5–10 business days depending on your bank",
              ]
            : [
                  "İade talebi destek@panobu.com adresine e-posta ile gönderilmelidir",
                  "E-postada sipariş numarası ve iade nedeni belirtilmelidir",
                  "Talebiniz 3 iş günü içinde değerlendirilecektir",
                  "Onaylanan iadeler, ödeme yönteminize göre 5-10 iş günü içinde hesabınıza yansır",
              ],
        s7h: e ? "7. Refund method" : "7. İade Yöntemi",
        s7p: e
            ? "Refunds are credited to the same payment method used for the purchase. Posting timelines depend on your bank."
            : "İadeler, ödemenin yapıldığı aynı yöntemle (kredi kartı/banka kartı) gerçekleştirilir. İade tutarı, bankanızın işlem süresine bağlı olarak hesabınıza yansır.",
        s8h: e ? "8. Contact" : "8. İletişim",
        s8p: e ? "For refund requests:" : "İade talepleriniz için:",
        subjectLine: e ? "Subject: Refund request – [your order number]" : "Konu: İade Talebi - [Sipariş Numaranız]",
    };
}
