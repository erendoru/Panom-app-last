import type { AppLocale } from "@/messages/publicNav";

export type HeroScrollStrings = {
    h1Line1: string;
    h1Line2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
};

export type LandingMainStrings = {
    hero: HeroScrollStrings;
    dashboardAlt: string;
    overlayImpressionsLabel: string;
    stats: {
        units: string;
        allTurkey: string;
        globalSoon: string;
        bestPrice: string;
        priceGuarantee: string;
        fastStart: string;
        fastSuffix: string;
    };
    products: {
        title: string;
        subtitle: string;
        cards: { title: string; desc: string; linkText: string }[];
    };
    why: {
        badge: string;
        title: string;
        subtitle: string;
        rows: { traditional: string; panobu: string }[];
        barBadge: string;
        barCol1: string;
        barCol1Sub: string;
        barCol2: string;
        barCol2Sub: string;
        barCol3: string;
        barCol3Sub: string;
        compareLink: string;
    };
    features: {
        badge: string;
        title: string;
        subtitle: string;
        items: { title: string; desc: string }[];
    };
    how: {
        badge: string;
        title: string;
        subtitle: string;
        steps: { title: string; desc: string }[];
        overlayImp: string;
        overlayEasy: string;
        bottomCards: { title: string; desc: string }[];
    };
    enterprise: {
        badge: string;
        titleLine1: string;
        titleLine2: string;
        lead: string;
        bullets: { title: string; desc: string }[];
        cta: string;
        dashTitle: string;
        stats: { label: string; change: string }[];
    };
    cta: {
        title: string;
        subtitle: string;
        primary: string;
        secondary: string;
    };
};

const TR: LandingMainStrings = {
    hero: {
        h1Line1: "Şehrin Ritmini",
        h1Line2: "Panobu ile yakala",
        subtitle:
            "Markanızı şehrin en işlek noktalarındaki billboardlarda dakikalar içinde yayınlayın. Sabit fiyatlar, direkt pano sahibinden, aracısız kiralama.",
        ctaPrimary: "Panoları Gör",
        ctaSecondary: "Tümünü İncele",
    },
    dashboardAlt: "Panobu Dashboard önizlemesi",
    overlayImpressionsLabel: "Günlük Gösterim",
    stats: {
        units: "Reklam Ünitesi",
        allTurkey: "Tüm Türkiye",
        globalSoon: "Yakında Global",
        bestPrice: "En Uygun",
        priceGuarantee: "Fiyat Garantisi",
        fastStart: "Hızlı Başlangıç",
        fastSuffix: " dk",
    },
    products: {
        title: "Açık Hava Reklamcılığının Yeni Adresi",
        subtitle: "Planlayın. Kiralayın. Ölçümleyin. Tek platform, sınırsız olanak.",
        cards: [
            {
                title: "Dijital Panolar",
                desc: "AVM ekranları, dijital billboardlar ve LED duvar panolarını keşfedin. Saniyeler içinde kampanyanızı oluşturun.",
                linkText: "Keşfet",
            },
            {
                title: "Klasik Billboardlar",
                desc: "Sokak, cadde ve otoyol panolarında markanızı milyonlara ulaştırın. Tüm formatlar, tek çatı altında.",
                linkText: "İncele",
            },
            {
                title: "Fiyat Karşılaştır",
                desc: "Bütçenize uygun panoları anında filtreleyin. Şehir, ilçe ve format bazında en uygun fiyatları görün.",
                linkText: "Hesapla",
            },
        ],
    },
    why: {
        badge: "Farkımız",
        title: "Neden Panobu?",
        subtitle:
            "Geleneksel outdoor reklam ajanslarıyla uğraşmayın. Panobu ile hızlı, şeffaf ve uygun fiyatlı reklam verin.",
        rows: [
            { traditional: "Günlerce fiyat teklifi bekleme", panobu: "Anında fiyatları gör, hemen kirala" },
            { traditional: "Aracı komisyonları + gizli ücretler", panobu: "Direkt pano sahibinden, sıfır komisyon" },
            { traditional: "Her ajansı tek tek ara", panobu: "Tüm panolar tek platformda" },
            { traditional: "Sadece büyük bütçeler kabul edilir", panobu: "Her bütçeye uygun, esnek kiralama" },
        ],
        barBadge: "Türkiye'nin İlk Aracısız OOH Platformu",
        barCol1: "%0",
        barCol1Sub: "Ajans Komisyonu",
        barCol2: "Yok",
        barCol2Sub: "Minimum Bütçe",
        barCol3: "5 dk",
        barCol3Sub: "Başlangıç Süresi",
        compareLink: "Detaylı karşılaştırmayı gör",
    },
    features: {
        badge: "Özellikler",
        title: "Geleceğin Reklamcılığı",
        subtitle:
            "Geleneksel süreçleri unutun. Panobu ile dijital açıkhava reklamcılığı artık online reklam vermek kadar kolay.",
        items: [
            {
                title: "Sabit & Şeffaf Fiyatlar",
                desc: "Tüm billboard ve ekranların fiyatları platformda sabit ve şeffaf olarak listelenir. Sürpriz ücretler, gizli komisyonlar yok. Gördüğünüz fiyat, ödediğiniz fiyattır.",
            },
            {
                title: "Direkt Pano Sahibinden",
                desc: "Aracı firmalara komisyon ödemeye son. Panobu ile doğrudan pano ve ekran sahipleriyle çalışarak maliyetinizi düşürün, sürecinizi hızlandırın.",
            },
            {
                title: "Tüm Formatlar Tek Platformda",
                desc: "AVM iç mekan ekranları, cadde billboardları, otoyol megaboardları, bina kaplamaları — tüm açıkhava reklam formatlarını tek bir platform üzerinden yönetin.",
            },
        ],
    },
    how: {
        badge: "Nasıl Çalışır?",
        title: "4 Adımda Reklam Verin",
        subtitle: "Sadece birkaç dakikada reklamınızı şehrin en görünür noktalarına taşıyın.",
        steps: [
            {
                title: "Lokasyon Seçin",
                desc: "Harita üzerinden şehir, ilçe ve cadde bazında pano lokasyonlarını keşfedin. Trafik yoğunluğu, günlük gösterim tahmini ve çevre analiziyle en doğru noktayı bulun.",
            },
            {
                title: "Tarih ve Bütçe Belirleyin",
                desc: "Her panonun müsaitlik takvimini anlık kontrol edin. Günlük, haftalık veya aylık esnek kiralama periyotlarıyla bütçenize uygun planı oluşturun.",
            },
            {
                title: "Görsellerinizi Yükleyin",
                desc: "Reklam görsellerinizi platforma yükleyin. Ölçü ve format kılavuzuyla doğru boyutta hazırlayın. İsterseniz tasarım desteği talep edin, biz halledelim.",
            },
            {
                title: "Yayına Geçin",
                desc: "Siparişiniz hızlıca incelenir ve onaylanır. Onay sonrası kampanyanız belirlediğiniz tarihte otomatik başlar. Tüm süreci panelden takip edin.",
            },
        ],
        overlayImp: "Günlük Gösterim",
        overlayEasy: "Kolay & Hızlı",
        bottomCards: [
            {
                title: "Şeffaf Fiyatlandırma",
                desc: "Tüm billboard ve ekranların fiyatları platformda anlık görünür. Aracı firmalara zaman kaybetmeden direkt kiralayın.",
            },
            {
                title: "Herkes İçin Uygun",
                desc: "Restoran, emlakçı, showroom, kafe — işletmenizin büyüklüğü fark etmez. Küçük bütçelerle bile açık hava reklamı verin.",
            },
            {
                title: "Türkiye Geneli Kapsama",
                desc: "Her ile, her ilçeye genişliyoruz. Stratejik lokasyonlarda markanızı konumlandırın, yerel ve ulusal ölçekte görünür olun.",
            },
        ],
    },
    enterprise: {
        badge: "Enterprise",
        titleLine1: "Büyük Markalar İçin",
        titleLine2: "Kurumsal Çözümler",
        lead: "Türkiye'nin dört bir yanında, il bazlı stratejik kampanyalar oluşturun. Farklı lokasyonlarla A/B testleri yapın, en yüksek dönüşümü yakalayan kombinasyonu keşfedin.",
        bullets: [
            {
                title: "İl Bazlı Kampanya Yönetimi",
                desc: "Her ilde stratejik lokasyonlarda markanızı konumlandırın. Bölgesel hedefleme ile reklam bütçenizi en verimli şekilde kullanın.",
            },
            {
                title: "A/B Test & Performans Analizi",
                desc: "Farklı lokasyonlar ve görseller ile A/B testleri yapın. Kampanyalarınızın performansını karşılaştırın, veriye dayalı kararlar alın.",
            },
            {
                title: "Anlık Müsaitlik Takvimi",
                desc: "Her panonun müsaitlik tarihlerini anlık kontrol edin. Reklamlarınızı önceden planlayarak en uygun zamanlarda yayın yapın.",
            },
            {
                title: "Sipariş Takip Paneli",
                desc: "Tüm açık hava siparişlerinizi tek bir panelden yönetin. Geçmiş kampanya detaylarını, ödeme geçmişini ve süreç durumunu anlık görüntüleyin.",
            },
        ],
        cta: "Demo Talep Et",
        dashTitle: "Panobu Enterprise Dashboard",
        stats: [
            { label: "Aktif Kampanyalar", change: "+3 bu ay" },
            { label: "Toplam Gösterim", change: "+18% artış" },
            { label: "Kapsanan İl", change: "81 il hedefi" },
            { label: "Aylık Tasarruf", change: "aracısız fiyat" },
        ],
    },
    cta: {
        title: "Markanızı Şehre Duyurun",
        subtitle:
            "Ücretsiz hesabınızı oluşturun ve ilk kampanyanızı bugün başlatın. Açık hava reklamcılığı hiç bu kadar kolay olmamıştı.",
        primary: "Şimdi Başla — Ücretsiz",
        secondary: "Demo Rezervasyon",
    },
};

const EN: LandingMainStrings = {
    hero: {
        h1Line1: "Own the rhythm",
        h1Line2: "of the city with Panobu",
        subtitle:
            "Launch your brand on high-traffic billboards in minutes. Fixed prices, direct from media owners — no middlemen.",
        ctaPrimary: "Browse faces",
        ctaSecondary: "See everything",
    },
    dashboardAlt: "Panobu dashboard preview",
    overlayImpressionsLabel: "Daily impressions",
    stats: {
        units: "Advertising faces",
        allTurkey: "Across Türkiye",
        globalSoon: "Global soon",
        bestPrice: "Best value",
        priceGuarantee: "Price transparency",
        fastStart: "Fast setup",
        fastSuffix: " min",
    },
    products: {
        title: "The new home for out-of-home",
        subtitle: "Plan. Book. Measure. One platform, endless reach.",
        cards: [
            {
                title: "Digital screens",
                desc: "Mall screens, digital billboards and LED walls — explore formats and spin up campaigns in seconds.",
                linkText: "Explore",
            },
            {
                title: "Classic billboards",
                desc: "Streets, avenues and highways — reach millions with every static format in one place.",
                linkText: "Browse",
            },
            {
                title: "Compare prices",
                desc: "Filter by city, district and format to see the best rates for your budget instantly.",
                linkText: "Compare",
            },
        ],
    },
    why: {
        badge: "Our edge",
        title: "Why Panobu?",
        subtitle:
            "Skip the slow agency loop. Panobu makes outdoor faster, transparent and fairly priced.",
        rows: [
            { traditional: "Waiting days for a quote", panobu: "See prices instantly and book" },
            { traditional: "Hidden fees + commissions", panobu: "Direct from owners, zero commission" },
            { traditional: "Calling every vendor", panobu: "Every face in one marketplace" },
            { traditional: "Only big budgets accepted", panobu: "Flexible rentals for every budget" },
        ],
        barBadge: "Türkiye’s first intermediary-free OOH platform",
        barCol1: "0%",
        barCol1Sub: "Agency commission",
        barCol2: "None",
        barCol2Sub: "Minimum spend",
        barCol3: "5 min",
        barCol3Sub: "Time to start",
        compareLink: "See the full comparison",
    },
    features: {
        badge: "Features",
        title: "Advertising, modernized",
        subtitle:
            "Forget opaque processes. With Panobu, out-of-home feels as straightforward as buying online media.",
        items: [
            {
                title: "Fixed, transparent pricing",
                desc: "Every billboard and screen price is listed clearly. No surprise fees or hidden commissions — the price you see is what you pay.",
            },
            {
                title: "Direct from media owners",
                desc: "Stop paying middlemen. Work directly with face owners to cut cost and speed up approvals.",
            },
            {
                title: "Every format, one login",
                desc: "Mall interiors, roadside boards, megaboards, building wraps — manage every OOH format from a single workspace.",
            },
        ],
    },
    how: {
        badge: "How it works",
        title: "Launch in four steps",
        subtitle: "Move your campaign to the most visible spots in just a few minutes.",
        steps: [
            {
                title: "Pick your locations",
                desc: "Explore faces on the map by city, district and street. Compare traffic, estimated daily impressions and context to choose the right unit.",
            },
            {
                title: "Choose dates & budget",
                desc: "Check live availability for each face. Build daily, weekly or monthly plans that match your budget.",
            },
            {
                title: "Upload creatives",
                desc: "Upload artwork with guided specs. Need design help? Request support and we’ll handle production.",
            },
            {
                title: "Go live",
                desc: "Orders are reviewed quickly. Once approved, your campaign starts on schedule — track everything in your dashboard.",
            },
        ],
        overlayImp: "Daily impressions",
        overlayEasy: "Easy & fast",
        bottomCards: [
            {
                title: "Transparent pricing",
                desc: "See live prices for every unit and book direct without wasting time on back-and-forth quotes.",
            },
            {
                title: "Built for every business",
                desc: "Restaurants, real estate, retail, cafés — company size doesn’t matter. Start small and scale up.",
            },
            {
                title: "Nationwide footprint",
                desc: "We’re expanding city by city. Build local bursts or nationwide coverage from one platform.",
            },
        ],
    },
    enterprise: {
        badge: "Enterprise",
        titleLine1: "For national brands,",
        titleLine2: "enterprise-grade tooling",
        lead: "Plan province-level strategies across Türkiye, run location A/B tests and double down on the combinations that convert.",
        bullets: [
            {
                title: "Province-level orchestration",
                desc: "Activate strategic units per city or region and steer spend with geo-specific goals.",
            },
            {
                title: "A/B testing & analytics",
                desc: "Compare creatives and markets, export learnings and invest where the data says you win.",
            },
            {
                title: "Live availability calendar",
                desc: "See open dates for every face in real time so media plans line up with your launch windows.",
            },
            {
                title: "Unified order desk",
                desc: "Track every OOH order, payment and production milestone from a single control center.",
            },
        ],
        cta: "Book a demo",
        dashTitle: "Panobu Enterprise dashboard",
        stats: [
            { label: "Active campaigns", change: "+3 this month" },
            { label: "Total impressions", change: "+18% lift" },
            { label: "Provinces live", change: "Targeting 81" },
            { label: "Monthly savings", change: "Intermediary-free pricing" },
        ],
    },
    cta: {
        title: "Make your brand unmissable",
        subtitle:
            "Create a free account and launch your first campaign today. Outdoor has never been this simple.",
        primary: "Start now — it’s free",
        secondary: "Book a demo",
    },
};

export function landingMainStrings(locale: AppLocale): LandingMainStrings {
    return locale === "en" ? EN : TR;
}
