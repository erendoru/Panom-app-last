/** Turkish-aware ASCII slugifier (re-uses cityToSlug rules for accents). */
export function slugify(input: string): string {
    const lower = input.trim().toLocaleLowerCase("tr-TR");
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
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 64);
}
