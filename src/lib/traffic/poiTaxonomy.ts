/**
 * POI taksonomisi + marka normalize
 *
 * OSM Overpass'tan gelen ham tag'leri Panobu'nun kategori/marka sistemine
 * çeviren saf fonksiyonlar. Hiç ağ çağrısı yok — her yerden güvenle import
 * edilebilir.
 */

export type PoiCategory =
    | "SUPERMARKET"
    | "CONVENIENCE"
    | "MALL"
    | "DEPARTMENT_STORE"
    | "PHARMACY"
    | "BANK"
    | "ATM"
    | "FUEL"
    | "RESTAURANT"
    | "FAST_FOOD"
    | "CAFE"
    | "BAR"
    | "SCHOOL"
    | "UNIVERSITY"
    | "HOSPITAL"
    | "CLINIC"
    | "HOTEL"
    | "MARKETPLACE"
    | "PARK"
    | "STADIUM"
    | "SPORTS_CENTRE"
    | "TOURIST_ATTRACTION"
    | "BUS_STATION"
    | "TRAIN_STATION"
    | "ELECTRONICS"
    | "CLOTHING"
    | "FURNITURE"
    | "OTHER";

/** Türkçe (arayüz) etiketleri — UI'da göstermek için */
export const POI_CATEGORY_LABELS: Record<PoiCategory, string> = {
    SUPERMARKET: "Süpermarket",
    CONVENIENCE: "Market / Bakkal",
    MALL: "AVM",
    DEPARTMENT_STORE: "Büyük Mağaza",
    PHARMACY: "Eczane",
    BANK: "Banka",
    ATM: "ATM",
    FUEL: "Akaryakıt",
    RESTAURANT: "Restoran",
    FAST_FOOD: "Fast Food",
    CAFE: "Kafe",
    BAR: "Bar / Pub",
    SCHOOL: "Okul",
    UNIVERSITY: "Üniversite",
    HOSPITAL: "Hastane",
    CLINIC: "Klinik / Poliklinik",
    HOTEL: "Otel",
    MARKETPLACE: "Semt Pazarı",
    PARK: "Park",
    STADIUM: "Stadyum",
    SPORTS_CENTRE: "Spor Merkezi",
    TOURIST_ATTRACTION: "Turistik Nokta",
    BUS_STATION: "Otogar / Otobüs Dur.",
    TRAIN_STATION: "Tren / Metro",
    ELECTRONICS: "Elektronik Mağaza",
    CLOTHING: "Giyim Mağazası",
    FURNITURE: "Mobilya / Ev Eşyası",
    OTHER: "Diğer",
};

/** UI için kategori ikonları (lucide-react isim) */
export const POI_CATEGORY_ICONS: Record<PoiCategory, string> = {
    SUPERMARKET: "ShoppingCart",
    CONVENIENCE: "Store",
    MALL: "ShoppingBag",
    DEPARTMENT_STORE: "Store",
    PHARMACY: "Cross",
    BANK: "Landmark",
    ATM: "CreditCard",
    FUEL: "Fuel",
    RESTAURANT: "UtensilsCrossed",
    FAST_FOOD: "Pizza",
    CAFE: "Coffee",
    BAR: "Beer",
    SCHOOL: "School",
    UNIVERSITY: "GraduationCap",
    HOSPITAL: "Stethoscope",
    CLINIC: "HeartPulse",
    HOTEL: "Bed",
    MARKETPLACE: "Store",
    PARK: "Trees",
    STADIUM: "Trophy",
    SPORTS_CENTRE: "Dumbbell",
    TOURIST_ATTRACTION: "Camera",
    BUS_STATION: "Bus",
    TRAIN_STATION: "TrainFront",
    ELECTRONICS: "Monitor",
    CLOTHING: "Shirt",
    FURNITURE: "Armchair",
    OTHER: "MapPin",
};

/**
 * OSM tag'lerinden bizim PoiCategory'ye çevrim.
 * Öncelik: shop > amenity > tourism > leisure > public_transport
 */
export function mapOsmTagsToCategory(tags: Record<string, string>): PoiCategory | null {
    const shop = tags.shop?.toLowerCase();
    const amenity = tags.amenity?.toLowerCase();
    const tourism = tags.tourism?.toLowerCase();
    const leisure = tags.leisure?.toLowerCase();
    const publicTransport = tags.public_transport?.toLowerCase();
    const railway = tags.railway?.toLowerCase();

    if (shop) {
        if (["supermarket"].includes(shop)) return "SUPERMARKET";
        if (["convenience", "kiosk", "general"].includes(shop)) return "CONVENIENCE";
        if (["mall"].includes(shop)) return "MALL";
        if (["department_store"].includes(shop)) return "DEPARTMENT_STORE";
        if (["electronics", "computer", "mobile_phone"].includes(shop)) return "ELECTRONICS";
        if (
            [
                "clothes",
                "shoes",
                "fashion",
                "boutique",
                "jewelry",
            ].includes(shop)
        )
            return "CLOTHING";
        if (["furniture", "houseware", "interior_decoration"].includes(shop))
            return "FURNITURE";
    }

    if (amenity) {
        if (amenity === "pharmacy") return "PHARMACY";
        if (amenity === "bank") return "BANK";
        if (amenity === "atm") return "ATM";
        if (amenity === "fuel") return "FUEL";
        if (amenity === "restaurant") return "RESTAURANT";
        if (amenity === "fast_food") return "FAST_FOOD";
        if (["cafe", "ice_cream"].includes(amenity)) return "CAFE";
        if (["bar", "pub", "nightclub"].includes(amenity)) return "BAR";
        if (["school", "kindergarten"].includes(amenity)) return "SCHOOL";
        if (["university", "college"].includes(amenity)) return "UNIVERSITY";
        if (amenity === "hospital") return "HOSPITAL";
        if (["clinic", "doctors", "dentist"].includes(amenity)) return "CLINIC";
        if (amenity === "marketplace") return "MARKETPLACE";
        if (amenity === "bus_station") return "BUS_STATION";
    }

    if (tourism) {
        if (["hotel", "motel", "hostel", "apartment"].includes(tourism)) return "HOTEL";
        if (["attraction", "museum", "viewpoint"].includes(tourism))
            return "TOURIST_ATTRACTION";
    }

    if (leisure) {
        if (leisure === "stadium") return "STADIUM";
        if (["sports_centre", "fitness_centre"].includes(leisure))
            return "SPORTS_CENTRE";
        if (["park", "garden", "playground"].includes(leisure)) return "PARK";
    }

    if (railway === "station" || publicTransport === "station") {
        return "TRAIN_STATION";
    }

    return null;
}

// ------------------------------------------------------------
// Marka normalize — OSM `brand`/`name` tag'inden bizim brand code
// ------------------------------------------------------------

/**
 * Normalize bilinen Türkiye ve uluslararası zincir markalarını.
 * Girdi: OSM `brand`, `brand:en` veya `name` tag'i
 * Çıktı: Panobu marka kodu ya da null
 */
const BRAND_ALIASES: Array<{ code: string; patterns: RegExp[] }> = [
    // Market zincirleri
    { code: "MIGROS", patterns: [/\bmigros\b/i, /\bmigros\s*jet\b/i, /\bmacro\s*center\b/i, /\b5m\s*migros\b/i] },
    { code: "BIM", patterns: [/^bi[mn]$/i, /\bbi[mn]\b/i] },
    { code: "SOK", patterns: [/^[şs]ok$/i, /\b[şs]ok\s*market\b/i] },
    { code: "A101", patterns: [/\ba\s*-?\s*101\b/i] },
    { code: "CARREFOURSA", patterns: [/carrefour\s*sa/i, /carrefoursa/i, /carrefour/i] },
    { code: "METRO", patterns: [/^metro(?!politan)/i, /metro\s*grosmarket/i] },
    { code: "HAKMAR", patterns: [/hakmar/i] },
    { code: "FILE", patterns: [/\bfile\s*market\b/i, /^file$/i] },
    { code: "ONUR", patterns: [/\bonur\s*market\b/i] },
    // Kafe / fast food
    { code: "STARBUCKS", patterns: [/starbucks/i] },
    { code: "KAHVE_DUNYASI", patterns: [/kahve\s*d[uü]nyas[iı]/i] },
    { code: "MADO", patterns: [/\bmado\b/i] },
    { code: "SIMIT_SARAYI", patterns: [/simit\s*saray[iı]/i] },
    { code: "MCDONALDS", patterns: [/mcdonald/i, /mc ?donald/i] },
    { code: "BURGER_KING", patterns: [/burger\s*king/i] },
    { code: "KFC", patterns: [/\bkfc\b/i] },
    { code: "POPEYES", patterns: [/popeyes/i] },
    { code: "DOMINOS", patterns: [/domino'?s/i] },
    { code: "PIZZA_HUT", patterns: [/pizza\s*hut/i] },
    { code: "SUBWAY", patterns: [/\bsubway\b/i] },
    { code: "TAVUK_DUNYASI", patterns: [/tavuk\s*d[uü]nyas[iı]/i] },
    { code: "KOMAGENE", patterns: [/komagene/i] },
    { code: "EKMEK_TEKNESI", patterns: [/ekmek\s*teknesi/i] },
    { code: "BAKLAVACI_GULLUOGLU", patterns: [/g[uü]ll[uü]o[gğ]lu/i] },
    { code: "CAFE_CREPE", patterns: [/cafe\s*crepe/i] },
    { code: "CARIBOU", patterns: [/caribou/i] },
    { code: "GLORIA_JEANS", patterns: [/gloria\s*jean'?s/i] },
    { code: "JOHNNY_ROCKETS", patterns: [/johnny\s*rockets/i] },
    { code: "TACO_BELL", patterns: [/taco\s*bell/i] },
    { code: "SBARRO", patterns: [/sbarro/i] },
    { code: "COFFY", patterns: [/^coffy$/i] },
    { code: "BURGER_BUFFET", patterns: [/burger\s*buffet/i] },
    { code: "WAFFLE_HOUSE", patterns: [/waffle\s*house/i] },
    // Banka
    { code: "AKBANK", patterns: [/akbank/i] },
    { code: "ISBANK", patterns: [/i[sş]\s*bankas[iı]/i, /\bi[sş]bank\b/i] },
    { code: "GARANTI", patterns: [/garanti\s*bbva/i, /garanti\s*bankas[iı]/i, /^garanti$/i] },
    { code: "YAPIKREDI", patterns: [/yap[iı]\s*kredi/i] },
    { code: "ZIRAAT", patterns: [/ziraat\s*bankas[iı]/i, /^ziraat$/i] },
    { code: "QNB", patterns: [/\bqnb\b/i, /qnb\s*finansbank/i, /finansbank/i] },
    { code: "HALKBANK", patterns: [/halk\s*bankas[iı]/i, /^halkbank$/i] },
    { code: "VAKIFBANK", patterns: [/vak[iı]fbank/i, /vak[iı]f\s*bankas[iı]/i] },
    { code: "DENIZBANK", patterns: [/deniz\s*bank/i] },
    { code: "TEB", patterns: [/\bteb\b/i] },
    { code: "ING", patterns: [/^ing$/i, /ing\s*bank/i] },
    // Akaryakıt
    { code: "SHELL", patterns: [/^shell$/i, /shell/i] },
    { code: "OPET", patterns: [/^opet$/i] },
    { code: "BP", patterns: [/^bp$/i] },
    { code: "PETROL_OFISI", patterns: [/petrol\s*ofisi/i, /^p\.o\.?$/i, /^po\s+/i] },
    { code: "TP", patterns: [/t[uü]rkiye\s*petrolleri/i, /^tp$/i, /^t\.p\.?$/i] },
    { code: "AYTEMIZ", patterns: [/aytemiz/i] },
    { code: "TOTAL", patterns: [/^total$/i, /totalenergies/i] },
    { code: "LUKOIL", patterns: [/lukoil/i] },
    { code: "GAZPROM", patterns: [/gazprom/i] },
    { code: "EKOPET", patterns: [/ekopet/i] },
    { code: "KADOIL", patterns: [/kadoil/i] },
    { code: "TERMOPET", patterns: [/termopet/i] },
    { code: "ALPET", patterns: [/\balpet\b/i] },
    { code: "MMG", patterns: [/^mmg\b/i] },
    // Elektronik / Teknoloji
    { code: "TEKNOSA", patterns: [/teknosa/i] },
    { code: "MEDIAMARKT", patterns: [/media\s*markt/i] },
    { code: "VATAN", patterns: [/vatan\s*bilgisayar/i, /^vatan$/i] },
    { code: "TURKCELL", patterns: [/turkcell/i] },
    { code: "VODAFONE", patterns: [/vodafone/i] },
    { code: "TURK_TELEKOM", patterns: [/t[uü]rk\s*telekom/i] },
    // Mobilya / ev
    { code: "IKEA", patterns: [/ikea/i] },
    { code: "KOCTAS", patterns: [/ko[cç]ta[sş]/i] },
    { code: "BAUHAUS", patterns: [/bauhaus/i] },
    { code: "MUDO", patterns: [/mudo/i] },
    { code: "BELLONA", patterns: [/bellona/i] },
    { code: "ISTIKBAL", patterns: [/istikbal/i] },
    // Giyim
    { code: "LCW", patterns: [/lc\s*waikiki/i, /^lcw$/i] },
    { code: "DEFACTO", patterns: [/defacto/i] },
    { code: "KOTON", patterns: [/koton/i] },
    { code: "MAVI", patterns: [/^mavi$/i] },
    { code: "COLINS", patterns: [/colin['’]?s/i] },
    { code: "ZARA", patterns: [/^zara$/i] },
    { code: "HM", patterns: [/^h&m$/i, /^h\s*m$/i] },
    // Gıda toptan / ev dışı
    { code: "WATSONS", patterns: [/watsons/i] },
    { code: "GRATIS", patterns: [/gratis/i] },
    { code: "ROSSMANN", patterns: [/rossmann/i] },
];

export function normalizeBrand(
    brandTag?: string | null,
    name?: string | null,
): string | null {
    const candidates = [brandTag, name]
        .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
        .map((x) => x.trim());
    if (candidates.length === 0) return null;
    for (const candidate of candidates) {
        for (const entry of BRAND_ALIASES) {
            if (entry.patterns.some((p) => p.test(candidate))) {
                return entry.code;
            }
        }
    }
    return null;
}

// ------------------------------------------------------------
// Geo yardımcılar — mesafe + bearing + yön
// ------------------------------------------------------------

const toRad = (x: number) => (x * Math.PI) / 180;
const toDeg = (x: number) => (x * 180) / Math.PI;

export function haversineMeters(
    aLat: number,
    aLng: number,
    bLat: number,
    bLng: number,
): number {
    const R = 6_371_000;
    const dLat = toRad(bLat - aLat);
    const dLng = toRad(bLng - aLng);
    const s =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(s));
}

/**
 * A noktasından B noktasına bakıldığında ilk yön (0-360°, 0=Kuzey).
 */
export function bearingDegrees(
    aLat: number,
    aLng: number,
    bLat: number,
    bLng: number,
): number {
    const φ1 = toRad(aLat);
    const φ2 = toRad(bLat);
    const Δλ = toRad(bLng - aLng);
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x =
        Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const θ = Math.atan2(y, x);
    return (toDeg(θ) + 360) % 360;
}

export type CompassDirection = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

export const DIRECTION_LABELS: Record<CompassDirection, string> = {
    N: "Kuzey",
    NE: "Kuzeydoğu",
    E: "Doğu",
    SE: "Güneydoğu",
    S: "Güney",
    SW: "Güneybatı",
    W: "Batı",
    NW: "Kuzeybatı",
};

export function bearingToDirection(bearing: number): CompassDirection {
    const b = ((bearing % 360) + 360) % 360;
    if (b < 22.5 || b >= 337.5) return "N";
    if (b < 67.5) return "NE";
    if (b < 112.5) return "E";
    if (b < 157.5) return "SE";
    if (b < 202.5) return "S";
    if (b < 247.5) return "SW";
    if (b < 292.5) return "W";
    return "NW";
}
