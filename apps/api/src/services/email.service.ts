import nodemailer from 'nodemailer';
import { ENV } from '../config/env';

export interface PaymentNotificationPayload {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  coupleNames: string;
  amount: number;
  paymentMethod: string;
  referenceNumber?: string | null;
  paymentProofUrl?: string | null;
  invitationTitle?: string | null;
  slug?: string | null;
  packageId?: string | null;
  type?: string | null;
}

// Create reusable nodemailer transporter for Gmail
const transporter = nodemailer.createTransport({
  host: ENV.SMTP_HOST || 'smtp.gmail.com',
  port: ENV.SMTP_PORT || 465,
  secure: ENV.SMTP_SECURE,
  auth: {
    user: ENV.SMTP_USER || 'farahna.connect@gmail.com',
    pass: (ENV.SMTP_PASS || 'rhllpussftltvpvu').replace(/\s+/g, ''),
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * Format Arabic method label
 */
function getMethodLabel(method: string): string {
  switch (method?.toLowerCase()) {
    case 'vodafone_cash':
    case 'vodafone':
      return 'فودافون كاش 📱';
    case 'instapay':
    default:
      return 'إنستاباي (InstaPay) 📲';
  }
}

/**
 * Send Payment Proof & New Invitation Notification Email to Super Admin
 */
export async function sendPaymentProofNotification(
  payload: PaymentNotificationPayload
): Promise<boolean> {
  const adminEmail = ENV.NOTIFICATION_EMAIL || 'farahna.connect@gmail.com';
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://farahna.menuflowx.com').replace(/\/$/, '');
  const cleanPhone = payload.customerPhone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone.startsWith('0') ? '2' + cleanPhone : cleanPhone}`;
  const invitationUrl = payload.slug ? `${appUrl}/invitation/${payload.type || 'wedding'}/${payload.slug}` : '';
  const adminOrderUrl = `${appUrl}/admin/orders`;

  const methodLabel = getMethodLabel(payload.paymentMethod);

  const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>إشعار إيصال دفع جديد | فرحنا</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F5EE; font-family: 'Segoe UI', Tahoma, Arial, sans-serif; direction: rtl; text-align: right; color: #1A1819;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8F5EE; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 620px; background: #FFFFFF; border-radius: 20px; border: 1.5px solid #D4AF37; box-shadow: 0 15px 35px rgba(0,0,0,0.08); overflow: hidden;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #720925 0%, #4A0E17 100%); padding: 30px 25px; text-align: center; border-bottom: 3px solid #D4AF37;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 26px; font-weight: 900; letter-spacing: 0.5px;">
                👑 منصة فرحنا | Farahna
              </h1>
              <p style="margin: 8px 0 0 0; color: #F5D77F; font-size: 14px; font-weight: bold;">
                🔔 إشعار فوري: تم رفع إيصال دفع وإنشاء دعوة جديدة!
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 28px 24px;">
              <p style="font-size: 15px; line-height: 1.7; color: #2D2A26; margin-top: 0;">
                مرحباً يا بشمهندس كريم،<br>
                قام عميل جديد الآن بتصميم دعوته ذاتياً عبر استوديو المنصة ورفع لقطة شاشة لإيصال التحويل لمطابقته وتفعيل الرابط:
              </p>

              <!-- Order Summary Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FAF7F2; border-radius: 14px; border: 1px solid #EADBBE; margin: 18px 0; padding: 18px;">
                <tr>
                  <td style="padding: 7px 0; font-size: 14px; border-bottom: 1px dashed #E0D3BC;">
                    <strong style="color: #720925;">رقم الطلب:</strong>
                    <span style="display: inline-block; direction: ltr; font-weight: bold; background: #FFF; padding: 2px 8px; border-radius: 6px; border: 1px solid #DDD;">${payload.orderNumber}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 7px 0; font-size: 14px; border-bottom: 1px dashed #E0D3BC;">
                    <strong style="color: #720925;">أسماء العروسين:</strong>
                    <span style="font-weight: 800; color: #1A1819;">${payload.coupleNames}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 7px 0; font-size: 14px; border-bottom: 1px dashed #E0D3BC;">
                    <strong style="color: #720925;">اسم العميل:</strong>
                    <span>${payload.customerName}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 7px 0; font-size: 14px; border-bottom: 1px dashed #E0D3BC;">
                    <strong style="color: #720925;">رقم الهاتف / واتساب:</strong>
                    <span style="direction: ltr; display: inline-block; font-weight: bold;">${payload.customerPhone}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 7px 0; font-size: 14px; border-bottom: 1px dashed #E0D3BC;">
                    <strong style="color: #720925;">الباقة والمبلغ:</strong>
                    <span style="font-weight: 900; color: #10B981; font-size: 16px;">${payload.amount} ج.م</span>
                    <span style="font-size: 12px; color: #666;">(${payload.packageId || 'باقة مخصصة'})</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 7px 0; font-size: 14px; border-bottom: 1px dashed #E0D3BC;">
                    <strong style="color: #720925;">طريقة الدفع:</strong>
                    <span>${methodLabel}</span>
                  </td>
                </tr>
                ${
                  payload.referenceNumber
                    ? `
                <tr>
                  <td style="padding: 7px 0; font-size: 14px;">
                    <strong style="color: #720925;">رقم المرجع / الحوالة:</strong>
                    <span style="font-weight: bold; direction: ltr; display: inline-block;">${payload.referenceNumber}</span>
                  </td>
                </tr>
                `
                    : ''
                }
              </table>

              <!-- Payment Proof Screenshot Section -->
              ${
                payload.paymentProofUrl
                  ? `
              <div style="margin: 22px 0; text-align: center;">
                <h3 style="color: #720925; font-size: 15px; margin-bottom: 10px;">📸 لقطة شاشة إيصال الدفع المرفوع:</h3>
                <div style="background: #000; border-radius: 12px; overflow: hidden; display: inline-block; max-width: 100%; border: 2px solid #D4AF37;">
                  <img src="${payload.paymentProofUrl}" alt="إيصال الدفع" style="max-width: 100%; max-height: 480px; display: block; object-fit: contain;" />
                </div>
                <div style="margin-top: 8px;">
                  <a href="${payload.paymentProofUrl}" target="_blank" style="font-size: 12px; color: #720925; text-decoration: underline; font-weight: bold;">
                    عرض الصورة بالحجم الكامل في نافذة مستقلة 🔍
                  </a>
                </div>
              </div>
              `
                  : `
              <div style="padding: 12px; background: #FFF3CD; border-radius: 8px; color: #856404; font-size: 13px; margin: 15px 0;">
                ⚠️ لم يتم إرفاق رابط صورة إيصال، يرجى مراجعة تفاصيل التحويل يدوياً مع العميل.
              </div>
              `
              }

              <!-- Action CTAs -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 25px;">
                <tr>
                  <td align="center" style="padding-bottom: 10px;">
                    <a href="${adminOrderUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #720925 0%, #9C1C3F 100%); color: #FFFFFF; font-weight: bold; font-size: 14px; text-decoration: none; padding: 13px 28px; border-radius: 50px; border: 1px solid #D4AF37; box-shadow: 0 4px 12px rgba(114,9,37,0.35);">
                      🚀 فتح لوحة التحكم لمراجعة واعتماد الطلب
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom: 10px;">
                    <a href="${whatsappUrl}" target="_blank" style="display: inline-block; background: #25D366; color: #FFFFFF; font-weight: bold; font-size: 13px; text-decoration: none; padding: 10px 22px; border-radius: 50px;">
                      💬 التواصل مع العميل مباشرة عبر واتساب
                    </a>
                  </td>
                </tr>
                ${
                  invitationUrl
                    ? `
                <tr>
                  <td align="center">
                    <a href="${invitationUrl}" target="_blank" style="font-size: 12px; color: #720925; text-decoration: underline; font-weight: bold;">
                      معاينة رابط الدعوة التجريبي 💌
                    </a>
                  </td>
                </tr>
                `
                    : ''
                }
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FAF7F2; padding: 16px 20px; text-align: center; border-top: 1px solid #EBE4D5; font-size: 11px; color: #7A756D;">
              منصة فرحنا (Farahna) — نظام التنبيهات والإدارة المركزية 💍<br>
              تم إرسال هذا التنبيه تلقائياً إلى بريدك المعتمد: <strong>${adminEmail}</strong>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"منصة فرحنا | Farahna" <${ENV.SMTP_USER || 'farahna.connect@gmail.com'}>`,
      to: adminEmail,
      subject: `🔔 إيصال دفع جديد لطلب #${payload.orderNumber} — ${payload.coupleNames} (${payload.amount} ج.م)`,
      html: htmlContent,
    });

    console.log(
      `✅ [EmailService] Payment notification successfully sent to ${adminEmail}! MessageId: ${info.messageId}`
    );
    return true;
  } catch (error) {
    console.error('❌ [EmailService] Failed to send payment notification email:', error);
    return false;
  }
}

export interface NewInvitationNotificationPayload {
  invitationId: string;
  title: string;
  slug: string;
  type: string;
  coupleNames: string;
  previewToken?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
  eventDate?: string | Date | null;
}

/**
 * Send notification email to admin whenever a new invitation is created
 */
export async function sendNewInvitationNotification(
  payload: NewInvitationNotificationPayload
): Promise<boolean> {
  const adminEmail = ENV.NOTIFICATION_EMAIL || 'farahna.connect@gmail.com';
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://farahna.menuflowx.com').replace(/\/$/, '');
  const previewUrl = payload.previewToken ? `${appUrl}/preview/${payload.previewToken}` : `${appUrl}/invitation/${payload.type || 'wedding'}/${payload.slug}`;
  const builderUrl = `${appUrl}/admin/invitations/${payload.invitationId}/builder`;
  const cleanPhone = payload.customerPhone ? payload.customerPhone.replace(/[^0-9]/g, '') : '';
  const whatsappUrl = cleanPhone ? `https://wa.me/${cleanPhone.startsWith('0') ? '2' + cleanPhone : cleanPhone}` : '';

  const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>دعوة جديدة في فرحنا | Farahna</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F5EE; font-family: 'Segoe UI', Tahoma, Arial, sans-serif; direction: rtl; text-align: right; color: #1A1819;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8F5EE; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 620px; background: #FFFFFF; border-radius: 20px; border: 1.5px solid #D4AF37; box-shadow: 0 15px 35px rgba(0,0,0,0.08); overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #720925 0%, #4A0E17 100%); padding: 30px 25px; text-align: center; border-bottom: 3px solid #D4AF37;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 26px; font-weight: 900;">
                👑 منصة فرحنا | Farahna
              </h1>
              <p style="margin: 8px 0 0 0; color: #F5D77F; font-size: 14px; font-weight: bold;">
                ✨ إشعار إنشاء دعوة جديدة في النظام
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 24px;">
              <p style="font-size: 15px; line-height: 1.7; color: #2D2A26; margin-top: 0;">
                مرحباً يا بشمهندس كريم،<br>
                تم إنشاء دعوة جديدة في النظام الآن وجاهزة للمعاينة والتعديل عبر لوحة التحكم:
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FAF7F2; border-radius: 14px; border: 1px solid #EADBBE; margin: 18px 0; padding: 18px;">
                <tr>
                  <td style="padding: 7px 0; font-size: 14px; border-bottom: 1px dashed #E0D3BC;">
                    <strong style="color: #720925;">عنوان الدعوة:</strong>
                    <span style="font-weight: 800; color: #1A1819;">${payload.title}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 7px 0; font-size: 14px; border-bottom: 1px dashed #E0D3BC;">
                    <strong style="color: #720925;">أسماء العروسين:</strong>
                    <span>${payload.coupleNames}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 7px 0; font-size: 14px; border-bottom: 1px dashed #E0D3BC;">
                    <strong style="color: #720925;">الرابط المختصر:</strong>
                    <span style="direction: ltr; display: inline-block; font-weight: bold; font-family: monospace;">/${payload.slug}</span>
                  </td>
                </tr>
                ${payload.customerName ? `
                <tr>
                  <td style="padding: 7px 0; font-size: 14px; border-bottom: 1px dashed #E0D3BC;">
                    <strong style="color: #720925;">العميل:</strong>
                    <span>${payload.customerName} ${payload.customerPhone ? `(${payload.customerPhone})` : ''}</span>
                  </td>
                </tr>` : ''}
                ${payload.customerEmail ? `
                <tr>
                  <td style="padding: 7px 0; font-size: 14px; border-bottom: 1px dashed #E0D3BC;">
                    <strong style="color: #720925;">البريد الإلكتروني للعميل:</strong>
                    <span style="direction: ltr; display: inline-block;">${payload.customerEmail}</span>
                  </td>
                </tr>` : ''}
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 25px;">
                <tr>
                  <td align="center" style="padding-bottom: 10px;">
                    <a href="${builderUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #720925 0%, #9C1C3F 100%); color: #FFFFFF; font-weight: bold; font-size: 14px; text-decoration: none; padding: 13px 28px; border-radius: 50px; border: 1px solid #D4AF37; box-shadow: 0 4px 12px rgba(114,9,37,0.35);">
                      🎨 فتح المحرر المرئي للدعوة
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom: 10px;">
                    <a href="${previewUrl}" target="_blank" style="display: inline-block; background: #FAF7F2; border: 1.5px solid #D4AF37; color: #720925; font-weight: bold; font-size: 13px; text-decoration: none; padding: 10px 22px; border-radius: 50px;">
                      👁️ فتح رابط المعاينة السريعة
                    </a>
                  </td>
                </tr>
                ${whatsappUrl ? `
                <tr>
                  <td align="center">
                    <a href="${whatsappUrl}" target="_blank" style="display: inline-block; background: #25D366; color: #FFFFFF; font-weight: bold; font-size: 12px; text-decoration: none; padding: 8px 18px; border-radius: 50px; margin-top: 5px;">
                      💬 محادثة العميل عبر واتساب
                    </a>
                  </td>
                </tr>` : ''}
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #FAF7F2; padding: 16px 20px; text-align: center; border-top: 1px solid #EBE4D5; font-size: 11px; color: #7A756D;">
              منصة فرحنا (Farahna) — نظام الإشعارات والتحكم المركزي 💍<br>
              تم إرسال هذا التنبيه إلى بريدك: <strong>${adminEmail}</strong>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"منصة فرحنا | Farahna" <${ENV.SMTP_USER || 'farahna.connect@gmail.com'}>`,
      to: adminEmail,
      subject: `✨ تم إنشاء دعوة جديدة: ${payload.title} (${payload.coupleNames})`,
      html: htmlContent,
    });
    console.log(`✅ [EmailService] New invitation notification sent to ${adminEmail}! MessageId: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ [EmailService] Failed to send new invitation notification:', error);
    return false;
  }
}

export interface CustomerConfirmationPayload {
  customerEmail: string;
  customerName: string;
  coupleNames: string;
  orderNumber: string;
  invitationTitle: string;
  slug: string;
  previewToken?: string | null;
  type?: string | null;
  amount: number;
  packageId?: string | null;
}

/**
 * Send confirmation email to customer upon ordering/designing invitation
 */
export async function sendCustomerOrderConfirmationEmail(
  payload: CustomerConfirmationPayload
): Promise<boolean> {
  if (!payload.customerEmail || !payload.customerEmail.includes('@')) {
    return false;
  }

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://farahna.menuflowx.com').replace(/\/$/, '');
  const previewUrl = payload.previewToken ? `${appUrl}/preview/${payload.previewToken}` : `${appUrl}/invitation/${payload.type || 'wedding'}/${payload.slug}`;
  const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+201019262075';
  const whatsappUrl = `https://wa.me/201019262075?text=${encodeURIComponent(`مرحباً فرحنا، بخصوص طلبي رقم ${payload.orderNumber}`)}`;

  const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>تهانينا! تم استلام طلب دعوتكم | فرحنا</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F5EE; font-family: 'Segoe UI', Tahoma, Arial, sans-serif; direction: rtl; text-align: right; color: #1A1819;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8F5EE; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 620px; background: #FFFFFF; border-radius: 20px; border: 1.5px solid #D4AF37; box-shadow: 0 15px 35px rgba(0,0,0,0.08); overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #720925 0%, #4A0E17 100%); padding: 35px 25px; text-align: center; border-bottom: 3px solid #D4AF37;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: 900;">
                💍 ألف مبروك يا عرساننا!
              </h1>
              <p style="margin: 10px 0 0 0; color: #F5D77F; font-size: 15px; font-weight: bold;">
                تم استلام طلب دعوتكم الإلكترونية بنجاح في منصة فرحنا 🎉
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 24px;">
              <p style="font-size: 16px; line-height: 1.8; color: #2D2A26; margin-top: 0;">
                أهلاً بكم يا <strong>${payload.customerName || payload.coupleNames}</strong>،<br>
                يسعدنا ويشرفنا في منصة <strong>فرحنا (Farahna)</strong> أن نكون جزءاً من فرحتكم الكبرى! لقد تم استلام تفاصيل وتصميم دعوتكم بنجاح:
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FAF7F2; border-radius: 14px; border: 1px solid #EADBBE; margin: 18px 0; padding: 18px;">
                <tr>
                  <td style="padding: 7px 0; font-size: 14px; border-bottom: 1px dashed #E0D3BC;">
                    <strong style="color: #720925;">رقم الطلب:</strong>
                    <span style="font-weight: bold; direction: ltr; display: inline-block;">${payload.orderNumber}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 7px 0; font-size: 14px; border-bottom: 1px dashed #E0D3BC;">
                    <strong style="color: #720925;">مناسبة العروسين:</strong>
                    <span style="font-weight: 800; color: #1A1819;">${payload.coupleNames}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 7px 0; font-size: 14px; border-bottom: 1px dashed #E0D3BC;">
                    <strong style="color: #720925;">قيمة الباقة:</strong>
                    <span style="font-weight: bold; color: #10B981;">${payload.amount} ج.م</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 7px 0; font-size: 14px;">
                    <strong style="color: #720925;">حالة الطلب:</strong>
                    <span style="font-weight: bold; color: #B45309; background: #FEF3C7; padding: 2px 8px; border-radius: 6px;">جاري مراجعة الإيصال وتفعيل الرابط الرسمي ⚡</span>
                  </td>
                </tr>
              </table>

              <div style="background: #F0FDF4; border: 1px solid #86EFAC; border-radius: 12px; padding: 14px; margin: 20px 0; color: #166534; font-size: 13px; line-height: 1.6;">
                💡 <strong>ما هي الخطوة القادمة؟</strong><br>
                يقوم فريق العمل الآن بمراجعة بيانات التحويل والإيصال، وخلال دقائق معدودة سيتم تفعيل رابطكم الرسمي ليصبح متاحاً للمشاركة مع الأهل والأحباب!
              </div>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 25px;">
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <a href="${previewUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #720925 0%, #9C1C3F 100%); color: #FFFFFF; font-weight: bold; font-size: 14px; text-decoration: none; padding: 13px 30px; border-radius: 50px; border: 1px solid #D4AF37; box-shadow: 0 4px 12px rgba(114,9,37,0.35);">
                      📱 معاينة بطاقة وتصميم دعوتكم الآن
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <a href="${whatsappUrl}" target="_blank" style="display: inline-block; background: #25D366; color: #FFFFFF; font-weight: bold; font-size: 13px; text-decoration: none; padding: 10px 22px; border-radius: 50px;">
                      💬 التواصل المباشر مع فريق الدعم عبر واتساب
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #FAF7F2; padding: 18px 20px; text-align: center; border-top: 1px solid #EBE4D5; font-size: 12px; color: #7A756D;">
              منصة فرحنا (Farahna) — بطاقات ودعوات إلكترونية فاخرة للأعراس والمناسبات 💍<br>
              رقم خدمة العملاء والدعم: ${supportPhone}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"منصة فرحنا | Farahna" <${ENV.SMTP_USER || 'farahna.connect@gmail.com'}>`,
      to: payload.customerEmail,
      subject: `🎉 تهانينا! تم استلام طلب دعوتكم بنجاح (طلب #${payload.orderNumber}) | فرحنا 💌`,
      html: htmlContent,
    });
    console.log(`✅ [EmailService] Customer confirmation sent to ${payload.customerEmail}! MessageId: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ [EmailService] Failed to send customer confirmation email:', error);
    return false;
  }
}

/**
 * Send generic notification or alert email to administrator
 */
export async function sendSystemAlert(subject: string, textOrHtml: string): Promise<boolean> {
  const adminEmail = ENV.NOTIFICATION_EMAIL || 'farahna.connect@gmail.com';
  try {
    await transporter.sendMail({
      from: `"منصة فرحنا | Farahna" <${ENV.SMTP_USER || 'farahna.connect@gmail.com'}>`,
      to: adminEmail,
      subject,
      html: `<div style="direction: rtl; text-align: right; font-family: sans-serif; padding: 20px;">${textOrHtml}</div>`,
    });
    return true;
  } catch (err) {
    console.error('❌ [EmailService] Failed to send system alert:', err);
    return false;
  }
}

