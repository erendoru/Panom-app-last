import sharp from "sharp";

/** Her kenardan atılacak oran (0–1); toplam karşı kenarlar görüntüyü fazla yemesin. */
export type EdgeFractions = {
    left: number;
    top: number;
    right: number;
    bottom: number;
};

function clampEdge(n: number): number {
    if (Number.isNaN(n)) return 0.28;
    return Math.min(0.48, Math.max(0.05, n));
}

/**
 * Logo / dikey URL genelde sağda: sağdan belirgin şekilde daha fazla kesilir.
 * (Sağ %48 → clamp üst sınırına yakın; sol/üst/alt daha hafif.)
 */
export const PRESET_HEAVY_RIGHT: EdgeFractions = {
    left: 0.24,
    top: 0.26,
    right: 0.48,
    bottom: 0.26,
};

/**
 * Kenar başına ayrı oran: soldan `left` oranında piksel atılır, sağdan `right` vb.
 * Kalan dikdörtgen `extract` ile alınır, JPEG çıktı.
 */
export async function cropImageWithEdgeFractions(
    input: Buffer,
    edges: EdgeFractions
): Promise<{ buffer: Buffer; contentType: "image/jpeg"; used: EdgeFractions }> {
    const e: EdgeFractions = {
        left: clampEdge(edges.left),
        top: clampEdge(edges.top),
        right: clampEdge(edges.right),
        bottom: clampEdge(edges.bottom),
    };

    const meta = await sharp(input).metadata();
    const w = meta.width ?? 0;
    const h = meta.height ?? 0;
    if (w < 48 || h < 48) {
        throw new Error("Görsel çok küçük");
    }

    const left = Math.floor(w * e.left);
    const right = Math.floor(w * e.right);
    const top = Math.floor(h * e.top);
    const bottom = Math.floor(h * e.bottom);
    const width = Math.max(1, w - left - right);
    const height = Math.max(1, h - top - bottom);

    if (width < 24 || height < 24) {
        throw new Error("Kırpma sonrası alan çok küçük; sağ oranını veya tüm oranları düşürün");
    }
    if (left + right >= w || top + bottom >= h) {
        throw new Error("Kenar oranları toplamı geçersiz");
    }

    const buf = await sharp(input)
        .extract({ left, top, width, height })
        .jpeg({ quality: 88, mozjpeg: true })
        .toBuffer();
    return { buffer: buf, contentType: "image/jpeg", used: e };
}

/** Dört kenarda aynı oran (önceki davranış). */
export async function cropImageRemoveEdgeFraction(
    input: Buffer,
    edgeFraction = 0.3
): Promise<{ buffer: Buffer; contentType: "image/jpeg"; used: EdgeFractions }> {
    const f = Math.min(0.48, Math.max(0.05, edgeFraction));
    return cropImageWithEdgeFractions(input, { left: f, top: f, right: f, bottom: f });
}
