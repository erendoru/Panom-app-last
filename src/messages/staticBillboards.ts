import type { AppLocale } from "@/messages/publicNav";

export function staticBillboardsCopy(locale: AppLocale) {
    const e = locale === "en";
    return {
        backHome: e ? "Home" : "Ana Sayfa",
        pageTitle: e ? "AD UNITS" : "REKLAM ÜNİTELERİ",
        loading: e ? "Loading…" : "Yükleniyor…",
        mapLoading: e ? "Loading map…" : "Harita Yükleniyor…",
        panelsLoading: e ? "Loading units…" : "Panolar yükleniyor…",
        panelType: e ? "Face type" : "Pano Tipi",
        price: e ? "Price" : "Fiyat",
        location: e ? "Location" : "Konum",
        allLocations: e ? "All" : "Tümü",
        mallInterior: e ? "Mall interior" : "🏬 AVM İçi",
        openArea: e ? "Open area" : "🏙️ Açık Alan",
        clearFilters: e ? "Clear ×" : "Temizle ×",
        priceDropdownHint: e
            ? "Use the full filter panel on the right for detailed price range."
            : "Detaylı fiyat ayarı için sağdaki filtre menüsünü kullanın.",
        filtersHide: e ? "Hide filters" : "Filtreleri Gizle",
        filtersShow: e ? "All filters" : "Tüm Filtreler",
        panelCountMobile: (n: number) => (e ? `${n} units` : `${n} pano`),
        panelCountDesktop: (n: number) => (e ? `${n} units found` : `${n} pano bulundu`),
        filtersTitle: e ? "Filters" : "Filtreler",
        priceRange: e ? "Price range" : "Fiyat Aralığı",
        sizeRange: e ? "Face size (m²)" : "Pano Boyutu (m²)",
        panelKind: e ? "Face type" : "Pano Türü",
        traffic: e ? "Traffic level" : "Trafik Yoğunluğu",
        selected: (n: number) => (e ? `${n} selected` : `${n} seçili`),
        resetFilters: e ? "Clear filters" : "Filtreleri Temizle",
        closeAria: e ? "Close" : "Kapat",
        availability: e ? "Available" : "Müsait",
        doubleSidedShort: e ? "Double-sided" : "Çift yüz",
        visibility: e ? "Visibility" : "Görünürlük",
        grade: e ? "Grade" : "Sınıf",
        daily: e ? "Daily" : "Günlük",
        impressions: e ? "Impressions" : "İzlenme",
        otsHigh: e ? "High" : "Yüksek",
        angleFull: e ? "Full" : "Tam",
        duration247: e ? "24/7" : "7/24",
        angle: e ? "Angle" : "Açı",
        duration: e ? "Duration" : "Süre",
        technical: e ? "Specs" : "Teknik",
        size: e ? "Size" : "Boyut",
        area: e ? "Area" : "Alan",
        minRental: e ? "Min. rental" : "Min. kiralama",
        days: e ? "days" : "gün",
        lighting: e ? "Lighting" : "Aydınlatma",
        weeklyRental: e ? "Weekly rental" : "Haftalık kiralama",
        startingFrom: e ? "Starting from" : "’den başlayan",
        plusVat: e ? "+ VAT" : "+ KDV",
        addToCart: e ? "Add to cart" : "Sepete ekle",
        addedToCart: e ? "Added to cart" : "Sepete eklendi",
        cartHint: e ? "Dates & payment: cart → checkout" : "Tarih ve ödeme: sepet → ödeme adımları",
        panelNotFound: e ? "Unit details not found" : "Pano bilgisi bulunamadı",
        genericError: e ? "Something went wrong" : "Bir hata oluştu",
        connectionError: e ? "Connection error" : "Bağlantı hatası",
        clpNoteTitle: e ? "Double-sided:" : "Çift yüz:",
        clpNoteBody: e
            ? "Price is for one face; mark double-sided in the cart."
            : "Fiyat tek yüz içindir; çift yüz için sepette işaretleyin.",
        clpKocaeli: e ? "20+ CLP → ₺1,500/week" : "20+ CLP → 1.500₺/hafta",
        locationFallback: e ? "Location" : "Lokasyon",
        openAreaBadge: e ? "Open area" : "Açık alan",
    };
}

export function staticBillboardsCityLabel(city: string, locale: AppLocale): string {
    if (city === "Tümü" && locale === "en") return "All";
    return city;
}
