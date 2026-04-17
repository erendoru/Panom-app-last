import type { AppLocale } from "@/messages/publicNav";

export const contactTitle = { tr: "İletişim", en: "Contact" };

export function contactCopy(locale: AppLocale) {
    const e = locale === "en";
    return {
        lead: e
            ? "Questions, ideas or partnership proposals? We would love to hear from you."
            : "Sorularınız, önerileriniz veya işbirliği teklifleriniz için bizimle iletişime geçin.",
        emailTitle: e ? "Email" : "E-posta",
        emailSub: e ? "We respond 24/7" : "7/24 yanıt",
        phoneTitle: e ? "Phone" : "Telefon",
        phoneSub: e ? "Weekdays 09:00 – 18:00" : "Hafta içi 09:00 - 18:00",
        addrTitle: e ? "Address" : "Adres",
        addrSub: e ? "Head office" : "Merkez ofis",
        addrLine: e ? "Kocaeli, Türkiye" : "Kocaeli, Türkiye",
        hoursTitle: e ? "Business hours" : "Çalışma Saatleri",
        hoursSub: e ? "Customer care" : "Müşteri hizmetleri",
        hoursBody: e
            ? "Monday – Friday: 09:00 – 18:00\nSaturday: 10:00 – 14:00"
            : "Pazartesi - Cuma: 09:00 - 18:00\nCumartesi: 10:00 - 14:00",
        quickTitle: e ? "Need fast help?" : "Hızlı Destek",
        quickBody: e
            ? "For urgent questions about orders, payments or technical issues, email us — we aim to reply within 24 hours."
            : "Sipariş, ödeme veya teknik konularda acil destek için e-posta gönderin. 24 saat içinde yanıt garantisi veriyoruz.",
        quickCta: e ? "Send a support email" : "Destek Talebi Gönder",
        companyTitle: e ? "Company information" : "Şirket Bilgileri",
        cName: e ? "Company" : "Şirket Adı",
        cTax: e ? "Tax office" : "Vergi Dairesi",
        cNo: e ? "Tax ID" : "Vergi No",
        cAddr: e ? "Address" : "Adres",
        companyRows: e
            ? [
                  ["Pufero Mobilya Ticaret Limited Şirketi"],
                  ["Körfez Tax Office"],
                  ["7331202819"],
                  ["Esentepe Mah. İplik Sk. No: 23 İç Kapı No: 1 Körfez/Kocaeli"],
              ]
            : [
                  ["Pufero Mobilya Ticaret Limited Şirketi"],
                  ["Körfez Vergi Dairesi"],
                  ["7331202819"],
                  ["Esentepe Mah. İplik Sk. No: 23 İç Kapı No: 1 Körfez/Kocaeli"],
              ],
    };
}
