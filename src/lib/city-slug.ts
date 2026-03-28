import { TURKEY_CITIES } from "@/lib/turkey-data";

/** ASCII URL slug for Turkish city names (matches tr-TR rules + common diacritics). */
export function cityToSlug(cityName: string): string {
    const lower = cityName.toLocaleLowerCase("tr-TR");
    const map: Record<string, string> = {
        ç: "c",
        ğ: "g",
        ı: "i",
        ö: "o",
        ş: "s",
        ü: "u",
        â: "a",
        î: "i",
        û: "u",
    };
    return lower
        .split("")
        .map((ch) => map[ch] ?? ch)
        .join("")
        .replace(/\s+/g, "-");
}

export function cityFromSlug(slug: string): string | undefined {
    const normalized = slug.trim().toLowerCase();
    return TURKEY_CITIES.find((city) => cityToSlug(city) === normalized);
}
