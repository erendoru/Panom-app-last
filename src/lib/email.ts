import { Resend } from 'resend';

let _resend: Resend | null = null;

function getResend(): Resend | null {
    if (!process.env.RESEND_API_KEY) return null;
    if (!_resend) {
        _resend = new Resend(process.env.RESEND_API_KEY);
    }
    return _resend;
}

export const MAIL_FROM = process.env.MAIL_FROM || 'Panobu <bildirim@panobu.com>';
export const MAIL_REPLY_TO = process.env.MAIL_REPLY_TO || 'destek@panobu.com';
export const APP_URL =
    process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://panobu.com';

type SendEmailInput = {
    to: string | string[];
    subject: string;
    html: string;
    replyTo?: string;
    from?: string;
};

/**
 * Generic email sender. RESEND_API_KEY yoksa sessizce no-op döner (dev/test için güvenli).
 * Hatalar log'lanır ama fırlatılmaz — çağıran endpoint'leri bozmaz.
 */
export async function sendEmail(input: SendEmailInput): Promise<boolean> {
    const resend = getResend();
    if (!resend) {
        console.log(
            '[Email] RESEND_API_KEY yok — mail atlandı:',
            input.subject,
            '→',
            input.to
        );
        return true;
    }
    try {
        const { data, error } = await resend.emails.send({
            from: input.from || MAIL_FROM,
            to: Array.isArray(input.to) ? input.to : [input.to],
            subject: input.subject,
            html: input.html,
            replyTo: input.replyTo || MAIL_REPLY_TO,
        });
        if (error) {
            console.error('[Email] send error:', error);
            return false;
        }
        console.log('[Email] sent:', data?.id, '→', input.to);
        return true;
    } catch (err) {
        console.error('[Email] exception:', err);
        return false;
    }
}

// --- Ortak wrapper + util'ler ---

function fmtDateTR(d: Date | string): string {
    return new Intl.DateTimeFormat('tr-TR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(d));
}

function fmtPriceTR(n: number | string, currency = 'TRY'): string {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: currency || 'TRY',
        maximumFractionDigits: 0,
    }).format(Number(n));
}

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

type WrapperOpts = {
    title: string;
    preheader?: string;
    accent?: 'blue' | 'emerald' | 'rose' | 'amber' | 'violet';
    body: string;
};

function wrap(opts: WrapperOpts): string {
    const accentMap = {
        blue: { from: '#3b82f6', to: '#1e40af' },
        emerald: { from: '#10b981', to: '#065f46' },
        rose: { from: '#ef4444', to: '#991b1b' },
        amber: { from: '#f59e0b', to: '#92400e' },
        violet: { from: '#8b5cf6', to: '#5b21b6' },
    } as const;
    const a = accentMap[opts.accent || 'blue'];
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${escapeHtml(opts.title)}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color:#f3f4f6; margin:0; padding:20px;">
    ${opts.preheader
            ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escapeHtml(
                opts.preheader
            )}</div>`
            : ''
        }
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
        <tr>
            <td style="background:linear-gradient(135deg,${a.from} 0%,${a.to} 100%);padding:28px;text-align:center;border-radius:12px 12px 0 0;">
                <div style="color:#fff;font-size:22px;font-weight:700;margin:0;">${escapeHtml(
                    opts.title
                )}</div>
            </td>
        </tr>
        <tr>
            <td style="background:#fff;padding:28px;border-radius:0 0 12px 12px;color:#1f2937;font-size:14px;line-height:1.6;">
                ${opts.body}
            </td>
        </tr>
        <tr>
            <td style="padding:20px;text-align:center;color:#9ca3af;font-size:12px;">
                Bu e-posta Panobu tarafından otomatik gönderilmiştir.<br>
                <a href="${APP_URL}" style="color:#6b7280;text-decoration:none;">panobu.com</a>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

function button(href: string, label: string, color = '#3b82f6'): string {
    return `<div style="text-align:center;margin:24px 0 8px;">
        <a href="${href}" style="display:inline-block;background:${color};color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
            ${escapeHtml(label)}
        </a>
    </div>`;
}

function infoRow(label: string, value: string): string {
    return `<tr>
        <td style="padding:6px 0;color:#6b7280;width:40%;">${escapeHtml(label)}</td>
        <td style="padding:6px 0;color:#111827;font-weight:600;">${escapeHtml(value)}</td>
    </tr>`;
}

interface OrderItem {
    panel: {
        name: string;
        type: string;
        city: string;
        district: string;
    };
    startDate: Date;
    endDate: Date;
    weeklyPrice: number;
}

interface OrderDetails {
    orderNumber: string;
    campaignName: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    companyName?: string | null;
    notes?: string | null;
    hasOwnCreatives: boolean;
    needsDesignHelp: boolean;
    startDate: Date;
    endDate: Date;
    items: OrderItem[];
}

// Format date for display
function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Format price
function formatPrice(price: number): string {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 0
    }).format(price);
}

// Generate HTML email template for new order
function generateOrderEmailHtml(order: OrderDetails): string {
    const totalPrice = order.items.reduce((sum, item) => sum + item.weeklyPrice, 0);

    const itemsHtml = order.items.map(item => `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                <strong>${item.panel.name}</strong><br>
                <span style="color: #6b7280; font-size: 14px;">${item.panel.type} - ${item.panel.city}, ${item.panel.district}</span>
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
                ${formatDate(item.startDate)} - ${formatDate(item.endDate)}
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
                ${formatPrice(item.weeklyPrice)}
            </td>
        </tr>
    `).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Yeni Sipariş - Panobu</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
            <tr>
                <td style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Yeni Sipariş!</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Sipariş No: <strong>${order.orderNumber}</strong></p>
                </td>
            </tr>
            <tr>
                <td style="background: white; padding: 30px; border-radius: 0 0 12px 12px;">
                    <!-- Müşteri Bilgileri -->
                    <h2 style="color: #1f2937; font-size: 18px; margin: 0 0 15px; padding-bottom: 10px; border-bottom: 2px solid #e5e7eb;">
                        👤 Müşteri Bilgileri
                    </h2>
                    <table width="100%" style="margin-bottom: 25px;">
                        <tr>
                            <td style="padding: 5px 0; color: #6b7280;">Ad Soyad:</td>
                            <td style="padding: 5px 0; font-weight: 600;">${order.contactName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 0; color: #6b7280;">Telefon:</td>
                            <td style="padding: 5px 0; font-weight: 600;"><a href="tel:${order.contactPhone}" style="color: #3b82f6;">${order.contactPhone}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 0; color: #6b7280;">E-posta:</td>
                            <td style="padding: 5px 0; font-weight: 600;"><a href="mailto:${order.contactEmail}" style="color: #3b82f6;">${order.contactEmail}</a></td>
                        </tr>
                        ${order.companyName ? `
                        <tr>
                            <td style="padding: 5px 0; color: #6b7280;">Şirket:</td>
                            <td style="padding: 5px 0; font-weight: 600;">${order.companyName}</td>
                        </tr>
                        ` : ''}
                    </table>
                    
                    <!-- Kampanya Bilgileri -->
                    <h2 style="color: #1f2937; font-size: 18px; margin: 0 0 15px; padding-bottom: 10px; border-bottom: 2px solid #e5e7eb;">
                        📋 Kampanya Bilgileri
                    </h2>
                    <table width="100%" style="margin-bottom: 25px;">
                        <tr>
                            <td style="padding: 5px 0; color: #6b7280;">Kampanya Adı:</td>
                            <td style="padding: 5px 0; font-weight: 600;">${order.campaignName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 0; color: #6b7280;">Tarih Aralığı:</td>
                            <td style="padding: 5px 0; font-weight: 600;">${formatDate(order.startDate)} - ${formatDate(order.endDate)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 0; color: #6b7280;">Görsel Durumu:</td>
                            <td style="padding: 5px 0;">
                                ${order.hasOwnCreatives ? '✅ Kendi görseli var' : ''}
                                ${order.needsDesignHelp ? '🎨 Tasarım desteği istiyor' : ''}
                                ${!order.hasOwnCreatives && !order.needsDesignHelp ? '❓ Belirtilmedi' : ''}
                            </td>
                        </tr>
                    </table>
                    
                    ${order.notes ? `
                    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 15px; margin-bottom: 25px; border-radius: 4px;">
                        <strong style="color: #92400e;">📝 Notlar:</strong>
                        <p style="margin: 5px 0 0; color: #78350f;">${order.notes}</p>
                    </div>
                    ` : ''}
                    
                    <!-- Panolar -->
                    <h2 style="color: #1f2937; font-size: 18px; margin: 0 0 15px; padding-bottom: 10px; border-bottom: 2px solid #e5e7eb;">
                        🖼️ Seçilen Panolar (${order.items.length} adet)
                    </h2>
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                        <thead>
                            <tr style="background: #f9fafb;">
                                <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Pano</th>
                                <th style="padding: 12px; text-align: center; font-weight: 600; color: #374151;">Tarih</th>
                                <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151;">Fiyat</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                        <tfoot>
                            <tr style="background: #f0fdf4;">
                                <td colspan="2" style="padding: 15px; font-weight: 700; font-size: 16px;">TOPLAM</td>
                                <td style="padding: 15px; text-align: right; font-weight: 700; font-size: 18px; color: #16a34a;">
                                    ${formatPrice(totalPrice)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                    
                    <!-- CTA -->
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="https://panobu.com/admin/orders" style="display: inline-block; background: #3b82f6; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                            Siparişi İncele →
                        </a>
                    </div>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
                    Bu e-posta Panobu sipariş sistemi tarafından otomatik gönderilmiştir.
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
}

// Send order notification email
export async function sendOrderNotificationEmail(order: OrderDetails): Promise<boolean> {
    console.log('[Email] sendOrderNotificationEmail called for order:', order.orderNumber);
    console.log('[Email] RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);

    // Development modda email göndermeden başarılı döndür
    if (!process.env.RESEND_API_KEY) {
        console.log('[Email] RESEND_API_KEY not configured, skipping email');
        console.log('[Email] Order notification would be sent for:', order.orderNumber);
        return true;
    }

    try {
        console.log('[Email] Attempting to send email to destek@panobu.com...');
        const { data, error } = await getResend()!.emails.send({
            from: 'Panobu <bildirim@panobu.com>',
            to: ['destek@panobu.com'],
            subject: `🎉 Yeni Sipariş: ${order.orderNumber} - ${order.campaignName}`,
            html: generateOrderEmailHtml(order),
        });

        if (error) {
            console.error('[Email] Failed to send order notification:', error);
            return false;
        }

        console.log('[Email] Order notification sent successfully:', data?.id);
        return true;
    } catch (error) {
        console.error('[Email] Error sending order notification:', error);
        return false;
    }
}

// Optionally send confirmation email to customer
export async function sendOrderConfirmationToCustomer(order: OrderDetails): Promise<boolean> {
    if (!process.env.RESEND_API_KEY) {
        console.log('[Email] Skipping customer confirmation (no API key)');
        return true;
    }

    try {
        const { error } = await getResend()!.emails.send({
            from: 'Panobu <bildirim@panobu.com>',
            to: [order.contactEmail],
            subject: `Siparişiniz Alındı - ${order.orderNumber}`,
            html: `
                <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
                    <h1 style="color: #3b82f6;">Teşekkürler! 🎉</h1>
                    <p>Sayın ${order.contactName},</p>
                    <p><strong>${order.campaignName}</strong> kampanyanız için siparişiniz başarıyla alındı.</p>
                    <p><strong>Sipariş No:</strong> ${order.orderNumber}</p>
                    <p>Ekibimiz en kısa sürede sizinle iletişime geçecektir.</p>
                    <p style="margin-top: 30px;">Saygılarımızla,<br><strong>Panobu Ekibi</strong></p>
                </div>
            `,
        });

        if (error) {
            console.error('[Email] Failed to send customer confirmation:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('[Email] Error sending customer confirmation:', error);
        return false;
    }
}

// =================================================================
// Faz 5 — Talep ve Onay Sistemi bildirimleri
// =================================================================

export type RequestEmailContext = {
    rentalId: string;
    panel: { name: string; city?: string | null; district?: string | null };
    advertiser: { name: string; companyName?: string | null; email?: string | null };
    owner: { name: string; companyName?: string | null; email?: string | null };
    startDate: Date | string;
    endDate: Date | string;
    totalPrice: number | string;
    currency?: string;
};

/**
 * Reklam veren yeni bir kiralama talebi oluşturduğunda medya sahibine gider.
 */
export async function sendNewRequestToOwner(ctx: RequestEmailContext): Promise<boolean> {
    if (!ctx.owner.email) {
        console.log('[Email] Owner email yok, yeni talep bildirimi atlandı');
        return true;
    }

    const actor = ctx.advertiser.companyName || ctx.advertiser.name;
    const panelLoc = [ctx.panel.city, ctx.panel.district].filter(Boolean).join(' · ');
    const detailUrl = `${APP_URL}/app/owner/requests/${ctx.rentalId}`;

    const body = `
        <p style="margin:0 0 14px;">Merhaba <strong>${escapeHtml(
        ctx.owner.name
    )}</strong>,</p>
        <p style="margin:0 0 18px;">
            <strong>${escapeHtml(actor)}</strong> panonuz için yeni bir kiralama talebi gönderdi.
            İncelemeniz ve onaylamanız bekleniyor.
        </p>
        <table width="100%" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 16px;margin:0 0 18px;">
            ${infoRow('Pano', ctx.panel.name)}
            ${panelLoc ? infoRow('Konum', panelLoc) : ''}
            ${infoRow('Reklam Veren', actor)}
            ${infoRow(
        'Tarih Aralığı',
        `${fmtDateTR(ctx.startDate)} → ${fmtDateTR(ctx.endDate)}`
    )}
            ${infoRow('Teklif', fmtPriceTR(ctx.totalPrice, ctx.currency))}
        </table>
        <p style="margin:0 0 6px;color:#4b5563;">
            Talebi onaylarsanız bu tarih aralığı takviminizde dolu olarak işaretlenir.
            Reddederseniz reklam verene bildirilir ve takvim boş kalır.
        </p>
        ${button(detailUrl, 'Talebi İncele →')}
    `;

    return sendEmail({
        to: ctx.owner.email,
        subject: `Yeni kiralama talebi — ${ctx.panel.name}`,
        html: wrap({
            title: 'Yeni Kiralama Talebi',
            preheader: `${actor} — ${fmtDateTR(ctx.startDate)} → ${fmtDateTR(ctx.endDate)}`,
            accent: 'blue',
            body,
        }),
    });
}

/**
 * Medya sahibi talebi onayladığında/reddettiğinde reklam verene gider.
 */
export async function sendRequestDecisionToAdvertiser(
    ctx: RequestEmailContext & {
        decision: 'approve' | 'reject';
        note?: string | null;
    }
): Promise<boolean> {
    if (!ctx.advertiser.email) {
        console.log('[Email] Advertiser email yok, karar bildirimi atlandı');
        return true;
    }
    const approved = ctx.decision === 'approve';
    const owner = ctx.owner.companyName || ctx.owner.name;
    const panelLoc = [ctx.panel.city, ctx.panel.district].filter(Boolean).join(' · ');

    const body = `
        <p style="margin:0 0 14px;">Merhaba <strong>${escapeHtml(
        ctx.advertiser.name
    )}</strong>,</p>
        <p style="margin:0 0 18px;">
            <strong>${escapeHtml(ctx.panel.name)}</strong> panosu için gönderdiğiniz talep
            <strong style="color:${approved ? '#047857' : '#b91c1c'};">
                ${approved ? 'onaylandı' : 'reddedildi'}
            </strong>.
        </p>
        <table width="100%" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 16px;margin:0 0 18px;">
            ${infoRow('Pano', ctx.panel.name)}
            ${panelLoc ? infoRow('Konum', panelLoc) : ''}
            ${infoRow('Medya Sahibi', owner)}
            ${infoRow(
        'Tarih Aralığı',
        `${fmtDateTR(ctx.startDate)} → ${fmtDateTR(ctx.endDate)}`
    )}
            ${infoRow('Tutar', fmtPriceTR(ctx.totalPrice, ctx.currency))}
        </table>
        ${ctx.note
            ? `<div style="background:${approved ? '#ecfdf5' : '#fef2f2'};border-left:4px solid ${approved ? '#10b981' : '#ef4444'};padding:12px 14px;border-radius:4px;margin:0 0 18px;">
                    <div style="font-size:12px;color:#6b7280;margin-bottom:4px;">
                        ${approved ? 'Medya sahibinden not' : 'Red gerekçesi'}
                    </div>
                    <div style="color:#111827;">${escapeHtml(ctx.note)}</div>
                </div>`
            : ''
        }
        <p style="margin:0;color:#4b5563;">
            ${approved
            ? 'Bir sonraki adımlar için yakında sizinle iletişime geçeceğiz. Kampanya görselinizi henüz yüklemediyseniz, en kısa sürede yükleyebilirsiniz.'
            : 'Dilerseniz başka tarihlerle veya farklı panolarla yeni bir talep oluşturabilirsiniz.'
        }
        </p>
        ${button(
            approved ? `${APP_URL}/dashboard/advertiser` : `${APP_URL}/static-billboards`,
            approved ? 'Panomu Görüntüle' : 'Yeni Talep Oluştur',
            approved ? '#10b981' : '#3b82f6'
        )}
    `;

    return sendEmail({
        to: ctx.advertiser.email,
        subject: approved
            ? `Talebiniz onaylandı — ${ctx.panel.name}`
            : `Talebiniz reddedildi — ${ctx.panel.name}`,
        html: wrap({
            title: approved ? 'Talebiniz Onaylandı' : 'Talebiniz Reddedildi',
            preheader: `${ctx.panel.name} — ${fmtDateTR(ctx.startDate)} → ${fmtDateTR(
                ctx.endDate
            )}`,
            accent: approved ? 'emerald' : 'rose',
            body,
        }),
    });
}

/**
 * Medya sahibi kampanya görselini onayladığında veya revizyon istediğinde reklam verene gider.
 */
export async function sendCreativeDecisionToAdvertiser(
    ctx: RequestEmailContext & {
        decision: 'approve' | 'revision';
        note?: string | null;
    }
): Promise<boolean> {
    if (!ctx.advertiser.email) {
        console.log('[Email] Advertiser email yok, creative bildirimi atlandı');
        return true;
    }
    const approved = ctx.decision === 'approve';
    const owner = ctx.owner.companyName || ctx.owner.name;

    const body = `
        <p style="margin:0 0 14px;">Merhaba <strong>${escapeHtml(
        ctx.advertiser.name
    )}</strong>,</p>
        <p style="margin:0 0 18px;">
            <strong>${escapeHtml(ctx.panel.name)}</strong> panosu için yüklediğiniz kampanya görseli
            ${approved
            ? '<strong style="color:#047857;">onaylandı</strong>. Yayın hazırlığına geçebiliriz.'
            : '<strong style="color:#b45309;">için revizyon istendi</strong>. Aşağıdaki notu dikkate alarak güncel görseli iletmeniz rica olunur.'
        }
        </p>
        <table width="100%" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 16px;margin:0 0 18px;">
            ${infoRow('Pano', ctx.panel.name)}
            ${infoRow('Medya Sahibi', owner)}
            ${infoRow(
        'Tarih Aralığı',
        `${fmtDateTR(ctx.startDate)} → ${fmtDateTR(ctx.endDate)}`
    )}
        </table>
        ${!approved && ctx.note
            ? `<div style="background:#fff7ed;border-left:4px solid #f97316;padding:12px 14px;border-radius:4px;margin:0 0 18px;">
                    <div style="font-size:12px;color:#6b7280;margin-bottom:4px;">Revizyon notu</div>
                    <div style="color:#111827;white-space:pre-wrap;">${escapeHtml(ctx.note)}</div>
                </div>`
            : ''
        }
        ${approved && ctx.note
            ? `<div style="background:#ecfdf5;border-left:4px solid #10b981;padding:12px 14px;border-radius:4px;margin:0 0 18px;">
                    <div style="font-size:12px;color:#6b7280;margin-bottom:4px;">Medya sahibinden not</div>
                    <div style="color:#111827;white-space:pre-wrap;">${escapeHtml(ctx.note)}</div>
                </div>`
            : ''
        }
        ${button(
            `${APP_URL}/dashboard/advertiser`,
            approved ? 'Kampanyamı Görüntüle' : 'Yeni Görsel Yükle',
            approved ? '#10b981' : '#f97316'
        )}
    `;

    return sendEmail({
        to: ctx.advertiser.email,
        subject: approved
            ? `Görseliniz onaylandı — ${ctx.panel.name}`
            : `Görselinizde revizyon istendi — ${ctx.panel.name}`,
        html: wrap({
            title: approved ? 'Kampanya Görseliniz Onaylandı' : 'Görselde Revizyon İstendi',
            accent: approved ? 'emerald' : 'amber',
            body,
        }),
    });
}

/**
 * Medya sahibi yayın kanıtı yüklediğinde reklam verene gider.
 */
export async function sendProofUploadedToAdvertiser(params: {
    rentalId: string;
    photoUrls: string[];
    notes?: string | null;
    panel: { name: string; city?: string | null; district?: string | null };
    owner: { name: string; companyName?: string | null };
    advertiser: { name: string; companyName?: string | null; email?: string | null };
    startDate: Date | string;
    endDate: Date | string;
}): Promise<boolean> {
    if (!params.advertiser.email) {
        console.log('[Email] Advertiser email yok, yayın kanıtı bildirimi atlandı');
        return true;
    }

    const owner = params.owner.companyName || params.owner.name;
    const detailUrl = `${APP_URL}/app/advertiser/rentals/${params.rentalId}`;
    const photosHtml = params.photoUrls
        .slice(0, 3)
        .map(
            (url) => `
        <td align="center" style="padding:6px;">
            <a href="${escapeHtml(url)}" style="text-decoration:none;">
                <img src="${escapeHtml(url)}" alt="Yayın kanıtı"
                    style="display:block;width:100%;max-width:200px;height:140px;object-fit:cover;border-radius:8px;border:1px solid #e5e7eb;" />
            </a>
        </td>`
        )
        .join('');

    const body = `
        <p style="margin:0 0 14px;">Merhaba <strong>${escapeHtml(
            params.advertiser.name
        )}</strong>,</p>
        <p style="margin:0 0 18px;">
            <strong>${escapeHtml(owner)}</strong>, <strong>${escapeHtml(params.panel.name)}</strong>
            panosu için yayın kanıtı fotoğraflarını yükledi. Kampanyanızın fiilen yayında olduğunu
            gösteren görselleri aşağıda bulabilirsiniz.
        </p>
        <table width="100%" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 16px;margin:0 0 18px;">
            ${infoRow('Pano', params.panel.name)}
            ${infoRow('Medya Sahibi', owner)}
            ${infoRow(
                'Tarih Aralığı',
                `${fmtDateTR(params.startDate)} → ${fmtDateTR(params.endDate)}`
            )}
        </table>
        <div style="margin:0 0 18px;">
            <table width="100%" cellspacing="0" cellpadding="0"><tr>${photosHtml}</tr></table>
        </div>
        ${
            params.notes
                ? `<div style="background:#f0f9ff;border-left:4px solid #38bdf8;padding:12px 14px;border-radius:4px;margin:0 0 18px;">
                    <div style="font-size:12px;color:#6b7280;margin-bottom:4px;">Medya sahibinden not</div>
                    <div style="color:#111827;white-space:pre-wrap;">${escapeHtml(params.notes)}</div>
                </div>`
                : ''
        }
        ${button(detailUrl, 'Kampanyamı Görüntüle', '#0ea5e9')}
    `;

    return sendEmail({
        to: params.advertiser.email,
        subject: `Yayın kanıtı yüklendi — ${params.panel.name}`,
        html: wrap({
            title: 'Kampanyanız Yayında',
            preheader: 'Medya sahibi yayın kanıtı fotoğraflarını yükledi.',
            accent: 'blue',
            body,
        }),
    });
}

// =================================================================
// Hesap bildirimleri (welcome, admin notify, onay)
// =================================================================

/**
 * Yeni bir medya sahibi kaydolduğunda onaya hazırlık maili.
 * Hesap henüz admin tarafından onaylanmadıysa bu mail gönderilir.
 */
export async function sendOwnerWelcomeEmail(params: {
    to: string;
    name: string;
    companyName: string;
}): Promise<boolean> {
    const dashboardUrl = `${APP_URL}/app/owner/dashboard`;
    const body = `
        <p style="margin:0 0 14px;">Merhaba <strong>${escapeHtml(params.name)}</strong>,</p>
        <p style="margin:0 0 16px;">
            <strong>${escapeHtml(params.companyName)}</strong> firması Panobu medya sahibi ağına hoş geldiniz!
            Kaydınız başarıyla alındı; ekibimiz firmanızı kısa süre içinde inceleyip onaylayacak.
        </p>
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:14px 16px;margin:0 0 16px;">
            <div style="font-size:13px;color:#0369a1;font-weight:600;margin-bottom:4px;">Sonraki adımlar</div>
            <ol style="margin:0;padding-left:18px;color:#0c4a6e;">
                <li>Panonuza giriş yapıp firma profilinizi, logonuzu ve iletişim bilgilerinizi tamamlayın.</li>
                <li>Panolarınızı ve dijital ekranlarınızı ekleyin — dilediğiniz kadar yükleyebilirsiniz.</li>
                <li>Onay sonrası panolarınız Panobu.com üzerinde reklam verenlere görünür hale gelir.</li>
            </ol>
        </div>
        <p style="margin:0 0 8px;color:#4b5563;">
            Onay süreci devam ederken dashboard'unuza giriş yapabilir, ünitelerinizi önceden hazırlayabilirsiniz.
        </p>
        ${button(dashboardUrl, 'Dashboard\'a Git')}
    `;
    return sendEmail({
        to: params.to,
        subject: 'Panobu\'ya Hoş Geldiniz — Başvurunuz alındı',
        html: wrap({
            title: 'Panobu\'ya Hoş Geldiniz',
            preheader: 'Başvurunuz alındı. Firma onayı kısa süre içinde tamamlanacak.',
            accent: 'blue',
            body,
        }),
    });
}

/**
 * Yeni bir reklam veren kaydolduğunda gönderilir.
 */
export async function sendAdvertiserWelcomeEmail(params: {
    to: string;
    name: string;
}): Promise<boolean> {
    const exploreUrl = `${APP_URL}/static-billboards`;
    const body = `
        <p style="margin:0 0 14px;">Merhaba <strong>${escapeHtml(params.name)}</strong>,</p>
        <p style="margin:0 0 16px;">
            Panobu'ya hoş geldiniz! Hesabınız hazır — şehrinizin en iyi billboard ve dijital
            ekranlarını keşfedip hemen rezerve edebilirsiniz.
        </p>
        <div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:8px;padding:14px 16px;margin:0 0 16px;color:#4c1d95;">
            <ul style="margin:0;padding-left:18px;">
                <li>Harita üzerinden panoları gezin, fiyat ve boyutları karşılaştırın.</li>
                <li>Tarih seçin, görselinizi yükleyin veya tasarım desteği isteyin.</li>
                <li>Talebiniz onaylandığında e-posta ile haberdar olursunuz.</li>
            </ul>
        </div>
        ${button(exploreUrl, 'Panoları Keşfet')}
    `;
    return sendEmail({
        to: params.to,
        subject: 'Panobu\'ya Hoş Geldiniz',
        html: wrap({
            title: 'Panobu\'ya Hoş Geldiniz',
            accent: 'violet',
            body,
        }),
    });
}

/**
 * Medya sahibi firması admin tarafından onaylandığında gönderilir.
 */
export async function sendOwnerApprovedEmail(params: {
    to: string;
    name: string;
    companyName: string;
    slug?: string | null;
}): Promise<boolean> {
    const dashboardUrl = `${APP_URL}/app/owner/dashboard`;
    const storeUrl = params.slug ? `${APP_URL}/medya/${params.slug}` : null;
    const body = `
        <p style="margin:0 0 14px;">Merhaba <strong>${escapeHtml(params.name)}</strong>,</p>
        <p style="margin:0 0 16px;">
            Tebrikler! <strong>${escapeHtml(params.companyName)}</strong> firmanız onaylandı.
            Panolarınız artık reklam verenler tarafından görülebilir, talep alabilir ve rezerve edilebilir.
        </p>
        <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;padding:14px 16px;margin:0 0 16px;color:#065f46;">
            <div style="font-weight:600;margin-bottom:4px;">Neler yapabilirsiniz?</div>
            <ul style="margin:0;padding-left:18px;">
                <li>Dashboard'da gelen talepleri inceleyip onaylayın veya reddedin.</li>
                <li>Takviminizden müsaitlik durumunu yönetin, dönemsel fiyat tanımlayın.</li>
                <li>Raporlar üzerinden gelir ve doluluk oranlarınızı takip edin.</li>
            </ul>
        </div>
        ${button(dashboardUrl, 'Dashboard\'a Git', '#10b981')}
        ${storeUrl
            ? `<p style="text-align:center;margin:12px 0 0;color:#6b7280;font-size:13px;">
                    Public mağaza linkiniz:
                    <a href="${storeUrl}" style="color:#10b981;">${escapeHtml(storeUrl)}</a>
                </p>`
            : ''
        }
    `;
    return sendEmail({
        to: params.to,
        subject: `${params.companyName} — firmanız onaylandı`,
        html: wrap({
            title: 'Firmanız Onaylandı',
            preheader: 'Panolarınız artık reklam verenlere görünür.',
            accent: 'emerald',
            body,
        }),
    });
}

/**
 * Yeni bir medya sahibi kaydolduğunda Panobu ekibine bildirim.
 */
export async function sendNewOwnerRegistrationToAdmin(params: {
    adminEmails: string[];
    name: string;
    email: string;
    companyName: string;
    phone?: string | null;
    website?: string | null;
    cities?: string[];
}): Promise<boolean> {
    if (!params.adminEmails.length) return true;
    const reviewUrl = `${APP_URL}/app/admin/owners`;
    const rows = [
        infoRow('Firma', params.companyName),
        infoRow('Yetkili', params.name),
        infoRow('E-posta', params.email),
        params.phone ? infoRow('Telefon', params.phone) : '',
        params.website ? infoRow('Web', params.website) : '',
        params.cities && params.cities.length ? infoRow('Şehirler', params.cities.join(', ')) : '',
    ]
        .filter(Boolean)
        .join('');
    const body = `
        <p style="margin:0 0 14px;">Yeni bir medya sahibi kaydı alındı. İnceleme bekliyor.</p>
        <table width="100%" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 16px;margin:0 0 18px;">
            ${rows}
        </table>
        ${button(reviewUrl, 'Admin Panosuna Git')}
    `;
    return sendEmail({
        to: params.adminEmails,
        subject: `[Yeni Başvuru] ${params.companyName}`,
        html: wrap({
            title: 'Yeni Medya Sahibi Başvurusu',
            accent: 'blue',
            body,
        }),
    });
}

export async function sendStoreInquiryToOwner(params: {
    ownerEmail: string;
    ownerName: string;
    companyName: string;
    slug: string;
    customer: {
        name: string;
        email: string;
        phone?: string | null;
        company?: string | null;
    };
    period?: {
        startDate?: string | null;
        endDate?: string | null;
    };
    message?: string | null;
    panels: Array<{
        id: string;
        name: string;
        type: string;
        city: string;
        district: string;
        priceWeekly: number;
    }>;
}): Promise<boolean> {
    const storeUrl = `${APP_URL}/medya/${params.slug}`;
    const dashboardUrl = `${APP_URL}/app/owner/dashboard`;

    const total = params.panels.reduce((s, p) => s + (Number(p.priceWeekly) || 0), 0);

    const itemsHtml = params.panels.length
        ? `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 16px;">
            ${params.panels
                .map(
                    (p) => `
                <tr>
                    <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">
                        <strong>${escapeHtml(p.name)}</strong><br>
                        <span style="color:#6b7280;font-size:12px;">${escapeHtml(p.type)} — ${escapeHtml(p.district)}, ${escapeHtml(p.city)}</span>
                    </td>
                    <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;white-space:nowrap;font-weight:600;">
                        ${fmtPriceTR(p.priceWeekly)} <span style="color:#9ca3af;font-weight:400;font-size:12px;">/ hafta</span>
                    </td>
                </tr>`
                )
                .join('')}
            <tr>
                <td style="padding:12px;text-align:right;color:#6b7280;">Toplam (haftalık)</td>
                <td style="padding:12px;text-align:right;font-weight:700;font-size:16px;">${fmtPriceTR(total)}</td>
            </tr>
        </table>`
        : '';

    const customerRows = [
        infoRow('Ad Soyad', params.customer.name),
        infoRow('E-posta', params.customer.email),
        params.customer.phone ? infoRow('Telefon', params.customer.phone) : '',
        params.customer.company ? infoRow('Firma', params.customer.company) : '',
        params.period?.startDate
            ? infoRow(
                'Hedef Dönem',
                `${fmtDateTR(params.period.startDate)}${
                    params.period.endDate ? ' → ' + fmtDateTR(params.period.endDate) : ''
                }`
            )
            : '',
    ]
        .filter(Boolean)
        .join('');

    const messageHtml = params.message
        ? `<div style="margin:0 0 18px;padding:14px 16px;background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;">
            <div style="font-weight:600;color:#9a3412;margin-bottom:6px;">Müşteri Notu</div>
            <div style="white-space:pre-line;color:#1f2937;">${escapeHtml(params.message)}</div>
        </div>`
        : '';

    const body = `
        <p style="margin:0 0 14px;">Merhaba ${escapeHtml(params.ownerName)},</p>
        <p style="margin:0 0 14px;"><strong>${escapeHtml(params.companyName)}</strong> mağaza sayfanız üzerinden yeni bir teklif talebi aldınız.</p>
        <h3 style="margin:18px 0 8px;color:#111827;">Müşteri Bilgileri</h3>
        <table width="100%" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 16px;margin:0 0 18px;">
            ${customerRows}
        </table>
        ${messageHtml}
        <h3 style="margin:18px 0 8px;color:#111827;">Seçilen Üniteler (${params.panels.length})</h3>
        ${itemsHtml}
        <p style="margin:0 0 6px;color:#6b7280;font-size:12px;">Müşteriye yanıtınızı doğrudan e-postaya "yanıtla" ile iletebilirsiniz.</p>
        ${button(dashboardUrl, 'Panobu Panelini Aç')}
        <p style="margin:16px 0 0;color:#9ca3af;font-size:12px;text-align:center;">
            Mağaza sayfanız: <a href="${storeUrl}" style="color:#6b7280;">${escapeHtml(storeUrl)}</a>
        </p>
    `;

    return sendEmail({
        to: params.ownerEmail,
        replyTo: params.customer.email,
        subject: `[Teklif Talebi] ${params.customer.name} — ${params.panels.length} ünite`,
        html: wrap({
            title: 'Yeni Teklif Talebi',
            preheader: `${params.customer.name} — ${params.panels.length} ünite için teklif istiyor`,
            accent: 'emerald',
            body,
        }),
    });
}

/**
 * Medya sahibinin müşterisine tekrar-teklif / yeniden iletişim e-postası.
 */
export async function sendReengagementEmail(params: {
    customerEmail: string;
    customerName: string;
    ownerCompanyName: string;
    ownerContactName: string;
    ownerEmail?: string | null;
    ownerPhone?: string | null;
    ownerStoreSlug?: string | null;
    message: string;
}): Promise<boolean> {
    const storeUrl = params.ownerStoreSlug
        ? `${APP_URL}/medya/${params.ownerStoreSlug}`
        : null;

    const contactLines = [
        params.ownerEmail ? `E-posta: ${escapeHtml(params.ownerEmail)}` : '',
        params.ownerPhone ? `Telefon: ${escapeHtml(params.ownerPhone)}` : '',
    ]
        .filter(Boolean)
        .join(' · ');

    const body = `
        <p style="margin:0 0 14px;">Merhaba ${escapeHtml(params.customerName)},</p>
        <p style="margin:0 0 14px;">
            <strong>${escapeHtml(params.ownerCompanyName)}</strong> olarak sizinle tekrar iletişime geçmek istedik.
        </p>
        <div style="margin:0 0 18px;padding:14px 16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;white-space:pre-line;color:#1f2937;">
            ${escapeHtml(params.message)}
        </div>
        ${
            storeUrl
                ? button(storeUrl, 'Güncel Panolarımıza Göz Atın')
                : ''
        }
        <p style="margin:18px 0 0;color:#6b7280;font-size:13px;">
            <strong>${escapeHtml(params.ownerContactName)}</strong><br>
            ${escapeHtml(params.ownerCompanyName)}<br>
            ${contactLines}
        </p>
    `;

    return sendEmail({
        to: params.customerEmail,
        replyTo: params.ownerEmail || undefined,
        subject: `${params.ownerCompanyName} — Yeni Dönem Teklif Fırsatı`,
        html: wrap({
            title: 'Yeniden iletişime geçmek isteriz',
            preheader: `${params.ownerCompanyName} size özel bir teklif hatırlatması gönderdi`,
            accent: 'blue',
            body,
        }),
    });
}
