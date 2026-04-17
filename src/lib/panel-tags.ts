/**
 * Pano çevresindeki noktalar (POI) için önerilen etiketler.
 * Medya sahibi kendi panosunun çevresinde bulunan dükkan / tesis tiplerini bu
 * etiketler üzerinden belirtir. İleride reklamverenlere öneri sistemi yapılırken
 * bu etiketler kullanılacak (ör. "otel yakınında", "market yakınında").
 */

export const NEARBY_TAG_GROUPS: { title: string; tags: string[] }[] = [
    {
        title: "Alışveriş",
        tags: [
            "Market",
            "Süpermarket",
            "AVM",
            "Alışveriş Merkezi",
            "Giyim Mağazası",
            "Mobilya",
            "Beyaz Eşya",
            "Elektronik",
            "Pazar",
        ],
    },
    {
        title: "Yeme & İçme",
        tags: [
            "Restoran",
            "Kafe",
            "Fast Food",
            "Pastane",
            "Fırın",
            "Tekel",
            "Bar",
            "Nargile Kafe",
        ],
    },
    {
        title: "Konaklama & Turizm",
        tags: ["Otel", "Hostel", "Apart", "Tatil Köyü", "Plaj", "Turistik Nokta"],
    },
    {
        title: "Eğitim & Sağlık",
        tags: [
            "Üniversite",
            "Okul",
            "Kreş",
            "Dershane",
            "Hastane",
            "Poliklinik",
            "Eczane",
            "Diş Kliniği",
            "Veteriner",
        ],
    },
    {
        title: "Finans & Ofis",
        tags: ["Banka", "ATM", "Plaza", "İş Merkezi", "Ofis Bölgesi", "Fabrika"],
    },
    {
        title: "Ulaşım",
        tags: [
            "Metro",
            "Metrobüs",
            "Tramvay",
            "Otobüs Durağı",
            "Tren İstasyonu",
            "Havalimanı",
            "Otogar",
            "Benzin İstasyonu",
            "Oto Galeri",
            "Otopark",
        ],
    },
    {
        title: "Eğlence & Yaşam",
        tags: [
            "Sinema",
            "Tiyatro",
            "Spor Salonu",
            "Fitness",
            "Yüzme Havuzu",
            "Park",
            "Meydan",
            "Stadyum",
            "Cami",
            "Kilise",
            "Kuaför",
            "Güzellik Merkezi",
        ],
    },
    {
        title: "Konut & Bölge",
        tags: [
            "Konut Bölgesi",
            "Site",
            "Rezidans",
            "Yeni Proje",
            "Şantiye",
            "Sanayi Bölgesi",
        ],
    },
];

export const ALL_NEARBY_TAGS: string[] = NEARBY_TAG_GROUPS.flatMap((g) => g.tags);

export function normalizeTag(input: string): string {
    return input.trim().replace(/\s+/g, " ");
}
