/**
 * Google Maps URL'lerinden koordinat çıkarma yardımcı fonksiyonları
 */

export interface Coordinates {
    latitude: number;
    longitude: number;
}

/**
 * Google Maps URL'sinden enlem/boylam çıkarır.
 * Desteklenen formatlar:
 *  - https://www.google.com/maps/place/.../@LAT,LNG,...
 *  - https://www.google.com/maps?q=LAT,LNG
 *  - https://www.google.com/maps/place/LAT,LNG
 *  - https://goo.gl/maps/... (kısa URL - sadece parse edilebiliyorsa)
 *  - https://maps.google.com/?ll=LAT,LNG
 *  - Ham koordinat string: "LAT,LNG"
 */
export function parseGoogleMapsUrl(url: string): Coordinates | null {
    if (!url || typeof url !== 'string') return null;

    const trimmed = url.trim();

    // Ham koordinat: "40.7897,29.4104"
    const rawCoordMatch = trimmed.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
    if (rawCoordMatch) {
        const lat = parseFloat(rawCoordMatch[1]);
        const lng = parseFloat(rawCoordMatch[2]);
        if (isValidCoordinates(lat, lng)) return { latitude: lat, longitude: lng };
    }

    // @LAT,LNG formatı (en yaygın)
    const atMatch = trimmed.match(/@(-?\d+\.?\d+),(-?\d+\.?\d+)/);
    if (atMatch) {
        const lat = parseFloat(atMatch[1]);
        const lng = parseFloat(atMatch[2]);
        if (isValidCoordinates(lat, lng)) return { latitude: lat, longitude: lng };
    }

    // /place/LAT,LNG formatı
    const placeMatch = trimmed.match(/\/place\/(-?\d+\.?\d+),(-?\d+\.?\d+)/);
    if (placeMatch) {
        const lat = parseFloat(placeMatch[1]);
        const lng = parseFloat(placeMatch[2]);
        if (isValidCoordinates(lat, lng)) return { latitude: lat, longitude: lng };
    }

    // ?q=LAT,LNG formatı
    const qMatch = trimmed.match(/[?&]q=(-?\d+\.?\d+),(-?\d+\.?\d+)/);
    if (qMatch) {
        const lat = parseFloat(qMatch[1]);
        const lng = parseFloat(qMatch[2]);
        if (isValidCoordinates(lat, lng)) return { latitude: lat, longitude: lng };
    }

    // ?ll=LAT,LNG formatı
    const llMatch = trimmed.match(/[?&]ll=(-?\d+\.?\d+),(-?\d+\.?\d+)/);
    if (llMatch) {
        const lat = parseFloat(llMatch[1]);
        const lng = parseFloat(llMatch[2]);
        if (isValidCoordinates(lat, lng)) return { latitude: lat, longitude: lng };
    }

    // URL'de herhangi bir yerde iki ondalıklı sayı aranıyor (son çare)
    const anyCoordMatch = trimmed.match(/(-?\d{1,3}\.\d{4,}),\s*(-?\d{1,3}\.\d{4,})/);
    if (anyCoordMatch) {
        const lat = parseFloat(anyCoordMatch[1]);
        const lng = parseFloat(anyCoordMatch[2]);
        if (isValidCoordinates(lat, lng)) return { latitude: lat, longitude: lng };
    }

    return null;
}

function isValidCoordinates(lat: number, lng: number): boolean {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180 && !isNaN(lat) && !isNaN(lng);
}

/**
 * Boyut stringini metre cinsine çevirir.
 * "385x260cm" -> { width: 3.85, height: 2.60 }
 * "3x8m" -> { width: 3, height: 8 }
 * "500x200" -> cm olarak varsayar -> { width: 5, height: 2 }
 */
export function parseDimensions(dimensionStr: string): { width: number; height: number } | null {
    if (!dimensionStr) return null;

    const str = dimensionStr.trim().toLowerCase();

    const match = str.match(/(\d+\.?\d*)\s*[x×]\s*(\d+\.?\d*)\s*(cm|m)?/i);
    if (!match) return null;

    let w = parseFloat(match[1]);
    let h = parseFloat(match[2]);
    const unit = match[3];

    if (unit === 'cm' || (!unit && (w > 50 || h > 50))) {
        w = w / 100;
        h = h / 100;
    }

    return { width: w, height: h };
}

/**
 * PanelType enum değerine normalize eder.
 * Çeşitli yazım biçimlerini kabul eder.
 */
const PANEL_TYPE_MAP: Record<string, string> = {
    'billboard': 'BILLBOARD',
    'bilboard': 'BILLBOARD',
    'billboard+': 'BILLBOARD_PLUS',
    'billboard plus': 'BILLBOARD_PLUS',
    'giantboard': 'GIANTBOARD',
    'giant board': 'GIANTBOARD',
    'megalight': 'MEGALIGHT',
    'mega light': 'MEGALIGHT',
    'megalayt': 'MEGALIGHT',
    'clp': 'CLP',
    'raket': 'CLP',
    'raket/clp': 'CLP',
    'raket clp': 'CLP',
    'megaboard': 'MEGABOARD',
    'mega board': 'MEGABOARD',
    'ultraboard': 'MEGABOARD',
    'ultra board': 'MEGABOARD',
    'kuleboard': 'KULEBOARD',
    'kule board': 'KULEBOARD',
    'alinlik': 'ALINLIK',
    'alınlık': 'ALINLIK',
    'lightbox': 'LIGHTBOX',
    'light box': 'LIGHTBOX',
    'maxiboard': 'MAXIBOARD',
    'maxi board': 'MAXIBOARD',
    'yol panosu': 'YOL_PANOSU',
    'yol_panosu': 'YOL_PANOSU',
    'led ekran': 'BILLBOARD',
    'led': 'BILLBOARD',
    'sabit pano': 'BILLBOARD',
    'duvar reklam': 'BILLBOARD',
};

const VALID_PANEL_TYPES = [
    'BILLBOARD', 'BILLBOARD_PLUS', 'GIANTBOARD', 'MEGALIGHT', 'CLP',
    'MEGABOARD', 'KULEBOARD', 'ALINLIK', 'LIGHTBOX', 'MAXIBOARD', 'YOL_PANOSU'
];

export function normalizePanelType(input: string): string | null {
    if (!input) return null;
    const upper = input.trim().toUpperCase();
    if (VALID_PANEL_TYPES.includes(upper)) return upper;

    const lower = input.trim().toLowerCase();
    return PANEL_TYPE_MAP[lower] || null;
}

const VALID_LOCATION_TYPES = ['AVM', 'HIGHWAY', 'MAIN_ROAD', 'CITY_CENTER', 'SQUARE', 'STREET', 'OPEN_AREA', 'OTHER'];

export function normalizeLocationType(input: string): string {
    if (!input) return 'OPEN_AREA';
    const upper = input.trim().toUpperCase().replace(/\s+/g, '_');
    if (VALID_LOCATION_TYPES.includes(upper)) return upper;
    return 'OPEN_AREA';
}
