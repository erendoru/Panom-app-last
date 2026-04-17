# Supabase Auth E-posta Kurulumu (Panobu)

Bu doküman **Supabase Auth** tarafından gönderilen otomatik mailler (confirm signup,
password reset, magic link, email change, invite) için kurulum ve Panobu stili HTML
template'leri içerir. Bizim kod tarafındaki `src/lib/email.ts` üzerinden giden
_business_ mailleriyle çakışmaz — bunlar ayrı dünyalar.

---

## 1. SMTP'yi Resend'e bağla (kritik)

Supabase default SMTP'si rate-limit'li (saatte ~3–4 mail). Production'da **mutlaka**
kendi domain'inden gönderim yapmak gerekir. Resend zaten kullanıyoruz.

Supabase Dashboard → **Project Settings → Authentication → SMTP Settings**:

| Alan | Değer |
|---|---|
| Enable Custom SMTP | ✅ |
| Sender email | `bildirim@panobu.com` |
| Sender name | `Panobu` |
| Host | `smtp.resend.com` |
| Port | `465` (SSL) |
| Username | `resend` |
| Password | _Resend dashboard → API Keys → yeni bir key oluştur_ |

> **Domain doğrulaması:** Resend → Domains → `panobu.com` için SPF/DKIM kayıtlarını
> DNS'te eklemen gerekir. Eklenmeden gönderim reddedilir.

Ayrıca **Authentication → URL Configuration** altında:
- **Site URL:** `https://panobu.com`
- **Redirect URLs:** `https://panobu.com/**` (prod) + `http://localhost:3000/**` (dev)

---

## 2. Email template'leri

Supabase Dashboard → **Authentication → Email Templates** altında her tema için
`Message (HTML)` alanına aşağıdaki template'leri yapıştır. Subject'leri de aynen
gir.

Kullanılabilir değişkenler:

- `{{ .ConfirmationURL }}` — onay/link
- `{{ .Token }}` — 6 haneli OTP (kullanmıyoruz)
- `{{ .TokenHash }}` — tek kullanımlık token hash
- `{{ .SiteURL }}` — Site URL
- `{{ .Email }}` — alıcının e-postası
- `{{ .Data }}` — `user_metadata` (örn. `{{ .Data.name }}`)

> Tüm template'ler **Panobu mavi** header + temiz body + CTA butonu kullanır.
> Mobilde ve Gmail/Outlook'ta temiz render olacak şekilde inline CSS ile yazıldı.

---

### 2.1. Confirm signup (E-posta doğrulama)

**Subject:** `E-posta adresinizi doğrulayın — Panobu`

```html
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>E-postanızı Doğrulayın</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f3f4f6;margin:0;padding:20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
    <tr>
      <td style="background:linear-gradient(135deg,#3b82f6 0%,#1e40af 100%);padding:28px;text-align:center;border-radius:12px 12px 0 0;">
        <div style="color:#fff;font-size:22px;font-weight:700;">E-postanızı Doğrulayın</div>
      </td>
    </tr>
    <tr>
      <td style="background:#fff;padding:28px;border-radius:0 0 12px 12px;color:#1f2937;font-size:14px;line-height:1.6;">
        <p style="margin:0 0 14px;">Panobu'ya kaydolduğunuz için teşekkürler!</p>
        <p style="margin:0 0 14px;">Hesabınızı etkinleştirmek için aşağıdaki butona tıklayın:</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#3b82f6;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
            E-postamı Doğrula
          </a>
        </div>
        <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">
          Buton çalışmazsa bu bağlantıyı kopyalayıp tarayıcınıza yapıştırın:
        </p>
        <p style="margin:0;word-break:break-all;font-size:12px;color:#3b82f6;">{{ .ConfirmationURL }}</p>
        <p style="margin:20px 0 0;font-size:13px;color:#6b7280;">
          Bu e-postayı siz talep etmediyseniz görmezden gelebilirsiniz.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:20px;text-align:center;color:#9ca3af;font-size:12px;">
        Bu e-posta Panobu tarafından otomatik gönderilmiştir.<br>
        <a href="https://panobu.com" style="color:#6b7280;text-decoration:none;">panobu.com</a>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

### 2.2. Invite user (Davet)

**Subject:** `Panobu'ya davet edildiniz`

```html
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Panobu'ya Davet</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f3f4f6;margin:0;padding:20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
    <tr>
      <td style="background:linear-gradient(135deg,#8b5cf6 0%,#5b21b6 100%);padding:28px;text-align:center;border-radius:12px 12px 0 0;">
        <div style="color:#fff;font-size:22px;font-weight:700;">Panobu'ya Davet Edildiniz</div>
      </td>
    </tr>
    <tr>
      <td style="background:#fff;padding:28px;border-radius:0 0 12px 12px;color:#1f2937;font-size:14px;line-height:1.6;">
        <p style="margin:0 0 14px;">Panobu ekibi sizi platforma davet etti.</p>
        <p style="margin:0 0 14px;">Hesabınızı oluşturmak için aşağıdaki butona tıklayın:</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#8b5cf6;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
            Daveti Kabul Et
          </a>
        </div>
        <p style="margin:0;font-size:13px;color:#6b7280;">
          Bu davet yalnızca sizin için hazırlandı. Beklenmeyen bir e-posta ise yoksayabilirsiniz.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:20px;text-align:center;color:#9ca3af;font-size:12px;">
        Bu e-posta Panobu tarafından otomatik gönderilmiştir.<br>
        <a href="https://panobu.com" style="color:#6b7280;text-decoration:none;">panobu.com</a>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

### 2.3. Magic link

**Subject:** `Panobu giriş bağlantınız`

```html
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Panobu Giriş Bağlantısı</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f3f4f6;margin:0;padding:20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
    <tr>
      <td style="background:linear-gradient(135deg,#3b82f6 0%,#1e40af 100%);padding:28px;text-align:center;border-radius:12px 12px 0 0;">
        <div style="color:#fff;font-size:22px;font-weight:700;">Giriş Bağlantınız</div>
      </td>
    </tr>
    <tr>
      <td style="background:#fff;padding:28px;border-radius:0 0 12px 12px;color:#1f2937;font-size:14px;line-height:1.6;">
        <p style="margin:0 0 14px;">Panobu'ya giriş yapmak için aşağıdaki butona tıklayın:</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#3b82f6;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
            Giriş Yap
          </a>
        </div>
        <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">
          Bu bağlantı kısa süre içinde geçersiz olur. Siz talep etmediyseniz bu mesajı görmezden gelin.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:20px;text-align:center;color:#9ca3af;font-size:12px;">
        Bu e-posta Panobu tarafından otomatik gönderilmiştir.<br>
        <a href="https://panobu.com" style="color:#6b7280;text-decoration:none;">panobu.com</a>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

### 2.4. Change email address (E-posta değiştirme onayı)

**Subject:** `Yeni e-posta adresinizi doğrulayın — Panobu`

```html
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>E-posta Değişikliği</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f3f4f6;margin:0;padding:20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
    <tr>
      <td style="background:linear-gradient(135deg,#f59e0b 0%,#92400e 100%);padding:28px;text-align:center;border-radius:12px 12px 0 0;">
        <div style="color:#fff;font-size:22px;font-weight:700;">E-posta Değişikliği</div>
      </td>
    </tr>
    <tr>
      <td style="background:#fff;padding:28px;border-radius:0 0 12px 12px;color:#1f2937;font-size:14px;line-height:1.6;">
        <p style="margin:0 0 14px;">
          Panobu hesabınız için e-posta değişikliği talebi aldık.
          Yeni e-posta adresinizi doğrulamak için aşağıdaki butona tıklayın:
        </p>
        <div style="text-align:center;margin:24px 0;">
          <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#f59e0b;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
            Yeni E-postamı Doğrula
          </a>
        </div>
        <p style="margin:0;font-size:13px;color:#6b7280;">
          Bu değişikliği siz talep etmediyseniz lütfen Panobu ekibiyle iletişime geçin.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:20px;text-align:center;color:#9ca3af;font-size:12px;">
        Bu e-posta Panobu tarafından otomatik gönderilmiştir.<br>
        <a href="https://panobu.com" style="color:#6b7280;text-decoration:none;">panobu.com</a>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

### 2.5. Reset password (Şifre sıfırlama)

**Subject:** `Şifre sıfırlama talebi — Panobu`

```html
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Şifre Sıfırlama</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f3f4f6;margin:0;padding:20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
    <tr>
      <td style="background:linear-gradient(135deg,#ef4444 0%,#991b1b 100%);padding:28px;text-align:center;border-radius:12px 12px 0 0;">
        <div style="color:#fff;font-size:22px;font-weight:700;">Şifre Sıfırlama</div>
      </td>
    </tr>
    <tr>
      <td style="background:#fff;padding:28px;border-radius:0 0 12px 12px;color:#1f2937;font-size:14px;line-height:1.6;">
        <p style="margin:0 0 14px;">Panobu hesabınız için şifre sıfırlama talebi aldık.</p>
        <p style="margin:0 0 14px;">Yeni şifre belirlemek için aşağıdaki butona tıklayın:</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#ef4444;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
            Yeni Şifre Belirle
          </a>
        </div>
        <p style="margin:0;font-size:13px;color:#6b7280;">
          Bu talebi siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz — hesabınız güvende kalır.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:20px;text-align:center;color:#9ca3af;font-size:12px;">
        Bu e-posta Panobu tarafından otomatik gönderilmiştir.<br>
        <a href="https://panobu.com" style="color:#6b7280;text-decoration:none;">panobu.com</a>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 3. `.env.local` değişkenleri (kod tarafı)

Resend API key'i sadece kendi uygulama mailleri için gerekli. Supabase SMTP'yi ayrı
bir key ile ayarlamak daha güvenlidir.

```bash
# Uygulama (business) mailleri için
RESEND_API_KEY=re_xxxxxxxx

# Opsiyonel
MAIL_FROM="Panobu <bildirim@panobu.com>"
MAIL_REPLY_TO=destek@panobu.com
APP_URL=https://panobu.com

# Yeni başvurular için admin bilgilendirme adresleri (virgülle ayrılmış)
# DB'deki ADMIN/REGIONAL_ADMIN kullanıcılarına otomatik eklenir.
ADMIN_NOTIFY_EMAILS=destek@panobu.com,admin@panobu.com
```

---

## 4. Özet: hangi mail nereden gider?

| Durum | Gönderen | Template nerede |
|---|---|---|
| Kayıt sırasında e-posta doğrulama | Supabase Auth | Supabase Dashboard (yukarıdaki 2.1) |
| Şifre sıfırlama | Supabase Auth | Supabase Dashboard (2.5) |
| Magic link / e-posta değiştirme / davet | Supabase Auth | Supabase Dashboard (2.2–2.4) |
| **Hoş geldin** (owner/advertiser) | **Bizim kod** | `src/lib/email.ts` |
| **Firma onaylandı** | **Bizim kod** | `src/lib/email.ts` |
| Admin'e yeni owner bilgisi | **Bizim kod** | `src/lib/email.ts` |
| Yeni talep / talep kararı / creative kararı | **Bizim kod** | `src/lib/email.ts` |
| Sipariş bildirimi / müşteri onayı | **Bizim kod** | `src/lib/email.ts` |

Supabase SMTP'yi Resend'e bağladığında **hepsi aynı `bildirim@panobu.com` adresinden**
gönderilir ve kullanıcı için tutarlı bir marka deneyimi olur.
