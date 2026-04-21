#!/usr/bin/env node
/**
 * Tek seferlik admin script: Supabase Auth'ta bir kullanıcının şifresini
 * doğrudan yeni bir değere günceller.
 *
 * Kullanım:
 *   node scripts/admin-set-password.mjs <email> <yeni-sifre>
 *
 * Örnek:
 *   node scripts/admin-set-password.mjs ayse@izmiracikhavareklam.com Panobu2025!
 *
 * Not: .env.local içindeki SUPABASE_SERVICE_ROLE_KEY kullanılır. Bu anahtar
 * tüm Supabase işlemlerine erişebilir — dikkatli kullan, asla commit etme.
 */

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

function loadEnvLocal() {
    const p = path.resolve(process.cwd(), ".env.local");
    if (!fs.existsSync(p)) return;
    const raw = fs.readFileSync(p, "utf8");
    for (const line of raw.split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (!m) continue;
        const key = m[1];
        let val = m[2];
        if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
        ) {
            val = val.slice(1, -1);
        }
        if (!(key in process.env)) process.env[key] = val;
    }
}

loadEnvLocal();

const [, , emailArg, passwordArg] = process.argv;
if (!emailArg || !passwordArg) {
    console.error("Kullanım: node scripts/admin-set-password.mjs <email> <yeni-sifre>");
    process.exit(1);
}

const SUPABASE_URL =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error(
        "Hata: NEXT_PUBLIC_SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY bulunamadı (.env.local kontrol et).",
    );
    process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(email) {
    let page = 1;
    const perPage = 200;
    while (true) {
        const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
        if (error) throw error;
        const found = data.users.find(
            (u) => (u.email || "").toLowerCase() === email.toLowerCase(),
        );
        if (found) return found;
        if (data.users.length < perPage) return null;
        page += 1;
        if (page > 50) return null; // güvenlik
    }
}

(async () => {
    try {
        console.log(`[1/2] Kullanıcı aranıyor: ${emailArg}`);
        const user = await findUserByEmail(emailArg);
        if (!user) {
            console.error(
                `Bu email Supabase Auth'ta yok: ${emailArg}\n` +
                "Kullanıcı tamamen sisteme kayıtlı mı? (auth.users tablosu)",
            );
            process.exit(2);
        }
        console.log(`    bulundu: id=${user.id}  email=${user.email}`);

        console.log(`[2/2] Şifre güncelleniyor...`);
        const { error } = await admin.auth.admin.updateUserById(user.id, {
            password: passwordArg,
        });
        if (error) {
            console.error("Güncelleme hatası:", error.message);
            process.exit(3);
        }
        console.log("\n✅ Şifre başarıyla güncellendi.");
        console.log(`   email: ${user.email}`);
        console.log(`   şifre: ${passwordArg}`);
        console.log("\nMüşteriye bu bilgilerle giriş yapabileceğini söyleyebilirsin.");
    } catch (err) {
        console.error("Beklenmeyen hata:", err);
        process.exit(99);
    }
})();
