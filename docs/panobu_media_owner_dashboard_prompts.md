# PANOBU — Medya Sahibi (Ünite Sahibi) Dashboard Geliştirme Promptları

## Projeye Genel Bakış

Panobu (panobu.com) açık hava reklamcılığının dijital platformudur. Next.js + Supabase + Prisma stack kullanılmaktadır. Halihazırda bir admin paneli ve reklam veren (advertiser) dashboard'u mevcuttur. Şimdi **medya sahipleri (ünite sahipleri)** için ayrı bir dashboard geliştiriyoruz. Bu dashboard, reklam ünitesi sahiplerinin (billboard, CLP, raket, megalight, dijital ekran sahiplerinin) kendi envanterlerini yönetmelerine, talepleri takip etmelerine ve gelirlerini görüntülemelerine olanak sağlayacak.

**Önemli:** Mevcut sistemdeki pano ekleme, haritada pinleme, fotoğraf yükleme, takvim yönetimi gibi bileşenler zaten çalışıyor. Yeni dashboard bu mevcut bileşenleri mümkün olduğunca yeniden kullanmalı, sıfırdan yazmak yerine adapte etmeli.

---

## FAZ 1: Kayıt Akışı ve Rol Ayrımı

### Prompt:

```
Panobu projemizde mevcut kullanıcı kayıt/giriş sistemi var (Supabase Auth kullanıyoruz). Şimdi "Ünite Sahibi" (media_owner) rolü eklememiz gerekiyor.

Yapılacaklar:

1. VERITABANI:
- Mevcut users tablosuna veya profiles tablosuna "role" alanı ekle (enum: 'advertiser', 'media_owner', 'admin'). Eğer zaten bir role alanı varsa, 'media_owner' değerini ekle.
- Yeni bir "companies" tablosu oluştur:
  - id (uuid, primary key)
  - user_id (foreign key → users)
  - company_name (text, zorunlu)
  - tax_number (text, opsiyonel)
  - phone (text, zorunlu)
  - email (text, zorunlu)
  - logo_url (text, opsiyonel)
  - cities (text[], hangi illerde hizmet veriyor)
  - website (text, opsiyonel)
  - description (text, opsiyonel)
  - created_at, updated_at

2. KAYIT SAYFASI:
- /auth/login sayfasının altına "Ünite Sahibi Olarak Kaydol" linki/butonu ekle
- /auth/register/media-owner sayfası oluştur
- Bu sayfada: email, şifre, firma adı, telefon, hizmet verilen iller (multi-select), vergi no (opsiyonel) alanları olsun
- Kayıt tamamlandığında kullanıcının rolü 'media_owner' olarak atansın ve companies tablosuna kayıt oluşturulsun

3. GİRİŞ SONRASI YÖNLENDİRME:
- Login sonrası kullanıcının rolünü kontrol et
- role === 'media_owner' ise → /dashboard/media-owner'a yönlendir
- role === 'advertiser' ise → mevcut reklam veren dashboard'una yönlendir
- role === 'admin' ise → mevcut admin paneline yönlendir

4. MIDDLEWARE:
- /dashboard/media-owner/* route'larını sadece media_owner rolü olan kullanıcılara aç
- Yetkisiz erişimde /auth/login'e yönlendir

Mevcut auth yapısını bozmadan, üzerine ekleme yap. Mevcut kullanıcılar etkilenmemeli.
```

### Kontrol Listesi (Faz 1 tamamlandığında):
- [ ] /auth/login sayfasında "Ünite Sahibi Olarak Kaydol" linki görünüyor
- [ ] /auth/register/media-owner sayfası çalışıyor
- [ ] Kayıt sonrası role doğru atanıyor
- [ ] Login sonrası role'e göre doğru dashboard'a yönlendirme çalışıyor
- [ ] Mevcut advertiser ve admin kullanıcıları etkilenmemiş
- [ ] companies tablosu oluşmuş ve kayıt ile birlikte dolduruluyor

---

## FAZ 2: Medya Sahibi Dashboard Ana Sayfası

### Prompt:

```
Medya sahibi için ana dashboard sayfasını oluştur: /dashboard/media-owner

Bu sayfa giriş yaptığında ilk gördüğü ekran olacak. Üstte özet kartları, altta son aktiviteler gösterilecek.

1. LAYOUT:
- Sol sidebar navigasyon:
  - Ana Sayfa (dashboard özet)
  - Ünitelerim (pano listesi)
  - Ünite Ekle
  - Gelen Talepler
  - Takvim
  - Raporlar
  - Mağaza Görüntüle
  - Ayarlar (firma profili)
- Üst bar: firma adı + logo (companies tablosundan), bildirim ikonu, profil menüsü

2. ÖZET KARTLARI (üstte 4 kart):
- Toplam Ünite Sayısı (bu medya sahibine ait toplam pano)
- Aktif Üniteler (durumu 'active' olanlar)
- Bu Ay Gelen Talepler (son 30 gündeki talepler)
- Doluluk Oranı (%) — dolu haftalar / toplam haftalar

3. SON AKTİVİTELER:
- Son 5 gelen kiralama talebi (tarih, müşteri adı, hangi ünite, durum)
- Her talebin yanında "Detay" butonu

4. HIZLI İSTATİSTİK GRAFİĞİ:
- Son 6 aylık talep trendi (basit bar chart, recharts kullanabilirsin)

Mevcut projenin tasarım dilini (renk, font, spacing) koru. Dashboard profesyonel ve temiz görünmeli. Sidebar responsive olmalı, mobilde hamburger menü.
```

### Kontrol Listesi (Faz 2 tamamlandığında):
- [ ] /dashboard/media-owner sayfası yükleniyor
- [ ] Sidebar navigasyon çalışıyor, tüm linkler doğru sayfalara gidiyor
- [ ] Özet kartları gerçek veriden çekiliyor (şimdilik 0 gösterebilir)
- [ ] Son aktiviteler listesi çalışıyor
- [ ] Mobilde responsive görünüm çalışıyor
- [ ] Firma adı ve logo üst barda görünüyor

---

## FAZ 3: Ünite Yönetimi — Listeleme ve Ekleme

### Prompt:

```
Medya sahibinin kendi ünitelerini görebildiği ve yeni ünite ekleyebildiği sayfaları oluştur.

ÖNEMLİ: Mevcut admin panelindeki pano ekleme formu ve harita pin bileşenlerini yeniden kullan. Sıfırdan yazmak yerine, mevcut bileşenleri adapte et. ve burada insanların eklediği bütün panolar admin tarafında genel panobu.com'a eklenmek için pasif olarak ADMIN dashboardına gözükmeli. biz isteyince oradan aktif yapıp panobu.com genelinde yayınlayabilelim. ünite sahibinin panolarını ama ünite sahibinde zaten gözüksün

1. ÜNİTELERİM SAYFASI (/dashboard/media-owner/units):
- Medya sahibine ait tüm panoların listesi (tablo veya kart görünümü, toggle ile değiştirilebilir)
- Her ünitede gösterilecekler:
  - Fotoğraf (küçük thumbnail)
  - Ünite adı / konum
  - Pano tipi (billboard, CLP, raket, megalight, dijital)
  - Boyut
  - Fiyat (haftalık)
  - Durum badge'i: Aktif (yeşil), Pasif (gri), Bakımda (sarı)
  - Doluluk: bu ay dolu/boş hafta sayısı
- Filtreleme: il bazlı, pano tipine göre, duruma göre
- Arama: ünite adı veya adres ile
- Her ünitenin yanında: Düzenle, Durum Değiştir, Sil butonları
- Üstte "Yeni Ünite Ekle" butonu

2. ÜNİTE EKLEME SAYFASI (/dashboard/media-owner/units/new):
- Mevcut admin panelindeki pano ekleme formunun aynısını kullan, şu alanlarla:
  - Ünite adı (text)
  - Pano tipi (select: Billboard, CLP, Raket, Megalight, Dijital Ekran, Diğer)
  - Boyut — genişlik x yükseklik (cm veya m)
  - Yüz sayısı (tek yüz, çift yüz)
  - Aydınlatma (ışıklı, ışıksız, dijital)
  - Konum — HARİTA: mevcut harita bileşenini kullan, tıklayarak veya adres girerek pin at
  - İl ve ilçe (haritadan otomatik doldurulsun veya manuel seçilsin)
  - Adres (text)
  - Fotoğraflar — en az 1, en fazla 5 fotoğraf yükleme (mevcut upload bileşenini kullan)
  - Haftalık fiyat (TL)
  - Aylık fiyat (TL, opsiyonel)
  - Açıklama / notlar (textarea, opsiyonel)
- Kaydet butonuna basıldığında:
  - Ünite veritabanına kaydedilir
  - Otomatik olarak bu medya sahibinin company_id'si ile ilişkilendirilir
  - Durum varsayılan olarak 'active' atanır
  - Ünitelerim listesine yönlendirilir

3. ÜNİTE DÜZENLEME SAYFASI (/dashboard/media-owner/units/[id]/edit):
- Ekleme formuyla aynı yapı, mevcut verilerle dolu gelir
- Fiyat değiştirme, fotoğraf ekleme/silme, durum değiştirme yapılabilir

4. VERİTABANI:
- Mevcut billboards/units tablosuna "company_id" foreign key ekle (companies tablosuna referans)
- Medya sahibi sadece kendi company_id'sine ait üniteleri görebilir ve düzenleyebilir (RLS - Row Level Security)
```

### Kontrol Listesi (Faz 3 tamamlandığında):
- [ ] Ünitelerim sayfasında sadece bu medya sahibinin üniteleri görünüyor
- [ ] Kart ve tablo görünümü toggle çalışıyor
- [ ] Yeni ünite ekleme formu çalışıyor — haritada pin atma, fotoğraf yükleme dahil
- [ ] Eklenen ünite otomatik olarak bu medya sahibiyle ilişkileniyor
- [ ] Düzenleme sayfası mevcut verilerle dolu geliyor ve güncelleme çalışıyor
- [ ] Durum değiştirme (aktif/pasif/bakımda) çalışıyor
- [ ] Filtreleme ve arama çalışıyor
- [ ] Başka medya sahibinin ünitelerine erişilemiyor (RLS çalışıyor)

---

## FAZ 4: Müsaitlik Takvimi ve Fiyat Yönetimi

### Prompt:

```
Her ünite için müsaitlik takvimi ve fiyat yönetimi ekle.

1. TAKVİM SAYFASI (/dashboard/media-owner/calendar):
- Aylık takvim görünümü (mevcut takvim bileşenini kullan veya yeni bir basit takvim yap)
- Sol tarafta ünite seçici (dropdown veya liste) — medya sahibi hangi ünitenin takvimini göreceğini seçer
- Takvimde her hafta bir blok:
  - Yeşil: müsait
  - Kırmızı: dolu (rezervasyon var)
  - Sarı: beklemede (talep var ama onaylanmamış)
  - Gri: bloklanmış (medya sahibi manuel olarak kapattı — kurumsal müşterisi için)
- Tıklama ile blok durumu değiştirme:
  - Müsait bloğa tıkla → "Blokla" seçeneği (kurumsal müşteri için ayır)
  - Bloklanmış bloğa tıkla → "Aç" seçeneği
- Dolu blokta: kiracı adı ve tarih aralığı gösterilsin

2. FİYAT YÖNETİMİ:
- Her ünitenin düzenleme sayfasında fiyat bölümü:
  - Standart haftalık fiyat (varsayılan)
  - Dönemsel fiyat: tarih aralığı seç + özel fiyat gir (bayram, seçim dönemi vs.)
  - "Fiyatlar başlangıçtır" seçeneği (checkbox) — sitede "X TL'den başlayan" şeklinde gösterir
- Veritabanı: pricing tablosu
  - id, unit_id, price_type (standard, seasonal, promotional), amount, start_date, end_date, is_starting_price (boolean)

3. TOPLU TAKVİM GÖRÜNÜMÜ:
- /dashboard/media-owner/calendar sayfasında tüm üniteleri tek takvimde görme seçeneği
- Her satır bir ünite, sütunlar haftalar — ısı haritası gibi doluluk görünümü
```

### Kontrol Listesi (Faz 4 tamamlandığında):
- [ ] Tek ünite takvimi doğru çalışıyor — dolu/boş/beklemede/bloklanmış durumlar görünüyor
- [ ] Tıklama ile blok durumu değiştirme çalışıyor
- [ ] Dolu blokta kiracı bilgisi görünüyor
- [ ] Dönemsel fiyat ekleme ve düzenleme çalışıyor
- [ ] "Fiyatlar başlangıçtır" seçeneği sitede doğru yansıyor
- [ ] Toplu takvim görünümü çalışıyor

---

## FAZ 5: Gelen Talepler ve Onay Sistemi

### Prompt:

```
Medya sahibine gelen kiralama taleplerini yönetme sistemi oluştur.

1. GELEN TALEPLER SAYFASI (/dashboard/media-owner/requests):
- Tüm gelen kiralama taleplerinin listesi
- Her talep kartında:
  - Talep tarihi
  - Reklam veren adı ve firma adı
  - Hangi ünite (fotoğraf + isim)
  - Talep edilen tarih aralığı
  - Bütçe / teklif edilen fiyat
  - Durum badge: Beklemede (sarı), Onaylandı (yeşil), Reddedildi (kırmızı), Tamamlandı (mavi)
- Filtreleme: duruma göre, üniteye göre, tarihe göre
- Sıralama: en yeni, en eski, fiyata göre

2. TALEP DETAY SAYFASI (/dashboard/media-owner/requests/[id]):
- Talep detayları — tüm bilgiler
- Reklam verenin yüklediği görsel (varsa) — büyük önizleme
- Aksiyon butonları:
  - "Onayla" → durum 'approved' olur, takvimde ilgili hafta(lar) "dolu" olarak işaretlenir, reklam verene bildirim/email gider
  - "Reddet" → durum 'rejected' olur, opsiyonel red sebebi yazılabilir, reklam verene bildirim gider
  - "Mesaj Gönder" → reklam verenle basit mesajlaşma (opsiyonel, basit bir chat veya textarea + gönder)

3. GÖRSEL ONAY:
- Reklam veren kampanya görseli yüklediyse, medya sahibi burada görür
- "Görsel Uygun" veya "Görsel Uygun Değil — Revizyon İste" butonları
- Revizyon istendiğinde reklam verene not ile birlikte bildirim gider

4. BİLDİRİMLER:
- Yeni talep geldiğinde dashboard'da bildirim sayısı (üst bardaki zil ikonu)
- Email bildirimi (Supabase Edge Function veya basit bir email servisi ile)

5. VERİTABANI:
- requests/bookings tablosu (muhtemelen mevcut):
  - id, unit_id, advertiser_user_id, company_id (medya sahibi), start_date, end_date, status (pending, approved, rejected, completed), offered_price, rejection_reason, creative_url, creative_status (pending, approved, revision_requested), created_at, updated_at
```

### Kontrol Listesi (Faz 5 tamamlandığında):
- [ ] Gelen talepler listesi sadece bu medya sahibine ait talepleri gösteriyor
- [ ] Onaylama çalışıyor — takvim otomatik güncelleniyor
- [ ] Reddetme çalışıyor — sebep yazılabiliyor
- [ ] Görsel onay/revizyon sistemi çalışıyor
- [ ] Bildirim sayısı üst barda görünüyor
- [ ] Filtreleme ve sıralama çalışıyor

---

## FAZ 6: Yayın Kanıtı (Proof of Posting) Sistemi

### Prompt:

```
Kampanya başladığında medya sahibinin yayın kanıtı fotoğrafı yükleyebildiği sistem oluştur.

1. YAYIN KANITI YÜKLEME:
- Onaylanmış ve aktif kampanyalar listesinde her kampanyanın yanında "Yayın Kanıtı Yükle" butonu
- Tıklayınca modal açılır:
  - Fotoğraf yükleme (en az 1, en fazla 3)
  - Not alanı (opsiyonel, "gece fotoğrafı", "gündüz fotoğrafı" vs.)
  - Yükleme tarihi otomatik atanır
- Yüklenen fotoğraflar otomatik olarak reklam verene bildirim ile gönderilir

2. VERİTABANI:
- proof_of_posting tablosu:
  - id, booking_id, photo_urls (text[]), notes, uploaded_at
- Mevcut bookings tablosuna: proof_status (pending, uploaded, confirmed) alanı ekle

3. REKLAM VEREN TARAFI:
- Reklam verenin dashboard'unda kampanya detayında yayın kanıtı fotoğrafları görünsün
- "Kanıtı Onayla" butonu (opsiyonel — sadece görmesi yeterli olabilir)

4. MEDYA SAHİBİ TARAFINDA:
- Aktif kampanyalar listesinde yayın kanıtı durumu gösterilsin:
  - Henüz yüklenmedi (kırmızı uyarı)
  - Yüklendi (yeşil onay)
- Dashboard ana sayfasında "Yayın kanıtı bekleyen kampanyalar: X" uyarısı
```

### Kontrol Listesi (Faz 6 tamamlandığında):
- [ ] Yayın kanıtı fotoğraf yükleme çalışıyor
- [ ] Yüklenen fotoğraflar reklam veren tarafında görünüyor
- [ ] Dashboard'da yayın kanıtı bekleyen kampanya uyarısı çalışıyor
- [ ] Aktif kampanyalar listesinde kanıt durumu gösteriliyor

---

## FAZ 7: Raporlama ve Analitik

### Prompt:

```
Medya sahibi için raporlama ve analitik sayfası oluştur.

1. RAPORLAR SAYFASI (/dashboard/media-owner/reports):

Tarih aralığı seçici (bu ay, son 3 ay, son 6 ay, bu yıl, özel aralık)

2. ÖZET METRİKLER (kartlar):
- Toplam Gelir (TL) — seçilen dönemde onaylanmış kampanyaların toplam tutarı
- Toplam Kiralama Sayısı
- Ortalama Doluluk Oranı (%)
- En Çok Talep Alan Ünite

3. GRAFİKLER (recharts kullan):
- Aylık gelir trendi (bar chart)
- Ünite bazlı doluluk oranı (horizontal bar chart)
- Talep durum dağılımı (pie chart: onaylanan, reddedilen, bekleyen)
- Müşteri sektör dağılımı (pie chart: sağlık, gayrimenkul, yeme-içme vs.)

4. ÜNİTE BAZLI RAPOR:
- Her ünite için ayrı satır:
  - Ünite adı, konum
  - Bu dönem kiralama sayısı
  - Bu dönem gelir
  - Doluluk oranı (%)
  - En çok kiralayan müşteri
- Tablo olarak göster, CSV export butonu

5. GELİR RAPORU:
- Aylık gelir breakdown (tablo)
- Panobu komisyonu vs net gelir ayrımı
- CSV veya PDF export
```

### Kontrol Listesi (Faz 7 tamamlandığında):
- [ ] Raporlar sayfası yükleniyor, tarih aralığı seçimi çalışıyor
- [ ] Özet metrikler gerçek veriden hesaplanıyor
- [ ] Grafikler doğru veriyle render ediliyor
- [ ] Ünite bazlı rapor tablosu çalışıyor
- [ ] CSV export çalışıyor

---

## FAZ 8: Mağaza Görüntüle (Public Profil Sayfası)

### Prompt:

```
Her medya sahibinin kamuya açık profil sayfasını oluştur. Bu sayfa medya sahibinin kendi müşterilerine gönderebileceği bir vitrin olacak.

1. PUBLIC SAYFA: /medya/[company-slug]
- Örnek: panobu.com/medya/donanim-medya
- companies tablosuna "slug" alanı ekle (firma adından otomatik oluştur)

2. SAYFA İÇERİĞİ:
- Üstte: firma logosu, firma adı, açıklama, hizmet verilen iller, iletişim bilgileri
- Harita: sadece bu medya sahibinin aktif ünitelerini gösteren harita (mevcut harita bileşenini kullan)
- Ünite listesi: kartlar halinde — fotoğraf, isim, tür, fiyat, "Detay" butonu
- Ünite detayına tıklanınca mevcut pano detay sayfasına yönlendir

3. MEDYA SAHİBİ DASHBOARD'UNDA:
- "Mağaza Görüntüle" butonuna basınca kendi public sayfasını yeni sekmede açar
- "Mağaza Linkini Kopyala" butonu — kendi müşterilerine göndermek için
- Ayarlar sayfasında: mağaza açıklaması, logo, kapak fotoğrafı düzenleme

4. SEO:
- Her medya sahibi sayfası için dinamik meta tags (firma adı, açıklama, iller)
- Open Graph tags (sosyal medyada paylaşılabilir)
```

### Kontrol Listesi (Faz 8 tamamlandığında):
- [ ] /medya/[slug] sayfası çalışıyor ve doğru firmayı gösteriyor
- [ ] Haritada sadece bu firmaya ait üniteler görünüyor
- [ ] Ünite kartları ve detay yönlendirmesi çalışıyor
- [ ] Dashboard'dan "Mağaza Görüntüle" ve "Link Kopyala" çalışıyor
- [ ] SEO meta tags doğru render ediliyor

---

## FAZ 9: CRM — Müşteri İlişki Yönetimi

### Prompt:

```
Medya sahibinin geçmiş ve mevcut müşterilerini takip ettiği basit CRM modülü oluştur.

1. MÜŞTERİLER SAYFASI (/dashboard/media-owner/customers):
- Bu medya sahibinden kiralama yapmış tüm müşterilerin listesi
- Her müşteri kartında:
  - Müşteri adı / firma adı
  - Toplam kiralama sayısı
  - Toplam harcama (TL)
  - Son kiralama tarihi
  - Sektör (sağlık, gayrimenkul, yeme-içme vs.)
- Sıralama: en çok harcayan, en son kiralayan, en sık kiralayan

2. MÜŞTERİ DETAY:
- Müşterinin tüm geçmiş kiralamaları (hangi ünite, hangi tarih, ne kadar)
- Not ekleme alanı — medya sahibi müşteri hakkında not düşebilir ("her yıl bayramda kiralıyor", "fiyata hassas" vs.)
- "Tekrar Teklif Gönder" butonu (basit: email ile önceden tanımlı şablon mesaj gönderir)

3. HATIRLATMALAR:
- Dashboard ana sayfasında: "X müşteri geçen ay/yıl bu dönemde kiralamıştı — tekrar teklif gönder" önerileri
- Bu logic basit olsun: geçen yıl aynı ay kiralama yapmış müşterileri listele
```

### Kontrol Listesi (Faz 9 tamamlandığında):
- [ ] Müşteriler listesi gerçek veriden çekiliyor
- [ ] Müşteri detay sayfası geçmiş kiralamaları gösteriyor
- [ ] Not ekleme çalışıyor
- [ ] "Tekrar Teklif Gönder" çalışıyor
- [ ] Dashboard'da hatırlatma önerileri çalışıyor

---

## FAZ 10: Ayarlar ve Firma Profili Yönetimi

### Prompt:

```
Medya sahibinin firma profilini ve hesap ayarlarını yönettiği sayfa.

1. AYARLAR SAYFASI (/dashboard/media-owner/settings):

Tab yapısı:
- Firma Bilgileri
- Bildirim Tercihleri
- Hesap Güvenliği

2. FİRMA BİLGİLERİ TAB:
- Firma adı düzenleme
- Logo yükleme/değiştirme
- Vergi numarası
- İletişim bilgileri (telefon, email, adres)
- Hizmet verilen iller (multi-select, güncelleme)
- Firma açıklaması (mağaza sayfasında görünecek)
- Banka bilgileri (IBAN — ödeme alabilmek için)

3. BİLDİRİM TERCİHLERİ TAB:
- Yeni talep geldiğinde email bildirimi (on/off)
- Kampanya başladığında hatırlatma (on/off)
- Yayın kanıtı hatırlatması (on/off)
- Haftalık rapor özeti emaili (on/off)

4. HESAP GÜVENLİĞİ TAB:
- Şifre değiştirme
- Email değiştirme
- Hesabı silme/deaktif etme
```

### Kontrol Listesi (Faz 10 tamamlandığında):
- [ ] Firma bilgileri düzenleme ve kaydetme çalışıyor
- [ ] Logo yükleme çalışıyor
- [ ] Bildirim tercihleri kaydediliyor
- [ ] Şifre değiştirme çalışıyor
- [ ] Değişiklikler mağaza sayfasına yansıyor

---

## GENEL NOTLAR (Her Faz İçin Geçerli)

1. **Mevcut bileşenleri yeniden kullan:** Harita, fotoğraf yükleme, takvim, form bileşenleri zaten çalışıyor. Sıfırdan yazmak yerine mevcut olanları import edip adapte et.

2. **Tasarım tutarlılığı:** Mevcut sitenin renk şeması, tipografi ve spacing'ini koru. Yeni sayfalar mevcut siteyle aynı ailede görünmeli.

3. **Row Level Security:** Supabase RLS kuralları ile medya sahibi sadece kendi verilerine erişebilmeli. Bu her faz için kritik.

4. **Responsive:** Tüm sayfalar mobilde de düzgün çalışmalı — medya sahipleri sahada telefondan bakacak.

5. **Loading states:** Her veri çekme işlemi için skeleton loader veya spinner göster.

6. **Error handling:** Form validasyonları, API hataları kullanıcıya anlaşılır mesajlarla gösterilmeli.

7. **Her fazın sonunda:** Yapılanları özetle ve "Sonraki faz: [faz adı]. Devam edeyim mi?" diye sor.
