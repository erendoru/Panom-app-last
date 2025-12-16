# Panom - DOOH Platform

Türkiye'nin Dijital Açıkhava Reklam Platformu.

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Veritabanını hazırlayın:
```bash
npx prisma db push
```

3. Örnek verileri yükleyin (Admin ve Demo Ekranlar):
```bash
npx ts-node prisma/seed.ts
```

4. Uygulamayı başlatın:
```bash
npm run dev
```

## Kullanıcılar

**Admin:**
- Email: `admin@panom.com`
- Şifre: `admin123`

**Ekran Sahibi (Demo):**
- Email: `owner@medya.com`
- Şifre: `admin123`

**Reklamveren:**
- `/auth/register` sayfasından yeni kayıt oluşturabilirsiniz.

## Özellikler

- **Ekran Sahipleri:** Ekran ekleme, yönetme, kazanç takibi.
- **Reklamverenler:** Harita/Liste üzerinden ekran seçimi, bütçe planlama, kampanya oluşturma sihirbazı.
- **Admin:** Ekran ve Kampanya onay mekanizması.
- **Teknoloji:** Next.js 14, Prisma, PostgreSQL, Tailwind CSS.
