import type { AppLocale } from "@/messages/publicNav";

type FaqItem = { question: string; answer: string };

const FAQ_TR: FaqItem[] = [
    {
        question: "Pano kiralaması nasıl yapılıyor?",
        answer: "Panoları harita üzerinden görüntüleyip sepete ekleyebilirsiniz. Ardından kampanya bilgilerinizi girerek sipariş oluşturabilirsiniz. Ekibimiz siparişinizi inceleyip sizinle iletişime geçecektir.",
    },
    {
        question: "Minimum kiralama süresi nedir?",
        answer: "Minimum kiralama süresi pano türüne göre değişmekle birlikte genellikle 1 haftadır. Bazı özel lokasyonlarda 2 hafta minimum süre uygulanabilir.",
    },
    {
        question: "Reklam görselimi nasıl göndereceğim?",
        answer: "Sipariş onaylandıktan sonra size her pano için gerekli boyut ve format bilgilerini ileteceğiz. Görselleri e-posta yoluyla veya sistemimiz üzerinden yükleyebilirsiniz.",
    },
    {
        question: "Tasarım hizmeti sunuyor musunuz?",
        answer: "Evet! Sipariş oluştururken 'Tasarım Desteği İstiyorum' seçeneğini işaretleyebilirsiniz. Ekibimiz sizden bilgi alarak tasarımlarınızı hazırlayacaktır.",
    },
    {
        question: "Fiyatlar neye göre belirleniyor?",
        answer: "Fiyatlar pano türüne, boyutuna, lokasyonuna ve trafik yoğunluğuna göre belirlenir. Toplu kiramalarda özel indirimler uygulanabilir.",
    },
    {
        question: "Ödeme nasıl yapılıyor?",
        answer: "Sipariş onaylandıktan sonra size ödeme detayları iletilecektir. Havale/EFT veya kredi kartı ile ödeme yapabilirsiniz.",
    },
    {
        question: "Sipariş iptali yapabilir miyim?",
        answer: "Montaj başlamadan önce siparişinizi iptal edebilirsiniz. Detaylı bilgi için lütfen destek ekibimizle iletişime geçin.",
    },
    {
        question: "Montaj ne zaman yapılıyor?",
        answer: "Montaj tarihi, kampanya başlangıç tarihinize göre planlanır. Genellikle kampanya başlangıcından 1-2 gün önce montaj tamamlanır.",
    },
    {
        question: "Pano bakımı sizin sorumluluğunuzda mı?",
        answer: "Evet, kiralama süresi boyunca panoların bakımı ve olası hasarların onarımı bizim sorumluluğumuzdadır.",
    },
    {
        question: "Hangi şehirlerde hizmet veriyorsunuz?",
        answer: "Şu anda Kocaeli, Sakarya başta olmak üzere İstanbul, Ankara, İzmir, Bursa ve Antalya'da hizmet vermekteyiz. Sürekli olarak yeni lokasyonlar ekliyoruz.",
    },
];

const FAQ_EN: FaqItem[] = [
    {
        question: "How do I rent a face?",
        answer: "Browse faces on the map and add them to your cart. Then enter your campaign details to place an order. Our team will review it and get in touch.",
    },
    {
        question: "What is the minimum rental period?",
        answer: "It depends on the face type; usually one week. Some premium locations may require two weeks minimum.",
    },
    {
        question: "How do I send my creative?",
        answer: "After approval we send you the exact specs per face. You can upload creatives by email or through the platform.",
    },
    {
        question: "Do you offer design services?",
        answer: "Yes. When placing an order you can request design support. Our team will gather requirements and produce artwork for you.",
    },
    {
        question: "How are prices determined?",
        answer: "By face type, size, location and traffic level. Volume bookings may qualify for custom discounts.",
    },
    {
        question: "How do I pay?",
        answer: "After approval we share payment instructions. You can pay by bank transfer or card.",
    },
    {
        question: "Can I cancel an order?",
        answer: "You can cancel before installation starts. Contact support for details.",
    },
    {
        question: "When is installation?",
        answer: "Install is scheduled around your campaign start date, typically completed one to two days before go-live.",
    },
    {
        question: "Do you maintain the faces?",
        answer: "Yes. During the rental we handle maintenance and repairs.",
    },
    {
        question: "Which cities do you serve?",
        answer: "We currently operate in Kocaeli, Sakarya, Istanbul, Ankara, Izmir, Bursa and Antalya, with more locations added over time.",
    },
];

export function faqPageCopy(locale: AppLocale) {
    const e = locale === "en";
    return {
        items: e ? FAQ_EN : FAQ_TR,
        title: e ? "Frequently asked questions" : "Sıkça Sorulan Sorular",
        subtitle: e ? "Find answers to common questions here." : "Merak ettiklerinizi burada bulabilirsiniz",
        contactTitle: e ? "Didn't find your answer?" : "Cevabını Bulamadınız mı?",
        contactLead: e ? "Reach out — we're happy to help." : "Bize ulaşın, size yardımcı olalım.",
        exploreFaces: e ? "Explore faces" : "Panoları Keşfet",
    };
}
