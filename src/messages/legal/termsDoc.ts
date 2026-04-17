import type { LegalSection } from "@/components/legal/LegalBody";

export const termsTitle = { tr: "Hizmet Şartları", en: "Terms of service" };
export const termsUpdated = {
    tr: "Son güncelleme: 12 Ocak 2026",
    en: "Last updated: January 12, 2026",
};

export const termsSections: LegalSection[] = [
    {
        kind: "section",
        h2: { tr: "1. Genel Hükümler", en: "1. General" },
        paragraphs: {
            tr: [
                "Bu kullanım şartları, Panobu platformu (\"Platform\") ile kullanıcılar (\"Kullanıcı\") arasındaki ilişkiyi düzenler. Platformu kullanarak bu şartları kabul etmiş sayılırsınız.",
            ],
            en: [
                "These terms of use govern the relationship between the Panobu platform (\"Platform\") and users (\"User\"). By using the Platform you agree to these terms.",
            ],
        },
    },
    {
        kind: "section",
        h2: { tr: "2. Hizmet Tanımı", en: "2. Service description" },
        paragraphs: {
            tr: [
                "Panobu, açık hava reklamcılığı alanında dijital ve klasik pano kiralama hizmeti sunan bir platformdur. Platform üzerinden:",
            ],
            en: [
                "Panobu is a marketplace for renting digital and classic out-of-home advertising inventory. Through the Platform we provide:",
            ],
        },
        list: {
            tr: [
                "Dijital billboard kiralaması",
                "Klasik (statik) pano kiralaması",
                "Reklam görseli tasarım hizmeti",
                "Kampanya yönetimi hizmetleri sunulmaktadır",
            ],
            en: [
                "Digital billboard rentals",
                "Classic (static) face rentals",
                "Creative design services",
                "Campaign coordination services",
            ],
        },
    },
    {
        kind: "section",
        h2: { tr: "3. Üyelik ve Hesap", en: "3. Accounts" },
        list: {
            tr: [
                "Hizmetlerden yararlanmak için üyelik oluşturulması gerekmektedir",
                "Üyelik bilgilerinin doğruluğundan kullanıcı sorumludur",
                "Hesap güvenliğinden kullanıcı sorumludur",
                "Hesap paylaşımı yasaktır",
            ],
            en: [
                "You must create an account to use certain services",
                "You are responsible for the accuracy of account information",
                "You are responsible for safeguarding your credentials",
                "Account sharing is prohibited",
            ],
        },
    },
    {
        kind: "section",
        h2: { tr: "4. Ödeme Koşulları", en: "4. Payments" },
        list: {
            tr: [
                "Tüm fiyatlar Türk Lirası (TRY) cinsindendir ve KDV dahildir",
                "Ödemeler iyzico güvencesiyle gerçekleştirilir",
                "Kiralama ücreti, rezervasyon anında tahsil edilir",
                "Kabul edilen ödeme yöntemleri: Kredi kartı, banka kartı",
            ],
            en: [
                "All prices are quoted in Turkish Lira (TRY) and include VAT unless stated otherwise",
                "Payments are processed securely via iyzico",
                "Rental fees are charged when the booking is confirmed",
                "Accepted methods include major credit and debit cards",
            ],
        },
    },
    {
        kind: "section",
        h2: { tr: "5. Reklam İçeriği", en: "5. Advertising content" },
        paragraphs: {
            tr: ["Yayınlanacak reklam içerikleri aşağıdaki kurallara uygun olmalıdır:"],
            en: ["All advertising creatives must comply with the following rules:"],
        },
        list: {
            tr: [
                "Türkiye Cumhuriyeti yasalarına uygun olmalıdır",
                "Yanıltıcı veya aldatıcı içerik bulunmamalıdır",
                "Telif hakkı ihlali içermemelidir",
                "Ahlaka ve genel ahlaka aykırı olmamalıdır",
                "Nefret söylemi veya ayrımcılık içermemelidir",
            ],
            en: [
                "Comply with applicable laws in Türkiye",
                "Must not be misleading or deceptive",
                "Must not infringe third-party intellectual property",
                "Must not violate public morality or decency",
                "Must not include hate speech or unlawful discrimination",
            ],
        },
        afterListParagraphs: {
            tr: [
                "Panobu, uygunsuz içerik tespit ettiğinde yayını durdurma hakkını saklı tutar.",
            ],
            en: [
                "Panobu reserves the right to reject or pause campaigns that contain non-compliant creatives.",
            ],
        },
    },
    {
        kind: "section",
        h2: { tr: "6. Kullanıcı Yükümlülükleri", en: "6. User responsibilities" },
        list: {
            tr: [
                "Doğru ve güncel bilgi sağlamak",
                "Platformu yasal amaçlarla kullanmak",
                "Diğer kullanıcıların haklarına saygı göstermek",
                "Platformun güvenliğini tehlikeye atacak eylemlerden kaçınmak",
            ],
            en: [
                "Provide accurate and up-to-date information",
                "Use the Platform only for lawful purposes",
                "Respect the rights of other users and partners",
                "Avoid actions that compromise security or availability",
            ],
        },
    },
    {
        kind: "section",
        h2: { tr: "7. Sorumluluk Sınırları", en: "7. Limitation of liability" },
        paragraphs: {
            tr: ["Panobu, aşağıdaki durumlardan kaynaklanan zararlardan sorumlu tutulamaz:"],
            en: ["To the fullest extent permitted by law, Panobu is not liable for damages arising from:"],
        },
        list: {
            tr: [
                "Mücbir sebepler (doğal afet, savaş, pandemi vb.)",
                "Üçüncü taraf hizmetlerindeki kesintiler",
                "Kullanıcının kendi hatası veya ihmali",
                "Yetkisiz erişimler",
            ],
            en: [
                "Force majeure events (natural disasters, war, pandemics, etc.)",
                "Outages or issues with third-party infrastructure",
                "User error, delay or negligence",
                "Unauthorized access to your account caused by compromised credentials",
            ],
        },
    },
    {
        kind: "section",
        h2: { tr: "8. Fikri Mülkiyet", en: "8. Intellectual property" },
        paragraphs: {
            tr: [
                "Platform üzerindeki tüm içerik, tasarım, logo ve yazılımlar Panobu'ya aittir ve telif hakkı ile korunmaktadır. İzinsiz kullanım yasaktır.",
            ],
            en: [
                "Platform software, branding, layouts and supporting materials belong to Panobu and are protected by copyright and related rights. Unauthorized copying is prohibited.",
            ],
        },
    },
    {
        kind: "section",
        h2: { tr: "9. Sözleşme Değişiklikleri", en: "9. Changes to these terms" },
        paragraphs: {
            tr: [
                "Bu kullanım şartları önceden bildirimde bulunmaksızın güncellenebilir. Güncellemeler yayınlandığı anda yürürlüğe girer. Platformu kullanmaya devam etmeniz, değişiklikleri kabul ettiğiniz anlamına gelir.",
            ],
            en: [
                "We may update these terms from time to time. Updates take effect when posted. Continued use of the Platform constitutes acceptance of the revised terms.",
            ],
        },
    },
    {
        kind: "section",
        h2: { tr: "10. Uygulanacak Hukuk", en: "10. Governing law" },
        paragraphs: {
            tr: [
                "Bu sözleşme Türkiye Cumhuriyeti yasalarına tabidir. Uyuşmazlıklarda Kocaeli Mahkemeleri ve İcra Daireleri yetkilidir.",
            ],
            en: [
                "These terms are governed by the laws of the Republic of Türkiye. Courts and enforcement offices in Kocaeli shall have jurisdiction over disputes, subject to mandatory consumer protections.",
            ],
        },
    },
    {
        kind: "contact",
        h2: { tr: "11. İletişim", en: "11. Contact" },
        intro: {
            tr: "Şartlar hakkında sorularınız için:",
            en: "For questions about these terms:",
        },
        emailLabel: { tr: "E-posta:", en: "Email:" },
        addressLabel: { tr: "Adres:", en: "Address:" },
        addressLine: { tr: "Kocaeli, Türkiye", en: "Kocaeli, Türkiye" },
    },
];
