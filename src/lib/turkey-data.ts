// Türkiye İlleri ve İlçeleri
export const TURKEY_CITIES = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya",
    "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu",
    "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır",
    "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun",
    "Gümüşhane", "Hakkâri", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir",
    "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya",
    "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş",
    "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop",
    "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak",
    "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale",
    "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük",
    "Kilis", "Osmaniye", "Düzce"
];

export const TURKEY_DISTRICTS: Record<string, string[]> = {
    "İstanbul": [
        "Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar", "Bahçelievler",
        "Bakırköy", "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beykoz", "Beylikdüzü",
        "Beyoğlu", "Büyükçekmece", "Çatalca", "Çekmeköy", "Esenler", "Esenyurt",
        "Eyüpsultan", "Fatih", "Gaziosmanpaşa", "Güngören", "Kadıköy", "Kağıthane",
        "Kartal", "Küçükçekmece", "Maltepe", "Pendik", "Sancaktepe", "Sarıyer",
        "Silivri", "Sultanbeyli", "Sultangazi", "Şile", "Şişli", "Tuzla",
        "Ümraniye", "Üsküdar", "Zeytinburnu"
    ],
    "Kocaeli": [
        "Başiskele", "Çayırova", "Darıca", "Derince", "Dilovası", "Gebze",
        "Gölcük", "İzmit", "Kandıra", "Karamürsel", "Kartepe", "Körfez"
    ],
    "Adana": [
        "Aladağ", "Ceyhan", "Çukurova", "Feke", "İmamoğlu", "Karaisalı", "Karataş",
        "Kozan", "Pozantı", "Saimbeyli", "Sarıçam", "Seyhan", "Tufanbeyli", "Yumurtalık", "Yüreğir"
    ],
    "Ankara": [
        "Akyurt", "Altındağ", "Ayaş", "Bala", "Beypazarı", "Çamlıdere", "Çankaya",
        "Çubuk", "Elmadağ", "Etimesgut", "Evren", "Gölbaşı", "Güdül", "Haymana",
        "Kalecik", "Kazan", "Keçiören", "Kızılcahamam", "Mamak", "Nallıhan",
        "Polatlı", "Pursaklar", "Sincan", "Şereflikoçhisar", "Yenimahalle"
    ],
    "İzmir": [
        "Aliağa", "Balçova", "Bayındır", "Bayraklı", "Bergama", "Beydağ", "Bornova",
        "Buca", "Çeşme", "Çiğli", "Dikili", "Foça", "Gaziemir", "Güzelbahçe",
        "Karabağlar", "Karaburun", "Karşıyaka", "Kemalpaşa", "Kınık", "Kiraz",
        "Konak", "Menderes", "Menemen", "Narlıdere", "Ödemiş", "Seferihisar",
        "Selçuk", "Tire", "Torbalı", "Urla"
    ],
    "Bursa": [
        "Büyükorhan", "Gemlik", "Gürsu", "Harmancık", "İnegöl", "İznik", "Karacabey",
        "Keles", "Kestel", "Mudanya", "Mustafakemalpaşa", "Nilüfer", "Orhaneli",
        "Orhangazi", "Osmangazi", "Yenişehir", "Yıldırım"
    ],
    "Antalya": [
        "Akseki", "Aksu", "Alanya", "Demre", "Döşemealtı", "Elmalı", "Finike",
        "Gazipaşa", "Gündoğmuş", "İbradı", "Kaş", "Kemer", "Kepez", "Konyaaltı",
        "Korkuteli", "Kumluca", "Manavgat", "Muratpaşa", "Serik"
    ],
    // Ana şehirler için ekleme yapıldı, diğer şehirler için gerekirse genişletilebilir
};

// Panel Type Türkçe İsimleri
export const PANEL_TYPE_LABELS: Record<string, string> = {
    BILLBOARD: "Billboard",
    BILLBOARD_PLUS: "Billboard Plus",
    GIANTBOARD: "Giantboard",
    MEGALIGHT: "Megalight",
    CLP: "CLP",
    MEGABOARD: "Megaboard",
    KULEBOARD: "Kuleboard",
    ALINLIK: "Alınlık",
    LIGHTBOX: "Lightbox",
    MAXIBOARD: "Maxiboard",
    YOL_PANOSU: "Yol Panosu"
};

// Traffic Level Türkçe İsimleri
export const TRAFFIC_LEVEL_LABELS: Record<string, string> = {
    LOW: "Düşük Trafik",
    MEDIUM: "Orta Trafik",
    HIGH: "Yüksek Trafik",
    VERY_HIGH: "Çok Yüksek Trafik"
};

// Traffic Level Renkleri (Tailwind)
export const TRAFFIC_LEVEL_COLORS: Record<string, string> = {
    LOW: "text-gray-600 bg-gray-100",
    MEDIUM: "text-blue-600 bg-blue-100",
    HIGH: "text-orange-600 bg-orange-100",
    VERY_HIGH: "text-red-600 bg-red-100"
};

// Panel Type İконları (emoji veya lucide icon name)
export const PANEL_TYPE_ICONS: Record<string, string> = {
    BILLBOARD: "📋",
    BILLBOARD_PLUS: "📊",
    GIANTBOARD: "🏢",
    MEGALIGHT: "💡",
    CLP: "🎯",
    MEGABOARD: "🖼️",
    KULEBOARD: "🏛️",
    ALINLIK: "🔖",
    LIGHTBOX: "💫",
    MAXIBOARD: "🌟",
    YOL_PANOSU: "🛣️"
};

// Reach Rate (impression'dan kaç kişiye ulaştığı tahmini)
// Örnek: 10,000 impression × 0.4 = 4,000 unique reach
export const REACH_RATE_BY_TRAFFIC: Record<string, number> = {
    LOW: 0.25,      // 1 impression = 0.25 kişi (aynı kişi 4 kez görür)
    MEDIUM: 0.35,   // 1 impression = 0.35 kişi
    HIGH: 0.45,     // 1 impression = 0.45 kişi
    VERY_HIGH: 0.55 // 1 impression = 0.55 kişi
};

// Helper function: Calculate reach from impressions
export function calculateReach(impressions: number, trafficLevel: string): number {
    const reachRate = REACH_RATE_BY_TRAFFIC[trafficLevel] || 0.35;
    return Math.round(impressions * reachRate);
}

// Helper function: Calculate total days between dates
export function calculateTotalDays(startDate: Date, endDate: Date): number {
    const diff = endDate.getTime() - startDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end date
}

// Helper function: Calculate estimated impressions
export function calculateEstimatedImpressions(
    dailyImpressions: number,
    totalDays: number
): number {
    return dailyImpressions * totalDays;
}
