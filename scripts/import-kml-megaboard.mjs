/**
 * Google My Maps KML → StaticPanel (MEGABOARD) tek seferlik içe aktarma.
 *
 * Kullanım:
 *   node scripts/import-kml-megaboard.mjs [yol.kml] [--dry-run]
 *
 * Varsayılan KML: ./data/imports/MEGABOARD.kml (projeye kopyalanmış dosya)
 *
 * Notlar:
 * - Koordinatlar KML sırasıyla: boylam, enlem (veritabanına lat/lng yazılır).
 * - İlk <img src="..."> görsel URL olarak kullanılır (Google hosted; dış bağlantı).
 * - Aynı isimde kayıt varsa atlanır.
 * - priceWeekly vb. yer tutucudur; Prisma Studio veya admin’den güncelleyin.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

const DEFAULT_KML = path.join(projectRoot, "data", "imports", "MEGABOARD.kml");

/** @returns {{ name: string, address: string, latitude: number, longitude: number, imageUrl: string | null }[]} */
function parseKmlPlacemarks(xml) {
    const out = [];
    const re = /<Placemark>([\s\S]*?)<\/Placemark>/g;
    let m;
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
        const imageUrl = imgMatch ? imgMatch[1] : null;
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

async function main() {
    const args = process.argv.slice(2).filter((a) => a !== "--dry-run");
    const dryRun = process.argv.includes("--dry-run");
    const kmlPath = path.resolve(args[0] || DEFAULT_KML);

    if (!fs.existsSync(kmlPath)) {
        console.error("KML bulunamadı:", kmlPath);
        console.error("Kullanım: node scripts/import-kml-megaboard.mjs [dosya.kml] [--dry-run]");
        process.exit(1);
    }

    const xml = fs.readFileSync(kmlPath, "utf8");
    const rows = parseKmlPlacemarks(xml);
    console.log(`Okunan Placemark: ${rows.length} (${kmlPath})`);

    if (dryRun) {
        rows.slice(0, 5).forEach((r, i) => {
            console.log(`${i + 1}. ${r.name.slice(0, 72)}… | ${r.latitude}, ${r.longitude} | img: ${r.imageUrl ? "evet" : "hayır"}`);
        });
        if (rows.length > 5) console.log("…");
        return;
    }

    const prisma = new PrismaClient();
    const defaults = {
        type: "MEGABOARD",
        city: "İstanbul",
        district: "Otoyol / güzergâh",
        width: 24,
        height: 8,
        priceWeekly: 45000,
        trafficLevel: "HIGH",
        locationType: "HIGHWAY",
        socialGrade: "A",
        estimatedDailyImpressions: 45000,
        minRentalDays: 7,
        active: true,
        isAVM: false,
    };

    let created = 0;
    let skipped = 0;
    for (const row of rows) {
        const exists = await prisma.staticPanel.findFirst({ where: { name: row.name } });
        if (exists) {
            skipped++;
            continue;
        }
        await prisma.staticPanel.create({
            data: {
                name: row.name,
                address: row.address,
                latitude: row.latitude,
                longitude: row.longitude,
                imageUrl: row.imageUrl,
                ...defaults,
            },
        });
        created++;
    }

    console.log(`Tamamlandı. Yeni: ${created}, atlanan (aynı ad): ${skipped}`);
    await prisma.$disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
