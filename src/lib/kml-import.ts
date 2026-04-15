/**
 * Google My Maps KML (Placemark + Point) → toplu import satırları.
 * Koordinat sırası KML standardı: boylam, enlem.
 */

export interface KmlPlacemarkParsed {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    imageUrl: string | null;
}

export interface KmlImportDefaults {
    type: string;
    city: string;
    district: string;
    width: string;
    height: string;
    priceWeekly: string;
    locationType: string;
    trafficLevel: string;
    estimatedDailyImpressions: string;
}

export const DEFAULT_KML_PANEL_DEFAULTS: KmlImportDefaults = {
    type: "MEGABOARD",
    city: "İstanbul",
    district: "Otoyol / güzergâh",
    width: "24",
    height: "8",
    priceWeekly: "45000",
    locationType: "HIGHWAY",
    trafficLevel: "HIGH",
    estimatedDailyImpressions: "45000",
};

/** Ham KML metninden placemark listesi (dosya doğrulaması / önizleme için). */
export function parseKmlPlacemarks(xml: string): KmlPlacemarkParsed[] {
    const out: KmlPlacemarkParsed[] = [];
    const re = /<Placemark>([\s\S]*?)<\/Placemark>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(xml)) !== null) {
        const block = m[1];
        const nameMatch = block.match(/<name>([\s\S]*?)<\/name>/);
        let name = nameMatch ? nameMatch[1].trim().replace(/\u00a0/g, " ").replace(/\s+/g, " ") : "Adsız";
        const coordMatch = block.match(/<coordinates>\s*([\d.,\-\s]+)\s*<\/coordinates>/);
        if (!coordMatch) continue;
        const nums = coordMatch[1]
            .trim()
            .split(/[\s,]+/)
            .map(Number)
            .filter((n) => !Number.isNaN(n));
        if (nums.length < 2) continue;
        const lng = nums[0];
        const lat = nums[1];
        const imgMatch = block.match(/<img[^>]+src="([^"]+)"/i);
        const imageUrl = imgMatch ? imgMatch[1].trim() : null;
        out.push({
            name,
            address: name,
            latitude: lat,
            longitude: lng,
            imageUrl,
        });
    }
    return out;
}

/** Import ekranı / API gövdesi için düz kayıt (string alanlar). */
export function kmlToImportRowStrings(
    p: KmlPlacemarkParsed,
    defaults: KmlImportDefaults = DEFAULT_KML_PANEL_DEFAULTS
): Record<string, string> {
    return {
        name: p.name,
        type: defaults.type,
        city: defaults.city,
        district: defaults.district,
        address: p.address,
        latitude: String(p.latitude),
        longitude: String(p.longitude),
        width: defaults.width,
        height: defaults.height,
        priceWeekly: defaults.priceWeekly,
        locationType: defaults.locationType,
        trafficLevel: defaults.trafficLevel,
        estimatedDailyImpressions: defaults.estimatedDailyImpressions,
        imageUrl: p.imageUrl || "",
    };
}

export function kmlXmlToPanelImportRows(
    xml: string,
    defaults?: Partial<KmlImportDefaults>
): Record<string, string>[] {
    const d = { ...DEFAULT_KML_PANEL_DEFAULTS, ...defaults };
    return parseKmlPlacemarks(xml).map((p) => kmlToImportRowStrings(p, d) as Record<string, string>);
}
