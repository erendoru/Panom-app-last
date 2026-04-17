import type { LegalSection } from "@/components/legal/LegalBody";

export const privacyTitle = { tr: "Gizlilik Politikası", en: "Privacy policy" };
export const privacyUpdated = {
    tr: "Son güncelleme: 12 Ocak 2026",
    en: "Last updated: January 12, 2026",
};

export const privacySections: LegalSection[] = [
    {
        kind: "section",
        h2: { tr: "1. Giriş", en: "1. Introduction" },
        paragraphs: {
            tr: [
                "Panobu olarak, kullanıcılarımızın gizliliğine büyük önem veriyoruz. Bu gizlilik politikası, kişisel verilerinizin nasıl toplandığını, kullanıldığını, saklandığını ve korunduğunu açıklamaktadır. Platformumuzu kullanarak bu politikayı kabul etmiş sayılırsınız.",
            ],
            en: [
                "At Panobu we take your privacy seriously. This privacy policy explains how we collect, use, store and protect your personal data. By using the platform you agree to this policy.",
            ],
        },
    },
    {
        kind: "section",
        h2: { tr: "2. Toplanan Veriler", en: "2. Data we collect" },
        paragraphs: {
            tr: ["Hizmetlerimizi sunabilmek için aşağıdaki verileri topluyoruz:"],
            en: ["To provide our services we may collect the following categories of data:"],
        },
        list: {
            tr: [
                "Kimlik bilgileri: ad, soyad, e-posta, telefon",
                "İletişim bilgileri: adres, şirket bilgileri",
                "Finansal bilgiler: ödeme işlemleri için gerekli veriler (iyzico güvencesiyle işlenir)",
                "Kullanım verileri: platform kullanım istatistikleri, IP adresi, tarayıcı bilgileri",
                "Reklam verileri: yüklenen görseller, kampanya bilgileri",
            ],
            en: [
                "Identity data: name, surname, email, phone",
                "Contact data: address, company details",
                "Financial data: information required for payments (processed securely via iyzico)",
                "Usage data: product analytics, IP address, browser metadata",
                "Advertising data: uploaded creatives and campaign details",
            ],
        },
    },
    {
        kind: "section",
        h2: { tr: "3. Verilerin Kullanımı", en: "3. How we use data" },
        paragraphs: {
            tr: ["Toplanan veriler aşağıdaki amaçlarla kullanılmaktadır:"],
            en: ["We process personal data for the following purposes:"],
        },
        list: {
            tr: [
                "Hizmetlerin sunulması ve işlemlerin gerçekleştirilmesi",
                "Kullanıcı hesabının yönetimi",
                "Ödeme işlemlerinin güvenli şekilde tamamlanması",
                "Müşteri destek hizmetlerinin sağlanması",
                "Platform güvenliğinin sağlanması",
                "Yasal yükümlülüklerin yerine getirilmesi",
                "Hizmet kalitesinin iyileştirilmesi",
            ],
            en: [
                "Delivering the marketplace and completing bookings",
                "Managing your account and authentication",
                "Processing secure payments",
                "Providing customer support",
                "Protecting platform security and integrity",
                "Complying with legal obligations",
                "Improving product quality and user experience",
            ],
        },
    },
    {
        kind: "section",
        h2: { tr: "4. Verilerin Paylaşımı", en: "4. Sharing data" },
        paragraphs: {
            tr: ["Kişisel verileriniz aşağıdaki durumlar dışında üçüncü taraflarla paylaşılmaz:"],
            en: ["We do not sell your personal data. It may only be shared in the following cases:"],
        },
        list: {
            tr: [
                "Ödeme işlemleri: iyzico ödeme altyapısı (PCI-DSS uyumlu)",
                "Yasal zorunluluklar: mahkeme kararı veya düzenleyici talepler",
                "Hizmet sağlayıcılar: barındırma, e-posta vb. (veri işleme sözleşmeleri kapsamında)",
            ],
            en: [
                "Payments: iyzico payment infrastructure (PCI-DSS compliant)",
                "Legal requirements: court orders or regulatory requests",
                "Processors: hosting, email and similar vendors bound by data-processing agreements",
            ],
        },
    },
    {
        kind: "section",
        h2: { tr: "5. Çerezler (Cookies)", en: "5. Cookies" },
        paragraphs: {
            tr: [
                "Platformumuz, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır. Çerezler, oturum yönetimi, tercih hatırlama ve analitik amaçlarla kullanılır. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz, ancak bu durumda bazı özellikler düzgün çalışmayabilir.",
            ],
            en: [
                "We use cookies and similar technologies to operate sessions, remember preferences and measure product usage. You can disable cookies in your browser, but parts of the platform may not work correctly.",
            ],
        },
    },
    {
        kind: "section",
        h2: { tr: "6. Veri Güvenliği", en: "6. Security" },
        paragraphs: {
            tr: ["Verilerinizi korumak için endüstri standardı güvenlik önlemleri uyguluyoruz:"],
            en: ["We apply industry-standard safeguards to protect your information, including:"],
        },
        list: {
            tr: ["SSL/TLS şifreleme", "Güvenli veri merkezleri", "Düzenli güvenlik denetimleri", "Erişim kontrolü ve yetkilendirme"],
            en: ["TLS encryption in transit", "Hardened infrastructure providers", "Periodic security reviews", "Role-based access controls"],
        },
    },
    {
        kind: "section",
        h2: { tr: "7. KVKK Kapsamındaki Haklarınız", en: "7. Your rights (KVKK)" },
        paragraphs: {
            tr: ["6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aşağıdaki haklara sahipsiniz:"],
            en: [
                "Under Turkish Law No. 6698 on the Protection of Personal Data (KVKK), data subjects may exercise the rights listed below (non-exhaustive summary):",
            ],
        },
        list: {
            tr: [
                "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
                "İşlenmişse buna ilişkin bilgi talep etme",
                "İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme",
                "Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme",
                "Eksik veya yanlış işlenmişse düzeltilmesini isteme",
                "Silinmesini veya yok edilmesini isteme",
                "İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme",
            ],
            en: [
                "Learn whether personal data is processed",
                "Request information if processed",
                "Learn the purpose of processing and whether use is consistent with that purpose",
                "Know third parties to whom data is transferred domestically or abroad",
                "Request rectification if data is incomplete or inaccurate",
                "Request erasure or destruction where conditions apply",
                "Object to results produced solely through automated processing that are against you",
            ],
        },
    },
    {
        kind: "contact",
        h2: { tr: "8. İletişim", en: "8. Contact" },
        intro: {
            tr: "Gizlilik politikası hakkında sorularınız veya KVKK kapsamındaki talepleriniz için:",
            en: "For privacy questions or requests under KVKK, please contact us:",
        },
        emailLabel: { tr: "E-posta:", en: "Email:" },
        addressLabel: { tr: "Adres:", en: "Address:" },
        addressLine: { tr: "Kocaeli, Türkiye", en: "Kocaeli, Türkiye" },
    },
    {
        kind: "section",
        h2: { tr: "9. Değişiklikler", en: "9. Changes" },
        paragraphs: {
            tr: [
                "Bu gizlilik politikası zaman zaman güncellenebilir. Değişiklikler bu sayfada yayınlanacak ve önemli değişiklikler için kullanıcılara bildirim yapılacaktır.",
            ],
            en: [
                "We may update this privacy policy from time to time. Changes will be posted on this page and we will notify you when updates are material.",
            ],
        },
    },
];
