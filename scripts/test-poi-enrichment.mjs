#!/usr/bin/env node
/**
 * Tek bir panoda POI zenginleştirme (OSM) testi.
 *
 * Kullanım:
 *   node scripts/test-poi-enrichment.mjs                  # ilk panoyu otomatik seç
 *   node scripts/test-poi-enrichment.mjs <panelId>         # belirli pano
 */

import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

// .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
        const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.+)$/);
        if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"(.*)"$/, "$1");
    }
}

const prisma = new PrismaClient();

const OVERPASS = "https://overpass-api.de/api/interpreter";
const toRad = (x) => (x * Math.PI) / 180;
const toDeg = (x) => (x * 180) / Math.PI;
function haversine(aLat, aLng, bLat, bLng) {
    const R = 6371000;
    const dLat = toRad(bLat - aLat);
    const dLng = toRad(bLng - aLng);
    const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(s));
}
function bearing(aLat, aLng, bLat, bLng) {
    const φ1 = toRad(aLat), φ2 = toRad(bLat), Δλ = toRad(bLng - aLng);
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    return (toDeg(Math.atan2(y, x)) + 360) % 360;
}
function dirOf(b) {
    const n = ((b % 360) + 360) % 360;
    if (n < 22.5 || n >= 337.5) return "N";
    if (n < 67.5) return "NE";
    if (n < 112.5) return "E";
    if (n < 157.5) return "SE";
    if (n < 202.5) return "S";
    if (n < 247.5) return "SW";
    if (n < 292.5) return "W";
    return "NW";
}

(async () => {
    const panelId = process.argv[2];
    const panel = panelId
        ? await prisma.staticPanel.findUnique({ where: { id: panelId } })
        : await prisma.staticPanel.findFirst({ where: { active: true }, orderBy: { createdAt: "desc" } });

    if (!panel) {
        console.error("Pano bulunamadı.");
        process.exit(1);
    }
    console.log(`\n📍 Test panosu: ${panel.name}`);
    console.log(`   Konum: ${panel.latitude}, ${panel.longitude}`);
    console.log(`   Şehir: ${panel.city} / ${panel.district}\n`);

    const query = `
[out:json][timeout:25];
(
  node["shop"~"^(supermarket|convenience|kiosk|general|mall|department_store|electronics|computer|mobile_phone|clothes|shoes|fashion|boutique|jewelry|furniture|houseware|interior_decoration)$"](around:500,${panel.latitude},${panel.longitude});
  way["shop"~"^(mall|department_store|supermarket)$"](around:500,${panel.latitude},${panel.longitude});
  node["amenity"~"^(pharmacy|bank|atm|fuel|restaurant|fast_food|cafe|ice_cream|bar|pub|nightclub|school|kindergarten|university|college|hospital|clinic|doctors|dentist|marketplace|bus_station)$"](around:500,${panel.latitude},${panel.longitude});
  way["amenity"~"^(school|university|college|hospital|marketplace)$"](around:500,${panel.latitude},${panel.longitude});
  node["tourism"~"^(hotel|motel|hostel|apartment|attraction|museum|viewpoint)$"](around:500,${panel.latitude},${panel.longitude});
  way["tourism"~"^(hotel|attraction|museum)$"](around:500,${panel.latitude},${panel.longitude});
  node["leisure"~"^(stadium|sports_centre|fitness_centre|park|garden|playground)$"](around:500,${panel.latitude},${panel.longitude});
  way["leisure"~"^(stadium|sports_centre|park)$"](around:500,${panel.latitude},${panel.longitude});
);
out tags center;
    `.trim();

    console.log("⏳ OSM Overpass'a sorgu atılıyor (500m yarıçap)...\n");
    const res = await fetch(OVERPASS, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Panobu-PoiEnrichment-Test/1.0 (https://panobu.com)",
            Accept: "application/json",
        },
        body: `data=${encodeURIComponent(query)}`,
    });
    if (!res.ok) {
        console.error(`Overpass hata: ${res.status}`);
        process.exit(1);
    }
    const data = await res.json();
    const elements = data.elements || [];

    const pois = [];
    for (const el of elements) {
        const tags = el.tags || {};
        const poiLat = el.type === "node" ? el.lat : el.center?.lat;
        const poiLng = el.type === "node" ? el.lon : el.center?.lon;
        if (!poiLat) continue;
        const name = tags.name || tags.brand || tags.operator || "(isimsiz)";
        const dist = haversine(panel.latitude, panel.longitude, poiLat, poiLng);
        const br = bearing(panel.latitude, panel.longitude, poiLat, poiLng);
        const dir = dirOf(br);
        const rawTag = tags.shop ? `shop=${tags.shop}`
            : tags.amenity ? `amenity=${tags.amenity}`
            : tags.tourism ? `tourism=${tags.tourism}`
            : tags.leisure ? `leisure=${tags.leisure}`
            : "?";
        pois.push({ name, brand: tags.brand || null, rawTag, dist, dir });
    }
    pois.sort((a, b) => a.dist - b.dist);

    console.log(`✅ ${pois.length} POI bulundu (ilk 15):\n`);
    for (const p of pois.slice(0, 15)) {
        const brand = p.brand ? ` [${p.brand}]` : "";
        console.log(`  ${String(Math.round(p.dist)).padStart(4)}m ${p.dir.padEnd(2)}  ${p.rawTag.padEnd(28)}  ${p.name}${brand}`);
    }
    if (pois.length > 15) console.log(`  ... ve ${pois.length - 15} POI daha`);
    await prisma.$disconnect();
})().catch((e) => {
    console.error(e);
    process.exit(1);
});
