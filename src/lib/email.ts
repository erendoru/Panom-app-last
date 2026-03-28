import { Resend } from 'resend';

let _resend: Resend | null = null;

function getResend(): Resend | null {
    if (!process.env.RESEND_API_KEY) return null;
    if (!_resend) {
        _resend = new Resend(process.env.RESEND_API_KEY);
    }
    return _resend;
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
