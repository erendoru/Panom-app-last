# Panobu - Proje Dokümantasyonu

> Bu dosya, Panobu platformunun marka kimliği, teknik altyapı, özellikler ve güncel durumunu tek bir yerden takip etmek için oluşturulmuştur.
> Her sprint/güncelleme sonrasında bu dosya güncellenmelidir.

---

## Marka Kimliği

| Öğe | Değer |
|-----|-------|
| **Marka Adı** | Panobu |
| **Domain** | https://panobu.com |
| **Slogan** | Türkiye'nin Dijital Açıkhava Reklam Platformu |
| **Kuruluş** | 2026, Kocaeli |
| **Hedef Kitle** | KOBİ'ler, ajanslar, yerel işletmeler |

### Marka Renkleri

| Kullanım | Renk/Değer |
|----------|------------|
| Logo Gradyan | `from-blue-400 to-purple-600` |
| Birincil CTA | `bg-blue-600` / `hover:bg-blue-700` |
| Koyu Tema Arka Plan | `#0B1120` (Header/Layout), `#0f1829`, `#111827` |
| Başarı/Aksan | `emerald-400/500` |
| Karşılaştırma Kartları | `indigo`, `amber` |
| Metin (Koyu Tema) | `slate-300/400` |
| İnce Kenarlık | `border-white/5` |
| shadcn Primary (Light) | `hsl(0, 0%, 9%)` |
| shadcn Background (Light) | `hsl(0, 0%, 100%)` |

### Marka Dili

- "Şeffaf fiyat" - Fiyatlar gizli değil, kullanıcı hemen görebilir
- "Aracısız" - Ajans gerektirmeden doğrudan kiralama
- "Hızlı rezervasyon" - Online, anında
- KOBİ dostu vurgusu - Küçük işletmelerin bütçesine uygun
- Güvenilirlik: "Panobu Güvencesi", "256-bit SSL", "Iyzico ile güvenli ödeme"

### Sosyal Medya

- LinkedIn: https://www.linkedin.com/company/panobu
- Instagram: https://www.instagram.com/panobutr
- Twitter: https://twitter.com/panobu
- Destek: destek@panobu.com

---

## Teknoloji Yığını

| Katman | Teknoloji | Versiyon |
|--------|-----------|----------|
| Framework | Next.js (App Router) | 14.1.0 |
| UI | React | 18 |
| Dil | TypeScript | 5 |
| Veritabanı | PostgreSQL (Prisma ORM) | Prisma 5.10 |
| Auth | Supabase Auth | - |
| UI Kit | Tailwind CSS + shadcn (new-york) | Tailwind 3 |
| Animasyon | Framer Motion | - |
| Harita | Leaflet + react-leaflet + react-leaflet-cluster | - |
| Ödeme | Stripe (yeni) | - |
| E-posta | Resend | - |
| Grafik | Recharts | - |
| Doğrulama | Zod | - |
| İkonlar | Lucide React | - |
| Takvim | react-calendar | - |
| Dosya İşleme | PapaParse, xlsx | - |

---

## Kullanıcı Rolleri

| Rol | Açıklama | Dashboard Yolu |
|-----|----------|----------------|
| `ADMIN` | Tam yönetim (panolar, siparişler, kullanıcılar, blog, fiyatlandırma) | `/app/admin/panels` |
| `REGIONAL_ADMIN` | Bölgesel yönetim (atanmış şehir bazlı) | `/app/admin/panels` |
| `ADVERTISER` | Reklamveren / kiracı (kampanya, kiralama, ödeme) | `/app/advertiser/dashboard` |
| `SCREEN_OWNER` | Pano/ekran sahibi (ekranlar, kazançlar) | `/app/owner/dashboard` |

---

## Temel Özellikler

### 1. Statik Pano Kiralama
- 11 pano tipi: Billboard, Billboard+, Giantboard, Megalight, CLP, Megaboard, Kuleboard, Alınlık, Lightbox, Maxiboard, Yol Panosu
- Harita üzerinde keşif (Leaflet + kümeleme)
- Şehir bazlı filtreleme
- Takvimden tarih seçimi (bloklu günler destekli)
- Minimum kiralama süresi kontrolü
- Görsel yükleme veya tasarım desteği talebi
- RentalWizard: Tarih -> Görsel -> Ödeme akışı

### 2. Dijital DOOH Kampanyaları
- Ekran seçimi, bütçe dağılımı
- Kreatif yükleme ve onay süreci
- Zamanlama (ScheduledPlay)
- Admin onayı gerekli (PENDING_APPROVAL)

### 3. Sepet Sistemi
- Misafir + üye sepeti (sessionId bazlı)
- Çoklu pano ekleme
- Toplu indirimler (CLP 20+ = 1500 TL/hafta)
- CLP çift yüz seçeneği (2x fiyat)

### 4. Ödeme Sistemi (Stripe)
- Stripe Checkout (hosted) entegrasyonu
- Webhook ile ödeme doğrulama
- Transaction modeli: PENDING -> COMPLETED/FAILED
- Statik kiralama: PENDING_PAYMENT -> ACTIVE
- Kampanya checkout akışı

### 5. Admin Paneli
- Pano CRUD (tekil + toplu import CSV)
- Sipariş yönetimi (Order statüsü: PENDING -> REVIEWING -> APPROVED -> IN_PROGRESS -> COMPLETED)
- Kullanıcı yönetimi
- Fiyatlandırma kuralları (toplu indirim tanımları)
- Müsaitlik yönetimi (bloklu tarihler)
- Blog yönetimi
- Güncellemeler (changelog)

### 6. SEO & İçerik
- Şehir bazlı SEO sayfaları (`/billboard-kiralama/[sehir]`)
- Blog
- SSR + structured data (Organization, LocalBusiness)
- Open Graph + Twitter Cards
- Sitemap, robots.txt

### 7. Pano Sahibi (Partner) Dashboard
- Ekran listesi ve ekleme
- Kazanç takibi (OwnerBalance, Payout modeli)
- Hesap yönetimi

---

## Dashboard Özellikleri

### Reklamveren Dashboard
- **KPI Kartları:** Aktif kampanya, toplam kampanya, toplam harcama, tahmini gösterim, ort. BGBM
- **Trend Grafiği:** Son 30 gün gösterim (Recharts AreaChart)
- **Son Aktiviteler:** Dijital + statik kampanyalar birleşik liste
- **Hızlı Aksiyonlar:** Yeni kampanya oluştur

### Admin Dashboard
- Panel yönetimi, sipariş takibi
- Kullanıcı listesi
- Blog ve güncellemeler
- Fiyatlandırma kuralları

### Partner (Pano Sahibi) Dashboard
- Ekran listesi
- Kazanç özeti (placeholder, gerçek veriye bağlanacak)

---

## Veritabanı Modelleri (Prisma)

### Temel Modeller
- `User` - Tüm kullanıcılar (role bazlı)
- `ScreenOwner` - Ekran sahibi profili
- `Advertiser` - Reklamveren profili
- `Screen` - Dijital ekranlar
- `StaticPanel` - Klasik panolar (11 tip)
- `Campaign` - Dijital kampanyalar
- `StaticRental` - Statik pano kiralamaları
- `Transaction` - Ödeme işlemleri (STRIPE, IYZICO, MOCK)
- `Order` / `OrderItem` - Sepet siparişleri
- `CartItem` - Sepet öğeleri
- `PricingRule` - Fiyatlandırma kuralları

### Önemli Enumlar
- `PanelType`: 11 pano tipi
- `LocationType`: AVM, HIGHWAY, MAIN_ROAD, CITY_CENTER, SQUARE, STREET, OPEN_AREA, OTHER
- `SocialGrade`: A_PLUS, A, B, C, D
- `TrafficLevel`: LOW, MEDIUM, HIGH, VERY_HIGH
- `OrderStatus`: PENDING, REVIEWING, APPROVED, IN_PROGRESS, COMPLETED, CANCELLED

---

## Ortam Değişkenleri

```
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=
RESEND_API_KEY=
```

---

## Bilinen Kısıtlamalar & Teknik Borç

- [ ] Advertiser dashboard trend grafiği dummy veri kullanıyor (günlük analitik tablosu yok)
- [ ] Owner dashboard metrikleri placeholder (0)
- [ ] Kampanya detay sayfası (`/app/advertiser/campaigns/[id]`) eklendi ama basit düzeyde
- [ ] Fatura/invoice oluşturma sistemi henüz yok
- [ ] Gerçek gösterim takibi (actual impressions) henüz aktif değil
- [ ] Abonelik modeli henüz yok (tek seferlik ödemeler)
- [ ] Mobil responsive sidebar iyileştirmeleri gerekli (advertiser/owner)

---

## Son Güncellemeler

| Tarih | Değişiklik |
|-------|-----------|
| 2026-04-03 | PANOBU.md oluşturuldu |
| 2026-04-03 | Stripe entegrasyonu eklendi (iyzico'dan geçiş) |
| 2026-04-03 | Kırık rotalar düzeltildi (billing, account, finance, campaigns/[id]) |
| 2026-04-03 | Ödeme callback GET handler düzeltildi |
| 2026-04-03 | Error boundary'ler eklendi |
| 2026-04-03 | Playwright + Vitest test altyapısı kuruldu |
| 2026-04-03 | Middleware admin yolu düzeltildi |
