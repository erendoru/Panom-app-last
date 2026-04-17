import type { AppLocale } from "@/messages/publicNav";
import { PANEL_TYPE_LABELS, TRAFFIC_LEVEL_LABELS } from "@/lib/turkey-data";

const PANEL_TYPE_EN: Record<string, string> = {
    ...PANEL_TYPE_LABELS,
    ALINLIK: "Header board",
    YOL_PANOSU: "Roadside panel",
};

const TRAFFIC_EN: Record<string, string> = {
    LOW: "Low traffic",
    MEDIUM: "Medium traffic",
    HIGH: "High traffic",
    VERY_HIGH: "Very high traffic",
};

export function panelTypeLabel(type: string, locale: AppLocale): string {
    if (locale === "en") return PANEL_TYPE_EN[type] ?? PANEL_TYPE_LABELS[type] ?? type;
    return PANEL_TYPE_LABELS[type] ?? type;
}

export function trafficLevelLabel(level: string, locale: AppLocale): string {
    if (locale === "en") return TRAFFIC_EN[level] ?? TRAFFIC_LEVEL_LABELS[level] ?? level;
    return TRAFFIC_LEVEL_LABELS[level] ?? level;
}

const LOCATION_EN: Record<string, string> = {
    OPEN_AREA: "Open area",
    AVM: "Mall interior",
    HIGHWAY: "Highway",
    E5: "E5 route",
    CITY_CENTER: "City center",
    METRO: "Metro",
    STADIUM: "Stadium",
    HOSPITAL: "Hospital",
    UNIVERSITY: "University",
    AIRPORT: "Airport",
};

const LOCATION_TR: Record<string, string> = {
    OPEN_AREA: "Açık Alan",
    AVM: "AVM İçi",
    HIGHWAY: "Otoyol",
    E5: "E5 Yolu",
    CITY_CENTER: "Şehir Merkezi",
    METRO: "Metro",
    STADIUM: "Stadyum",
    HOSPITAL: "Hastane",
    UNIVERSITY: "Üniversite",
    AIRPORT: "Havalimanı",
};

export function locationTypeLabel(code: string, locale: AppLocale): string {
    if (locale === "en") return LOCATION_EN[code] ?? code;
    return LOCATION_TR[code] ?? LOCATION_EN[code] ?? code;
}
